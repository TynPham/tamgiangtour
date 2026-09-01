"use client";

import { useEffect } from "react";
import { hasAnalyticsConsent } from "./consent";
import { initializePostHog } from "./posthog-runtime";

export function PostHogProvider({
  children,
  initialize = initializePostHog,
}: {
  children: React.ReactNode;
  initialize?: () => boolean;
}) {
  useEffect(() => {
    const initializeIfConsented = () => {
      if (hasAnalyticsConsent()) initialize();
    };
    initializeIfConsented();

    const handleConsentChange = (event: Event) => {
      const consentEvent = event as CustomEvent<{ consent?: string }>;
      if (consentEvent.detail?.consent === "granted") initializeIfConsented();
    };
    window.addEventListener("tamgiang:consent_changed", handleConsentChange);
    return () => {
      window.removeEventListener("tamgiang:consent_changed", handleConsentChange);
    };
  }, [initialize]);

  return <>{children}</>;
}
