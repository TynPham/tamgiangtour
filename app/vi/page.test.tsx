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
        name: /Khám phá Đầm phá Tam Giang cùng Chú Huyền/i,
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
        name: /Lịch trình tham khảo/i,
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
        name: /Cùng gia đình Chú Huyền tìm hiểu cuộc sống trên phá/i,
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
        name: /Thông tin rõ ràng trước khi trải nghiệm/i,
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
        name: /Thông tin liên hệ & Điểm gặp/i,
        level: 2,
      })
    ).toBeInTheDocument();

    // 4. Primary CTA links to dedicated booking page /vi/dat-trai-nghiem
    const ctaLink = main.getByRole("link", {
      name: /Gửi yêu cầu đặt trải nghiệm/i,
    });
    expect(ctaLink).toHaveAttribute("href", "/vi/dat-trai-nghiem");

    expect(main.getAllByText("350.000đ/người").length).toBeGreaterThan(0);
    expect(main.getAllByText("500.000đ/người").length).toBeGreaterThan(0);
    expect(main.getAllByText(/3–4 giờ/i).length).toBeGreaterThan(0);
    expect(main.getAllByText(/không phải giờ vận hành cố định/i).length).toBeGreaterThan(0);
    expect(main.getByRole("link", { name: /Bến đò Cồn Tộc/i })).toBeInTheDocument();
    expect(main.getByText("Mỗi gói bao gồm những gì?")).toBeInTheDocument();
    expect(main.getByText("Cần đặt cọc bao nhiêu?")).toBeInTheDocument();
    expect(main.getByText("Chú Huyền là ai?")).toBeInTheDocument();
    expect(main.getByText("SUP có luôn hoạt động không?")).toBeInTheDocument();
    expect(document.body).not.toHaveTextContent(/— Gia đình Chú Huyền|điểm đón|tư vấn gấp|chuẩn bị chu đáo|trọn vẹn nhất/i);
    expect(document.body).not.toHaveTextContent(/cất rớ|thả lưới|15–20km|30–40 phút|giá trẻ em|biết bơi|phụ nữ mang thai|người cao tuổi/i);

    // 5. Canonical metadata check
    expect(metadata.alternates?.canonical).toBe("/vi");
  });
});
