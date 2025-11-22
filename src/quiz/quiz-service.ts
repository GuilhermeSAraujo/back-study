import { db } from "../database/db";
import { Difficulty, quizzes } from "../database/schemas/quizzes";
import { Course, CourseTopic, buildQuizPrompt } from "../domain/courses";
import { QuizResponse, generateJsonContent } from "../utils/ai";

export interface GenerateQuizProps {
  userId: string;
  course: Course;
  topic: CourseTopic;
  difficulty: Difficulty;
  additionalInfo?: string;
}

export async function generateQuiz(input: GenerateQuizProps) {
  const { course, topic, difficulty, additionalInfo, userId } = input;

  const prompt = buildQuizPrompt(course.name, topic.name, difficulty, additionalInfo);

  const quizData = await generateJsonContent<QuizResponse>(prompt);

  if (!quizData.questions || !Array.isArray(quizData.questions)) {
    throw new Error("Resposta do Gemini não contém questões válidas");
  }

  await db.insert(quizzes).values({
    userId,
    courseId: course.id,
    courseName: course.name,
    topicId: topic.id,
    topicName: topic.name,
    difficulty,
    questions: quizData.questions,
    additionalInfo: additionalInfo || null,
  });
}
