// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("booking enquiry development preview", () => {
  it("is explicitly preview-only and excluded from indexing", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const { default: PreviewPage, metadata } = await import("./page");

    render(<PreviewPage />);

    expect(
      screen.getByRole("heading", { name: "Booking enquiry UI preview" }),
    ).toBeVisible();
    expect(screen.getByText(/development preview/i)).toBeVisible();
    expect(screen.getByText(/does not create a booking enquiry/i)).toBeVisible();
    expect(metadata.robots).toEqual({
      index: false,
      follow: false,
      nocache: true,
    });
  });
});
