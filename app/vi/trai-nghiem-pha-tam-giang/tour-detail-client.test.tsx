// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { act, cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { TourDetailPageViewTracker } from "./tour-detail-client";
import { analytics } from "@/src/analytics/analytics-client";
import { setAnalyticsConsent, ANALYTICS_CONSENT_KEY } from "@/src/analytics/consent";

describe("TourDetailPageViewTracker", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("emits page_viewed on mount if consent is already granted", () => {
    setAnalyticsConsent("granted");
    const trackSpy = vi.spyOn(analytics, "trackPageView");

    render(<TourDetailPageViewTracker />);

    expect(trackSpy).toHaveBeenCalledTimes(1);
    expect(trackSpy).toHaveBeenCalledWith("tour_detail", "vi");
  });

  it("does not emit page_viewed on mount if consent is pending", () => {
    const trackSpy = vi.spyOn(analytics, "trackPageView");

    render(<TourDetailPageViewTracker />);

    expect(trackSpy).not.toHaveBeenCalled();
  });

  it("emits page_viewed exactly once when visitor grants consent during the active visit", () => {
    const trackSpy = vi.spyOn(analytics, "trackPageView");

    render(<TourDetailPageViewTracker />);
    expect(trackSpy).not.toHaveBeenCalled();

    act(() => {
      setAnalyticsConsent("granted");
    });

    expect(trackSpy).toHaveBeenCalledTimes(1);
    expect(trackSpy).toHaveBeenCalledWith("tour_detail", "vi");

    // Firing consent change again does not double-count
    act(() => {
      window.dispatchEvent(
        new CustomEvent("tamgiang:consent_changed", { detail: { consent: "granted" } }),
      );
    });

    expect(trackSpy).toHaveBeenCalledTimes(1);
  });

  it("does not emit page_viewed when visitor denies consent", () => {
    const trackSpy = vi.spyOn(analytics, "trackPageView");

    render(<TourDetailPageViewTracker />);
    expect(trackSpy).not.toHaveBeenCalled();

    act(() => {
      setAnalyticsConsent("denied");
    });

    expect(trackSpy).not.toHaveBeenCalled();
  });
});
