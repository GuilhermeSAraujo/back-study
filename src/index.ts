// Load environment variables BEFORE any other imports
import "./env";

import { serve } from "@hono/node-server";
import { swaggerUI } from "@hono/swagger-ui";
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

db.execute("SELECT 1")
  .then((res) => {
    console.info("Database connected!");
  })
  .catch((err) => {
    console.error("Database connection failed 🚨");
    console.error("Database error: " + err);
    console.error("Exiting...");
  });

const app = new Hono()
  .get("/doc", (c) => c.json(openApiDoc))
  .get("/ui", swaggerUI({ url: "/doc" }))
  .route("/auth", authRoute)
  .use(handleCors(), handleAuth())
  .route("/user", userRoute)
  .route("/course", courseRoute)
  .route("/quiz", quizRoute)
  .onError(onError);

serve(
  {
    fetch: app.fetch,
    port: 3001,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
