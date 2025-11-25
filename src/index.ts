import { swaggerUI } from "@hono/swagger-ui";
import { Hono } from "hono";
import { courseRoute } from "./course/course.route";
import { dashboardRoute } from "./dashboard/dashboard.route";
import { db } from "./database/db";
import { handleAuth } from "./middleware/auth";
import { handleCors } from "./middleware/cors";
import { onError } from "./middleware/error";
import { quizRoute } from "./quiz/quiz.route";
import { userRoute } from "./user/user.route";
import { openApiDoc } from "./utils/swagger";

// Database connection check
db.execute("SELECT 1")
  .then(() => console.info("Database connected!"))
  .catch((err) => console.error("Database connection failed:", err));

const app = new Hono()
  .use("*", handleCors())
  .get("/doc", (c) => c.json(openApiDoc))
  .get("/ui", swaggerUI({ url: "/doc" }))
  .use(handleAuth())
  .route("/user", userRoute)
  .route("/course", courseRoute)
  .route("/quiz", quizRoute)
  .route("/dashboard", dashboardRoute)
  .onError(onError);

// Remover o serve() - não funciona na Vercel

export default app;
