import { Hono } from "hono";

import { greetingRoutes } from "./features/greeting/routes";
import type { AppEnv } from "./types";

export const app = new Hono<AppEnv>().route("/api/", greetingRoutes);

export type AppType = typeof app;
