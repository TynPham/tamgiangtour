// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import VietnameseContactPage, { metadata } from "./page";
import { LANDING_PAGE_CONTENT } from "@/src/content/landing-page-content";

describe("Vietnamese Contact Page (/vi/lien-he)", () => {
  it("renders approved contact, embedded Maps iframe, directions link, and routes back to the tour journey", () => {
    const { contact } = LANDING_PAGE_CONTENT;

    render(<VietnameseContactPage />);
    const main = within(screen.getByRole("main"));

    // 1. Heading
    expect(
      screen.getByRole("heading", { level: 1, name: contact.heading }),
    ).toBeInTheDocument();

    // 2. Direct contact channels
    expect(
      main.getByRole("link", { name: new RegExp(contact.phoneDisplay) }),
    ).toHaveAttribute("href", contact.phoneHref);
    expect(
      main.getByRole("link", { name: contact.zaloLabel }),
    ).toHaveAttribute("href", contact.zaloHref);

    // 3. Embedded Google Maps iframe
    const mapIframe = main.getByTitle(`Bản đồ vị trí ${contact.mapsPlaceName}`);
    expect(mapIframe).toBeInTheDocument();
    expect(mapIframe).toHaveAttribute("src", contact.mapsEmbedUrl);

    // 4. Secondary external directions link
    expect(
      main.getByRole("link", { name: /Mở chỉ đường trên Google Maps/i }),
    ).toHaveAttribute("href", contact.mapsHref);

    // 5. Back navigation
    expect(
      main.getByRole("link", { name: "Xem chi tiết trải nghiệm" }),
    ).toHaveAttribute("href", "/vi/trai-nghiem-pha-tam-giang");
    expect(
      main.getByRole("link", { name: "Gửi yêu cầu đặt trải nghiệm" }),
    ).toHaveAttribute("href", "/vi/dat-trai-nghiem");

    // 6. Metadata
    expect(metadata.alternates?.canonical).toBe("/vi/lien-he");
  });
});
