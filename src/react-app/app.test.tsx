import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vite-plus/test";

import App from "./app";

describe(App, () => {
  it("increments the counter", async () => {
    const user = userEvent.setup();
    render(<App />);
    const button = screen.getByRole("button", { name: "increment" });
    expect(button).toHaveTextContent("count is 0");
    await user.click(button);
    expect(button).toHaveTextContent("count is 1");
  });

  it("loads the name from the API", async () => {
    const user = userEvent.setup();
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(Response.json({ name: "Durable" }));
    vi.stubGlobal("fetch", fetchMock);
    render(<App />);
    await user.click(screen.getByRole("button", { name: "get name" }));
    expect(fetchMock).toHaveBeenCalledWith("/api/");
    const result = await screen.findByText("Name from API is: Durable");
    expect(result).toBeInTheDocument();
  });

  it("handles API failures", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockRejectedValue(new Error("Offline"))
    );
    render(<App />);
    await user.click(screen.getByRole("button", { name: "get name" }));
    const result = await screen.findByText("Name from API is: unavailable");
    expect(result).toBeInTheDocument();
  });

  it("ignores an invalid API payload", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockResolvedValue(Response.json(null))
    );
    render(<App />);
    await user.click(screen.getByRole("button", { name: "get name" }));
    expect(screen.getByRole("button", { name: "get name" })).toHaveTextContent(
      "Name from API is: unknown"
    );
  });
});
