"use client";

import * as React from "react";
import { ExternalLink, MapPin, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import { analytics } from "@/src/analytics/analytics-client";
import type { PageKey } from "@/src/analytics/analytics-contract";
import { LANDING_PAGE_CONTENT } from "@/src/content/landing-page-content";
import { buttonVariants } from "@/components/ui/button";

export interface MeetingPointMapProps {
  className?: string;
  heightClassName?: string;
  pageKey?: PageKey;
  showCardHeader?: boolean;
  showDirectionsButton?: boolean;
  directionsButtonLabel?: string;
}

export function MeetingPointMap({
  className,
  heightClassName = "h-[320px] sm:h-[380px] lg:h-[440px]",
  pageKey = "contact",
  showCardHeader = true,
  showDirectionsButton = true,
  directionsButtonLabel = "Mở chỉ đường trên Google Maps",
}: MeetingPointMapProps) {
  const { contact } = LANDING_PAGE_CONTENT;

  const handleExternalMapsClick = () => {
    analytics.trackMaps(contact.mapsPlaceKey, pageKey, "vi");
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs transition-colors hover:border-primary/40",
        className,
      )}
    >
      {showCardHeader && (
        <div className="flex flex-col gap-1.5 border-b border-border/70 bg-muted/40 p-4 sm:px-5 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <MapPin className="size-4" aria-hidden="true" />
              </span>
              <span className="font-sans text-sm font-bold text-foreground sm:text-base">
                {contact.mapsPlaceName}
              </span>
            </div>
            <span className="hidden text-[11px] font-medium text-muted-foreground sm:inline-block">
              Vị trí xác thực Google Maps
            </span>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground sm:pl-9">
            {contact.mapsAddress}
          </p>
        </div>
      )}

      {/* Embedded Map Iframe Container */}
      <div className={cn("relative w-full overflow-hidden bg-muted/30", heightClassName)}>
        <iframe
          src={contact.mapsEmbedUrl}
          title={`Bản đồ vị trí ${contact.mapsPlaceName}`}
          aria-label={`Bản đồ vị trí ${contact.mapsPlaceName}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="size-full border-0 grayscale-[0.08] transition-[filter] duration-300 group-hover:grayscale-0"
        />
      </div>

      {showDirectionsButton && (
        <div className="flex flex-col items-stretch justify-between gap-3 border-t border-border/70 bg-muted/30 p-3.5 sm:flex-row sm:items-center sm:px-5 sm:py-3.5">
          <p className="text-xs text-muted-foreground">
            Gia đình xác nhận điểm gặp phù hợp sau khi nhận yêu cầu của khách.
          </p>
          <a
            href={contact.mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleExternalMapsClick}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "min-h-10 shrink-0 gap-1.5 border-border bg-background text-xs font-semibold hover:border-primary/40 hover:text-foreground",
            )}
          >
            <Navigation className="size-3.5 text-primary" aria-hidden="true" />
            <span>{directionsButtonLabel}</span>
            <ExternalLink className="size-3 text-muted-foreground" aria-hidden="true" />
          </a>
        </div>
      )}
    </div>
  );
}
