import { ISplit } from "@/types/split.types";
import { query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("splits").collect() as ISplit[];
  },
});
