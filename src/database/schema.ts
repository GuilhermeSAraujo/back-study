import { authUsers } from "./schemas/auth-users";
import { userQuota } from "./schemas/user-quota";
import { quizzes, difficultyEnum } from "./schemas/quizzes";
import { quizResults } from "./schemas/quiz-results";

export const schema = {
  authUsers,
  userQuota,
  quizzes,
  quizResults,
  difficultyEnum,
};
