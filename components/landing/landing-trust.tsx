"use client";

import { ShieldCheck, MapPinCheck, PhoneCall, CloudSun, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { analytics } from "@/src/analytics/analytics-client";
import { LANDING_PAGE_CONTENT } from "@/src/content/landing-page-content";
import { ScrollReveal } from "@/components/landing/scroll-reveal";

const TRUST_ICON_MAP = {
  MapPinCheck,
  ShieldCheck,
  PhoneCall,
  CloudSun,
};

export function LandingTrust() {
  const { trust, contact } = LANDING_PAGE_CONTENT;

  const handleMapsClick = () => {
    analytics.trackMaps(contact.mapsPlaceKey, "home", "vi");
  };

  return (
    <section
      id="uy-tin"
      aria-labelledby="trust-heading"
      className="border-b border-border/60 bg-[var(--lagoon-paper)] py-20 sm:py-28 lg:py-36"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal delay={0} direction="right" distance={28} variant="heading" className="mb-14 max-w-3xl space-y-4 text-left sm:mb-20">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <span className="h-px w-6 bg-primary" aria-hidden="true" />
            <span>Cam kết an tâm</span>
          </div>
          <h2
            id="trust-heading"
            className="max-w-[15ch] text-balance font-sans text-3xl font-semibold leading-[1.08] tracking-[-0.035em] text-foreground sm:text-4xl lg:text-5xl"
          >
            An tâm trọn vẹn{" "}
            <span className="block sm:inline">khi trải nghiệm</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">
            {trust.subheading}
          </p>
        </ScrollReveal>

        <div className="mb-16 grid grid-cols-1 border-t border-border/80 md:grid-cols-2">
          {trust.pillars.map((pillar, index) => {
            const IconComponent =
              TRUST_ICON_MAP[pillar.iconName as keyof typeof TRUST_ICON_MAP] ||
              ShieldCheck;

            return (
              <ScrollReveal
                key={index}
                delay={index * 60}
                direction={index % 2 === 0 ? "right" : "left"}
                distance={22}
                className={`grid grid-cols-[2.5rem_1fr] gap-4 border-b border-border/80 py-7 md:px-8 ${
                  index % 2 === 0 ? "md:border-r md:pl-0" : "md:pr-0"
                }`}
              >
                <div className="flex size-10 items-center justify-center text-primary">
                  <IconComponent className="size-5" aria-hidden="true" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-sans text-base font-semibold text-foreground sm:text-lg">
                    {pillar.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {pillar.description}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Verified Google Maps Callout Box */}
        <ScrollReveal delay={160} direction="left" distance={24} className="flex flex-col items-start justify-between gap-6 border-y border-primary/35 py-7 sm:flex-row sm:items-center">
          <div className="space-y-1.5 text-left">
            <h3 className="font-sans text-lg sm:text-xl font-bold text-foreground">
              Vị trí điểm đón xác thực trên Google Maps
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
              {trust.mapsNote}
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-11 shrink-0 rounded-md border-border px-5 text-xs font-semibold shadow-none transition-colors hover:bg-muted/50 sm:text-sm"
            onClick={handleMapsClick}
          >
            <a
              href={contact.mapsHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="mr-2 size-4" aria-hidden="true" />
              {trust.mapsLinkText}
            </a>
          </Button>
        </ScrollReveal>
      </div>
    </section>
  );
}
