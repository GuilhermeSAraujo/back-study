"use strict";

import * as fastq from "fastq";
import type { queueAsPromised } from "fastq";
import { Difficulty } from "../../database/schemas/quizzes";
import { generateQuiz } from "../quiz-service";
import { Course, CourseTopic } from "../../domain/courses";

interface QuizCreationTask {
  userId: string;
  course: Course;
  topic: CourseTopic;
  difficulty: Difficulty;
  additionalInfo?: string;
}

export const QuizCreationQueue: queueAsPromised<QuizCreationTask> = fastq.promise(asyncWorker, 1);

let currentTask: QuizCreationTask | null = null;

async function asyncWorker(arg: QuizCreationTask): Promise<void> {
  currentTask = arg;
  log(`Starting Quiz creation for user ${arg.userId}`);

  try {
    await generateQuiz(arg);
  } finally {
    currentTask = null;
  }

  log(`Quiz created for user ${arg.userId}`);
}

export function getPendingQuizzes(userId: string): QuizCreationTask[] {
  const pending: QuizCreationTask[] = [];

  if (currentTask && currentTask.userId === userId) {
    pending.push(currentTask);
  }

  const queue = QuizCreationQueue.getQueue();
  for (const task of queue) {
    if (task.userId === userId) {
      pending.push(task);
    }
  }

  return pending;
}

const log = (text: string) => {
  console.info(`[${new Date().toLocaleString("pt-BR")}] [QuizCreationQueue] ${text}`);
};
