import { defineSchema } from "convex/server";
import { authTables } from "@convex-dev/auth/server";

import { splits } from "./splits";
import { users } from "./users";
 
const schema = defineSchema({
  ...authTables,
  users,
  splits
  // Your other tables...
});
 
export default schema;