import { describe, expect, it } from "vitest";

import robots from "./robots";

describe("production robots directives", () => {
  it("allows public pages, excludes internal surfaces, and advertises the sitemap", () => {
    expect(robots()).toEqual({
      rules: {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dev/"],
      },
      sitemap: "https://tamgiangtour-ten.vercel.app/sitemap.xml",
    });
  });
});
