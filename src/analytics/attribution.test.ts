import { describe, expect, it } from "vitest";
import { getVisitAttribution, resolveAcquisitionSource } from "./attribution";

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
});
