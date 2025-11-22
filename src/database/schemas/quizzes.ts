import { sql } from "drizzle-orm";
import { pgEnum, pgTable } from "drizzle-orm/pg-core";
import { QuizQuestion } from "../../utils/ai";
import { user } from "./auth-users";
import { getBaseTimestampColumns } from "./helpers";

// Enum para dificuldade
export const difficultyEnum = pgEnum("difficulty", ["iniciante", "medio", "dificil"]);

// Schema para armazenar os quizzes criados
export const quizzes = pgTable("quizzes", (t) => ({
  id: t
    .uuid()
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  userId: t
    .varchar()
    .notNull()
    .references(() => user.id),
  courseId: t.varchar().notNull(),
  courseName: t.varchar().notNull(),
  topicId: t.varchar().notNull(),
  topicName: t.varchar().notNull(),
  difficulty: difficultyEnum("difficulty").notNull(),
  questions: t.jsonb().$type<QuizQuestion[]>().notNull(), // Array de questões com { id, question, options, correctAnswer, explanation }
  additionalInfo: t.varchar(),
  ...getBaseTimestampColumns(t),
}));
