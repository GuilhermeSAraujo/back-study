import type { MiddlewareHandler } from "hono";
import { cors } from "hono/cors";

export function handleCors(): MiddlewareHandler {
  const isDevelopment = process.env["ENVIRONMENT"] === "development";

  // Get allowed origins from environment variable or use defaults
  const frontendUrl = process.env["FRONTEND_URL"] || "https://front-study-nine.vercel.app";
  const allowedOrigins = isDevelopment ? ["http://localhost:3000"] : [frontendUrl];

  return cors({
    origin: (origin) => {
      // Para requisições sem origin (como Postman, curl), permite em desenvolvimento
      if (!origin && isDevelopment) return allowedOrigins[0];

      // Verifica se a origem está na lista de permitidas
      if (origin && allowedOrigins.includes(origin)) {
        return origin;
      }

      // Rejeita origens não autorizadas
      return null;
    },
    allowMethods: ["OPTIONS", "GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
    allowHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposeHeaders: ["content-disposition", "Set-Cookie"],
    credentials: true, // fundamental para permitir cookies
    maxAge: 86400,
  });
}
