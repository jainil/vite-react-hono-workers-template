import { greetingRoutes } from "@worker/features/greeting/routes";
import { openapiOptions } from "@worker/openapi";
import { apiErrorSchema, handleError } from "@worker/shared/errors";
import type { AppEnv } from "@worker/types";
import { Hono } from "hono";
import { openAPIRouteHandler } from "hono-openapi";

export const app = new Hono<AppEnv>().route("/api/", greetingRoutes);

export type AppType = typeof app;

app.get("/api/openapi.json", openAPIRouteHandler(app, openapiOptions));

app.onError(handleError);
app.notFound((c) =>
  c.json(
    apiErrorSchema.parse({
      code: "NOT_FOUND",
      message: "Route not found",
    }),
    404
  )
);
