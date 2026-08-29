import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Navigation,
  Phone,
  ShieldCheck,
} from "lucide-react";

import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { WaterDivider } from "@/components/landing/water-primitives";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import {
  SectionEyebrow,
  SiteContainer,
} from "@/components/site/site-primitives";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  VIETNAMESE_TOUR_CONTEXT,
} from "@/src/booking-enquiries/vietnamese-booking-enquiry-copy";
import { LANDING_PAGE_CONTENT } from "@/src/content/landing-page-content";
import {
  TourDetailContactLink,
  TourDetailPageViewTracker,
  TourDetailPrimaryCta,
} from "./tour-detail-client";

export const metadata: Metadata = {
  title: "Trải nghiệm Phá Tam Giang",
  description:
    "Trải nghiệm đầm phá Tam Giang cùng gia đình ngư dân địa phương. Đón hoàng hôn trên phá, chèo SUP, thả lưới cá và thưởng thức BBQ hải sản.",
  alternates: {
    canonical: "/vi/trai-nghiem-pha-tam-giang",
  },
  openGraph: {
    title: "Trải nghiệm Phá Tam Giang | Tour Du Lịch Chú Huyền",
    description:
      "Trải nghiệm đầm phá Tam Giang cùng gia đình ngư dân địa phương. Đón hoàng hôn trên phá, chèo SUP, thả lưới cá và thưởng thức BBQ hải sản.",
    url: "https://tamgiangtour.vn/vi/trai-nghiem-pha-tam-giang",
    siteName: LANDING_PAGE_CONTENT.navigation.brandName,
    locale: "vi_VN",
    type: "website",
  },
};

export default function VietnameseTourDetailPage() {
  const { contact, quickFacts, highlights, itinerary, inclusions } =
    LANDING_PAGE_CONTENT;

  return (
    <div className="tam-giang-site flex min-h-screen flex-col overflow-x-clip bg-background text-foreground selection:bg-primary/20 selection:text-foreground">
      {/* 1. Page View Analytics Tracker */}
      <TourDetailPageViewTracker />

      {/* 2. Skip to Main Content Link for Keyboard Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:not-sr-only focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground focus:shadow-lg focus:outline-none"
      >
        Chuyển đến nội dung chính
      </a>

      {/* 3. Shared Site Header */}
      <SiteHeader
        pageKey="tour_detail"
        primaryActionHref="/vi/dat-trai-nghiem"
      />

      <main id="main-content" className="flex-1">
        {/* SECTION 1: Tour Detail Hero / Opening */}
        <section className="relative overflow-hidden border-b border-border/60 bg-muted/35 py-16 sm:py-24 lg:py-28">
          <SiteContainer>
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
              {/* Hero Left Content */}
              <ScrollReveal
                direction="right"
                distance={28}
                variant="heading"
                className="space-y-6 lg:col-span-7"
              >
                <div className="space-y-4">
                  <SectionEyebrow>Trải nghiệm bản địa chân thật</SectionEyebrow>
                  <h1 className="text-balance font-sans text-3xl font-semibold leading-[1.08] tracking-[-0.035em] text-foreground sm:text-4xl lg:text-5xl">
                    {VIETNAMESE_TOUR_CONTEXT.title}
                  </h1>
                  <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                    Cùng gia đình ngư dân xuôi thuyền gỗ lướt trên mặt nước mênh
                    mông, chèo SUP giữa ráng chiều đỏ rực, tự tay thả lưới cất rớ
                    và thưởng thức bữa tiệc BBQ hải sản đầm phá nóng hổi ngay tại
                    chòi.
                  </p>
                </div>

                {/* Hero Actions */}
                <div className="flex flex-col gap-3.5 pt-2 sm:flex-row sm:items-center">
                  <TourDetailPrimaryCta />
                  <TourDetailContactLink
                    kind="phone"
                    href={contact.phoneHref}
                    variant="outline"
                    className="min-h-12 border-border px-5 text-sm font-semibold sm:text-base"
                  >
                    <Phone
                      className="mr-2 size-4 text-primary"
                      aria-hidden="true"
                    />
                    <span>Tư vấn: {contact.phoneDisplay}</span>
                  </TourDetailContactLink>
                </div>
              </ScrollReveal>

              {/* Hero Right Media Composition */}
              <div className="lg:col-span-5">
                <ScrollReveal
                  delay={80}
                  direction="left"
                  distance={28}
                  variant="image"
                  className="relative mx-auto max-w-lg lg:max-w-none"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border/80 bg-card shadow-lg">
                    <Image
                      src="/images/tamgiang/hero-sunset.jpg"
                      alt="Hoàng hôn buông xuống trên đầm phá Tam Giang với thuyền gỗ truyền thống"
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover transition-transform duration-700 hover:scale-105"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                      <div className="space-y-0.5">
                        <span className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--lagoon-sun)]">
                          Hoàng hôn xứ Huế
                        </span>
                        <p className="font-sans text-sm font-medium">
                          Bến thuyền Chú Huyền — Phá Tam Giang
                        </p>
                      </div>
                      <Badge className="bg-primary/90 text-primary-foreground text-xs font-semibold">
                        Gia đình bản địa
                      </Badge>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </SiteContainer>

          <WaterDivider
            variant="contour"
            className="absolute inset-x-0 bottom-1"
          />
        </section>

        {/* SECTION 2: Compact Key Facts Bar */}
        <section
          aria-label="Thông tin nhanh về tour"
          className="border-b border-border/70 bg-[var(--lagoon-paper)] py-7 sm:py-9"
        >
          <SiteContainer>
            <div className="grid grid-cols-2 gap-x-5 gap-y-7 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-border/70">
              {quickFacts.map((fact, index) => (
                <ScrollReveal
                  key={fact.label}
                  delay={index * 40}
                  direction="up"
                  distance={14}
                  className={`min-w-0 lg:px-8 ${
                    index === 0 ? "lg:pl-0" : ""
                  } ${index === quickFacts.length - 1 ? "lg:pr-0" : ""}`}
                >
                  <div className="space-y-1.5">
                    <span className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-primary">
                      {fact.label}
                    </span>
                    <p className="text-pretty font-sans text-lg font-semibold tracking-[-0.02em] text-foreground sm:text-xl">
                      {fact.value}
                    </p>
                  </div>
                  {fact.subtext && (
                    <p className="mt-2 hidden text-xs leading-relaxed text-muted-foreground sm:block">
                      {fact.subtext}
                    </p>
                  )}
                </ScrollReveal>
              ))}
            </div>
          </SiteContainer>
        </section>

        {/* SECTION 3: Experience Highlights & Itinerary Context */}
        <section
          aria-labelledby="experience-highlights-heading"
          className="py-16 sm:py-24 lg:py-28"
        >
          <SiteContainer>
            <ScrollReveal
              direction="right"
              distance={24}
              variant="heading"
              className="mb-12 max-w-2xl space-y-3 sm:mb-16"
            >
              <SectionEyebrow>Điểm nhấn trải nghiệm</SectionEyebrow>
              <h2
                id="experience-highlights-heading"
                className="text-balance font-sans text-2xl font-semibold tracking-[-0.03em] text-foreground sm:text-3xl lg:text-4xl"
              >
                {highlights.heading}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                {highlights.description}
              </p>
            </ScrollReveal>

            {/* 3 Highlight Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {highlights.items.map((item, idx) => (
                <ScrollReveal
                  key={item.id}
                  delay={idx * 60}
                  direction="up"
                  distance={20}
                  className="flex flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-xs transition-colors hover:border-primary/40"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                    <Image
                      src={item.imageSrc}
                      alt={item.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                    {item.badgeText && (
                      <Badge className="absolute left-3 top-3 bg-black/60 text-white backdrop-blur-xs text-[0.68rem]">
                        {item.badgeText}
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-5 space-y-3 sm:p-6">
                    <div className="space-y-1.5">
                      <span className="text-[0.68rem] font-semibold uppercase tracking-wider text-primary">
                        {item.tag}
                      </span>
                      <h3 className="font-sans text-lg font-bold text-foreground">
                        {item.title}
                      </h3>
                      <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Timeline stops preview */}
            <div className="mt-14 rounded-2xl border border-border/80 bg-muted/20 p-6 sm:p-8">
              <div className="mb-6 flex flex-col gap-2 border-b border-border/60 pb-4 sm:flex-row sm:items-baseline sm:justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Khung thời gian dự kiến
                  </span>
                  <h3 className="mt-1 font-sans text-xl font-bold text-foreground sm:text-2xl">
                    {itinerary.heading}
                  </h3>
                </div>
                <p className="max-w-md text-xs text-muted-foreground sm:text-right">
                  {itinerary.note}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {itinerary.stops.map((stop) => (
                  <div
                    key={stop.time}
                    className="flex gap-3 rounded-lg border border-border/60 bg-card/60 p-4 transition-colors hover:border-primary/40"
                  >
                    <span className="flex h-7 shrink-0 items-center justify-center rounded-md bg-primary/10 px-2 text-xs font-bold text-primary">
                      {stop.time}
                    </span>
                    <div className="space-y-1">
                      <h4 className="font-sans text-sm font-semibold text-foreground">
                        {stop.title}
                      </h4>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {stop.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SiteContainer>
        </section>

        {/* SECTION 4: Inclusions & Practical Information */}
        <section
          aria-labelledby="inclusions-heading"
          className="border-t border-border/60 bg-muted/30 py-16 sm:py-24"
        >
          <SiteContainer>
            <ScrollReveal
              direction="right"
              distance={24}
              variant="heading"
              className="mb-12 max-w-2xl space-y-3 sm:mb-16"
            >
              <SectionEyebrow>Dịch vụ & Tiện ích</SectionEyebrow>
              <h2
                id="inclusions-heading"
                className="text-balance font-sans text-2xl font-semibold tracking-[-0.03em] text-foreground sm:text-3xl lg:text-4xl"
              >
                Dịch vụ bao gồm & Thông tin cần biết
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                Chi tiết các dịch vụ được gia đình chuẩn bị chu đáo và những lưu
                ý thực tế trước khi lên thuyền.
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Included items */}
              <ScrollReveal
                direction="right"
                distance={20}
                className="space-y-4 rounded-2xl border border-border/80 bg-card p-6 shadow-xs sm:p-8"
              >
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <CheckCircle2
                    className="size-5 text-emerald-600 dark:text-emerald-400"
                    aria-hidden="true"
                  />
                  <span>Dịch vụ bao gồm trong tour</span>
                </div>
                <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
                  {inclusions.included.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-lg border border-border/50 bg-muted/30 p-3.5 space-y-1"
                    >
                      <p className="text-xs font-semibold text-foreground sm:text-sm">
                        {item.title}
                      </p>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollReveal>

              {/* Not included & practical notes */}
              <ScrollReveal
                direction="left"
                distance={20}
                className="flex flex-col justify-between space-y-6 rounded-2xl border border-border/80 bg-card p-6 shadow-xs sm:p-8"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                    <span className="flex size-5 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                      !
                    </span>
                    <span>Không bao gồm & Chi phí ngoài</span>
                  </div>
                  <div className="space-y-2.5">
                    {inclusions.notIncluded.map((item) => (
                      <div
                        key={item.title}
                        className="rounded-lg border border-border/50 bg-muted/20 p-3 space-y-0.5"
                      >
                        <p className="text-xs font-medium text-foreground sm:text-sm">
                          {item.title}
                        </p>
                        <p className="text-xs leading-relaxed text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border/60 pt-4 space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-primary">
                    Lưu ý chuẩn bị
                  </p>
                  <ul className="space-y-1.5 text-xs text-muted-foreground">
                    {inclusions.practicalNotes.map((note) => (
                      <li key={note} className="flex items-start gap-2">
                        <span
                          className="mt-1 size-1.5 shrink-0 rounded-full bg-primary/60"
                          aria-hidden="true"
                        />
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            </div>
          </SiteContainer>
        </section>

        {/* SECTION 5: Location & Maps Teaser */}
        <section
          aria-labelledby="location-teaser-heading"
          className="border-t border-border/60 py-16 sm:py-20"
        >
          <SiteContainer>
            <div className="rounded-2xl border border-border/80 bg-muted/30 p-6 sm:p-10">
              <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
                <div className="space-y-3 lg:col-span-7">
                  <SectionEyebrow>Điểm đón & Chỉ đường</SectionEyebrow>
                  <h2
                    id="location-teaser-heading"
                    className="font-sans text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
                  >
                    Điểm đón bến thuyền Chú Huyền
                  </h2>
                  <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
                    Bến thuyền có vị trí xác thực trên Google Maps, cách trung
                    tâm TP. Huế khoảng 15–20km (mất 30–40 phút di chuyển theo
                    Quốc lộ 49B).
                  </p>
                  <div className="border-l-2 border-primary pl-4 pt-1">
                    <p className="text-sm font-semibold text-foreground">
                      {contact.mapsPlaceName}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {contact.mapsAddress}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row lg:col-span-5 lg:justify-end">
                  <TourDetailContactLink
                    kind="maps"
                    href={contact.mapsHref}
                    meetingPointKey={contact.mapsPlaceKey}
                    className="min-h-12 px-5 text-sm font-semibold"
                  >
                    <Navigation className="mr-2 size-4" aria-hidden="true" />
                    <span>Mở Google Maps</span>
                  </TourDetailContactLink>

                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="min-h-12 border-border px-5 text-sm font-semibold"
                  >
                    <Link href="/vi/lien-he">
                      <span>Xem chỉ đường chi tiết</span>
                      <ArrowRight className="ml-1.5 size-4" aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </SiteContainer>
        </section>

        {/* SECTION 6: Closing Booking CTA Banner Section */}
        <section
          aria-labelledby="tour-detail-cta-heading"
          className="relative overflow-hidden border-t border-border/60 bg-muted/20 py-20 sm:py-28"
        >
          <WaterDivider
            variant="wave"
            className="absolute inset-x-0 top-0 -translate-y-1/2"
          />

          <SiteContainer>
            <ScrollReveal
              direction="up"
              distance={24}
              className="mx-auto max-w-3xl text-center space-y-6"
            >
              <SectionEyebrow className="justify-center">
                Đặt chỗ trực tiếp
              </SectionEyebrow>
              <h2
                id="tour-detail-cta-heading"
                className="text-balance font-sans text-3xl font-semibold tracking-[-0.035em] text-foreground sm:text-4xl"
              >
                Sẵn sàng cho chuyến du ngoạn Phá Tam Giang?
              </h2>
              <p className="mx-auto max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Điền ngày bạn dự kiến đi và số lượng khách. Gia đình Chú Huyền sẽ sắp xếp thuyền chu đáo và liên hệ xác nhận trực tiếp cùng bạn.
              </p>

              <div className="flex flex-col items-center justify-center gap-3.5 pt-2 sm:flex-row">
                <TourDetailPrimaryCta />
                <TourDetailContactLink
                  kind="phone"
                  href={contact.phoneHref}
                  variant="outline"
                  className="min-h-12 border-border px-5 text-sm font-semibold sm:text-base"
                >
                  <Phone className="mr-2 size-4 text-primary" aria-hidden="true" />
                  <span>Gọi tư vấn: {contact.phoneDisplay}</span>
                </TourDetailContactLink>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
                  Không cần thanh toán trước
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  Xác nhận trực tiếp cùng ngư dân
                </span>
              </div>
            </ScrollReveal>
          </SiteContainer>
        </section>
      </main>

      {/* 4. Shared Site Footer */}
      <SiteFooter pageKey="tour_detail" />
    </div>
  );
}
