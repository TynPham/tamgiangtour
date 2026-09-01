import type { Metadata } from "next";
import { LandingPageViewTracker } from "@/components/landing/landing-client-tracker";
import { LandingHeader } from "@/components/landing/landing-header";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingQuickFacts } from "@/components/landing/landing-quick-facts";
import { LandingHighlights } from "@/components/landing/landing-highlights";
import { LandingItinerary } from "@/components/landing/landing-itinerary";
import { LandingInclusions } from "@/components/landing/landing-inclusions";
import { LandingStory } from "@/components/landing/landing-story";
import { LandingGallery } from "@/components/landing/landing-gallery";
import { LandingTrust } from "@/components/landing/landing-trust";
import { LandingFaq } from "@/components/landing/landing-faq";
import { LandingContact } from "@/components/landing/landing-contact";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LANDING_PAGE_CONTENT } from "@/src/content/landing-page-content";
import { createVietnamesePageMetadata } from "@/src/seo/site-metadata";

export const metadata: Metadata = {
  ...createVietnamesePageMetadata({
    path: "/vi",
    title: LANDING_PAGE_CONTENT.metadata.title,
    description: LANDING_PAGE_CONTENT.metadata.description,
    imageAlt: LANDING_PAGE_CONTENT.hero.heroImageAlt,
  }),
  keywords: [...LANDING_PAGE_CONTENT.metadata.keywords],
};

export default function VietnameseLandingPage() {
  return (
    <div className="tam-giang-site flex min-h-screen flex-col overflow-x-clip bg-background text-foreground selection:bg-primary/20 selection:text-foreground">
      {/* Client-side Page View Analytics Tracker */}
      <LandingPageViewTracker />

      {/* Skip to Main Content Link for Keyboard Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground focus:shadow-lg focus:outline-none"
      >
        Chuyển đến nội dung chính
      </a>

      {/* 1. Header / Navigation */}
      <LandingHeader />

      {/* Main Content Landmark */}
      <main id="main-content" className="flex-1">
        {/* 2. Hero Section */}
        <LandingHero />

        {/* 3. Quick Tour Facts */}
        <LandingQuickFacts />

        {/* 4. Experience Highlights */}
        <LandingHighlights />

        {/* 5. Experience / Itinerary Section */}
        <LandingItinerary />

        {/* 6. Inclusions / Practical Information */}
        <LandingInclusions />

        {/* 7. Family / Local Story */}
        <LandingStory />

        {/* 8. Gallery / Visual Storytelling */}
        <LandingGallery />

        {/* 9. Trust / Social Proof */}
        <LandingTrust />

        {/* 10. FAQ */}
        <LandingFaq />

        {/* 11. Contact / Maps Section */}
        <LandingContact />
      </main>

      {/* 13. Footer */}
      <LandingFooter />
    </div>
  );
}
