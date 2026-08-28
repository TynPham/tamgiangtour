"use client";

import { useEffect } from "react";
import { analytics } from "@/src/analytics/analytics-client";
import { hasAnalyticsConsent } from "@/src/analytics/consent";

export function LandingPageViewTracker() {
  useEffect(() => {
    let tracked = false;

    if (hasAnalyticsConsent()) {
      analytics.trackPageView("home", "vi");
      tracked = true;
      return;
    }

    const handleConsentChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ consent: string }>;
      if (customEvent.detail?.consent === "granted" && !tracked) {
        analytics.trackPageView("home", "vi");
        tracked = true;
      }
    };

    window.addEventListener("tamgiang:consent_changed", handleConsentChange);
    return () => {
      window.removeEventListener("tamgiang:consent_changed", handleConsentChange);
    };
  }, []);

  return null;
}
