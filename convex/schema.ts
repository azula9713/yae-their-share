import { authTables } from "@convex-dev/auth/server";
import { defineSchema } from "convex/server";

import { splits } from "./splits";
import { users } from "./users";

const schema = defineSchema({
  ...authTables,
  users,
  splits,
});

export default schema;
