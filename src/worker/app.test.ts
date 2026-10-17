import { app } from "@worker/app";
import { handleError } from "@worker/shared/errors";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { describe, expect, it, vi } from "vite-plus/test";

describe("API", () => {
  it("serves the typed OpenAPI contract", async () => {
    const response = await app.request("/api/openapi.json");
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      components: {
        schemas: {
          Greeting: {
            properties: { name: { type: "string" } },
            required: ["name"],
            type: "object",
          },
        },
      },
      paths: {
        "/api/": {
          get: {
            operationId: "getGreeting",
            parameters: [
              {
                in: "query",
                name: "name",
                schema: { maxLength: 100, minLength: 1, type: "string" },
              },
            ],
            responses: {
              "200": {
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/Greeting" },
                  },
                },
              },
              "400": {
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/ApiError" },
                  },
                },
              },
            },
          },
        },
      },
    });
  });

  it("returns 404 for unknown routes", async () => {
    const response = await app.request("/api/missing");
    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toStrictEqual({
      code: "NOT_FOUND",
      message: "Route not found",
    });
  });
});

describe("centralized exceptions", () => {
  it("hides unexpected exception details and logs the cause", async () => {
    const error = new Error("secret database credentials");
    const log = vi.spyOn(console, "error").mockReturnValue();
    const failingApp = new Hono().onError(handleError).get("/", () => {
      throw error;
    });
    const response = await failingApp.request("/");
    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toStrictEqual({
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal server error",
    });
    expect(log).toHaveBeenCalledWith(error);
  });

  it("preserves deliberate HTTP status and headers", async () => {
    const failingApp = new Hono().onError(handleError).get("/", () => {
      throw new HTTPException(429, {
        message: "Try later",
        res: new Response(null, {
          headers: { "Retry-After": "60" },
          status: 429,
        }),
      });
    });
    const response = await failingApp.request("/");
    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("60");
    await expect(response.json()).resolves.toStrictEqual({
      code: "HTTP_ERROR",
      message: "Try later",
    });
  });
});
