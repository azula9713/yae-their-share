import { query } from "./_generated/server";
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const splits =  defineTable({
  date: v.string(),
  id: v.string(),
  name: v.string(),
  participants: v.array(v.object({
    id: v.string(),
    name: v.string(),
  })),
  expenses: v.array(v.object({
    id: v.string(),
    amount: v.number(),
    description: v.string(),
    paidBy: v.string(), // participant id
    splitBetween: v.array(v.string()), // array of participant ids
  })),  
  createdBy: v.id("users")
})

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("splits").collect();
  },
});
