import type { Metadata } from "next";
import { Geist, Geist_Mono, Lora } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "vietnamese"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "vietnamese"],
});

const lora = Lora({
  variable: "--font-heading-serif",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

import { AnalyticsConsentBanner } from "@/components/analytics-consent-banner";
import { FloatingZaloButton } from "@/components/floating-zalo-button";
import { PostHogProvider } from "@/src/analytics/posthog-provider";
import { LANDING_PAGE_CONTENT } from "@/src/content/landing-page-content";
import { SITE_URL } from "@/src/seo/site-metadata";

const googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  title: {
    template: "%s | Tour Phá Tam Giang - Chú Huyền",
    default: "Tour Du Lịch Phá Tam Giang - Chú Huyền | Trải Nghiệm Bản Địa Xứ Huế",
  },
  description: LANDING_PAGE_CONTENT.metadata.description,
  metadataBase: new URL(SITE_URL),
  verification: googleSiteVerification
    ? { google: googleSiteVerification }
    : undefined,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} ${lora.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <PostHogProvider>
          {children}
          <FloatingZaloButton />
          <AnalyticsConsentBanner />
        </PostHogProvider>
      </body>
    </html>
  );
}
