import { defineSchema } from "convex/server";
import { authTables } from "@convex-dev/auth/server";

import { splits } from "./splits";
 
const schema = defineSchema({
  ...authTables,
  splits
  // Your other tables...
});
 
export default schema;