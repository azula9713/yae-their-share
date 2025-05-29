import { mutation, query } from "./_generated/server";
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const splits = defineTable({
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
  createdBy: v.string(), // User ID of the creator
  isDeleted: v.optional(v.boolean()), // Optional field to mark as deleted
  deletedAt: v.optional(v.string()), // Optional field to store deletion timestamp
  updatedAt: v.optional(v.string()), // Optional field to store last update timestamp
  createdAt: v.optional(v.string()), // Optional field to store creation timestamp
  updatedBy: v.optional(v.string()), // Optional field to store the user who last updated the split
})
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
    splitId: v.string(), // Unique ID for the split
    name: v.string(),
    date: v.optional(v.string()), // Optional date, can be undefined
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
    createdBy: v.string(),
  },
  handler: async (ctx, args) => {
    const split = {
      date: args.date || "", // Use current date if not provided
      splitId: args.splitId,
      name: args.name,
      participants: args.participants,
      expenses: args.expenses,
      createdBy: args.createdBy,
      createdAt: new Date().toISOString(),
      updatedBy: args.createdBy, // Optional field for last updated user
      updatedAt: new Date().toISOString(), // Optional field for last update timestamp
      isDeleted: false, // Default to not deleted
    };

    return await ctx.db.insert("splits", split);
  },
});

export const updateSplit = mutation({
  args: {
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
    updatedBy: v.optional(v.string()), // Optional field to store the user who last updated the split
    updatedAt: v.optional(v.string()), // Optional field to store last update timestamp
    isDeleted: v.optional(v.boolean()), // Optional field to mark as deleted
    deletedAt: v.optional(v.string()), // Optional field to store deletion timestamp
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
      name: args.name,
      participants: args.participants,
      expenses: args.expenses,
      updatedBy: args.updatedBy,
      updatedAt: new Date().toISOString(),
      isDeleted: args.isDeleted,
      deletedAt: args.isDeleted ? new Date().toISOString() : undefined,
    });
  },
});

export const deleteSplit = mutation({
  args: {
    splitId: v.string(), // ID of the split to delete
  },
  handler: async (ctx, args) => {
    const { splitId } = args;

    const split = await ctx.db
      .query("splits")
      .withIndex("by_splitId", (q) => q.eq("splitId", splitId))
      .first();
    console.log("Deleting split:", splitId);

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
    splitId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { splitId, convexId } = args;

    // console.log("Fetching split by ID:", splitId);
    if (splitId) {
      const split = await ctx.db
        .query("splits")
        .withIndex("by_splitId", (q) => q.eq("splitId", splitId))
        .first();
      console.log("Split found:", split);
      if (!split) {
        throw new Error(`Split with ID ${splitId} not found`);
      }
      return split;
    }

    if (convexId) {
      const split = await ctx.db.get(convexId);
      console.log("Split found by convex ID:", split);
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
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId } = args;
    console.log("Fetching splits for user:", userId);

    const splits = await ctx.db
      .query("splits")
      .withIndex("by_createdBy_isDeleted", (q) =>
        q.eq("createdBy", userId).eq("isDeleted", false)
      )
      .collect();

    console.log("splits found:", splits);
    return splits;
  },
});

export const getDeletedSplits = query({
  args: {
    userId: v.string(),
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
