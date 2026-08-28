"use client";

import { useEffect } from "react";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { analytics } from "@/src/analytics/analytics-client";
import type { BookingEnquiryAnalyticsEvent } from "@/src/booking-enquiries/booking-enquiry-contract";
import { VIETNAMESE_TOUR_CONTEXT } from "@/src/booking-enquiries/vietnamese-booking-enquiry-copy";

import { hasAnalyticsConsent } from "@/src/analytics/consent";

export function TourDetailPageViewTracker() {
  useEffect(() => {
    let tracked = false;

    if (hasAnalyticsConsent()) {
      analytics.trackPageView("tour_detail", "vi");
      tracked = true;
      return;
    }

    const handleConsentChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ consent: string }>;
      if (customEvent.detail?.consent === "granted" && !tracked) {
        analytics.trackPageView("tour_detail", "vi");
        tracked = true;
      }
    };

    window.addEventListener("tamgiang:consent_changed", handleConsentChange);
    return () => {
      window.removeEventListener("tamgiang:consent_changed", handleConsentChange);
    };
  }, []);

  return null;
}

export function TourDetailPrimaryCta() {
  const handleClick = () => {
    analytics.trackPrimaryCta(
      "enquiry_start",
      "booking_enquiry_section",
      "tour_detail",
      "vi",
    );
  };

  return (
    <Button
      asChild
      size="lg"
      className="min-h-12 w-full px-7 text-base font-semibold shadow-sm sm:w-auto"
      onClick={handleClick}
    >
      <a href="#booking-enquiry">
        Gửi yêu cầu đặt trải nghiệm
        <ArrowDown aria-hidden="true" className="ml-2 size-4" />
      </a>
    </Button>
  );
}

export function handleTourDetailEnquiryAnalytics(
  event: BookingEnquiryAnalyticsEvent,
) {
  analytics.trackBookingEnquiryEvent(
    event,
    VIETNAMESE_TOUR_CONTEXT.key,
    "tour_detail",
    "vi",
  );
}
