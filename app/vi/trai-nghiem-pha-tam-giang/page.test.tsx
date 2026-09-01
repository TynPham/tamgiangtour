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
  it("renders the canonical tour contract and keeps the dedicated booking journey", () => {
    const { contact, highlights, policies } = LANDING_PAGE_CONTENT;
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
    for (const point of contact.meetingPoints) {
      expect(
        main.getByRole("link", {
          name: point.role === "primary" ? /Mở điểm chính/i : /Mở điểm thay thế/i,
        }),
      ).toHaveAttribute("href", point.mapsHref);
      expect(main.getByText(new RegExp(point.name))).toBeInTheDocument();
    }

    expect(main.getAllByText("350.000đ/người").length).toBeGreaterThan(0);
    expect(main.getAllByText("500.000đ/người").length).toBeGreaterThan(0);
    expect(main.getAllByText(/3–4 giờ/i).length).toBeGreaterThan(0);
    expect(main.getByText(/không phải giờ vận hành cố định/i)).toBeInTheDocument();
    expect(main.getByText(policies.deposit)).toBeInTheDocument();
    expect(main.getByText(new RegExp(policies.changeOrCancel))).toBeInTheDocument();
    expect(main.getByRole("heading", { name: /Cùng gia đình Chú Huyền/i })).toBeInTheDocument();
    expect(main.getByRole("heading", { name: /Câu hỏi thường gặp/i })).toBeInTheDocument();
    expect(main.getByText("Nếu hủy hoặc đổi ngày thì sao?")).toBeInTheDocument();
    expect(main.getByText("Điều gì xảy ra sau khi gửi yêu cầu?")).toBeInTheDocument();
    expect(main.getByText("Các mốc giờ trong lịch trình có cố định không?")).toBeInTheDocument();
    expect(document.body).not.toHaveTextContent(/— Gia đình Chú Huyền|điểm đón|chuẩn bị chu đáo/i);
    expect(document.body).not.toHaveTextContent(/cất rớ|thả lưới|15–20km|30–40 phút|Không cần thanh toán trước|giá trẻ em|biết bơi|phụ nữ mang thai|người cao tuổi/i);

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
