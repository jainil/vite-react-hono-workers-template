import { cloudflare } from "@cloudflare/vite-plugin";
import react from "@vitejs/plugin-react";
import ultraciteFmt from "ultracite/oxfmt";
import core from "ultracite/oxlint/core";
import ultraciteReact from "ultracite/oxlint/react";
import vitest from "ultracite/oxlint/vitest";
import { defineConfig, lazyPlugins } from "vite-plus";

const generated = ["dist/**", ".wrangler/**", ".cloudflare/**", "coverage/**"];

export default defineConfig(({ mode }) => ({
  environments: {
    ssr: { build: { sourcemap: true } },
  },
  fmt: {
    ...ultraciteFmt,
    ignorePatterns: [
      ...(ultraciteFmt.ignorePatterns ?? []),
      ...generated,
      "AGENTS.md",
    ],
  },
  lint: {
    extends: [core, ultraciteReact, vitest],
    ignorePatterns: [...(core.ignorePatterns ?? []), ...generated],
    options: { typeAware: true, typeCheck: true },
  },
  plugins: lazyPlugins(() => [
    react(),
    ...(mode === "test" ? [] : [cloudflare()]),
  ]),
  test: {
    clearMocks: true,
    coverage: {
      exclude: [
        "**/*.d.ts",
        "**/*.{test,spec}.{ts,tsx}",
        "**/test/**",
        "src/react-app/main.tsx",
      ],
      include: ["src/react-app/**/*.{ts,tsx}", "src/worker/**/*.ts"],
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      thresholds: { branches: 80, functions: 80, lines: 80, statements: 80 },
    },
    globals: false,
    projects: [
      {
        extends: true,
        test: {
          environment: "jsdom",
          include: ["src/react-app/**/*.{test,spec}.{ts,tsx}"],
          name: "react",
          setupFiles: ["./src/react-app/test/setup.ts"],
        },
      },
      {
        extends: true,
        test: {
          environment: "node",
          include: ["src/worker/**/*.{test,spec}.ts"],
          name: "worker",
        },
      },
    ],
    restoreMocks: true,
    unstubGlobals: true,
  },
}));
