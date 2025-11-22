import { account, session, user, verification } from "./schemas/auth-users";
import { quizResults } from "./schemas/quiz-results";
import { difficultyEnum, quizzes } from "./schemas/quizzes";
import { userQuota } from "./schemas/user-quota";

export const schema = {
  account,
  session,
  user,
  verification,
  userQuota,
  quizzes,
  quizResults,
  difficultyEnum,
};
