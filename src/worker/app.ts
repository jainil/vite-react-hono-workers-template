import { Hono } from "hono";
import { openAPIRouteHandler } from "hono-openapi";

import { greetingRoutes } from "./features/greeting/routes";
import { openapiOptions } from "./openapi";
import type { AppEnv } from "./types";

export const app = new Hono<AppEnv>().route("/api/", greetingRoutes);

export type AppType = typeof app;

app.get("/api/openapi.json", openAPIRouteHandler(app, openapiOptions));
