import { describe, expect, it, vi } from "vitest";
import { createAnalyticsTracker } from "./analytics-client";

describe("AnalyticsTracker", () => {
  it("drops all events when consent is not granted", () => {
    const sinkMock = vi.fn();
    const tracker = createAnalyticsTracker({
      sink: sinkMock,
      checkConsent: () => false,
    });

    tracker.trackPageView("tour_detail", "vi");
    tracker.trackPrimaryCta("enquiry_start", "booking_enquiry_page", "home", "vi");
    tracker.trackContact("phone", "tour_detail", "vi");

    expect(sinkMock).not.toHaveBeenCalled();
  });

  it("emits page_viewed event with normalized properties when consented", () => {
    const sinkMock = vi.fn();
    const tracker = createAnalyticsTracker({
      sink: sinkMock,
      checkConsent: () => true,
    });

    tracker.trackPageView("tour_detail", "vi");

    expect(sinkMock).toHaveBeenCalledTimes(1);
    expect(sinkMock).toHaveBeenCalledWith("page_viewed", {
      page_key: "tour_detail",
      locale: "vi",
    });
  });

  it("emits primary_cta_clicked with controlled keys only", () => {
    const sinkMock = vi.fn();
    const tracker = createAnalyticsTracker({
      sink: sinkMock,
      checkConsent: () => true,
    });

    tracker.trackPrimaryCta("enquiry_start", "booking_enquiry_page", "home", "vi");

    expect(sinkMock).toHaveBeenCalledWith("primary_cta_clicked", {
      cta_key: "enquiry_start",
      destination_key: "booking_enquiry_page",
      page_key: "home",
      locale: "vi",
    });
  });

  it("emits contact_clicked without double firing primary CTA", () => {
    const sinkMock = vi.fn();
    const tracker = createAnalyticsTracker({
      sink: sinkMock,
      checkConsent: () => true,
    });

    tracker.trackContact("zalo", "tour_detail", "vi");

    expect(sinkMock).toHaveBeenCalledTimes(1);
    expect(sinkMock).toHaveBeenCalledWith("contact_clicked", {
      contact_channel: "zalo",
      page_key: "tour_detail",
      locale: "vi",
    });
  });

  it("emits booking enquiry funnel events with no PII", () => {
    const sinkMock = vi.fn();
    const tracker = createAnalyticsTracker({
      sink: sinkMock,
      checkConsent: () => true,
    });

    // 1. booking_enquiry_started
    tracker.trackBookingEnquiryEvent(
      { name: "booking_enquiry_started" },
      "trai-nghiem-pha-tam-giang",
      "tour_detail",
      "vi",
    );
    expect(sinkMock).toHaveBeenLastCalledWith("booking_enquiry_started", {
      tour_key: "trai-nghiem-pha-tam-giang",
      page_key: "tour_detail",
      locale: "vi",
    });

    // 2. booking_enquiry_validation_failed (invalid semantic field keys only)
    tracker.trackBookingEnquiryEvent(
      {
        name: "booking_enquiry_validation_failed",
        fieldKeys: ["phoneNumber", "requestedTourDate"],
      },
      "trai-nghiem-pha-tam-giang",
      "tour_detail",
      "vi",
    );
    expect(sinkMock).toHaveBeenLastCalledWith("booking_enquiry_validation_failed", {
      field_keys: ["phoneNumber", "requestedTourDate"],
      tour_key: "trai-nghiem-pha-tam-giang",
      page_key: "tour_detail",
      locale: "vi",
    });

    // 3. booking_enquiry_submitted
    tracker.trackBookingEnquiryEvent(
      { name: "booking_enquiry_submitted" },
      "trai-nghiem-pha-tam-giang",
      "tour_detail",
      "vi",
    );
    expect(sinkMock).toHaveBeenLastCalledWith("booking_enquiry_submitted", {
      tour_key: "trai-nghiem-pha-tam-giang",
      page_key: "tour_detail",
      locale: "vi",
    });

    // 4. booking_enquiry_submission_failed
    tracker.trackBookingEnquiryEvent(
      {
        name: "booking_enquiry_submission_failed",
        failureCategory: "storage",
      },
      "trai-nghiem-pha-tam-giang",
      "tour_detail",
      "vi",
    );
    expect(sinkMock).toHaveBeenLastCalledWith("booking_enquiry_submission_failed", {
      failure_category: "storage",
      tour_key: "trai-nghiem-pha-tam-giang",
      page_key: "tour_detail",
      locale: "vi",
    });
  });

  it("catches sink errors and never throws to the caller", () => {
    const faultySink = () => {
      throw new Error("PostHog connection refused");
    };
    const tracker = createAnalyticsTracker({
      sink: faultySink,
      checkConsent: () => true,
    });

    expect(() => {
      tracker.trackPageView("tour_detail", "vi");
      tracker.trackPrimaryCta("enquiry_start", "booking_enquiry_page", "tour_detail", "vi");
      tracker.trackContact("phone", "tour_detail", "vi");
    }).not.toThrow();
  });

  it("tracker created before PostHog initialization can still send after PostHog becomes available", () => {
    let activeSink: ((eventName: string, properties: Record<string, unknown>) => void) | null = null;

    // Tracker created early (e.g. at module load time when PostHog is null)
    const tracker = createAnalyticsTracker({
      getSink: () => activeSink,
      checkConsent: () => true,
    });

    // Tracking before PostHog initializes
    tracker.trackPageView("tour_detail", "vi");

    // PostHog initializes later
    const dynamicSinkMock = vi.fn();
    activeSink = dynamicSinkMock;

    // Subsequent tracking succeeds
    tracker.trackPrimaryCta("enquiry_start", "booking_enquiry_page", "tour_detail", "vi");
    expect(dynamicSinkMock).toHaveBeenCalledTimes(1);
    expect(dynamicSinkMock).toHaveBeenCalledWith("primary_cta_clicked", {
      cta_key: "enquiry_start",
      destination_key: "booking_enquiry_page",
      page_key: "tour_detail",
      locale: "vi",
    });
  });

  it("missing or unavailable PostHog remains a silent no-op", () => {
    const tracker = createAnalyticsTracker({
      getSink: () => null,
      checkConsent: () => true,
    });

    expect(() => {
      tracker.trackPageView("tour_detail", "vi");
      tracker.trackContact("zalo", "tour_detail", "vi");
    }).not.toThrow();
  });
});
