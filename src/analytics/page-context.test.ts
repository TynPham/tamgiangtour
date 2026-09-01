import { describe, expect, it } from "vitest";

import { canonicalPageKeyForPathname } from "./page-context";

describe("canonical analytics page context", () => {
  it.each([
    ["/vi", "home"],
    ["/vi/lien-he", "contact"],
    ["/vi/trai-nghiem-pha-tam-giang", "tour_detail"],
    ["/vi/dat-trai-nghiem", "tour_detail"],
  ] as const)("maps %s to %s", (pathname, pageKey) => {
    expect(canonicalPageKeyForPathname(pathname)).toBe(pageKey);
  });

  it("does not invent analytics context for non-public routes", () => {
    expect(canonicalPageKeyForPathname("/dev/booking-enquiry-preview")).toBeNull();
  });
});
