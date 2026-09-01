import type {
  AcquisitionSource,
  PageKey,
  VisitAttribution,
} from "./analytics-contract";

const FIRST_TOUCH_STORAGE_KEY = "tamgiang_v1_first_touch";
const PAGE_KEYS = new Set<PageKey>(["home", "tour_detail", "contact"]);
const ACQUISITION_SOURCES = new Set<AcquisitionSource>([
  "direct",
  "google_search",
  "google_maps",
  "facebook",
  "tiktok",
  "other_referrer",
  "unknown",
]);

function browserSessionStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function parseStoredAttribution(value: string | null): VisitAttribution | null {
  if (!value) return null;
  try {
    const candidate = JSON.parse(value) as Record<string, unknown>;
    if (
      typeof candidate.landing_page_key !== "string" ||
      !PAGE_KEYS.has(candidate.landing_page_key as PageKey) ||
      typeof candidate.acquisition_source !== "string" ||
      !ACQUISITION_SOURCES.has(
        candidate.acquisition_source as AcquisitionSource,
      )
    ) {
      return null;
    }
    return {
      landing_page_key: candidate.landing_page_key as PageKey,
      acquisition_source: candidate.acquisition_source as AcquisitionSource,
    };
  } catch {
    return null;
  }
}

export function resolveAcquisitionSource(
  referrer?: string | null,
  searchParams?: URLSearchParams | null,
  currentOrigin?: string | null,
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
    if (currentOrigin && url.origin === currentOrigin) {
      return "unknown";
    }
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

export function readFirstTouchAttribution({
  hasConsent,
  storage = browserSessionStorage(),
}: {
  hasConsent: boolean;
  storage?: Storage | null;
}): VisitAttribution | null {
  if (!hasConsent || !storage) return null;
  try {
    return parseStoredAttribution(storage.getItem(FIRST_TOUCH_STORAGE_KEY));
  } catch {
    return null;
  }
}

export function captureFirstTouchAttribution({
  hasConsent,
  landingPageKey,
  referrer,
  searchParams,
  currentOrigin,
  storage = browserSessionStorage(),
}: {
  hasConsent: boolean;
  landingPageKey: PageKey;
  referrer?: string | null;
  searchParams?: URLSearchParams | null;
  currentOrigin?: string | null;
  storage?: Storage | null;
}): VisitAttribution | null {
  if (!hasConsent || !storage) return null;

  const existing = readFirstTouchAttribution({ hasConsent, storage });
  if (existing) return existing;

  const attribution: VisitAttribution = {
    landing_page_key: landingPageKey,
    acquisition_source: resolveAcquisitionSource(
      referrer,
      searchParams,
      currentOrigin,
    ),
  };
  try {
    storage.setItem(FIRST_TOUCH_STORAGE_KEY, JSON.stringify(attribution));
    return attribution;
  } catch {
    return null;
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
