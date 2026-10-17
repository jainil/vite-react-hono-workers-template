import {
  greetingQuerySchema,
  greetingSchema,
} from "@worker/features/greeting/schemas";
import { apiErrorSchema, errorResponse } from "@worker/shared/errors";
import type { AppEnv } from "@worker/types";
import { Hono } from "hono";
import { describeRoute, resolver, validator as zValidator } from "hono-openapi";

export const greetingRoutes = new Hono<AppEnv>().get(
  "/",
  describeRoute({
    operationId: "getGreeting",
    responses: {
      200: {
        content: { "application/json": { schema: resolver(greetingSchema) } },
        description: "The configured greeting",
      },
      400: errorResponse("Invalid request inputs"),
      500: errorResponse("Unexpected server error"),
    },
    summary: "Get the greeting",
    tags: ["greeting"],
  }),
  zValidator("query", greetingQuerySchema, (result, c) => {
    if (!result.success) {
      return c.json(
        apiErrorSchema.parse({
          code: "VALIDATION_ERROR",
          details: result.error,
          message: "Invalid request inputs",
        }),
        400
      );
    }
    // oxlint-disable-next-line unicorn/no-useless-undefined -- Validation hooks return a response only on failure.
    return undefined;
  }),
  (c) => {
    const query = c.req.valid("query");
    return c.json(greetingSchema.parse({ name: query.name ?? "Durable" }), 200);
  }
);
