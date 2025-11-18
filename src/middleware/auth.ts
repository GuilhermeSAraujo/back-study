import type { MiddlewareHandler } from "hono";
import { getCookie } from "hono/cookie";
import { decode } from "next-auth/jwt";
import { AuthContext, JWTPayload } from "../hono/context";

export const handleAuth = (): MiddlewareHandler<AuthContext> => {
  return async (c, next) => {
    try {
      const secret = process.env["NEXTAUTH_SECRET"];
      if (!secret) {
        console.error("NEXTAUTH_SECRET não está definido!");
        return c.json({ error: "Server configuration error" }, 500);
      }

      const sessionToken = getCookie(c, "next-auth.session-token");

      if (!sessionToken) {
        return c.json({ message: "Unauthorized - No session token found" }, { status: 401 });
      }

      const _token = await decode({
        token: sessionToken,
        secret,
      });

      if (!_token) {
        return c.json({ message: "Unauthorized - Invalid token" }, { status: 401 });
      }

      const token = _token as JWTPayload;
      c.set("jwtPayload", token);

      if (!token.id || !token.email) {
        return c.json(
          {
            error: "Unauthorized - Invalid token structure",
            debug: { tokenKeys: Object.keys(token || {}) },
          },
          401
        );
      }

      c.set("user", { id: token.id, email: token.email });
      await next();
    } catch (err) {
      console.error("Auth error:", err);
      return c.json({ error: "Unauthorized" }, 401);
    }
  };
};
