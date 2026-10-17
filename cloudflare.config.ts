import { defineConfig } from "cf/config";

export default defineConfig({
  worker: {
    assets: {
      notFoundHandling: "single-page-application",
      runWorkerFirst: ["/api", "/api/*"],
    },
    compatibilityDate: "2025-10-08",
    compatibilityFlags: ["nodejs_compat"],
    entrypoint: "./src/worker/index.ts",
    name: "vite-react-hono-workers-template",
    observability: { enabled: true },
  },
});
