import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  MessageCircle,
  Navigation,
  Phone,
} from "lucide-react";

import {
  ContactActionLink,
  ContactPageViewTracker,
} from "./contact-actions";
import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { MeetingPointMap } from "@/components/site/meeting-point-map";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import {
  SectionEyebrow,
  SiteContainer,
} from "@/components/site/site-primitives";
import { Button } from "@/components/ui/button";
import { LANDING_PAGE_CONTENT } from "@/src/content/landing-page-content";

const TOUR_DETAIL_HREF = "/vi/trai-nghiem-pha-tam-giang";
const BOOKING_ENQUIRY_HREF = "/vi/dat-trai-nghiem";

export const metadata: Metadata = {
  title: "Liên hệ & Điểm đón",
  description:
    "Liên hệ trực tiếp và mở điểm đón Tour Du Lịch Phá Tam Giang - Chú Huyền trên Google Maps.",
  alternates: {
    canonical: "/vi/lien-he",
  },
};

export default function VietnameseContactPage() {
  const { contact } = LANDING_PAGE_CONTENT;

  return (
    <div className="tam-giang-site flex min-h-screen flex-col overflow-x-clip bg-background text-foreground selection:bg-primary/20 selection:text-foreground">
      <ContactPageViewTracker />

      <a
        href="#main-content"
        className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:not-sr-only focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground focus:shadow-lg focus:outline-none"
      >
        Chuyển đến nội dung chính
      </a>

      <SiteHeader
        pageKey="contact"
        primaryActionHref={BOOKING_ENQUIRY_HREF}
      />

      <main id="main-content" className="flex-1 py-10 sm:py-16 lg:py-20">
        <SiteContainer>
          {/* PAGE HEADER */}
          <div className="mb-10 max-w-3xl space-y-3 sm:mb-14">
            <ScrollReveal
              direction="right"
              distance={24}
              variant="heading"
              className="space-y-3"
            >
              <SectionEyebrow>Liên hệ & Chỉ đường</SectionEyebrow>
              <h1 className="text-balance font-sans text-3xl font-semibold leading-[1.12] tracking-[-0.035em] text-foreground sm:text-4xl lg:text-5xl">
                {contact.heading}
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {contact.subheading}. Bạn có thể gọi điện trực tiếp, nhắn tin Zalo hoặc xem vị trí bến thuyền trên bản đồ bên dưới trước khi khởi hành.
              </p>
            </ScrollReveal>
          </div>

          {/* MAIN 2-COLUMN CONTACT & EMBEDDED MAP */}
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14">
            {/* Left Column: Direct Communication Channels & Travel Guidance */}
            <ScrollReveal
              delay={40}
              direction="right"
              distance={20}
              className="space-y-6 lg:col-span-5"
            >
              <div className="space-y-4 rounded-2xl border border-border/80 bg-card p-6 shadow-xs sm:p-7">
                <div className="space-y-2">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Phone className="size-4" aria-hidden="true" />
                  </div>
                  <h2 className="font-sans text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                    Trao đổi trực tiếp với gia đình
                  </h2>
                  <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                    Gọi điện hoặc nhắn tin Zalo để hỏi thêm về con nước, thời gian xuất bến hoặc thông báo trước khi đến.
                  </p>
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <ContactActionLink
                    kind="phone"
                    href={contact.phoneHref}
                    className="min-h-12 w-full justify-center px-5 text-sm font-semibold sm:text-base"
                  >
                    <Phone className="mr-2 size-4" aria-hidden="true" />
                    Gọi {contact.phoneDisplay}
                  </ContactActionLink>
                  <ContactActionLink
                    kind="zalo"
                    href={contact.zaloHref}
                    variant="outline"
                    className="min-h-12 w-full justify-center px-5 text-sm font-semibold sm:text-base"
                  >
                    <MessageCircle className="mr-2 size-4" aria-hidden="true" />
                    {contact.zaloLabel}
                  </ContactActionLink>
                </div>
              </div>

              {/* Travel Directions Guide */}
              <div className="space-y-3 rounded-2xl border border-border/80 bg-muted/30 p-5 sm:p-6 text-xs sm:text-sm text-muted-foreground shadow-xs">
                <div className="flex items-center gap-2">
                  <Navigation className="size-4 text-primary shrink-0" aria-hidden="true" />
                  <h3 className="font-sans font-bold text-foreground text-sm">
                    Hướng dẫn di chuyển từ TP. Huế:
                  </h3>
                </div>
                <p className="leading-relaxed text-xs sm:text-sm">
                  {contact.directionsTip}
                </p>
                <p className="border-t border-border/60 pt-3 text-[11px] text-muted-foreground">
                  Khoảng cách: ~15–20km (30–40 phút di chuyển bằng xe máy hoặc taxi).
                </p>
              </div>
            </ScrollReveal>

            {/* Right Column: Embedded Google Maps Interactive Map */}
            <ScrollReveal
              delay={80}
              direction="left"
              distance={20}
              className="lg:col-span-7"
            >
              <MeetingPointMap
                pageKey="contact"
                showCardHeader={true}
                showDirectionsButton={true}
                directionsButtonLabel="Mở chỉ đường trên Google Maps"
              />
            </ScrollReveal>
          </div>
        </SiteContainer>

        {/* JOURNEY CONTINUATION / RETURN ROUTE */}
        <section className="mt-16 sm:mt-24 border-t border-border/60 bg-muted/35 py-14 sm:py-18">
          <SiteContainer>
            <ScrollReveal
              direction="up"
              distance={18}
              className="grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
            >
              <div className="max-w-2xl space-y-2.5">
                <SectionEyebrow>Tiếp tục hành trình</SectionEyebrow>
                <h2 className="font-sans text-2xl font-semibold tracking-[-0.025em] text-foreground sm:text-3xl">
                  Xem lại trải nghiệm trước khi gửi yêu cầu
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Trang chi tiết tour có lịch trình và các điểm nhấn nổi bật trong chuyến đi.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="min-h-12 px-5 border-border"
                >
                  <Link href={TOUR_DETAIL_HREF}>Xem chi tiết trải nghiệm</Link>
                </Button>
                <Button asChild size="lg" className="min-h-12 px-5">
                  <Link href={BOOKING_ENQUIRY_HREF}>
                    Gửi yêu cầu đặt trải nghiệm
                    <ArrowRight className="ml-1.5 size-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </ScrollReveal>
          </SiteContainer>
        </section>
      </main>

      <SiteFooter pageKey="contact" />
    </div>
  );
}
