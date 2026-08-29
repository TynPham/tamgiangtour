"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { analytics } from "@/src/analytics/analytics-client";
import { hasAnalyticsConsent } from "@/src/analytics/consent";

type ContactActionKind = "phone" | "zalo" | "maps";

interface ContactActionLinkProps {
  kind: ContactActionKind;
  href: string;
  meetingPointKey?: string;
  variant?: "default" | "outline";
  className?: string;
  children: ReactNode;
}

export function ContactActionLink({
  kind,
  href,
  meetingPointKey,
  variant = "default",
  className,
  children,
}: ContactActionLinkProps) {
  const isExternal = kind === "zalo" || kind === "maps";

  const handleClick = () => {
    if (kind === "maps") {
      if (meetingPointKey) {
        analytics.trackMaps(meetingPointKey, "contact", "vi");
      }
      return;
    }

    analytics.trackContact(kind, "contact", "vi");
  };

  return (
    <Button
      asChild
      size="lg"
      variant={variant}
      className={className}
    >
      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        onClick={handleClick}
      >
        {children}
      </a>
    </Button>
  );
}

export function ContactPageViewTracker() {
  useEffect(() => {
    let tracked = false;

    if (hasAnalyticsConsent()) {
      analytics.trackPageView("contact", "vi");
      tracked = true;
      return;
    }

    const handleConsentChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ consent: string }>;
      if (customEvent.detail?.consent === "granted" && !tracked) {
        analytics.trackPageView("contact", "vi");
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
