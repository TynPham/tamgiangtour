import type { PageKey } from "./analytics-contract";

const CANONICAL_PAGE_KEYS = new Map<string, PageKey>([
  ["/vi", "home"],
  ["/vi/trai-nghiem-pha-tam-giang", "tour_detail"],
  ["/vi/dat-trai-nghiem", "tour_detail"],
  ["/vi/lien-he", "contact"],
]);

export function canonicalPageKeyForPathname(pathname: string): PageKey | null {
  const normalized =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;
  return CANONICAL_PAGE_KEYS.get(normalized) ?? null;
}
