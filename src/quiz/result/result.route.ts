import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../../database/db";
import { schema as s } from "../../database/schema";
import { AuthContext } from "../../hono/context";
import { routeValidator } from "../../middleware/validator";
import { HttpError } from "../../utils/throw-error";
import { deleteResultRouteParam } from "./result.input";

export const resultRoute = new Hono<AuthContext>().delete(
  "/:quizId",
  routeValidator(deleteResultRouteParam),
  async (c) => {
    const { quizId } = c.req.valid("param");
    const user = c.get("user");

    const result = await db.query.quizResults.findFirst({
      where: (c) => and(eq(c.quizId, quizId), eq(c.userId, user.id)),
    });

    if (!result) {
      throw new HttpError("Respostas não encontradas para o Quiz", 404);
    }

    await db
      .delete(s.quizResults)
      .where(and(eq(s.quizResults.id, result.id), eq(s.quizResults.userId, user.id)));

    return c.json({ message: "Respostas resetadas com sucesso!" });
  }
);
