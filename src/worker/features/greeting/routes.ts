import { Hono } from "hono";
import { describeRoute, resolver, validator as zValidator } from "hono-openapi";

import type { AppEnv } from "../../types";
import { greetingQuerySchema, greetingSchema } from "./schemas";

export const greetingRoutes = new Hono<AppEnv>().get(
  "/",
  describeRoute({
    operationId: "getGreeting",
    responses: {
      200: {
        content: { "application/json": { schema: resolver(greetingSchema) } },
        description: "The configured greeting",
      },
    },
    summary: "Get the greeting",
    tags: ["greeting"],
  }),
  zValidator("query", greetingQuerySchema),
  (c) => {
    const query = c.req.valid("query");
    return c.json(greetingSchema.parse({ name: query.name ?? "Durable" }), 200);
  }
);
