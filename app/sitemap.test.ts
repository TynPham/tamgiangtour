import { describe, expect, it } from "vitest";

import sitemap from "./sitemap";

describe("production sitemap", () => {
  it("contains only the four canonical public Vietnamese routes", () => {
    expect(sitemap().map(({ url }) => url)).toEqual([
      "https://tamgiangtour.vn/vi",
      "https://tamgiangtour.vn/vi/trai-nghiem-pha-tam-giang",
      "https://tamgiangtour.vn/vi/dat-trai-nghiem",
      "https://tamgiangtour.vn/vi/lien-he",
    ]);
  });
});
