// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import VietnameseTourDetailPage, {
  metadata,
} from "./page";
import { VIETNAMESE_TOUR_CONTEXT } from "@/src/booking-enquiries/vietnamese-booking-enquiry-copy";
import { LANDING_PAGE_CONTENT } from "@/src/content/landing-page-content";

afterEach(() => {
  cleanup();
});

describe("Vietnamese Tour Detail Page", () => {
  it("renders tour title, primary CTA linking to dedicated booking page, key sections, and Maps link", () => {
    const { contact, highlights } = LANDING_PAGE_CONTENT;
    render(<VietnameseTourDetailPage />);
    const main = within(screen.getByRole("main"));

    // 1. Single H1 heading
    const mainHeading = screen.getByRole("heading", {
      level: 1,
      name: VIETNAMESE_TOUR_CONTEXT.title,
    });
    expect(mainHeading).toBeVisible();

    // 2. Primary CTA link navigating to /vi/dat-trai-nghiem
    const ctaLinks = main.getAllByRole("link", {
      name: /Gửi yêu cầu đặt trải nghiệm/i,
    });
    expect(ctaLinks.length).toBeGreaterThanOrEqual(1);
    expect(ctaLinks[0]).toHaveAttribute("href", "/vi/dat-trai-nghiem");

    // 3. Experience Highlights section
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: highlights.heading,
      }),
    ).toBeInTheDocument();

    // 4. Inclusions section
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /Dịch vụ bao gồm & Thông tin cần biết/i,
      }),
    ).toBeInTheDocument();

    // 5. Maps destination link with verified URL
    const mapsLink = main.getByRole("link", {
      name: /Mở Google Maps/i,
    });
    expect(mapsLink).toHaveAttribute("href", contact.mapsHref);

    // 6. Closing booking CTA banner
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /Sẵn sàng cho chuyến du ngoạn Phá Tam Giang\?/i,
      }),
    ).toBeInTheDocument();

    // 7. Metadata canonical
    expect(metadata.title).toBe("Trải nghiệm Phá Tam Giang");
    expect(metadata.alternates?.canonical).toBe("/vi/trai-nghiem-pha-tam-giang");
  });
});
