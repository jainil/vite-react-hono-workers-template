import { defineConfig } from "orval";

export default defineConfig({
  api: {
    input: "./openapi/openapi.json",
    output: {
      client: "swr",
      httpClient: "fetch",
      override: {
        fetch: { includeHttpResponseReturnType: false },
        mutator: {
          name: "request",
          path: "./src/react-app/shared/api/request.ts",
        },
      },
      target: "./src/react-app/shared/api/generated/client.ts",
    },
  },
});
