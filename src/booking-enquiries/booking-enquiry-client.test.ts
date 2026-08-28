import { afterEach, describe, expect, it, vi } from "vitest";

import { submitBookingEnquiry } from "./booking-enquiry-client";

const payload = {
  requestedTourDate: "2026-08-29",
  totalGuestCount: 2,
  guestName: "Nguyễn An",
  phoneNumber: "0332279474",
  locale: "vi" as const,
  sourcePage: "tour_detail" as const,
};

afterEach(() => vi.unstubAllGlobals());

describe("booking enquiry browser transport", () => {
  it("sends the approved payload and idempotency key to the real API boundary", async () => {
    const fetch = vi.fn().mockResolvedValue(
      Response.json({ outcome: "recorded", replayed: false }, { status: 201 }),
    );
    vi.stubGlobal("fetch", fetch);

    await expect(submitBookingEnquiry(payload, "opaque-key-123456")).resolves.toEqual({
      outcome: "recorded",
      replayed: false,
    });
    expect(fetch).toHaveBeenCalledWith("/api/booking-enquiries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": "opaque-key-123456",
      },
      body: JSON.stringify(payload),
    });
  });

  it("classifies transport and malformed-response outcomes as ambiguous", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("offline")));
    await expect(submitBookingEnquiry(payload, "opaque-key-123456")).resolves.toEqual({
      outcome: "network_or_unknown",
    });

    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("not-json", { status: 502 })));
    await expect(submitBookingEnquiry(payload, "opaque-key-123456")).resolves.toEqual({
      outcome: "network_or_unknown",
    });
  });
});
