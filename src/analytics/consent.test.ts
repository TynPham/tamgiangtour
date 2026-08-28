// @vitest-environment jsdom

import { describe, expect, it, beforeEach } from "vitest";
import {
  getAnalyticsConsent,
  hasAnalyticsConsent,
  setAnalyticsConsent,
  ANALYTICS_CONSENT_KEY,
} from "./consent";

describe("Analytics Consent", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("defaults to pending and hasAnalyticsConsent returns false", () => {
    expect(getAnalyticsConsent()).toBe("pending");
    expect(hasAnalyticsConsent()).toBe(false);
  });

  it("returns true only when consent is affirmatively granted", () => {
    setAnalyticsConsent("granted");
    expect(getAnalyticsConsent()).toBe("granted");
    expect(hasAnalyticsConsent()).toBe(true);
    expect(window.localStorage.getItem(ANALYTICS_CONSENT_KEY)).toBe("granted");
  });

  it("returns false when consent is denied", () => {
    setAnalyticsConsent("denied");
    expect(getAnalyticsConsent()).toBe("denied");
    expect(hasAnalyticsConsent()).toBe(false);
    expect(window.localStorage.getItem(ANALYTICS_CONSENT_KEY)).toBe("denied");
  });

  it("handles faulty storage safely without throwing", () => {
    const faultyStorage = {
      getItem: () => {
        throw new Error("Storage unavailable");
      },
      setItem: () => {
        throw new Error("Storage quota exceeded");
      },
    } as unknown as Storage;

    expect(getAnalyticsConsent(faultyStorage)).toBe("pending");
    expect(hasAnalyticsConsent(faultyStorage)).toBe(false);
    expect(() => setAnalyticsConsent("granted", faultyStorage)).not.toThrow();
  });
});
