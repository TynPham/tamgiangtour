"use client";

import { useEffect } from "react";

import type { PageKey } from "./analytics-contract";
import { analytics } from "./analytics-client";
import { captureFirstTouchAttribution } from "./attribution";
import { hasAnalyticsConsent } from "./consent";

export function useConsentedPageView(pageKey: PageKey) {
  useEffect(() => {
    let tracked = false;

    const trackConsentedPage = () => {
      if (tracked || !hasAnalyticsConsent()) return;
      captureFirstTouchAttribution({
        hasConsent: true,
        landingPageKey: pageKey,
        referrer: document.referrer,
        searchParams: new URLSearchParams(window.location.search),
        currentOrigin: window.location.origin,
      });
      analytics.trackPageView(pageKey, "vi");
      tracked = true;
    };

    trackConsentedPage();
    const handleConsentChange = (event: Event) => {
      const consentEvent = event as CustomEvent<{ consent?: string }>;
      if (consentEvent.detail?.consent === "granted") trackConsentedPage();
    };
    window.addEventListener("tamgiang:consent_changed", handleConsentChange);
    return () => {
      window.removeEventListener(
        "tamgiang:consent_changed",
        handleConsentChange,
      );
    };
  }, [pageKey]);
}
