import { describe, expect, it, vi } from "vite-plus/test";

import { ApiError, request } from "./request";

describe("API transport", () => {
  it("preserves status, message, code and structured details", async () => {
    const body = {
      code: "VALIDATION_ERROR",
      details: [{ path: ["name"] }],
      message: "Invalid name",
    };
    vi.stubGlobal(
      "fetch",
      vi
        .fn<typeof fetch>()
        .mockResolvedValue(Response.json(body, { status: 400 }))
    );
    const result = await request("/api/").catch((error: unknown) => error);
    expect(result).toBeInstanceOf(ApiError);
    expect(result).toMatchObject({
      body,
      code: body.code,
      details: body.details,
      message: body.message,
      status: 400,
    });
  });

  it.each(["proxy unavailable", "{invalid json", ""])(
    "retains non-JSON HTTP failures: %j",
    async (body) => {
      vi.stubGlobal(
        "fetch",
        vi
          .fn<typeof fetch>()
          .mockResolvedValue(new Response(body, { status: 502 }))
      );
      await expect(request("/api/")).rejects.toMatchObject({
        body: body || undefined,
        message: "API request failed: 502 ",
        status: 502,
      });
    }
  );

  it("preserves network failures", async () => {
    const error = new TypeError("Offline");
    vi.stubGlobal("fetch", vi.fn<typeof fetch>().mockRejectedValue(error));
    await expect(request("/api/")).rejects.toBe(error);
  });

  it.each([204, 205])("handles bodyless success %i", async (status) => {
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status }))
    );
    await expect(request("/api/")).resolves.toBeUndefined();
  });
});
