import { Hono } from "hono";
import { getAllCourses } from "../domain/courses.js";
import { AuthContext } from "../hono/context.js";

export const courseRoute = new Hono<AuthContext>().get("/", async (c) => {
  const courses = getAllCourses();

  return c.json(courses);
});
