import { Hono } from "hono";
import { getAllCourses } from "../domain/courses";
import { AuthContext } from "../hono/context";

export const courseRoute = new Hono<AuthContext>().get("/", async (c) => {
  const courses = getAllCourses();

  return c.json(courses);
});
