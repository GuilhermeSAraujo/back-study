import { Hono } from "hono";
import { AuthContext } from "../hono/context.js";

export const userRoute = new Hono<AuthContext>().get("/quota", async (c) => {
  const user = c.get("user");

  // TODO: Buscar quota real do usuário no banco de dados
  return c.json({
    userId: user.id,
    email: user.email,
    plan: "basic",
    balance: 10,
  });
});
