import type { MiddlewareHandler } from "hono";
import { cors } from "hono/cors";

export function handleCors(): MiddlewareHandler {
  const isDevelopment = process.env["ENVIRONMENT"] === "development";

  const allowedOrigins = isDevelopment
    ? ["http://localhost:3000"]
    : ["https://seu-front-de-producao.com"];

  return cors({
    origin: (origin) => {
      if (!origin) return allowedOrigins[0]; // fallback
      return allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
    },
    allowMethods: ["OPTIONS", "GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["content-disposition"],
    credentials: true, // fundamental para permitir cookies
    maxAge: 86400,
  });
}
