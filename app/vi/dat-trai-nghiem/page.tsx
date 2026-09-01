import type { Metadata } from "next";
import Image from "next/image";
import { MessageCircle, Phone } from "lucide-react";

import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { WaterDivider } from "@/components/landing/water-primitives";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import {
  SectionEyebrow,
  SiteContainer,
} from "@/components/site/site-primitives";
import { Badge } from "@/components/ui/badge";
import { LANDING_PAGE_CONTENT } from "@/src/content/landing-page-content";
import { createVietnamesePageMetadata } from "@/src/seo/site-metadata";
import {
  BookingContactLink,
  BookingEnquiryFormContainer,
  BookingPageViewTracker,
} from "./booking-page-client";

const BOOKING_PAGE_TITLE = "Gửi yêu cầu đặt trải nghiệm";
const BOOKING_PAGE_DESCRIPTION =
  "Gửi thông tin ngày mong muốn và số lượng khách để trải nghiệm đầm phá Tam Giang cùng gia đình ngư dân Chú Huyền. Gia đình sẽ liên hệ xác nhận trực tiếp.";

export const metadata: Metadata = createVietnamesePageMetadata({
  path: "/vi/dat-trai-nghiem",
  title: BOOKING_PAGE_TITLE,
  description: BOOKING_PAGE_DESCRIPTION,
  imageAlt: LANDING_PAGE_CONTENT.hero.heroImageAlt,
});

export default function VietnameseBookingEnquiryPage() {
  const { contact, gallery, pricing, tour } = LANDING_PAGE_CONTENT;
  const bookingImage = gallery.photos.find((photo) => photo.id === "real-sup-activity");

  return (
    <div className="tam-giang-site flex min-h-screen flex-col overflow-x-clip bg-background text-foreground selection:bg-primary/20 selection:text-foreground">
      {/* 1. Analytics Page View Tracker */}
      <BookingPageViewTracker />

      {/* 2. Skip to Main Content Link for Keyboard Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:not-sr-only focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground focus:shadow-lg focus:outline-none"
      >
        Chuyển đến nội dung chính
      </a>

      {/* 3. Shared Site Header */}
      <SiteHeader pageKey="tour_detail" primaryActionHref="/vi/dat-trai-nghiem" />

      <main id="main-content" className="flex-1 py-10 sm:py-16 lg:py-20">
        <SiteContainer>
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14">
            {/* LEFT / INTRO & CONTEXT */}
            <ScrollReveal
              direction="right"
              distance={20}
              variant="heading"
              className="space-y-6 lg:col-span-5"
            >
              <div className="space-y-3">
                <SectionEyebrow>Đặt trải nghiệm bản địa</SectionEyebrow>
                <h1 className="text-balance font-sans text-3xl font-semibold leading-[1.12] tracking-[-0.035em] text-foreground sm:text-4xl">
                  Gửi yêu cầu đặt trải nghiệm
                </h1>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Điền ngày bạn dự kiến đi và số lượng khách. Gia đình Chú Huyền sẽ liên hệ lại trực tiếp để thống nhất chuyến đi và xác nhận đặt chỗ.
                </p>
              </div>

              {/* Compact Tour Context Summary */}
              <div className="space-y-3 rounded-2xl border border-border/80 bg-muted/30 p-5 sm:p-6 shadow-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-primary">
                    Thông tin chuyến đi
                  </span>
                  <Badge variant="outline" className="text-[11px] font-medium border-border/80 bg-background/60">
                    Gia đình bản địa
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="font-sans text-base font-semibold text-foreground">
                    {tour.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Khoảng {tour.duration} · {tour.operatingWindow}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {pricing.options.map((option) => `${option.label} ${option.display}`).join(" · ")} · Tối thiểu {pricing.minimumGuests} khách
                  </p>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground/90 border-t border-border/60 pt-3">
                  Bạn đang gửi ngày mong muốn và số lượng khách. Đây là yêu cầu đặt trải nghiệm, chưa phát sinh thanh toán hay xác nhận giữ chỗ tức thì.
                </p>
              </div>

              {/* Authentic Experience Visual */}
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border/70 bg-card shadow-xs">
                <Image
                  src={bookingImage?.src ?? LANDING_PAGE_CONTENT.hero.heroImage}
                  alt={bookingImage?.alt ?? LANDING_PAGE_CONTENT.hero.heroImageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover transition-transform duration-700 hover:scale-103"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="text-xs font-medium text-white/95">
                    Hoạt động SUP phụ thuộc điều kiện thực tế
                  </p>
                </div>
              </div>

              {/* Direct Hotline / Zalo Fallback Path */}
              <div className="rounded-xl border border-border/60 bg-card/60 p-4 space-y-2">
                <p className="text-xs font-semibold text-foreground">
                  Cần trao đổi trước khi gửi yêu cầu?
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <BookingContactLink
                    channel="phone"
                    href={contact.phoneHref}
                    variant="outline"
                    className="h-9 px-3 text-xs font-semibold border-border bg-background"
                  >
                    <Phone className="mr-1.5 size-3.5 text-primary" aria-hidden="true" />
                    <span>{contact.phoneDisplay}</span>
                  </BookingContactLink>
                  <BookingContactLink
                    channel="zalo"
                    href={contact.zaloHref}
                    variant="outline"
                    className="h-9 px-3 text-xs font-semibold border-border bg-background"
                  >
                    <MessageCircle className="mr-1.5 size-3.5 text-primary" aria-hidden="true" />
                    <span>{contact.zaloLabel}</span>
                  </BookingContactLink>
                </div>
              </div>
            </ScrollReveal>

            {/* RIGHT / FORM */}
            <ScrollReveal
              delay={60}
              direction="up"
              distance={20}
              className="lg:col-span-7"
            >
              <BookingEnquiryFormContainer />
            </ScrollReveal>
          </div>
        </SiteContainer>

        {/* Water Transition Motif before Footer */}
        <div className="mt-16 sm:mt-24">
          <WaterDivider variant="contour" />
        </div>
      </main>

      {/* 4. Shared Site Footer */}
      <SiteFooter pageKey="tour_detail" />
    </div>
  );
}
