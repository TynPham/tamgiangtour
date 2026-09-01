import { describe, expect, it, vi } from "vitest";

import { createPostHogRuntime } from "./posthog-runtime";

describe("PostHog consent runtime", () => {
  it("does not initialize or capture before affirmative consent", () => {
    const client = {
      __loaded: false,
      capture: vi.fn(),
      init: vi.fn(),
    };
    const runtime = createPostHogRuntime({
      client,
      getConsent: () => false,
      key: "phc_test",
      host: "https://eu.i.posthog.com",
    });

    runtime.capture("page_viewed", { page_key: "home", locale: "vi" });

    expect(client.init).not.toHaveBeenCalled();
    expect(client.capture).not.toHaveBeenCalled();
  });

  it("initializes once and captures after affirmative consent", () => {
    let consent = false;
    const client = {
      __loaded: false,
      capture: vi.fn(),
      init: vi.fn(() => {
        client.__loaded = true;
      }),
    };
    const runtime = createPostHogRuntime({
      client,
      getConsent: () => consent,
      key: "phc_test",
      host: "https://eu.i.posthog.com",
    });

    consent = true;
    runtime.capture("page_viewed", { page_key: "home", locale: "vi" });
    runtime.capture("contact_clicked", {
      contact_channel: "zalo",
      page_key: "home",
      locale: "vi",
    });

    expect(client.init).toHaveBeenCalledTimes(1);
    expect(client.init).toHaveBeenCalledWith("phc_test", {
      api_host: "https://eu.i.posthog.com",
      autocapture: false,
      capture_pageleave: false,
      capture_pageview: false,
      disable_session_recording: true,
      persistence: "memory",
      person_profiles: "never",
    });
    expect(client.capture).toHaveBeenCalledTimes(2);
  });

  it("keeps analytics initialization failure isolated from the core journey", () => {
    const client = {
      __loaded: false,
      capture: vi.fn(),
      init: vi.fn(() => {
        throw new Error("provider unavailable");
      }),
    };
    const runtime = createPostHogRuntime({
      client,
      getConsent: () => true,
      key: "phc_test",
      host: "https://eu.i.posthog.com",
    });

    expect(() =>
      runtime.capture("page_viewed", { page_key: "home", locale: "vi" }),
    ).not.toThrow();
    expect(client.capture).not.toHaveBeenCalled();
  });
});
