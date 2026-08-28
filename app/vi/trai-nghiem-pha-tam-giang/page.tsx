import type { Metadata } from "next";
import { Waves } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { BookingEnquirySection } from "@/src/booking-enquiries/booking-enquiry-section";
import {
  VIETNAMESE_BOOKING_ENQUIRY_COPY,
  VIETNAMESE_OPERATOR_PHONE,
  VIETNAMESE_TOUR_CONTEXT,
} from "@/src/booking-enquiries/vietnamese-booking-enquiry-copy";
import {
  TourDetailPageViewTracker,
  TourDetailPrimaryCta,
  handleTourDetailEnquiryAnalytics,
} from "./tour-detail-client";

export const metadata: Metadata = {
  title: "Trải nghiệm Phá Tam Giang",
  description:
    "Trải nghiệm đầm phá Tam Giang cùng gia đình ngư dân địa phương. Gửi yêu cầu đặt trải nghiệm trực tiếp.",
  alternates: {
    canonical: "/vi/trai-nghiem-pha-tam-giang",
  },
};

export default function VietnameseTourDetailPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TourDetailPageViewTracker />
      <header className="border-b border-border/80 bg-muted/20 px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-3xl space-y-5">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1.5 px-3 py-1 font-semibold text-xs rounded-full border-foreground/20">
              <Waves aria-hidden="true" className="size-3.5 text-primary" />
              Trải nghiệm đầm phá
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl text-balance">
            Trải nghiệm Phá Tam Giang
          </h1>
          <p className="max-w-prose text-base leading-relaxed text-muted-foreground sm:text-lg">
            Khám phá vẻ đẹp vùng đầm phá Tam Giang cùng ngư dân địa phương. Đón hoàng hôn trên phá, chèo SUP và trải nghiệm đời sống sông nước mộc mạc.
          </p>
          <div className="pt-2">
            <TourDetailPrimaryCta />
          </div>
        </div>
      </header>

      <main className="py-8 sm:py-12">
        <BookingEnquirySection
          tour={VIETNAMESE_TOUR_CONTEXT}
          copy={VIETNAMESE_BOOKING_ENQUIRY_COPY}
          phone={VIETNAMESE_OPERATOR_PHONE}
          onAnalyticsEvent={handleTourDetailEnquiryAnalytics}
        />
      </main>
    </div>
  );
}
