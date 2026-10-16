import { Hono } from "hono";

const app = new Hono<{ Bindings: Env }>();

app.get("/api/", (c) => {
  console.log("GET /api/ received");
  return c.json({ name: "Durable" });
});

export default app;
