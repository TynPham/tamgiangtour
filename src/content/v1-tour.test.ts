import { describe, expect, it } from "vitest";

import { LANDING_PAGE_CONTENT } from "@/src/content/landing-page-content";
import { V1_PUBLIC_CONTACT, V1_TOUR } from "@/src/content/v1-tour";

describe("canonical V1 tour contract", () => {
  it("keeps approved commercial, timing, meeting-point, and policy facts in one structured source", () => {
    expect(V1_TOUR.pricing.options).toEqual([
      { key: "standard", amount: 350000 },
      {
        key: "special",
        amount: 500000,
        additions: ["crab", "squid", "brown_fish_porridge"],
      },
    ]);
    expect(V1_TOUR.pricing.minimumGuests).toBe(2);
    expect(V1_TOUR.durationHours).toMatchObject({ min: 3, max: 4 });
    expect(V1_TOUR.referenceItinerary.timing).toBe("illustrative");
    expect(V1_TOUR.referenceItinerary.flexible).toBe(true);
    expect(V1_TOUR.meetingPoints.map((point) => point.name)).toEqual([
      "Bến đò thôn 13, Phong Quảng, Huế",
      "Bến đò Cồn Tộc",
    ]);
    expect(V1_PUBLIC_CONTACT.phoneDisplay).toBe("0332 279 474");
    expect(V1_PUBLIC_CONTACT.zaloPhone).toBe("0332 279 474");
    expect(V1_TOUR.bookingPolicy).toMatchObject({
      depositPercent: 30,
      changeOrCancelNoticeHours: 24,
      lateCancellation: "deposit_forfeited",
      noShow: "deposit_forfeited",
    });
  });

  it("does not publish unresolved suitability, child-pricing, or exclusions as claims", () => {
    const publicCopy = JSON.stringify(LANDING_PAGE_CONTENT);

    expect(publicCopy).not.toMatch(/giá trẻ em|độ tuổi tối thiểu|biết bơi|phụ nữ mang thai|người cao tuổi|không bao gồm/i);
    expect(publicCopy).not.toMatch(/cất rớ|thả lưới|nơm/i);
  });

  it("derives the Feature 4 FAQ from the canonical V1 contract", () => {
    const faqById = new Map(
      LANDING_PAGE_CONTENT.faq.items.map((item) => [item.id, item]),
    );

    expect(faqById.get("faq-deposit")?.answer).toContain(
      `${V1_TOUR.bookingPolicy.depositPercent}%`,
    );
    expect(faqById.get("faq-change-cancel")?.answer).toContain(
      `${V1_TOUR.bookingPolicy.changeOrCancelNoticeHours} giờ`,
    );
    expect(faqById.get("faq-host")?.answer).toContain(
      `${V1_TOUR.host.lagoonExperienceYears.value} năm`,
    );
    expect(faqById.get("faq-packages")?.answer).toContain("Gói đặc biệt");
    expect(faqById.get("faq-sup-availability")?.answer).toContain("phụ thuộc");
    expect(faqById.get("faq-itinerary-flexibility")?.answer).toContain(
      "lịch trình tham khảo",
    );
  });
});
