"use client";

import type { ComponentPropsWithoutRef } from "react";
import { useEffect } from "react";
import { analytics } from "@/src/analytics/analytics-client";
import { hasAnalyticsConsent } from "@/src/analytics/consent";
import type { BookingEnquiryAnalyticsEvent } from "@/src/booking-enquiries/booking-enquiry-contract";
import { BookingEnquirySection } from "@/src/booking-enquiries/booking-enquiry-section";
import {
  VIETNAMESE_BOOKING_ENQUIRY_COPY,
  VIETNAMESE_OPERATOR_PHONE,
  VIETNAMESE_TOUR_CONTEXT,
} from "@/src/booking-enquiries/vietnamese-booking-enquiry-copy";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export function BookingPageViewTracker() {
  useEffect(() => {
    let tracked = false;

    if (hasAnalyticsConsent()) {
      analytics.trackPageView("booking", "vi");
      tracked = true;
      return;
    }

    const handleConsentChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ consent: string }>;
      if (customEvent.detail?.consent === "granted" && !tracked) {
        analytics.trackPageView("booking", "vi");
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

export function BookingContactLink({
  channel,
  href,
  variant = "outline",
  className,
  children,
  onClick,
  ...props
}: ComponentPropsWithoutRef<"a"> & {
  channel: "phone" | "zalo";
  href: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link";
}) {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    analytics.trackContact(channel, "booking", "vi");
    onClick?.(event);
  };

  const isExternal = channel === "zalo";

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      onClick={handleClick}
      className={cn(buttonVariants({ variant }), className)}
      {...props}
    >
      {children}
    </a>
  );
}

export function BookingEnquiryFormContainer() {
  const handleAnalyticsEvent = (event: BookingEnquiryAnalyticsEvent) => {
    analytics.trackBookingEnquiryEvent(
      event,
      VIETNAMESE_TOUR_CONTEXT.key,
      "booking",
      "vi",
    );
  };

  return (
    <BookingEnquirySection
      tour={VIETNAMESE_TOUR_CONTEXT}
      copy={VIETNAMESE_BOOKING_ENQUIRY_COPY}
      phone={VIETNAMESE_OPERATOR_PHONE}
      onAnalyticsEvent={handleAnalyticsEvent}
    />
  );
}
