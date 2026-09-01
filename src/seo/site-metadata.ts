import type { Metadata } from "next";

export const SITE_URL = "https://tamgiangtour.vn";
export const SITE_NAME = "Phá Tam Giang - Tour Gia đình Chú Huyền";
export const DEFAULT_SOCIAL_IMAGE = "/images/tamgiang/hero-sunset.jpg";

export function createVietnamesePageMetadata({
  path,
  title,
  description,
  imageAlt,
}: {
  path: `/vi${string}`;
  title: string;
  description: string;
  imageAlt: string;
}): Metadata {
  const url = new URL(path, SITE_URL).toString();
  const images = [
    {
      url: DEFAULT_SOCIAL_IMAGE,
      width: 1200,
      height: 630,
      alt: imageAlt,
    },
  ];

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "vi_VN",
      type: "website",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_SOCIAL_IMAGE],
    },
  };
}
