import { describe, expect, it, vi } from "vitest";

import { createSupabaseOperatorNotificationStore } from "./supabase-operator-notification-store";

describe("Supabase operator notification delivery state", () => {
  it("claims one stored enquiry and records Telegram delivery", async () => {
    const rpc = vi
      .fn()
      .mockResolvedValueOnce({
        data: [
          {
            claim_outcome: "claimed",
            delivery_state: "sending",
            attempt_token: "attempt-1",
            enquiry_id: "enquiry-1",
            requested_tour_date: "2026-08-29",
            total_guest_count: 2,
            guest_name: "Nguyễn An",
            phone_number: "+84332279474",
            guest_notes: null,
          },
        ],
        error: null,
      })
      .mockResolvedValueOnce({ data: true, error: null });
    const store = createSupabaseOperatorNotificationStore({ rpc });

    await expect(store.claim("enquiry-1", "telegram")).resolves.toEqual({
      outcome: "claimed",
      attemptToken: "attempt-1",
      enquiry: {
        enquiryId: "enquiry-1",
        requestedTourDate: "2026-08-29",
        totalGuestCount: 2,
        guestName: "Nguyễn An",
        phoneNumber: "+84332279474",
        guestNotes: null,
      },
    });
    await expect(
      store.complete({
        attemptToken: "attempt-1",
        channel: "telegram",
        enquiryId: "enquiry-1",
        providerMessageId: "42",
        state: "delivered",
      }),
    ).resolves.toBeUndefined();

    expect(rpc).toHaveBeenNthCalledWith(
      1,
      "claim_booking_enquiry_notification",
      { p_channel: "telegram", p_enquiry_id: "enquiry-1" },
    );
    expect(rpc).toHaveBeenNthCalledWith(
      2,
      "complete_booking_enquiry_notification",
      {
        p_attempt_token: "attempt-1",
        p_channel: "telegram",
        p_enquiry_id: "enquiry-1",
        p_error_code: null,
        p_provider_message_id: "42",
        p_state: "delivered",
      },
    );
  });
});
