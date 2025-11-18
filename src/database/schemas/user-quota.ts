import { sql } from "drizzle-orm";
import { pgTable, integer } from "drizzle-orm/pg-core";
import { getBaseTimestampColumns } from "./helpers";
import { authUsers } from "./auth-users";

export const userQuota = pgTable("user_quota", (t) => ({
  id: t
    .uuid()
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  userId: t
    .uuid()
    .notNull()
    .references(() => authUsers.id),
  purchased: t.integer().notNull().default(0),
  consumed: t.integer().notNull().default(0),
  ...getBaseTimestampColumns(t),
}));
