import { describe, expect, it } from "vitest";
import {
  captureFirstTouchAttribution,
  getVisitAttribution,
  readFirstTouchAttribution,
  resolveAcquisitionSource,
} from "./attribution";

function createMemoryStorage(): Storage {
  const values = new Map<string, string>();
  return {
    get length() {
      return values.size;
    },
    clear: () => values.clear(),
    getItem: (key) => values.get(key) ?? null,
    key: (index) => [...values.keys()][index] ?? null,
    removeItem: (key) => values.delete(key),
    setItem: (key, value) => values.set(key, value),
  };
}

describe("Acquisition and Attribution", () => {
  it("resolves direct when referrer is empty", () => {
    expect(resolveAcquisitionSource("")).toBe("direct");
    expect(resolveAcquisitionSource(undefined)).toBe("direct");
  });

  it("resolves google_search from Google search engine referrer", () => {
    expect(resolveAcquisitionSource("https://www.google.com.vn/url?q=tamgiang")).toBe(
      "google_search",
    );
  });

  it("resolves google_maps from Google maps referrer or controlled param", () => {
    expect(resolveAcquisitionSource("https://maps.google.com/")).toBe("google_maps");
    expect(
      resolveAcquisitionSource(
        "",
        new URLSearchParams("utm_source=google_maps&utm_medium=cpc&utm_campaign=summer"),
      ),
    ).toBe("google_maps");
  });

  it("resolves social referrers (facebook, tiktok)", () => {
    expect(resolveAcquisitionSource("https://m.facebook.com/")).toBe("facebook");
    expect(resolveAcquisitionSource("https://www.tiktok.com/@tamgiang")).toBe("tiktok");
  });

  it("resolves other external referrers to other_referrer", () => {
    expect(resolveAcquisitionSource("https://some-travel-blog.vn/review")).toBe(
      "other_referrer",
    );
  });

  it("returns null attribution when consent is false", () => {
    const attribution = getVisitAttribution({
      hasConsent: false,
      landingPageKey: "tour_detail",
      referrer: "https://www.google.com",
    });
    expect(attribution).toBeNull();
  });

  it("returns normalized attribution when consent is true and strips all raw parameters", () => {
    const attribution = getVisitAttribution({
      hasConsent: true,
      landingPageKey: "tour_detail",
      referrer: "https://www.google.com/search?q=tam+giang+tour",
      searchParams: new URLSearchParams("utm_source=google&utm_campaign=launch&utm_term=pii"),
    });

    expect(attribution).toEqual({
      landing_page_key: "tour_detail",
      acquisition_source: "google_search",
    });
    expect(attribution).not.toHaveProperty("utm_campaign");
    expect(attribution).not.toHaveProperty("utm_term");
  });

  it("preserves the first consented V1 landing context across internal navigation", () => {
    const storage = createMemoryStorage();

    expect(
      captureFirstTouchAttribution({
        hasConsent: true,
        landingPageKey: "home",
        referrer: "https://www.google.com/search?q=tam+giang",
        searchParams: new URLSearchParams("utm_source=google"),
        currentOrigin: "https://tamgiangtour.vn",
        storage,
      }),
    ).toEqual({
      landing_page_key: "home",
      acquisition_source: "google_search",
    });

    expect(
      captureFirstTouchAttribution({
        hasConsent: true,
        landingPageKey: "tour_detail",
        referrer: "https://tamgiangtour.vn/vi",
        currentOrigin: "https://tamgiangtour.vn",
        storage,
      }),
    ).toEqual({
      landing_page_key: "home",
      acquisition_source: "google_search",
    });

    expect(
      readFirstTouchAttribution({ hasConsent: true, storage }),
    ).toEqual({
      landing_page_key: "home",
      acquisition_source: "google_search",
    });
  });

  it("does not persist attribution before consent", () => {
    const storage = createMemoryStorage();

    expect(
      captureFirstTouchAttribution({
        hasConsent: false,
        landingPageKey: "home",
        referrer: "https://www.google.com/search?q=tam+giang",
        currentOrigin: "https://tamgiangtour.vn",
        storage,
      }),
    ).toBeNull();
    expect(storage.length).toBe(0);
  });

  it("does not classify same-origin navigation as an external acquisition", () => {
    expect(
      resolveAcquisitionSource(
        "https://tamgiangtour.vn/vi",
        null,
        "https://tamgiangtour.vn",
      ),
    ).toBe("unknown");
  });
});
