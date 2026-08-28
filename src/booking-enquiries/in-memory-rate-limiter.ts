import { createHash } from "node:crypto";

import type { BookingEnquiryRateLimiter } from "./submit-booking-enquiry";

type RateLimiterOptions = {
  limit: number;
  windowMs: number;
  now?: () => number;
};

type Window = {
  count: number;
  expiresAt: number;
};

export function createInMemoryRateLimiter({
  limit,
  windowMs,
  now = Date.now,
}: RateLimiterOptions): BookingEnquiryRateLimiter {
  const windows = new Map<string, Window>();

  return {
    allow(signal) {
      const currentTime = now();
      for (const [key, window] of windows) {
        if (window.expiresAt <= currentTime) windows.delete(key);
      }

      const key = createHash("sha256").update(signal).digest("hex");
      const existing = windows.get(key);
      if (!existing) {
        windows.set(key, { count: 1, expiresAt: currentTime + windowMs });
        return true;
      }
      if (existing.count >= limit) return false;

      existing.count += 1;
      return true;
    },
  };
}
