// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  TourDetailContactLink,
  TourDetailPageViewTracker,
  TourDetailPrimaryCta,
} from "./tour-detail-client";
import { analytics } from "@/src/analytics/analytics-client";
import { setAnalyticsConsent } from "@/src/analytics/consent";

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

describe("TourDetail Interactions & Analytics", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("fires primary_cta_clicked on TourDetailPrimaryCta click", async () => {
    const user = userEvent.setup();
    const primaryCtaSpy = vi.spyOn(analytics, "trackPrimaryCta");

    render(<TourDetailPrimaryCta />);

    const ctaLink = screen.getByRole("link", {
      name: /Gửi yêu cầu đặt trải nghiệm/i,
    });
    await user.click(ctaLink);

    expect(primaryCtaSpy).toHaveBeenCalledTimes(1);
    expect(primaryCtaSpy).toHaveBeenCalledWith(
      "enquiry_start",
      "booking_enquiry_page",
      "tour_detail",
      "vi",
    );
  });

  it("tracks phone contact action without double-firing primary CTA", async () => {
    const user = userEvent.setup();
    const contactSpy = vi.spyOn(analytics, "trackContact");
    const primaryCtaSpy = vi.spyOn(analytics, "trackPrimaryCta");

    render(
      <TourDetailContactLink kind="phone" href="tel:+84332279474">
        Gọi 0332 279 474
      </TourDetailContactLink>,
    );

    const phoneLink = screen.getByRole("link", { name: "Gọi 0332 279 474" });
    phoneLink.addEventListener("click", (e) => e.preventDefault());
    await user.click(phoneLink);

    expect(contactSpy).toHaveBeenCalledTimes(1);
    expect(contactSpy).toHaveBeenCalledWith("phone", "tour_detail", "vi");
    expect(primaryCtaSpy).not.toHaveBeenCalled();
  });

  it("tracks Maps action as maps_opened without double-firing primary CTA", async () => {
    const user = userEvent.setup();
    const mapsSpy = vi.spyOn(analytics, "trackMaps");
    const primaryCtaSpy = vi.spyOn(analytics, "trackPrimaryCta");

    render(
      <TourDetailContactLink
        kind="maps"
        href="https://www.google.com/maps/place/verified"
        meetingPointKey="chu_huyen_boat_pier"
      >
        Mở Google Maps
      </TourDetailContactLink>,
    );

    const mapsLink = screen.getByRole("link", { name: "Mở Google Maps" });
    mapsLink.addEventListener("click", (e) => e.preventDefault());
    await user.click(mapsLink);

    expect(mapsSpy).toHaveBeenCalledTimes(1);
    expect(mapsSpy).toHaveBeenCalledWith(
      "chu_huyen_boat_pier",
      "tour_detail",
      "vi",
    );
    expect(primaryCtaSpy).not.toHaveBeenCalled();
  });
});
