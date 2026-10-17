import { describe, expect, it } from "vite-plus/test";

import { app } from "./app";

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
                content: { "application/json": { schema: { type: "object" } } },
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
  });
});
