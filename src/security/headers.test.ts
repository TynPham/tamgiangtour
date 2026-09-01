import { describe, expect, it } from "vitest";

import { productionSecurityHeaders } from "./headers";

describe("production security headers", () => {
  it("protects public responses without blocking required Maps or PostHog connections", () => {
    const headers = new Map(
      productionSecurityHeaders().map(({ key, value }) => [key, value]),
    );

    expect(headers.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
    expect(headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(headers.get("X-Frame-Options")).toBe("DENY");
    expect(headers.get("Permissions-Policy")).toContain("camera=()");
    expect(headers.get("Content-Security-Policy")).toContain(
      "frame-src https://www.google.com https://maps.google.com",
    );
    expect(headers.get("Content-Security-Policy")).toContain(
      "connect-src 'self' https://*.posthog.com",
    );
  });
});
