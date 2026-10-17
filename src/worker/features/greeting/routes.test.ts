import { app } from "@worker/app";
import { describe, expect, it } from "vite-plus/test";

describe("Greeting API", () => {
  it("returns the configured name", async () => {
    const response = await app.request("/api/");
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toStrictEqual({ name: "Durable" });
  });

  it("returns the validated name", async () => {
    const response = await app.request("/api/?name=%20Hono%20");
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toStrictEqual({ name: "Hono" });
  });

  it.each(["", "   ", "a".repeat(101)])(
    "rejects an invalid name: %j",
    async (name) => {
      const response = await app.request(
        `/api/?${new URLSearchParams({ name }).toString()}`
      );
      expect(response.status).toBe(400);
      await expect(response.json()).resolves.toMatchObject({ success: false });
    }
  );
});
