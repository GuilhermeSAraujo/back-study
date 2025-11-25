import { Hono } from "hono";
import { AuthContext } from "../hono/context";
import { db } from "../database/db";
import { quizzes as quizzesSchema } from "../database/schemas/quizzes";
import { quizResults as quizResultsSchema } from "../database/schemas/quiz-results";
import { InferSelectModel, and, asc, desc, eq, gte, isNotNull, lt } from "drizzle-orm";

type Quiz = InferSelectModel<typeof quizzesSchema>;
type QuizResult = InferSelectModel<typeof quizResultsSchema>;

export const dashboardRoute = new Hono<AuthContext>()
  .get("/", async (c) => {
    const user = c.get("user");

    // Get current date and calculate ranges
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Fetch quizzes to map IDs to topics/courses
    const quizzes = (await db.query.quizzes.findMany({
      where: (quiz, { eq }) => eq(quiz.userId, user.id),
    })) as Quiz[];

    // Fetch all quiz results for the user
    const quizResults = (await db.query.quizResults.findMany({
      where: (quizResult, { eq }) => eq(quizResult.userId, user.id),
    })) as QuizResult[];

    // Helper to calculate percentage growth
    const calculateGrowth = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    // Helper to calculate average
    const calculateAverage = (numbers: number[]) => {
      if (numbers.length === 0) return 0;
      const sum = numbers.reduce((a, b) => a + b, 0);
      return Math.round(sum / numbers.length);
    };

    // Filter results by date
    const currentMonthResults = quizResults.filter(
      (r) => r.completedAt && r.completedAt >= currentMonthStart
    );
    const lastMonthResults = quizResults.filter(
      (r) => r.completedAt && r.completedAt >= lastMonthStart && r.completedAt < currentMonthStart
    );

    // 1. Quizzes Realizados
    const totalQuizzesCurrent = currentMonthResults.length;
    const totalQuizzesLast = lastMonthResults.length;
    const quizzesGrowth = calculateGrowth(totalQuizzesCurrent, totalQuizzesLast);

    // 2. Taxa de acerto (Average Score)
    const avgScoreCurrent = calculateAverage(currentMonthResults.map((r) => r.score));
    const avgScoreLast = calculateAverage(lastMonthResults.map((r) => r.score));
    const scoreGrowth = calculateGrowth(avgScoreCurrent, avgScoreLast);

    // 3. Tópicos estudados
    const quizMap = new Map<string, Quiz>(quizzes.map((q) => [q.id, q]));

    const getUniqueTopics = (results: QuizResult[]) => {
      const topics = new Set<string>();
      results.forEach((r) => {
        const quiz = quizMap.get(r.quizId);
        if (quiz) topics.add(quiz.topicName);
      });
      return topics.size;
    };

    const topicsCurrent = getUniqueTopics(currentMonthResults);
    const topicsLast = getUniqueTopics(lastMonthResults);
    const topicsGrowth = calculateGrowth(topicsCurrent, topicsLast);

    // 4. Curso mais estudado (All time)
    const courseCounts = new Map<string, number>();
    quizResults.forEach((r) => {
      const quiz = quizMap.get(r.quizId);
      if (quiz) {
        const count = courseCounts.get(quiz.courseName) || 0;
        courseCounts.set(quiz.courseName, count + 1);
      }
    });

    let mostStudiedCourse = "Nenhum";
    let maxCount = 0;
    for (const [course, count] of courseCounts.entries()) {
      if (count > maxCount) {
        maxCount = count;
        mostStudiedCourse = course;
      }
    }

    return c.json({
      quizzes: {
        total: totalQuizzesCurrent,
        growth: quizzesGrowth,
      },
      accuracy: {
        value: avgScoreCurrent,
        growth: scoreGrowth,
      },
      topics: {
        count: topicsCurrent,
        growth: topicsGrowth,
      },
      mostStudiedCourse,
    });
  })
  .get("/best-worst", async (c) => {
    const user = c.get("user");

    const [bestResults, worstResults] = await Promise.all([
      // Fetch best results (score >= 80)
      db
        .select({
          id: quizResultsSchema.id,
          courseName: quizzesSchema.courseName,
          topicName: quizzesSchema.topicName,
          difficulty: quizzesSchema.difficulty,
          score: quizResultsSchema.score,
          completedAt: quizResultsSchema.completedAt,
        })
        .from(quizResultsSchema)
        .innerJoin(quizzesSchema, eq(quizResultsSchema.quizId, quizzesSchema.id))
        .where(
          and(
            eq(quizResultsSchema.userId, user.id),
            gte(quizResultsSchema.score, 80),
            isNotNull(quizResultsSchema.completedAt)
          )
        )
        .orderBy(desc(quizResultsSchema.score))
        .limit(4),

      // Fetch worst results (score < 80)
      db
        .select({
          id: quizResultsSchema.id,
          courseName: quizzesSchema.courseName,
          topicName: quizzesSchema.topicName,
          difficulty: quizzesSchema.difficulty,
          score: quizResultsSchema.score,
          completedAt: quizResultsSchema.completedAt,
        })
        .from(quizResultsSchema)
        .innerJoin(quizzesSchema, eq(quizResultsSchema.quizId, quizzesSchema.id))
        .where(
          and(
            eq(quizResultsSchema.userId, user.id),
            lt(quizResultsSchema.score, 80),
            isNotNull(quizResultsSchema.completedAt)
          )
        )
        .orderBy(asc(quizResultsSchema.score))
        .limit(4),
    ]);

    return c.json({
      bestResults: bestResults.map((r) => ({
        ...r,
        completedAt: r.completedAt!.toISOString(),
      })),
      worstResults: worstResults.map((r) => ({
        ...r,
        completedAt: r.completedAt!.toISOString(),
      })),
    });
  });
