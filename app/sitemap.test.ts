import { describe, expect, it } from "vitest";

import sitemap from "./sitemap";

describe("production sitemap", () => {
  it("contains only the four canonical public Vietnamese routes", () => {
    expect(sitemap().map(({ url }) => url)).toEqual([
      "https://tamgiangtour-ten.vercel.app/vi",
      "https://tamgiangtour-ten.vercel.app/vi/trai-nghiem-pha-tam-giang",
      "https://tamgiangtour-ten.vercel.app/vi/dat-trai-nghiem",
      "https://tamgiangtour-ten.vercel.app/vi/lien-he",
    ]);
  });
});
