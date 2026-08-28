// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import VietnameseTourDetailPage, {
  metadata,
} from "./page";
import { VIETNAMESE_BOOKING_ENQUIRY_COPY, VIETNAMESE_TOUR_CONTEXT } from "@/src/booking-enquiries/vietnamese-booking-enquiry-copy";

afterEach(() => {
  cleanup();
});

describe("Vietnamese Tour Detail Page", () => {
  it("renders tour title, primary CTA linking to enquiry anchor, and mounted enquiry section", () => {
    render(<VietnameseTourDetailPage />);

    const mainHeading = screen.getByRole("heading", {
      level: 1,
      name: VIETNAMESE_TOUR_CONTEXT.title,
    });
    expect(mainHeading).toBeVisible();

    const ctaLink = screen.getByRole("link", {
      name: /Gửi yêu cầu đặt trải nghiệm/i,
    });
    expect(ctaLink).toHaveAttribute("href", "#booking-enquiry");

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

    expect(metadata.title).toBe("Trải nghiệm Phá Tam Giang");
    expect(metadata.alternates?.canonical).toBe("/vi/trai-nghiem-pha-tam-giang");
  });
});
