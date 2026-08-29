// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import VietnameseBookingEnquiryPage, {
  metadata,
} from "./page";
import { VIETNAMESE_BOOKING_ENQUIRY_COPY } from "@/src/booking-enquiries/vietnamese-booking-enquiry-copy";
import { LANDING_PAGE_CONTENT } from "@/src/content/landing-page-content";

afterEach(() => {
  cleanup();
});

describe("Vietnamese Booking Enquiry Page (/vi/dat-trai-nghiem)", () => {
  it("renders intro, compact tour context, phone/Zalo fallback, and mounted enquiry form", () => {
    const { contact } = LANDING_PAGE_CONTENT;
    render(<VietnameseBookingEnquiryPage />);
    const main = within(screen.getByRole("main"));

    // 1. Single H1 heading
    const mainHeading = screen.getByRole("heading", {
      level: 1,
      name: /Gửi yêu cầu đặt trải nghiệm/i,
    });
    expect(mainHeading).toBeVisible();

    // 2. Compact tour context text
    expect(main.getAllByText("Trải nghiệm Phá Tam Giang").length).toBeGreaterThanOrEqual(1);
    expect(
      main.getByText(/Khoảng 3.5 – 4 giờ · Bắt đầu khoảng 15:40 chiều/i),
    ).toBeInTheDocument();

    // 3. Phone and Zalo contact options
    expect(
      main.getByRole("link", { name: new RegExp(contact.phoneDisplay) }),
    ).toHaveAttribute("href", contact.phoneHref);
    expect(
      main.getByRole("link", { name: contact.zaloLabel }),
    ).toHaveAttribute("href", contact.zaloHref);

    // 4. Mounted booking enquiry form
    expect(
      screen.getByRole("region", {
        name: VIETNAMESE_BOOKING_ENQUIRY_COPY.heading,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: VIETNAMESE_BOOKING_ENQUIRY_COPY.heading,
      }),
    ).toBeInTheDocument();

    // 5. Canonical metadata
    expect(metadata.title).toBe(
      "Gửi yêu cầu đặt trải nghiệm | Tour Phá Tam Giang - Chú Huyền",
    );
    expect(metadata.alternates?.canonical).toBe("/vi/dat-trai-nghiem");
  });
});
