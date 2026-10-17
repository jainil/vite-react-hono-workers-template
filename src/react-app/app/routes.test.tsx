import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vite-plus/test";
import { Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";

import { AppRoutes } from "./routes";

describe(AppRoutes, () => {
  it("shows a fallback for an unknown page", () => {
    const { hook } = memoryLocation({ path: "/missing" });
    render(
      <Router hook={hook}>
        <AppRoutes />
      </Router>
    );
    expect(
      screen.getByRole("heading", { name: "Page not found" })
    ).toBeInTheDocument();
  });
});
