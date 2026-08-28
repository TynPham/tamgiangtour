"use client";

import { ArrowDown, ArrowRight, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { analytics } from "@/src/analytics/analytics-client";
import { LANDING_PAGE_CONTENT } from "@/src/content/landing-page-content";

export function LandingHeroActions() {
  const { hero, contact } = LANDING_PAGE_CONTENT;

  const handlePrimaryCtaClick = () => {
    analytics.trackPrimaryCta(
      "enquiry_start",
      "booking_enquiry_section",
      "home",
      "vi",
    );
  };

  const handleZaloClick = () => {
    analytics.trackContact("zalo", "home", "vi");
  };

  return (
    <div className="hero-actions mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
      <Button
        asChild
        size="lg"
        className="min-h-12 rounded-md border-[var(--lagoon-sun)] bg-[var(--lagoon-sun)] px-6 text-sm font-bold text-[var(--lagoon-ink)] shadow-none hover:bg-[var(--lagoon-sun-soft)]"
        onClick={handlePrimaryCtaClick}
      >
        <a href="#booking-enquiry">
          {hero.primaryCtaText}
          <ArrowDown className="ml-1.5 size-4" aria-hidden="true" />
        </a>
      </Button>

      <Button
        asChild
        variant="outline"
        size="lg"
        className="min-h-12 rounded-md border-white/55 bg-black/12 px-5 text-sm font-semibold text-white shadow-none hover:border-white hover:bg-white/12 hover:text-white"
      >
        <a href="#lich-trinh">
          {hero.secondaryCtaText}
          <ArrowRight className="ml-1.5 size-4" aria-hidden="true" />
        </a>
      </Button>

      <a
        href={contact.zaloHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleZaloClick}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold text-white/78 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <MessageCircle className="size-4" aria-hidden="true" />
        {hero.zaloCtaText}
      </a>
    </div>
  );
}
