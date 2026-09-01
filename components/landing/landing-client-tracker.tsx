"use client";

import { useConsentedPageView } from "@/src/analytics/use-consented-page-view";

export function LandingPageViewTracker() {
  useConsentedPageView("home");

  return null;
}
