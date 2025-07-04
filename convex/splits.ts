import { defineTable } from "convex/server";
import { v } from "convex/values";

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
  isPrivate: v.boolean(), // Optional field to indicate if the split is private
  createdBy: v.string(), // User ID of the creator
  isDeleted: v.optional(v.boolean()), // Optional field to mark as deleted
  deletedAt: v.optional(v.string()), // Optional field to store deletion timestamp
  updatedAt: v.optional(v.string()), // Optional field to store last update timestamp
  createdAt: v.optional(v.string()), // Optional field to store creation timestamp
  updatedBy: v.optional(v.string()), // Optional field to store the user who last updated the split
};

export const splits = defineTable(splitSchema)
  .index("by_splitId", ["splitId"])
  .index("date", ["date"])
  .index("name", ["name"])
  .index("createdBy", ["createdBy"])
  .index("isDeleted", ["isDeleted"])
  .index("by_createdBy_isDeleted", ["createdBy", "isDeleted"]);

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("splits").collect();
  },
});

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

    const split = await ctx.db
      .query("splits")
      .withIndex("by_splitId", (q) => q.eq("splitId", splitId))
      .first();

    if (!split) {
      throw new Error("Split not found");
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

    const split = await ctx.db
      .query("splits")
      .withIndex("by_splitId", (q) => q.eq("splitId", splitId))
      .first();

    if (!split) {
      throw new Error("Split not found");
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

    if (splitId) {
      const split = await ctx.db
        .query("splits")
        .withIndex("by_splitId", (q) => q.eq("splitId", splitId))
        .first();
      if (!split) {
        throw new Error(`Split with ID ${splitId} not found`);
      }
      return split;
    }

    if (convexId) {
      const split = await ctx.db.get(convexId);
      if (!split) {
        throw new Error(`Split with convex ID ${convexId} not found`);
      }
      return split;
    }
    throw new Error("Either splitId or convexId must be provided");
  },
});

export const getSplitsByUserId = query({
  args: {
    userId: splitSchema.createdBy, // Use createdBy as userId
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
    userId: splitSchema.createdBy, // Use createdBy as userId
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
