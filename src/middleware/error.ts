import type { Context } from "hono";
import { HttpError, InternalServerError } from "../utils/throw-error";

export function onError(err: Error, c: Context) {
  // Erros internos de configuração - não expor detalhes ao usuário
  if (err instanceof InternalServerError) {
    console.error("Erro de configuração do servidor", { error: err.internalMessage });
    return c.json({ error: err.userMessage }, 500);
  }

  // expected custom error
  if (err instanceof HttpError) {
    console.error("Erro no servidor", { error: err.message, status: err.status });
    return c.json({ error: err.message }, err.status as any);
  }

  // unexpected errors
  console.error("Erro inesperado", { error: JSON.stringify(err, null, 2) });
  return c.json({ error: "Erro interno do servidor" }, 500);
}
