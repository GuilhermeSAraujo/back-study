import { authUsers } from "./schemas/auth-users.js";
import { userQuota } from "./schemas/user-quota.js";
import { quizzes, difficultyEnum } from "./schemas/quizzes.js";
import { quizResults } from "./schemas/quiz-results.js";

export const schema = {
  authUsers,
  userQuota,
  quizzes,
  quizResults,
  difficultyEnum,
};
