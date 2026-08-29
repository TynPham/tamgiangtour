"use client";

import type { ComponentPropsWithoutRef } from "react";
import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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

export function TourDetailPrimaryCta({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const handleClick = () => {
    analytics.trackPrimaryCta(
      "enquiry_start",
      "booking_enquiry_page",
      "tour_detail",
      "vi",
    );
  };

  return (
    <Button
      asChild
      size="lg"
      className={cn("min-h-12 w-full px-7 text-base font-semibold shadow-sm sm:w-auto", className)}
      onClick={handleClick}
    >
      <Link href="/vi/dat-trai-nghiem">
        {children ?? (
          <>
            Gửi yêu cầu đặt trải nghiệm
            <ArrowRight aria-hidden="true" className="ml-2 size-4" />
          </>
        )}
      </Link>
    </Button>
  );
}

export function TourDetailContactLink({
  kind,
  href,
  meetingPointKey,
  variant = "default",
  className,
  children,
  onClick,
  ...props
}: ComponentPropsWithoutRef<"a"> & {
  kind: "phone" | "zalo" | "maps";
  href: string;
  meetingPointKey?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link";
}) {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (kind === "phone" || kind === "zalo") {
      analytics.trackContact(kind, "tour_detail", "vi");
    } else if (kind === "maps") {
      analytics.trackMaps(meetingPointKey || "chu_huyen_boat_pier", "tour_detail", "vi");
    }
    onClick?.(event);
  };

  const isExternal = kind === "zalo" || kind === "maps";

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
