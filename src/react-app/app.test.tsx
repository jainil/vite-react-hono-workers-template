import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vite-plus/test";

import App from "./app";

const page = vi.hoisted(() => ({ shouldThrow: false }));

vi.mock(import("./app/routes"), () => ({
  AppRoutes: () => {
    if (page.shouldThrow) {
      throw new Error("Private render error details");
    }
    return <h1>Page contents</h1>;
  },
}));

describe(App, () => {
  beforeEach(() => {
    page.shouldThrow = false;
    vi.spyOn(console, "error").mockReturnValue();
  });

  it("renders the page normally", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: "Page contents" })
    ).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("shows a safe fallback and remounts the page on retry", async () => {
    const user = userEvent.setup();
    page.shouldThrow = true;
    render(<App />);

    expect(screen.getByRole("alert")).toHaveTextContent("Something went wrong");
    expect(
      screen.queryByText("Private render error details")
    ).not.toBeInTheDocument();

    page.shouldThrow = false;
    await user.click(screen.getByRole("button", { name: "Try again" }));

    expect(
      screen.getByRole("heading", { name: "Page contents" })
    ).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("keeps the fallback usable when retrying fails again", async () => {
    const user = userEvent.setup();
    page.shouldThrow = true;
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Try again" }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "If the problem continues, refresh your browser and try again."
    );
    expect(screen.getByRole("button", { name: "Try again" })).toBeEnabled();
  });
});
