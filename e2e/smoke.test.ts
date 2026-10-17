/* eslint-disable vitest/prefer-importing-vitest-globals -- This suite runs in Playwright, not Vitest. */
import { expect, test } from "@playwright/test";

test("built app loads, calls its API, and handles unknown routes", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));

  const home = await page.goto("/");
  expect(home?.status()).toBe(200);
  await expect(
    page.getByRole("heading", {
      exact: true,
      name: "Vite + React + Hono + Cloudflare",
    })
  ).toBeVisible();

  const greetingResponse = page.waitForResponse(
    (response) => new URL(response.url()).pathname === "/api/"
  );
  const apiButton = page.getByRole("button", { exact: true, name: "get name" });
  await apiButton.click();
  const greeting = await greetingResponse;
  expect(greeting.status()).toBe(200);
  expect(greeting.headers()["content-type"]).toContain("application/json");
  expect(await greeting.json()).toEqual({ name: "Durable" });
  await expect(apiButton).toHaveText("Name from API is: Durable");

  const missingPage = await page.goto("/__smoke__/missing-page");
  expect(missingPage?.status()).toBe(200);
  expect(missingPage?.headers()["content-type"]).toContain("text/html");
  await expect(
    page.getByRole("heading", { exact: true, name: "Page not found" })
  ).toBeVisible();

  // A document navigation must reach Hono too, rather than the SPA fallback.
  const missingApi = await page.goto("/api/__smoke__/missing-endpoint");
  expect(missingApi?.status()).toBe(404);
  expect(missingApi?.headers()["content-type"]).toContain("application/json");
  expect(await missingApi?.json()).toEqual({
    code: "NOT_FOUND",
    message: "Route not found",
  });
  expect(errors).toEqual([]);
});
