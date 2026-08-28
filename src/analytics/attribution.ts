import type {
  AcquisitionSource,
  PageKey,
  VisitAttribution,
} from "./analytics-contract";

export function resolveAcquisitionSource(
  referrer?: string | null,
  searchParams?: URLSearchParams | null,
): AcquisitionSource {
  // 1. Check controlled, recognized source param if available (strip any raw values)
  if (searchParams) {
    const rawSource = (
      searchParams.get("source") ||
      searchParams.get("utm_source") ||
      ""
    ).toLowerCase();

    if (rawSource === "google" || rawSource === "google_search") {
      return "google_search";
    }
    if (rawSource === "google_maps" || rawSource === "maps") {
      return "google_maps";
    }
    if (rawSource === "facebook" || rawSource === "fb") {
      return "facebook";
    }
    if (rawSource === "tiktok") {
      return "tiktok";
    }
  }

  // 2. Check referrer if present
  if (!referrer || referrer.trim() === "") {
    return "direct";
  }

  try {
    const url = new URL(referrer);
    const hostname = url.hostname.toLowerCase();

    if (hostname.includes("google.")) {
      if (hostname.includes("maps.") || url.pathname.includes("/maps")) {
        return "google_maps";
      }
      return "google_search";
    }
    if (hostname.includes("facebook.com") || hostname.includes("fb.com") || hostname.includes("m.me")) {
      return "facebook";
    }
    if (hostname.includes("tiktok.com")) {
      return "tiktok";
    }
    return "other_referrer";
  } catch {
    return "unknown";
  }
}

export function getVisitAttribution({
  hasConsent,
  landingPageKey,
  referrer,
  searchParams,
}: {
  hasConsent: boolean;
  landingPageKey: PageKey;
  referrer?: string | null;
  searchParams?: URLSearchParams | null;
}): VisitAttribution | null {
  if (!hasConsent) {
    return null;
  }

  return {
    landing_page_key: landingPageKey,
    acquisition_source: resolveAcquisitionSource(referrer, searchParams),
  };
}
