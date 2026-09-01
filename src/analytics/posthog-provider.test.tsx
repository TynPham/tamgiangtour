// @vitest-environment jsdom

import { act, cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { setAnalyticsConsent } from "./consent";
import { PostHogProvider } from "./posthog-provider";

describe("PostHogProvider", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it("keeps PostHog uninitialized while consent is pending or denied", () => {
    const initialize = vi.fn(() => true);
    render(<PostHogProvider initialize={initialize}>content</PostHogProvider>);

    expect(initialize).not.toHaveBeenCalled();
    act(() => setAnalyticsConsent("denied"));
    expect(initialize).not.toHaveBeenCalled();
  });

  it("initializes PostHog after affirmative consent", () => {
    const initialize = vi.fn(() => true);
    render(<PostHogProvider initialize={initialize}>content</PostHogProvider>);

    act(() => setAnalyticsConsent("granted"));

    expect(initialize).toHaveBeenCalledTimes(1);
  });
});
