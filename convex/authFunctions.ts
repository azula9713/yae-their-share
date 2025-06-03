import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

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

export const linkAnonymousUser = mutation({
  args: {
    anonymousUserId: v.string(),
    newUserId: v.string(),
  },
  handler: async (ctx, args) => {
    const anonymousUser = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("id", args.anonymousUserId))
      .first();

    if (!anonymousUser?.isAnonymous) {
      throw new Error("Invalid anonymous user ID");
    }
    const authAccount = await ctx.db
      .query("authAccounts")
      .withIndex("userIdAndProvider", (q) => q.eq("userId", anonymousUser._id))
      .first();

    if (!authAccount || authAccount.provider !== "anonymous") {
      throw new Error("No anonymous auth account found for this user");
    }

    const newUser = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("id", args.newUserId))
      .first();
    if (!newUser) {
      throw new Error("New user not found");
    }

   //copy data from anonymous user to new user and delete anonymous user
    await ctx.db.patch(newUser._id, {
      id: anonymousUser.id,
      isAnonymous: false,
      settings: anonymousUser.settings,
    }).then(() => {
      return ctx.db.delete(anonymousUser._id);
    });

    return newUser;
  },
});
