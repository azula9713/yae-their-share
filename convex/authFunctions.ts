import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});

export const upgradeAnonymousUser = mutation({
  args: {
    anonymousUserId: v.string(),
  },
  handler: async (ctx, args) => {
    // Find the anonymous user
    const anonymousUser = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("id", args.anonymousUserId))
      .first();

    if (!anonymousUser) {
      throw new Error("Anonymous user not found");
    }

    if (!anonymousUser.isAnonymous) {
      throw new Error("User is already authenticated");
    }

    // Find the anonymous auth account
    const authAccount = await ctx.db
      .query("authAccounts")
      .withIndex("userIdAndProvider", (q) => q.eq("userId", anonymousUser._id))
      .first();

    if (!authAccount || authAccount.provider !== "anonymous") {
      throw new Error("No anonymous auth account found for this user");
    }

    // This function will be called during SSO login to handle the upgrade
    // The actual auth provider integration happens in the createOrUpdateUser callback
    return {
      anonymousUserId: anonymousUser._id,
      anonymousUserData: {
        id: anonymousUser.id,
        name: anonymousUser.name,
        settings: anonymousUser.settings,
      },
    };
  },
});

export const migrateAnonymousUserData = mutation({
  args: {
    anonymousUserId: v.id("users"),
    authenticatedUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { anonymousUserId, authenticatedUserId } = args;

    // Get both users
    const anonymousUser = await ctx.db.get(anonymousUserId);
    const authenticatedUser = await ctx.db.get(authenticatedUserId);

    if (!anonymousUser || !authenticatedUser) {
      throw new Error("One or both users not found");
    }

    if (!anonymousUser.isAnonymous) {
      throw new Error("Source user is not anonymous");
    }

    try {
      console.log("Starting data migration:", {
        anonymousUserId,
        authenticatedUserId,
        anonymousUser: anonymousUser.id,
        authenticatedUser: authenticatedUser.id
      });

      // 1. Migrate user settings and preserve the custom ID
      await ctx.db.patch(authenticatedUserId, {
        settings: {
          // Merge settings, prioritizing anonymous user's customized settings
          ...authenticatedUser.settings,
          ...anonymousUser.settings,
        },
      });

      console.log("User settings migrated successfully");

      // 2. Migrate all splits created by the anonymous user
      const anonymousSplits = await ctx.db
        .query("splits")
        .withIndex("createdBy", (q) => q.eq("createdBy", anonymousUser.id))
        .collect();

      console.log(`Found ${anonymousSplits.length} splits to migrate`);

      // Update all splits to point to the authenticated user
      for (const split of anonymousSplits) {
        console.log(`Migrating split: ${split.splitId} from ${split.createdBy} to ${authenticatedUser.id}`);
        await ctx.db.patch(split._id, {
          createdBy: authenticatedUser.id,
          updatedBy: authenticatedUser.id,
          updatedAt: new Date().toISOString(),
        });
      }

      console.log("All splits migrated successfully");

      // 3. Clean up: Delete the anonymous user and associated auth accounts
      const anonymousAuthAccounts = await ctx.db
        .query("authAccounts")
        .withIndex("userIdAndProvider", (q) => q.eq("userId", anonymousUserId))
        .collect();

      for (const account of anonymousAuthAccounts) {
        await ctx.db.delete(account._id);
      }

      // Delete the anonymous user record
      await ctx.db.delete(anonymousUserId);

      return {
        success: true,
        migratedSplitsCount: anonymousSplits.length,
        message: `Successfully migrated ${anonymousSplits.length} splits and user data`,
      };
    } catch (error) {
      console.error("Error during data migration:", error);
      throw new Error(`Data migration failed: ${error}`);
    }
  },
});

// Helper function to find anonymous user by session
export const findAnonymousUserForUpgrade = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    if (!user || !user.isAnonymous) return null;

    return {
      userId: user._id,
      customId: user.id,
      hasData: true, // We can add logic to check if they have splits/data
    };
  },
});
