import { Hono } from "hono";

import type { AppEnv } from "../../types";

export const greetingRoutes = new Hono<AppEnv>().get("/", (c) => {
  console.log("GET /api/ received");
  return c.json({ name: "Durable" });
});
