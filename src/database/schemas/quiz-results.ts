import { sql } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import { getBaseTimestampColumns } from "./helpers";
import { quizzes } from "./quizzes";
import { user } from "./auth-users";

// Schema para armazenar os resultados da execução do quiz
export const quizResults = pgTable("quiz_results", (t) => ({
  id: t
    .uuid()
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  quizId: t
    .uuid()
    .notNull()
    .references(() => quizzes.id, { onDelete: "cascade" }),
  userId: t
    .varchar()
    .notNull()
    .references(() => user.id),
  answers: t.jsonb().notNull(), // Array com as respostas do usuário: [{ questionId, selectedAnswer }]
  totalQuestions: t.integer().notNull(),
  correctAnswers: t.integer().notNull(),
  score: t.integer().notNull(), // Porcentagem (0-100)
  startedAt: t.timestamp({ withTimezone: true, precision: 2 }),
  completedAt: t.timestamp({ withTimezone: true, precision: 2 }),
  ...getBaseTimestampColumns(t),
}));
