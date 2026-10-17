import { describe, expect, it } from "vite-plus/test";

import { app } from "./app";

describe("API", () => {
  it("returns 404 for unknown routes", async () => {
    const response = await app.request("/api/missing");
    expect(response.status).toBe(404);
  });
});
