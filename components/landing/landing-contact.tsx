"use client";

import { Phone, MessageCircle, MapPin, Navigation, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { analytics } from "@/src/analytics/analytics-client";
import { LANDING_PAGE_CONTENT } from "@/src/content/landing-page-content";
import { ScrollReveal } from "@/components/landing/scroll-reveal";
import {
  SectionEyebrow,
  SiteContainer,
} from "@/components/site/site-primitives";

export function LandingContact() {
  const { contact } = LANDING_PAGE_CONTENT;

  const handlePhoneClick = () => {
    analytics.trackContact("phone", "home", "vi");
  };

  const handleZaloClick = () => {
    analytics.trackContact("zalo", "home", "vi");
  };

  const handleMapsClick = (meetingPointKey: string) => {
    analytics.trackMaps(meetingPointKey, "home", "vi");
  };

  return (
    <section
      id="lien-he"
      aria-labelledby="contact-heading"
      className="relative border-b border-border/60 bg-muted/35 py-20 sm:py-28 lg:py-36"
    >
      <SiteContainer>
        {/* Section Header */}
        <ScrollReveal delay={0} direction="right" distance={28} variant="heading" className="mb-14 max-w-3xl space-y-4 text-left sm:mb-20">
          <SectionEyebrow>Liên hệ & Chỉ đường</SectionEyebrow>
          <h2
            id="contact-heading"
            className="max-w-[15ch] text-balance font-sans text-3xl font-semibold leading-[1.08] tracking-[-0.035em] text-foreground sm:text-4xl lg:text-5xl"
          >
            Thông tin liên hệ &{" "}
            <span className="block sm:inline">Điểm gặp</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">
            {contact.subheading}
          </p>
        </ScrollReveal>

        {/* Contact Connection Grid with Staggered Scroll Reveal */}
        <div className="mb-12 grid max-w-6xl grid-cols-1 border-y border-border/80 md:grid-cols-3">
          {/* Card 1: Direct Hotline */}
          <ScrollReveal delay={60} direction="right" distance={20} className="flex flex-col justify-between border-b border-border/80 py-7 md:border-b-0 md:border-r md:px-7 md:first:pl-0">
            <div className="space-y-2.5 mb-6">
              <div className="flex size-10 items-center justify-center text-primary">
                <Phone className="size-5" aria-hidden="true" />
              </div>
              <h3 className="font-sans text-lg font-bold text-foreground">
                Hotline trực tiếp
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Trao đổi trực tiếp với gia đình trước khi gửi yêu cầu hoặc khởi hành.
              </p>
            </div>
            <div>
              <Button
                asChild
                size="lg"
                className="w-full font-semibold text-xs sm:text-sm rounded-lg h-11"
                onClick={handlePhoneClick}
              >
                <a href={contact.phoneHref}>
                  <Phone className="mr-2 size-4" aria-hidden="true" />
                  {contact.phoneDisplay}
                </a>
              </Button>
            </div>
          </ScrollReveal>

          {/* Card 2: Zalo Chat */}
          <ScrollReveal delay={120} direction="up" distance={20} className="flex flex-col justify-between border-b border-border/80 py-7 md:border-b-0 md:border-r md:px-7">
            <div className="space-y-2.5 mb-6">
              <div className="flex size-10 items-center justify-center text-[#0068FF]">
                <MessageCircle className="size-5" aria-hidden="true" />
              </div>
              <h3 className="font-sans text-lg font-bold text-foreground">
                Nhắn tin Zalo
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Nhắn cho gia đình qua số Zalo đã công bố.
              </p>
            </div>
            <div>
              <Button
                asChild
                size="lg"
                className="w-full font-semibold text-xs sm:text-sm bg-[#0068FF] hover:bg-[#0052cc] text-white rounded-lg h-11"
                onClick={handleZaloClick}
              >
                <a
                  href={contact.zaloHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-2 size-4" aria-hidden="true" />
                  {contact.zaloLabel}
                </a>
              </Button>
            </div>
          </ScrollReveal>

          {/* Card 3: Google Maps */}
          <ScrollReveal delay={180} direction="left" distance={20} className="flex flex-col justify-between py-7 md:px-7 md:last:pr-0">
            <div className="space-y-2.5 mb-6">
              <div className="flex size-10 items-center justify-center text-primary">
                <MapPin className="size-5" aria-hidden="true" />
              </div>
              <h3 className="font-sans text-lg font-bold text-foreground">Hai điểm gặp</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Gia đình xác nhận điểm phù hợp sau khi nhận yêu cầu.
              </p>
            </div>
            <div>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full font-semibold text-xs sm:text-sm border-border hover:bg-muted/50 rounded-lg h-11"
                onClick={() => handleMapsClick(contact.mapsPlaceKey)}
              >
                <a
                  href={contact.mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 size-4" aria-hidden="true" />
                  Mở Google Maps
                </a>
              </Button>
            </div>
          </ScrollReveal>
        </div>

        {/* Travel Directions Tip */}
        <ScrollReveal delay={220} direction="left" distance={22} className="flex max-w-5xl items-start gap-3.5 border-l-2 border-primary bg-background/55 px-5 py-5 text-xs text-muted-foreground sm:text-sm">
          <Navigation className="size-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-1">
            <p className="font-sans font-bold text-foreground text-sm">Điểm gặp & chỗ đậu xe</p>
            <p className="leading-relaxed">{contact.directionsTip}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-2 pt-2">
              {contact.meetingPoints.map((point) => (
                <a
                  key={point.key}
                  href={point.mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleMapsClick(point.key)}
                  className="font-semibold text-foreground underline decoration-primary/50 underline-offset-4 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {point.roleLabel}: {point.name}
                </a>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </SiteContainer>

    </section>
  );
}
