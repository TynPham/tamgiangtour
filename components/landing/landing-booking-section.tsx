"use client";

import { BookingEnquirySection } from "@/src/booking-enquiries/booking-enquiry-section";
import {
  VIETNAMESE_BOOKING_ENQUIRY_COPY,
  VIETNAMESE_OPERATOR_PHONE,
  VIETNAMESE_TOUR_CONTEXT,
} from "@/src/booking-enquiries/vietnamese-booking-enquiry-copy";
import { analytics } from "@/src/analytics/analytics-client";
import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { WaterDivider } from "@/components/landing/water-primitives";
import type { BookingEnquiryAnalyticsEvent } from "@/src/booking-enquiries/booking-enquiry-contract";

export function LandingBookingSection() {
  const handleAnalyticsEvent = (event: BookingEnquiryAnalyticsEvent) => {
    analytics.trackBookingEnquiryEvent(
      event,
      VIETNAMESE_TOUR_CONTEXT.key,
      "home",
      "vi"
    );
  };

  return (
    <section
      aria-label="Biểu mẫu gửi yêu cầu đặt trải nghiệm"
      className="relative overflow-hidden border-b border-border/60 bg-background py-20 sm:py-28 lg:py-36"
    >
      {/* Wave Transition Leading into Booking */}
      <div className="absolute top-0 inset-x-0">
        <WaterDivider variant="deep" flip />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal delay={40} direction="up" distance={14}>
          <BookingEnquirySection
            tour={VIETNAMESE_TOUR_CONTEXT}
            copy={VIETNAMESE_BOOKING_ENQUIRY_COPY}
            phone={VIETNAMESE_OPERATOR_PHONE}
            onAnalyticsEvent={handleAnalyticsEvent}
          />
        </ScrollReveal>
      </div>
    </section>
  );
}
