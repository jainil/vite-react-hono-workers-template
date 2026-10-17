import { greetingRoutes } from "@worker/features/greeting/routes";
import { openapiOptions } from "@worker/openapi";
import type { AppEnv } from "@worker/types";
import { Hono } from "hono";
import { openAPIRouteHandler } from "hono-openapi";

export const app = new Hono<AppEnv>().route("/api/", greetingRoutes);

export type AppType = typeof app;

app.get("/api/openapi.json", openAPIRouteHandler(app, openapiOptions));
