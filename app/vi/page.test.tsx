// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import VietnameseLandingPage, { metadata } from "./page";

describe("Vietnamese Landing Page (/vi)", () => {
  it("renders the main heading, sections, booking CTA to dedicated route, and canonical metadata", () => {
    render(<VietnameseLandingPage />);
    const main = within(screen.getByRole("main"));

    // 1. Single H1 in hero
    expect(
      screen.getByRole("heading", {
        name: /Khám phá Đầm phá Tam Giang cùng Ngư dân Bản địa/i,
        level: 1,
      })
    ).toBeInTheDocument();

    // 2. Main landmark
    expect(screen.getByRole("main")).toBeInTheDocument();

    // 3. Key section headings
    expect(
      screen.getByRole("heading", {
        name: /Những khoảnh khắc không thể bỏ lỡ/i,
        level: 2,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: /Lịch trình trải nghiệm chi tiết/i,
        level: 2,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: /Dịch vụ bao gồm & Thông tin cần biết/i,
        level: 2,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: /Gia đình làng chài gắn bó cùng con nước Tam Giang/i,
        level: 2,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: /Hình ảnh chân thực từ đầm phá/i,
        level: 2,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: /An tâm trọn vẹn khi trải nghiệm/i,
        level: 2,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: /Câu hỏi thường gặp/i,
        level: 2,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: /Thông tin liên hệ & Điểm đón/i,
        level: 2,
      })
    ).toBeInTheDocument();

    // 4. Primary CTA links to dedicated booking page /vi/dat-trai-nghiem
    const ctaLink = main.getByRole("link", {
      name: /Gửi yêu cầu đặt trải nghiệm/i,
    });
    expect(ctaLink).toHaveAttribute("href", "/vi/dat-trai-nghiem");

    // 5. Canonical metadata check
    expect(metadata.alternates?.canonical).toBe("/vi");
  });
});
