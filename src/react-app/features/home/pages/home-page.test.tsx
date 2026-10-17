import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vite-plus/test";

import HomePage from "./home-page";

describe(HomePage, () => {
  it("increments the counter", async () => {
    const user = userEvent.setup();
    render(<HomePage />);
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
    render(<HomePage />);
    expect(fetchMock).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "get name" }));
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/",
      expect.objectContaining({ method: "GET" })
    );
    const result = await screen.findByText("Name from API is: Durable");
    expect(result).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "get name" }));
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });
  });

  it("handles API failures", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockRejectedValue(new Error("Offline"))
    );
    render(<HomePage />);
    await user.click(screen.getByRole("button", { name: "get name" }));
    const result = await screen.findByText("Name from API is: unavailable");
    expect(result).toBeInTheDocument();
  });

  it("handles unsuccessful HTTP responses", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi
        .fn<typeof fetch>()
        .mockResolvedValue(
          Response.json({ message: "Unavailable" }, { status: 503 })
        )
    );
    render(<HomePage />);
    await user.click(screen.getByRole("button", { name: "get name" }));
    const result = await screen.findByText("Name from API is: unavailable");
    expect(result).toBeInTheDocument();
  });
});
