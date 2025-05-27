import { defineTable } from "convex/server";
import { v } from "convex/values";
import { MutationCtx } from "./_generated/server";

export const users = defineTable({
  name: v.optional(v.string()),
  image: v.optional(v.string()),
  email: v.optional(v.string()),
  emailVerificationTime: v.optional(v.number()),
  phone: v.optional(v.string()),
  phoneVerificationTime: v.optional(v.number()),
  isAnonymous: v.optional(v.boolean()),
  id: v.optional(v.string()), // This is the user ID
}).index("email", ["email"]);

export const findUserByEmail = async (ctx: MutationCtx, email: string) => {
  const users = await ctx.db.query("users").withIndex("email", (q) =>
    q.eq("email", email)
  ).collect();
  return users.length > 0 ? users[0] : null;
};
