import type { MetadataRoute } from "next";

import { SITE_URL } from "@/src/seo/site-metadata";

const PUBLIC_VIETNAMESE_ROUTES = [
  { path: "/vi", changeFrequency: "weekly", priority: 1 },
  {
    path: "/vi/trai-nghiem-pha-tam-giang",
    changeFrequency: "weekly",
    priority: 0.9,
  },
  { path: "/vi/dat-trai-nghiem", changeFrequency: "monthly", priority: 0.8 },
  { path: "/vi/lien-he", changeFrequency: "monthly", priority: 0.7 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_VIETNAMESE_ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: new URL(path, SITE_URL).toString(),
    changeFrequency,
    priority,
  }));
}
