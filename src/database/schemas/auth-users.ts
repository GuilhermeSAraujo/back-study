import { sql } from "drizzle-orm";
import { pgTable, unique } from "drizzle-orm/pg-core";
import { getBaseTimestampColumns } from "./helpers.js";

export const authUsers = pgTable(
  "auth_users",
  (t) => ({
    id: t
      .uuid()
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    name: t.varchar().notNull(),
    email: t.varchar().notNull(),
    googleId: t.varchar().notNull(),
    image: t.varchar(),
    ...getBaseTimestampColumns(t),
  }),
  (self) => [unique("auth_users_email_idx").on(self.email)]
);
