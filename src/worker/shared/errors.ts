import type { ErrorHandler } from "hono";
import { resolver } from "hono-openapi";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

export const apiErrorSchema = z
  .object({
    code: z.string(),
    details: z.json().optional(),
    message: z.string(),
  })
  .meta({ ref: "ApiError" });

export const errorResponse = (description: string) => ({
  content: { "application/json": { schema: resolver(apiErrorSchema) } },
  description,
});

export const handleError: ErrorHandler = (error, c) => {
  if (error instanceof HTTPException && error.status < 500) {
    const response = error.getResponse();
    return c.json(
      apiErrorSchema.parse({
        code: "HTTP_ERROR",
        message: error.message || response.statusText || "Request failed",
      }),
      { headers: response.headers, status: error.status }
    );
  }
  console.error(error);
  return c.json(
    apiErrorSchema.parse({
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal server error",
    }),
    500
  );
};
