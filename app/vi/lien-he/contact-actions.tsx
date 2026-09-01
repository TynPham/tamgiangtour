"use client";

import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { analytics } from "@/src/analytics/analytics-client";
import { useConsentedPageView } from "@/src/analytics/use-consented-page-view";

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
  useConsentedPageView("contact");

  return null;
}
