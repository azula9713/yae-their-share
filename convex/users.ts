import { defineTable } from "convex/server";
import { v } from "convex/values";

import { mutation, MutationCtx } from "./_generated/server";

export const users = defineTable({
  name: v.string(),
  image: v.optional(v.string()),
  email: v.optional(v.string()),
  emailVerificationTime: v.optional(v.number()),
  phone: v.optional(v.string()),
  phoneVerificationTime: v.optional(v.number()),
  isAnonymous: v.boolean(),
  id: v.string(), // This is the user ID
  settings: v.object({
    currency: v.object({
      code: v.string(),
      symbol: v.string(),
      currencyName: v.string(),
      countryName: v.string(),
      decimalPlaces: v.number(),
      displayCents: v.boolean(),
    }),
    privacy: v.object({
      shareAnalytics: v.boolean(),
      autoBackup: v.boolean(),
    }),
    display: v.object({
      compactMode: v.boolean(),
      theme: v.string(),
    }),
  }),
})
  .index("email", ["email"])
  .index("by_userId", ["id"]);

export const findUserByEmail = async (ctx: MutationCtx, email: string) => {
  const users = await ctx.db
    .query("users")
    .withIndex("email", (q) => q.eq("email", email))
    .collect();
  return users.length > 0 ? users[0] : null;
};

export const updateUserSettings = mutation({
  args: {
    userId: v.string(),
    settings: v.object({
      currency: v.object({
        code: v.string(),
        symbol: v.string(),
        currencyName: v.string(),
        countryName: v.string(),
        decimalPlaces: v.number(),
        displayCents: v.boolean(),
      }),
      privacy: v.object({
        shareAnalytics: v.boolean(),
        autoBackup: v.boolean(),
      }),
      display: v.object({
        compactMode: v.boolean(),
        theme: v.string(),
      }),
    }),
  },
  handler: async (ctx, args) => {
    const { userId, settings } = args;

    // Find the user by ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("id", userId))
      .first();
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    // Update the user's settings
    await ctx.db.patch(user._id, {
      settings: {
        ...user.settings,
        ...settings,
      },
    });

    return { success: true, message: "User settings updated successfully" };
  },
});
