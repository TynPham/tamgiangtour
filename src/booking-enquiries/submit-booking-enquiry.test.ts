import { describe, expect, it } from "vitest";

import {
  createBookingEnquiryHandler,
  type BookingEnquiryStore,
  type PersistBookingEnquiryInput,
  type PersistBookingEnquiryResult,
} from "./submit-booking-enquiry";
import { createInMemoryRateLimiter } from "./in-memory-rate-limiter";

class MemoryBookingEnquiryStore implements BookingEnquiryStore {
  readonly records: PersistBookingEnquiryInput[] = [];

  async persist(
    input: PersistBookingEnquiryInput,
  ): Promise<PersistBookingEnquiryResult> {
    const existing = this.records.find(
      (record) => record.idempotencyKey === input.idempotencyKey,
    );
    if (existing) {
      return existing.payloadFingerprint === input.payloadFingerprint
        ? { outcome: "replayed", enquiryId: "enquiry-1" }
        : { outcome: "conflict" };
    }
    this.records.push(input);
    return { outcome: "stored", enquiryId: "enquiry-1" };
  }
}

function validRequest(overrides: Record<string, unknown> = {}) {
  return new Request("http://localhost/api/booking-enquiries", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "idempotency-key": "opaque-key-123456",
      "x-forwarded-for": "203.0.113.10",
    },
    body: JSON.stringify({
      requestedTourDate: "2026-08-29",
      totalGuestCount: 2,
      guestName: "  Nguyễn An  ",
      phoneNumber: " +84 332-279-474 ",
      guestNotes: "  Ăn tối cùng gia đình.  ",
      locale: "vi",
      sourcePage: "tour_detail",
      website: "",
      ...overrides,
    }),
  });
}

describe("booking enquiry submission boundary", () => {
  it("durably records one normalized booking enquiry", async () => {
    const store = new MemoryBookingEnquiryStore();
    const handler = createBookingEnquiryHandler({
      store,
      rateLimiter: { allow: () => true },
      now: () => new Date("2026-08-28T05:00:00.000Z"),
    });

    const response = await handler(validRequest());

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({
      outcome: "recorded",
      replayed: false,
    });
    expect(store.records).toHaveLength(1);
    expect(store.records[0]).toMatchObject({
      idempotencyKey: "opaque-key-123456",
      requestedTourDate: "2026-08-29",
      totalGuestCount: 2,
      guestName: "Nguyễn An",
      phoneNumber: "+84332279474",
      guestNotes: "Ăn tối cùng gia đình.",
      locale: "vi",
      sourcePage: "tour_detail",
    });
  });

  it("rejects a requested date that is already past in Ho Chi Minh City", async () => {
    const store = new MemoryBookingEnquiryStore();
    const handler = createBookingEnquiryHandler({
      store,
      rateLimiter: { allow: () => true },
      now: () => new Date("2026-08-27T18:00:00.000Z"),
    });

    const response = await handler(
      validRequest({ requestedTourDate: "2026-08-27" }),
    );

    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toEqual({
      outcome: "validation_failed",
      invalidFields: ["requestedTourDate"],
    });
    expect(store.records).toHaveLength(0);
  });

  it.each([
    ["guestName", { guestName: "🙂" }],
    ["guestName", { guestName: "a".repeat(101) }],
    ["phoneNumber", { phoneNumber: "not-a-phone" }],
    ["requestedTourDate", { requestedTourDate: "2026-02-30" }],
    ["totalGuestCount", { totalGuestCount: 0 }],
    ["totalGuestCount", { totalGuestCount: 1.5 }],
    ["guestNotes", { guestNotes: "a".repeat(1_001) }],
  ])("rejects invalid %s input", async (field, overrides) => {
    const store = new MemoryBookingEnquiryStore();
    const handler = createBookingEnquiryHandler({
      store,
      rateLimiter: { allow: () => true },
      now: () => new Date("2026-08-28T05:00:00.000Z"),
    });

    const response = await handler(validRequest(overrides));

    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toMatchObject({
      outcome: "validation_failed",
      invalidFields: [field],
    });
    expect(store.records).toHaveLength(0);
  });

  it("rejects unexpected fields", async () => {
    const store = new MemoryBookingEnquiryStore();
    const handler = createBookingEnquiryHandler({
      store,
      rateLimiter: { allow: () => true },
    });

    const response = await handler(validRequest({ bookingStatus: "confirmed" }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      outcome: "invalid_request",
    });
    expect(store.records).toHaveLength(0);
  });

  it("rejects an oversized request before persistence", async () => {
    const store = new MemoryBookingEnquiryStore();
    const handler = createBookingEnquiryHandler({
      store,
      rateLimiter: { allow: () => true },
    });
    const request = validRequest({ guestNotes: "a".repeat(17_000) });

    const response = await handler(request);

    expect(response.status).toBe(413);
    await expect(response.json()).resolves.toEqual({
      outcome: "invalid_request",
    });
    expect(store.records).toHaveLength(0);
  });

  it("rejects an enquiry caught by the honeypot without persistence", async () => {
    const store = new MemoryBookingEnquiryStore();
    const handler = createBookingEnquiryHandler({
      store,
      rateLimiter: { allow: () => true },
    });

    const response = await handler(validRequest({ website: "spam.example" }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ outcome: "rejected" });
    expect(store.records).toHaveLength(0);
  });

  it("replays the original outcome for the same key and normalized payload", async () => {
    const store = new MemoryBookingEnquiryStore();
    const handler = createBookingEnquiryHandler({
      store,
      rateLimiter: { allow: () => true },
      now: () => new Date("2026-08-28T05:00:00.000Z"),
    });

    const first = await handler(validRequest());
    const retry = await handler(
      validRequest({
        guestName: "Nguyễn An",
        phoneNumber: "+84332279474",
        guestNotes: "Ăn tối cùng gia đình.",
      }),
    );

    expect(first.status).toBe(201);
    expect(retry.status).toBe(200);
    await expect(retry.json()).resolves.toEqual({
      outcome: "recorded",
      replayed: true,
    });
    expect(store.records).toHaveLength(1);
  });

  it("conflicts when the same key is reused with different normalized values", async () => {
    const store = new MemoryBookingEnquiryStore();
    const handler = createBookingEnquiryHandler({
      store,
      rateLimiter: { allow: () => true },
      now: () => new Date("2026-08-28T05:00:00.000Z"),
    });

    await handler(validRequest());
    const conflict = await handler(validRequest({ totalGuestCount: 3 }));

    expect(conflict.status).toBe(409);
    await expect(conflict.json()).resolves.toEqual({ outcome: "conflict" });
    expect(store.records).toHaveLength(1);
    expect(store.records[0]?.totalGuestCount).toBe(2);
  });

  it("rejects rate-limited requests without persistence", async () => {
    const store = new MemoryBookingEnquiryStore();
    const handler = createBookingEnquiryHandler({
      store,
      rateLimiter: { allow: () => false },
    });

    const response = await handler(validRequest());

    expect(response.status).toBe(429);
    await expect(response.json()).resolves.toEqual({ outcome: "rejected" });
    expect(store.records).toHaveLength(0);
  });

  it("limits repeated submissions by an ephemeral technical signal", async () => {
    const store = new MemoryBookingEnquiryStore();
    const handler = createBookingEnquiryHandler({
      store,
      rateLimiter: createInMemoryRateLimiter({
        limit: 2,
        windowMs: 60_000,
        now: () => 1_000,
      }),
      now: () => new Date("2026-08-28T05:00:00.000Z"),
    });

    expect((await handler(validRequest())).status).toBe(201);
    expect((await handler(validRequest())).status).toBe(200);
    const limited = await handler(validRequest());

    expect(limited.status).toBe(429);
    await expect(limited.json()).resolves.toEqual({ outcome: "rejected" });
    expect(store.records).toHaveLength(1);
  });

  it("returns a safe storage failure without exposing the database error", async () => {
    const handler = createBookingEnquiryHandler({
      store: {
        persist: async () => {
          throw new Error("secret database connection detail");
        },
      },
      rateLimiter: { allow: () => true },
      now: () => new Date("2026-08-28T05:00:00.000Z"),
    });

    const response = await handler(validRequest());

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      outcome: "storage_failed",
    });
  });
});
