/* eslint-disable vitest/no-import-node-test, vitest/prefer-importing-vitest-globals -- This suite verifies Node's native TypeScript execution. */
import assert from "node:assert/strict";
import { test } from "node:test";

import worker from "../src/worker/index.ts";

await test("executes the TypeScript Worker entrypoint natively without a loader", async () => {
  const greeting = await worker.fetch(
    new Request("https://worker.example/api/?name=Native")
  );
  assert.equal(greeting.status, 200);
  assert.deepStrictEqual(await greeting.json(), { name: "Native" });

  const missing = await worker.fetch(
    new Request("https://worker.example/api/missing")
  );
  assert.equal(missing.status, 404);
  assert.deepStrictEqual(await missing.json(), {
    code: "NOT_FOUND",
    message: "Route not found",
  });
});
