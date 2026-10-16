import { describe, expect, it } from "vite-plus/test";

import app from "./index";

describe("API", () => {
  it("returns the configured name", async () => {
    const response = await app.request("/api/");
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toStrictEqual({ name: "Durable" });
  });

  it("returns 404 for unknown routes", async () => {
    const response = await app.request("/api/missing");
    expect(response.status).toBe(404);
  });
});
