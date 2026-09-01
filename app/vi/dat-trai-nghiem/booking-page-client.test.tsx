// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  BookingContactLink,
  BookingPageViewTracker,
} from "./booking-page-client";
import { analytics } from "@/src/analytics/analytics-client";
import { setAnalyticsConsent } from "@/src/analytics/consent";

describe("BookingPageViewTracker", () => {
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

    render(<BookingPageViewTracker />);

    expect(trackSpy).toHaveBeenCalledTimes(1);
    expect(trackSpy).toHaveBeenCalledWith("tour_detail", "vi");
  });

  it("does not emit page_viewed on mount if consent is pending", () => {
    const trackSpy = vi.spyOn(analytics, "trackPageView");

    render(<BookingPageViewTracker />);

    expect(trackSpy).not.toHaveBeenCalled();
  });

  it("emits page_viewed exactly once when visitor grants consent during the active visit", () => {
    const trackSpy = vi.spyOn(analytics, "trackPageView");

    render(<BookingPageViewTracker />);
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

  it("tracks booking-page contact clicks within the canonical tour-detail context", async () => {
    const user = userEvent.setup();
    const contactSpy = vi.spyOn(analytics, "trackContact");

    render(
      <BookingContactLink channel="phone" href="tel:+84332279474">
        Gọi 0332 279 474
      </BookingContactLink>,
    );

    const link = screen.getByRole("link", { name: "Gọi 0332 279 474" });
    link.addEventListener("click", (e) => e.preventDefault());
    await user.click(link);

    expect(contactSpy).toHaveBeenCalledTimes(1);
    expect(contactSpy).toHaveBeenCalledWith("phone", "tour_detail", "vi");
  });
});
