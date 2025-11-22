import type { MiddlewareHandler } from "hono";
import { AuthContext } from "../hono/context";
import { db } from "../database/db";
import { session, user } from "../database/schemas/auth-users";
import { eq } from "drizzle-orm";

export const handleAuth = (): MiddlewareHandler<AuthContext> => {
  return async (c, next) => {
    try {
      let sessionToken: string | undefined;

      // First, check for Authorization header (for cross-domain requests)
      const authHeader = c.req.header("Authorization");
      if (authHeader?.startsWith("Bearer ")) {
        sessionToken = authHeader.substring(7); // Remove "Bearer " prefix
      }

      if (!sessionToken) {
        return c.json({ message: "Unauthorized - No session token found" }, { status: 401 });
      }

      // Verify session in database
      const [sessionData] = await db
        .select({
          user: user,
          session: session,
        })
        .from(session)
        .innerJoin(user, eq(session.userId, user.id))
        .where(eq(session.token, sessionToken));

      if (!sessionData) {
        return c.json({ message: "Unauthorized - Invalid token" }, { status: 401 });
      }

      const { session: currentSession, user: currentUser } = sessionData;

      // Check if session is expired
      if (new Date() > currentSession.expiresAt) {
        return c.json({ message: "Unauthorized - Session expired" }, { status: 401 });
      }

      c.set("user", { id: currentUser.id, email: currentUser.email });
      await next();
    } catch (err) {
      console.error("Auth error:", err);
      return c.json({ error: "Unauthorized" }, 401);
    }
  };
};
