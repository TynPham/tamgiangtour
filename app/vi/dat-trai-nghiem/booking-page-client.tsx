"use client";

import type { ComponentPropsWithoutRef } from "react";
import { analytics } from "@/src/analytics/analytics-client";
import { useConsentedPageView } from "@/src/analytics/use-consented-page-view";
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
  useConsentedPageView("tour_detail");

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
    analytics.trackContact(channel, "tour_detail", "vi");
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
      "tour_detail",
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
