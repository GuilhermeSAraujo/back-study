import { Hono } from "hono";
import { handleCors } from "./middleware/cors.js";
import { userRoute } from "./user/user.route.js";
import { openApiDoc } from "./utils/swagger.js";
import { db } from "./database/db.js";
import { courseRoute } from "./course/course.route.js";
import { quizRoute } from "./quiz/quiz.route.js";
import { onError } from "./middleware/error.js";
import { authRoute } from "./auth/auth.route.js";
import { handleAuth } from "./middleware/auth.js";
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
