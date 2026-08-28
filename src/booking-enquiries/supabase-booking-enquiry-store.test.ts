import { describe, expect, it, vi } from "vitest";

import type { PersistBookingEnquiryInput } from "./submit-booking-enquiry";
import { createSupabaseBookingEnquiryStore } from "./supabase-booking-enquiry-store";

const enquiry: PersistBookingEnquiryInput = {
  idempotencyKey: "opaque-key-123456",
  payloadFingerprint: "a".repeat(64),
  requestedTourDate: "2026-08-29",
  totalGuestCount: 2,
  guestName: "Nguyễn An",
  phoneNumber: "+84332279474",
  guestNotes: "Ăn tối cùng gia đình.",
  locale: "vi",
  sourcePage: "tour_detail",
};

describe("Supabase booking enquiry persistence", () => {
  it("returns the atomic database outcome", async () => {
    const rpc = vi.fn().mockResolvedValue({
      data: [{ outcome: "stored", enquiry_id: "enquiry-1" }],
      error: null,
    });
    const store = createSupabaseBookingEnquiryStore({ rpc });

    await expect(store.persist(enquiry)).resolves.toEqual({
      outcome: "stored",
      enquiryId: "enquiry-1",
    });
    expect(rpc).toHaveBeenCalledWith("submit_booking_enquiry", {
      p_guest_name: "Nguyễn An",
      p_guest_notes: "Ăn tối cùng gia đình.",
      p_idempotency_key: "opaque-key-123456",
      p_locale: "vi",
      p_payload_fingerprint: "a".repeat(64),
      p_phone_number: "+84332279474",
      p_requested_tour_date: "2026-08-29",
      p_source_page: "tour_detail",
      p_total_guest_count: 2,
      p_landing_page_key: null,
      p_acquisition_source: null,
    });
  });

  it.each([
    ["replayed", "enquiry-1", { outcome: "replayed", enquiryId: "enquiry-1" }],
    ["conflict", null, { outcome: "conflict" }],
  ] as const)("maps the %s database outcome", async (outcome, enquiryId, expected) => {
    const store = createSupabaseBookingEnquiryStore({
      rpc: vi.fn().mockResolvedValue({
        data: [{ outcome, enquiry_id: enquiryId }],
        error: null,
      }),
    });

    await expect(store.persist(enquiry)).resolves.toEqual(expected);
  });

  it("turns database errors into a private persistence failure", async () => {
    const store = createSupabaseBookingEnquiryStore({
      rpc: vi.fn().mockResolvedValue({
        data: null,
        error: { message: "sensitive database detail" },
      }),
    });

    await expect(store.persist(enquiry)).rejects.toThrow(
      "Booking enquiry persistence failed",
    );
  });
});
