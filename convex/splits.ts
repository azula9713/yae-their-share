import { mutation, query } from "./_generated/server";
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const splits = defineTable({
  date: v.string(),
  id: v.string(),
  name: v.string(),
  participants: v.array(
    v.object({
      id: v.string(),
      name: v.string(),
    })
  ),
  expenses: v.array(
    v.object({
      id: v.string(),
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
  updatedBy: v.optional(v.id("users")), // Optional field to store the user who last updated the split
})
  .index("date", ["date"])
  .index("name", ["name"])
  .index("createdBy", ["createdBy"])
  .index("isDeleted", ["isDeleted"])
  .index("by_createdBy_isDeleted", ["createdBy", "isDeleted"])

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("splits").collect();
  },
});

export const createSplit = mutation({
  args: {
    name: v.string(),
    participants: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
      })
    ),
    expenses: v.array(
      v.object({
        id: v.string(),
        amount: v.number(),
        description: v.string(),
        paidBy: v.string(), // participant id
        splitBetween: v.array(v.string()), // array of participant ids
      })
    ),
    createdBy: v.id("users"),
    updatedBy: v.optional(v.id("users")), // Optional field to store the user who last updated the split
    createdAt: v.optional(v.string()), // Optional field to store creation timestamp
    updatedAt: v.optional(v.string()), // Optional field to store last update timestamp
    isDeleted: v.optional(v.boolean()), // Optional field to mark as deleted
  },
  handler: async (ctx, args) => {
    const split = {
      date: new Date().toISOString(),
      id: crypto.randomUUID(),
      name: args.name,
      participants: args.participants,
      expenses: args.expenses,
      createdBy: args.createdBy,
    };

    return await ctx.db.insert("splits", split);
  },
});

export const updateSplit = mutation({
  args: {
    id: v.id("splits"),
    name: v.string(),
    participants: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
      })
    ),
    expenses: v.array(
      v.object({
        id: v.string(),
        amount: v.number(),
        description: v.string(),
        paidBy: v.string(), // participant id
        splitBetween: v.array(v.string()), // array of participant ids
      })
    ),
    updatedBy: v.optional(v.id("users")), // Optional field to store the user who last updated the split
    updatedAt: v.optional(v.string()), // Optional field to store last update timestamp
    isDeleted: v.optional(v.boolean()), // Optional field to mark as deleted
    deletedAt: v.optional(v.string()), // Optional field to store deletion timestamp
  },
  handler: async (ctx, args) => {
    const { id } = args;

    const split = await ctx.db.get(id);

    if (!split) {
      throw new Error("Split not found");
    }

    await ctx.db.patch(id, {
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
    id: v.id("splits"),
  },
  handler: async (ctx, args) => {
    const { id } = args;

    const split = await ctx.db.get(id);

    if (!split) {
      throw new Error("Split not found");
    }

    await ctx.db.patch(id, {
      isDeleted: true,
      deletedAt: new Date().toISOString(),
    });
  },
});

export const getSplitById = query({
  args: {
    id: v.id("splits"),
  },
  handler: async (ctx, args) => {
    const { id } = args;

    const split = await ctx.db.get(id);

    if (!split) {
      throw new Error("Split not found");
    }

    return split;
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
