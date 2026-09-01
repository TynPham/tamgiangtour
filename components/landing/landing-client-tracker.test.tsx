// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { LandingPageViewTracker } from "./landing-client-tracker";
import { analytics } from "@/src/analytics/analytics-client";
import { setAnalyticsConsent } from "@/src/analytics/consent";
import { readFirstTouchAttribution } from "@/src/analytics/attribution";

describe("LandingPageViewTracker", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("emits home page_viewed on mount if consent is already granted", () => {
    setAnalyticsConsent("granted");
    const trackSpy = vi.spyOn(analytics, "trackPageView");

    render(<LandingPageViewTracker />);

    expect(trackSpy).toHaveBeenCalledTimes(1);
    expect(trackSpy).toHaveBeenCalledWith("home", "vi");
  });

  it("does not emit page_viewed on mount if consent is pending", () => {
    const trackSpy = vi.spyOn(analytics, "trackPageView");

    render(<LandingPageViewTracker />);

    expect(trackSpy).not.toHaveBeenCalled();
  });

  it("emits page_viewed when visitor grants consent during the active visit", () => {
    const trackSpy = vi.spyOn(analytics, "trackPageView");

    render(<LandingPageViewTracker />);
    expect(trackSpy).not.toHaveBeenCalled();

    setAnalyticsConsent("granted");

    expect(trackSpy).toHaveBeenCalledTimes(1);
    expect(trackSpy).toHaveBeenCalledWith("home", "vi");
    expect(
      readFirstTouchAttribution({
        hasConsent: true,
        storage: window.sessionStorage,
      }),
    ).toEqual({
      landing_page_key: "home",
      acquisition_source: "direct",
    });
  });

  it("does not emit page_viewed when visitor denies consent", () => {
    const trackSpy = vi.spyOn(analytics, "trackPageView");

    render(<LandingPageViewTracker />);
    setAnalyticsConsent("denied");

    expect(trackSpy).not.toHaveBeenCalled();
  });
});
