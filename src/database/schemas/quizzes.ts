import { sql } from "drizzle-orm";
import { pgTable, varchar, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { getBaseTimestampColumns } from "./helpers.js";
import { authUsers } from "./auth-users.js";
import { QuizQuestion } from "../../utils/ai.js";

// Enum para dificuldade
export const difficultyEnum = pgEnum("difficulty", ["iniciante", "medio", "dificil"]);

// Schema para armazenar os quizzes criados
export const quizzes = pgTable("quizzes", (t) => ({
  id: t
    .uuid()
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  userId: t
    .uuid()
    .notNull()
    .references(() => authUsers.id),
  courseId: t.varchar().notNull(),
  courseName: t.varchar().notNull(),
  topicId: t.varchar().notNull(),
  topicName: t.varchar().notNull(),
  difficulty: difficultyEnum("difficulty").notNull(),
  questions: t.jsonb().$type<QuizQuestion[]>().notNull(), // Array de questões com { id, question, options, correctAnswer, explanation }
  additionalInfo: t.varchar(),
  ...getBaseTimestampColumns(t),
}));
