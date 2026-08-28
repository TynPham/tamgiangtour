import { describe, expect, it, vi } from "vitest";

import {
  OperatorNotificationDeliveryError,
  createOperatorNotificationHandoff,
  type OperatorNotificationClaim,
  type OperatorNotificationCompletion,
  type OperatorNotificationDeliveryStore,
} from "./operator-notification";

const enquiry = {
  enquiryId: "enquiry-1",
  requestedTourDate: "2026-08-29",
  totalGuestCount: 2,
  guestName: "Nguyễn An",
  phoneNumber: "+84332279474",
  guestNotes: "Ăn tối cùng gia đình.",
};

class MemoryNotificationStore implements OperatorNotificationDeliveryStore {
  state: "pending" | "sending" | "delivered" | "failed" | "unknown" =
    "pending";
  readonly completions: OperatorNotificationCompletion[] = [];

  async claim(): Promise<OperatorNotificationClaim> {
    if (this.state !== "pending" && this.state !== "failed") {
      return { outcome: "not_claimed", state: this.state };
    }
    this.state = "sending";
    return { outcome: "claimed", attemptToken: "attempt-1", enquiry };
  }

  async complete(completion: OperatorNotificationCompletion) {
    this.completions.push(completion);
    this.state = completion.state;
  }
}

describe("operator notification handoff", () => {
  it("delivers one notification and skips an already delivered enquiry", async () => {
    const store = new MemoryNotificationStore();
    const send = vi.fn().mockResolvedValue({ providerMessageId: "telegram-10" });
    const handoff = createOperatorNotificationHandoff({
      channel: { key: "telegram", send },
      store,
    });

    await expect(handoff.deliverStoredEnquiry("enquiry-1")).resolves.toEqual({
      outcome: "delivered",
    });
    await expect(handoff.deliverStoredEnquiry("enquiry-1")).resolves.toEqual({
      outcome: "already_delivered",
    });

    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledWith(enquiry);
    expect(store.completions).toEqual([
      {
        attemptToken: "attempt-1",
        channel: "telegram",
        enquiryId: "enquiry-1",
        providerMessageId: "telegram-10",
        state: "delivered",
      },
    ]);
  });

  it("records a definite failure and retries delivery without another enquiry", async () => {
    const store = new MemoryNotificationStore();
    const send = vi
      .fn()
      .mockRejectedValueOnce(
        new OperatorNotificationDeliveryError("telegram_http_error", true),
      )
      .mockResolvedValueOnce({ providerMessageId: "telegram-11" });
    const handoff = createOperatorNotificationHandoff({
      channel: { key: "telegram", send },
      store,
    });

    await expect(handoff.deliverStoredEnquiry("enquiry-1")).resolves.toEqual({
      outcome: "failed",
    });
    await expect(handoff.deliverStoredEnquiry("enquiry-1")).resolves.toEqual({
      outcome: "delivered",
    });

    expect(send).toHaveBeenCalledTimes(2);
    expect(store.completions.map(({ state }) => state)).toEqual([
      "failed",
      "delivered",
    ]);
  });
});
