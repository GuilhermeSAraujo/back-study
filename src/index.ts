// Load environment variables first (only in development, not on Vercel)
import "./env";

import { Hono } from "hono";
import { handleCors } from "./middleware/cors";
import { userRoute } from "./user/user.route";
import { openApiDoc } from "./utils/swagger";
import { db } from "./database/db";
import { courseRoute } from "./course/course.route";
import { quizRoute } from "./quiz/quiz.route";
import { onError } from "./middleware/error";
import { authRoute } from "./auth/auth.route";
import { handleAuth } from "./middleware/auth";
import { swaggerUI } from "@hono/swagger-ui";

// Database connection check
db.execute("SELECT 1")
  .then(() => console.info("Database connected!"))
  .catch((err) => console.error("Database connection failed:", err));

const app = new Hono()
  .use("*", handleCors())
  .get("/doc", (c) => c.json(openApiDoc))
  .get("/ui", swaggerUI({ url: "/doc" }))
  .route("/auth", authRoute)
  .use(handleAuth())
  .route("/user", userRoute)
  .route("/course", courseRoute)
  .route("/quiz", quizRoute)
  .onError(onError);

// Remover o serve() - não funciona na Vercel

export default app;
