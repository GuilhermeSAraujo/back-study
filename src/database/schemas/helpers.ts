import type { HasDefault } from "drizzle-orm";
import type { PgColumnsBuilders } from "drizzle-orm/pg-core/columns/all";

export function getBaseTimestampColumns<T extends "string" | "date" = "date">(
  t: PgColumnsBuilders,
  options: { mode?: T } = {}
): {
  createdAt: HasDefault<ReturnType<typeof t.timestamp<T>>>;
  updatedAt: ReturnType<typeof t.timestamp<T>>;
  deletedAt: ReturnType<typeof t.timestamp<T>>;
} {
  const { mode = "date" as T } = options;
  return {
    createdAt: t.timestamp({ mode, withTimezone: true, precision: 2 }).defaultNow() as HasDefault<
      ReturnType<typeof t.timestamp<T>>
    >,
    updatedAt: t.timestamp({ mode, withTimezone: true, precision: 2 }),
    deletedAt: t.timestamp({ mode, withTimezone: true, precision: 2 }),
  };
}
