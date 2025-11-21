import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { schema } from "./schema.js";

const connectionString = process.env["DATABASE_URL"];
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

export const mainPool = new pg.Pool({ connectionString });
export function createDb() {
  function getBaseDbConfig() {
    return {
      schema,
      casing: "snake_case" as const,
    };
  }
  return drizzle(mainPool, getBaseDbConfig());
}

export const db = createDb();
