import { defineTable } from "convex/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

import { mutation, query } from "./_generated/server";

const splitSchema = {
  date: v.string(),
  splitId: v.string(),
  name: v.string(),
  participants: v.array(
    v.object({
      participantId: v.string(),
      name: v.string(),
    })
  ),
  expenses: v.array(
    v.object({
      expenseId: v.string(),
      amount: v.number(),
      description: v.string(),
      paidBy: v.string(), // participant id
      splitBetween: v.array(v.string()), // array of participant ids
    })
  ),
  isPrivate: v.boolean(),
  createdBy: v.string(), // User ID of the creator
  isDeleted: v.optional(v.boolean()),
  deletedAt: v.optional(v.string()),
  updatedAt: v.optional(v.string()),
  createdAt: v.optional(v.string()),
  updatedBy: v.optional(v.string()),
};

export const splits = defineTable(splitSchema)
  .index("by_splitId", ["splitId"])
  .index("date", ["date"])
  .index("name", ["name"])
  .index("createdBy", ["createdBy"])
  .index("isDeleted", ["isDeleted"])
  .index("by_createdBy_isDeleted", ["createdBy", "isDeleted"]);

export const createSplit = mutation({
  args: {
    splitId: splitSchema.splitId, // Using the schema definition directly
    name: splitSchema.name,
    date: v.optional(splitSchema.date), // Make date optional for creation
    participants: splitSchema.participants,
    expenses: splitSchema.expenses,
    createdBy: splitSchema.createdBy,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required to create splits");
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (args.createdBy !== user.id) {
      throw new Error("You can only create splits for yourself");
    }

    const split = {
      date: args.date ?? new Date().toISOString(), // Use current date if not provided
      splitId: args.splitId,
      name: args.name,
      participants: args.participants,
      expenses: args.expenses,
      createdBy: args.createdBy,
      createdAt: new Date().toISOString(),
      updatedBy: args.createdBy,
      updatedAt: new Date().toISOString(),
      isDeleted: false,
      isPrivate: false, // Default to public split
    };

    return await ctx.db.insert("splits", split);
  },
});

export const updateSplit = mutation({
  args: {
    splitId: splitSchema.splitId,
    name: splitSchema.name,
    date: splitSchema.date,
    participants: splitSchema.participants,
    expenses: splitSchema.expenses,
    updatedBy: splitSchema.updatedBy,
    updatedAt: splitSchema.updatedAt,
    isPrivate: splitSchema.isPrivate,
    isDeleted: v.optional(splitSchema.isDeleted),
    deletedAt: v.optional(splitSchema.deletedAt),
  },
  handler: async (ctx, args) => {
    const { splitId, ...updates } = args;

    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required to update splits");
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const split = await ctx.db
      .query("splits")
      .withIndex("by_splitId", (q) => q.eq("splitId", splitId))
      .first();

    if (!split) {
      throw new Error("Split not found");
    }

    if (split.createdBy !== user.id) {
      throw new Error("You can only update splits you created");
    }

    // Prepare updates, overriding updatedAt and deletedAt if isDeleted is set
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const patchData: Record<string, any> = {
      ...updates,
      updatedAt: new Date().toISOString(), // Always update updatedAt
    };

    if (updates.isDeleted !== undefined) {
      patchData.deletedAt = updates.isDeleted
        ? new Date().toISOString()
        : undefined;
    }

    await ctx.db.patch(split._id, patchData);
  },
});

export const deleteSplit = mutation({
  args: {
    splitId: splitSchema.splitId,
  },
  handler: async (ctx, args) => {
    const { splitId } = args;

    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required to delete splits");
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const split = await ctx.db
      .query("splits")
      .withIndex("by_splitId", (q) => q.eq("splitId", splitId))
      .first();

    if (!split) {
      throw new Error("Split not found");
    }

    if (split.createdBy !== user.id) {
      throw new Error("You can only delete splits you created");
    }

    await ctx.db.patch(split._id, {
      isDeleted: true,
      deletedAt: new Date().toISOString(),
    });
  },
});

export const getSplitById = query({
  args: {
    convexId: v.optional(v.id("splits")),
    splitId: v.optional(splitSchema.splitId),
  },
  handler: async (ctx, args) => {
    const { splitId, convexId } = args;

    let split;

    if (splitId) {
      split = await ctx.db
        .query("splits")
        .withIndex("by_splitId", (q) => q.eq("splitId", splitId))
        .first();
    } else if (convexId) {
      split = await ctx.db.get(convexId);
    } else {
      throw new Error("Either splitId or convexId must be provided");
    }

    if (!split) {
      throw new Error(`Split not found`);
    }

    if (split.isPrivate) {
      const userId = await getAuthUserId(ctx);
      if (!userId) {
        throw new Error("Access denied: This split is private");
      }

      const user = await ctx.db.get(userId);
      if (!user || split.createdBy !== user.id) {
        throw new Error(
          "Access denied: You can only view private splits you created"
        );
      }
    }

    return split;
  },
});

export const getSplitsByUserId = query({
  args: {
    userId: splitSchema.createdBy,
  },
  handler: async (ctx, args) => {
    const { userId } = args;

    const splits = await ctx.db
      .query("splits")
      .withIndex("by_createdBy_isDeleted", (q) =>
        q.eq("createdBy", userId).eq("isDeleted", false)
      )
      .collect();

    return splits;
  },
});

export const getDeletedSplits = query({
  args: {
    userId: splitSchema.createdBy,
  },
  handler: async (ctx, args) => {
    const { userId } = args;

    const splits = await ctx.db
      .query("splits")
      .withIndex("by_createdBy_isDeleted", (q) =>
        q.eq("createdBy", userId).eq("isDeleted", true)
      )
      .collect();

    return splits;
  },
});
