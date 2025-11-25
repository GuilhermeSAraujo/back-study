import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../database/db";
import { quizResults } from "../database/schemas/quiz-results";
import { quizzes } from "../database/schemas/quizzes";
import { userQuota } from "../database/schemas/user-quota";
import { getCourseById, getTopicById } from "../domain/courses";
import { AuthContext } from "../hono/context";
import { jsonValidator, routeValidator } from "../middleware/validator";
import { HttpError } from "../utils/throw-error";
import { QuizCreationQueue, getPendingQuizzes } from "./job/queue";
import { createQuizJsonInput, deleteQuizRouteParam, quizResultJsonInput } from "./quiz.input";
import { resultRoute } from "./result/result.route";

export const quizRoute = new Hono<AuthContext>()
  .post("/", jsonValidator(createQuizJsonInput), async (c) => {
    const user = c.get("user");
    const { course, topic, difficulty, additionalInfo } = c.req.valid("json");

    const selectedCourse = getCourseById(course);
    if (!selectedCourse) {
      throw new HttpError("Curso não encontrado", 404);
    }

    const selectedTopic = getTopicById(course, topic);
    if (!selectedTopic) {
      throw new HttpError("Tópico não encontrado", 404);
    }

    const quota = await db.query.userQuota.findFirst({
      where: eq(userQuota.userId, user.id),
    });

    if (!quota) {
      throw new HttpError("Quota do usuário não encontrada", 404);
    }

    const availableQuota = quota.purchased - quota.consumed;
    if (availableQuota <= 0) {
      throw new HttpError("Quota insuficiente para criar o quiz", 403);
    }

    QuizCreationQueue.push({
      userId: user.id,
      course: selectedCourse,
      topic: selectedTopic,
      difficulty,
      additionalInfo,
    });

    return c.json({}, 201);
  })
  .get("/", async (c) => {
    const user = c.get("user");

    const userQuizzes = await db
      .select({
        id: quizzes.id,
        userId: quizzes.userId,
        courseId: quizzes.courseId,
        courseName: quizzes.courseName,
        topicId: quizzes.topicId,
        topicName: quizzes.topicName,
        difficulty: quizzes.difficulty,
        questions: quizzes.questions,
        additionalInfo: quizzes.additionalInfo,
        createdAt: quizzes.createdAt,
        updatedAt: quizzes.updatedAt,
        deletedAt: quizzes.deletedAt,
        totalQuestions: quizResults.totalQuestions,
        correctAnswers: quizResults.correctAnswers,
      })
      .from(quizzes)
      .leftJoin(
        quizResults,
        and(eq(quizzes.id, quizResults.quizId), eq(quizzes.userId, quizResults.userId))
      )
      .where(eq(quizzes.userId, user.id));

    const pendingQuizzes = getPendingQuizzes(user.id).map((task, index) => ({
      id: `pending-${index}`,
      courseId: task.course.id,
      courseName: task.course.name,
      topicId: task.topic.id,
      topicName: task.topic.name,
      difficulty: task.difficulty,
      questions: [],
      additionalInfo: task.additionalInfo || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      status: "Em criação",
    }));

    return c.json([...pendingQuizzes, ...userQuizzes]);
  })
  .get("/:id", async (c) => {
    const user = c.get("user");
    const quizId = c.req.param("id");

    const quiz = await db.query.quizzes.findFirst({
      where: (quiz, { and, eq }) => and(eq(quiz.id, quizId), eq(quiz.userId, user.id)),
    });

    if (!quiz) {
      throw new HttpError("Quiz não encontrado", 404);
    }

    const result = await db.query.quizResults.findFirst({
      where: (result, { and, eq }) => and(eq(result.quizId, quizId), eq(result.userId, user.id)),
    });

    return c.json({ ...quiz, ...result });
  })
  .post("/:id", jsonValidator(quizResultJsonInput), async (c) => {
    const user = c.get("user");
    const quizId = c.req.param("id");
    const { answers } = c.req.valid("json");

    const quiz = await db.query.quizzes.findFirst({
      where: (quiz, { and, eq }) => and(eq(quiz.id, quizId), eq(quiz.userId, user.id)),
    });

    if (!quiz) {
      throw new HttpError("Quiz não encontrado", 404);
    }

    const existingResult = await db.query.quizResults.findFirst({
      where: (result, { and, eq }) => and(eq(result.quizId, quizId), eq(result.userId, user.id)),
    });

    if (existingResult) {
      throw new HttpError("Resultado já existe para este quiz", 409);
    }

    const totalQuestions = quiz.questions.length;
    const answeredQuestionIds = Object.keys(answers).map(Number);

    if (answeredQuestionIds.length !== totalQuestions) {
      throw new HttpError(
        `Todas as questões devem ser respondidas. Esperado: ${totalQuestions}, Recebido: ${answeredQuestionIds.length}`,
        400
      );
    }

    const quizQuestionIds = quiz.questions.map((q) => q.id);
    const missingQuestions = quizQuestionIds.filter((id) => !answeredQuestionIds.includes(id));
    if (missingQuestions.length > 0) {
      throw new HttpError(`Questões não respondidas: ${missingQuestions.join(", ")}`, 400);
    }

    const answersArray = quizQuestionIds.map((questionId) => ({
      questionId,
      selectedAnswer: answers[String(questionId)] as "A" | "B" | "C" | "D",
    }));

    let correctAnswers = 0;
    for (const question of quiz.questions) {
      const userAnswer = answers[String(question.id)];
      if (userAnswer === question.correctAnswer) {
        correctAnswers++;
      }
    }

    const score = Math.round((correctAnswers / totalQuestions) * 100);

    const [savedResult] = await db
      .insert(quizResults)
      .values({
        quizId,
        userId: user.id,
        answers: answersArray,
        totalQuestions,
        correctAnswers,
        score,
        completedAt: new Date(),
      })
      .returning();

    return c.json(
      {
        id: savedResult.id,
        quizId: savedResult.quizId,
        userId: savedResult.userId,
        answers: savedResult.answers,
        totalQuestions: savedResult.totalQuestions,
        correctAnswers: savedResult.correctAnswers,
        score: savedResult.score,
        completedAt: savedResult.completedAt?.toISOString() || null,
        createdAt: savedResult.createdAt?.toISOString() || new Date().toISOString(),
      },
      201
    );
  })
  .delete("/:id", routeValidator(deleteQuizRouteParam), async (c) => {
    const user = c.get("user");
    const quizId = c.req.param("id");

    const quiz = await db.query.quizzes.findFirst({
      where: (quiz, { and, eq }) => and(eq(quiz.id, quizId), eq(quiz.userId, user.id)),
    });

    if (!quiz) {
      throw new HttpError("Quiz não encontrado", 404);
    }

    await db.delete(quizzes).where(eq(quizzes.id, quizId));

    return c.json({ message: "Quiz deletado com sucesso!" });
  })
  .route("/result", resultRoute);
