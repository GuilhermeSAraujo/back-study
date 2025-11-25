import type { MiddlewareHandler } from "hono";
import { z } from "zod/v4";
import { HttpError } from "../utils/throw-error";

const jsonRegex = /^application\/([a-z-\.]+\+)?json(;\s*[a-zA-Z0-9\-]+\=([^;]+))*$/;

export function jsonValidator<T extends z.ZodType>(
  schema: T
): MiddlewareHandler<
  any,
  any,
  {
    in: { json: z.input<T> };
    out: { json: z.output<T> };
  }
> {
  return async (c, next) => {
    let value: unknown;
    const contentType = c.req.header("Content-Type");

    if (!contentType || !jsonRegex.test(contentType)) {
      throw new HttpError("JSON mal formado", 400);
    }

    try {
      value = await c.req.json();
    } catch {
      throw new HttpError("JSON mal formado", 400);
    }

    const result = await schema.safeParseAsync(value);

    if (!result.success) {
      console.error("JSON mal formado", { error: result.error });
      throw new HttpError("JSON mal formado", 400);
    }

    c.req.addValidatedData("json", result.data as never);

    await next();
  };
}

export function queryValidator<T extends z.ZodType>(
  schema: T
): MiddlewareHandler<
  any,
  any,
  {
    in: { query: z.input<T> };
    out: { query: z.output<T> };
  }
> {
  return async (c, next) => {
    const queryParams = c.req.query();

    const result = await schema.safeParseAsync(queryParams);

    if (!result.success) {
      console.error("Query parameters inválidos", { error: result.error });
      throw new HttpError("Query parameters inválidos", 400);
    }

    c.req.addValidatedData("query", result.data as never);

    await next();
  };
}

export function routeValidator<T extends z.ZodType>(
  schema: T
): MiddlewareHandler<
  any,
  any,
  {
    in: { param: z.input<T> };
    out: { param: z.output<T> };
  }
> {
  return async (c, next) => {
    const params = c.req.param();

    const result = await schema.safeParseAsync(params);

    if (!result.success) {
      console.error("Parâmetros de rota inválidos", { error: result.error });
      throw new HttpError("Parâmetros de rota inválidos", 400);
    }

    c.req.addValidatedData("param", result.data as never);

    await next();
  };
}
