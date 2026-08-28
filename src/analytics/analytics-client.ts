import type {
  BookingEnquiryAnalyticsEvent,
  BookingEnquiryFieldName,
} from "@/src/booking-enquiries/booking-enquiry-contract";
import type {
  CanonicalAnalyticsEvent,
  ContactChannel,
  FailureCategory,
  Locale,
  PageKey,
} from "./analytics-contract";
import { hasAnalyticsConsent } from "./consent";

export type AnalyticsSink = (
  eventName: string,
  properties: Record<string, unknown>,
) => void;

function defaultPostHogSink(): AnalyticsSink | null {
  if (typeof window !== "undefined" && (window as unknown as { posthog?: { capture?: AnalyticsSink } }).posthog?.capture) {
    return (eventName, properties) => {
      (window as unknown as { posthog: { capture: AnalyticsSink } }).posthog.capture(
        eventName,
        properties,
      );
    };
  }
  return null;
}

export interface AnalyticsTracker {
  track(event: CanonicalAnalyticsEvent): void;
  trackPageView(pageKey: PageKey, locale?: Locale): void;
  trackPrimaryCta(
    ctaKey: "enquiry_start",
    destinationKey: "booking_enquiry_section",
    pageKey: PageKey,
    locale?: Locale,
  ): void;
  trackContact(
    channel: ContactChannel,
    pageKey: PageKey,
    locale?: Locale,
  ): void;
  trackMaps(
    meetingPointKey: string,
    pageKey: PageKey,
    locale?: Locale,
  ): void;
  trackBookingEnquiryEvent(
    event: BookingEnquiryAnalyticsEvent,
    tourKey: string,
    pageKey?: PageKey,
    locale?: Locale,
  ): void;
}

export function createAnalyticsTracker({
  sink = defaultPostHogSink(),
  checkConsent = () => hasAnalyticsConsent(),
}: {
  sink?: AnalyticsSink | null;
  checkConsent?: () => boolean;
} = {}): AnalyticsTracker {
  function track(event: CanonicalAnalyticsEvent): void {
    try {
      if (!checkConsent()) {
        return;
      }
      if (!sink) {
        return;
      }

      sink(event.name, event.properties);
    } catch {
      // Analytics failure must never affect browsing, contact, or enquiry submission.
    }
  }

  return {
    track,
    trackPageView(pageKey: PageKey, locale: Locale = "vi") {
      track({
        name: "page_viewed",
        properties: {
          page_key: pageKey,
          locale,
        },
      });
    },
    trackPrimaryCta(
      ctaKey: "enquiry_start",
      destinationKey: "booking_enquiry_section",
      pageKey: PageKey,
      locale: Locale = "vi",
    ) {
      track({
        name: "primary_cta_clicked",
        properties: {
          cta_key: ctaKey,
          destination_key: destinationKey,
          page_key: pageKey,
          locale,
        },
      });
    },
    trackContact(
      channel: ContactChannel,
      pageKey: PageKey,
      locale: Locale = "vi",
    ) {
      track({
        name: "contact_clicked",
        properties: {
          contact_channel: channel,
          page_key: pageKey,
          locale,
        },
      });
    },
    trackMaps(
      meetingPointKey: string,
      pageKey: PageKey,
      locale: Locale = "vi",
    ) {
      track({
        name: "maps_opened",
        properties: {
          meeting_point_key: meetingPointKey,
          page_key: pageKey,
          locale,
        },
      });
    },
    trackBookingEnquiryEvent(
      event: BookingEnquiryAnalyticsEvent,
      tourKey: string,
      pageKey: PageKey = "tour_detail",
      locale: Locale = "vi",
    ) {
      if (event.name === "booking_enquiry_started") {
        track({
          name: "booking_enquiry_started",
          properties: {
            tour_key: tourKey,
            page_key: pageKey,
            locale,
          },
        });
        return;
      }
      if (event.name === "booking_enquiry_validation_failed") {
        track({
          name: "booking_enquiry_validation_failed",
          properties: {
            field_keys: event.fieldKeys,
            tour_key: tourKey,
            page_key: pageKey,
            locale,
          },
        });
        return;
      }
      if (event.name === "booking_enquiry_submitted") {
        track({
          name: "booking_enquiry_submitted",
          properties: {
            tour_key: tourKey,
            page_key: pageKey,
            locale,
          },
        });
        return;
      }
      if (event.name === "booking_enquiry_submission_failed") {
        track({
          name: "booking_enquiry_submission_failed",
          properties: {
            failure_category: event.failureCategory as FailureCategory,
            tour_key: tourKey,
            page_key: pageKey,
            locale,
          },
        });
      }
    },
  };
}

export const analytics = createAnalyticsTracker();
