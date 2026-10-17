import { describe, expect, it } from "vite-plus/test";

import { app } from "../../app";

describe("Greeting API", () => {
  it("returns the configured name", async () => {
    const response = await app.request("/api/");
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toStrictEqual({ name: "Durable" });
  });
});
