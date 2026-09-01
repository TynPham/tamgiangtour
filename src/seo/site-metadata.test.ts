import { describe, expect, it } from "vitest";

import { createVietnamesePageMetadata } from "./site-metadata";

describe("public Vietnamese page metadata", () => {
  it("publishes one canonical URL plus matching Open Graph and Twitter metadata", () => {
    const metadata = createVietnamesePageMetadata({
      path: "/vi/lien-he",
      title: "Liên hệ & Điểm gặp",
      description: "Liên hệ trực tiếp với gia đình Chú Huyền.",
      imageAlt: "Phá Tam Giang trong ánh chiều",
    });

    expect(metadata.alternates).toEqual({ canonical: "/vi/lien-he" });
    expect(metadata.openGraph).toMatchObject({
      title: "Liên hệ & Điểm gặp",
      description: "Liên hệ trực tiếp với gia đình Chú Huyền.",
      url: "https://tamgiangtour-ten.vercel.app/vi/lien-he",
      locale: "vi_VN",
      type: "website",
    });
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      title: "Liên hệ & Điểm gặp",
      description: "Liên hệ trực tiếp với gia đình Chú Huyền.",
    });
  });
});
