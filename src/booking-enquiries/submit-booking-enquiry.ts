import { createHash } from "node:crypto";

import { z } from "zod";

import {
  BOOKING_ENQUIRY_FIELD_NAMES,
  createBookingEnquiryFormSchema,
  normalizeBookingEnquiryFormValues,
  tourLocalDate,
  type BookingEnquiryValidationMessages,
} from "./booking-enquiry-contract";

const MAX_PAYLOAD_BYTES = 16 * 1_024;

const submissionSchema = z
  .object({
    requestedTourDate: z.string(),
    totalGuestCount: z.number(),
    guestName: z.string(),
    phoneNumber: z.string(),
    guestNotes: z.string().optional(),
    locale: z.enum(["vi", "en"]),
    sourcePage: z.literal("tour_detail"),
    website: z.string().optional(),
  })
  .strict();

export type PersistBookingEnquiryInput = {
  idempotencyKey: string;
  payloadFingerprint: string;
  requestedTourDate: string;
  totalGuestCount: number;
  guestName: string;
  phoneNumber: string;
  guestNotes: string | null;
  locale: "vi" | "en";
  sourcePage: "tour_detail";
};

export type PersistBookingEnquiryResult =
  | { outcome: "stored"; enquiryId: string }
  | { outcome: "replayed"; enquiryId: string }
  | { outcome: "conflict" };

export interface BookingEnquiryStore {
  persist(
    input: PersistBookingEnquiryInput,
  ): Promise<PersistBookingEnquiryResult>;
}

export interface BookingEnquiryRateLimiter {
  allow(signal: string): boolean | Promise<boolean>;
}

type HandlerDependencies = {
  store: BookingEnquiryStore;
  rateLimiter: BookingEnquiryRateLimiter;
  now?: () => Date;
};

const SERVER_VALIDATION_MESSAGES = Object.fromEntries(
  BOOKING_ENQUIRY_FIELD_NAMES.map((name) => [name, name]),
) as BookingEnquiryValidationMessages;

function fingerprint(input: Omit<PersistBookingEnquiryInput, "payloadFingerprint">) {
  return createHash("sha256").update(JSON.stringify(input)).digest("hex");
}

function json(body: unknown, status: number) {
  return Response.json(body, { status });
}

export function createBookingEnquiryHandler({
  store,
  rateLimiter,
  now = () => new Date(),
}: HandlerDependencies) {
  return async function submitBookingEnquiry(request: Request) {
    const signal = request.headers.get("x-forwarded-for") ?? "unknown";
    if (!(await rateLimiter.allow(signal))) {
      return json({ outcome: "rejected" }, 429);
    }

    const idempotencyKey = request.headers.get("idempotency-key") ?? "";
    if (!/^[A-Za-z0-9_-]{16,200}$/.test(idempotencyKey)) {
      return json({ outcome: "invalid_request" }, 400);
    }

    const declaredLength = Number(request.headers.get("content-length"));
    if (Number.isFinite(declaredLength) && declaredLength > MAX_PAYLOAD_BYTES) {
      return json({ outcome: "invalid_request" }, 413);
    }

    let body: string;
    try {
      body = await request.text();
    } catch {
      return json({ outcome: "invalid_request" }, 400);
    }
    if (new TextEncoder().encode(body).byteLength > MAX_PAYLOAD_BYTES) {
      return json({ outcome: "invalid_request" }, 413);
    }

    let raw: unknown;
    try {
      raw = JSON.parse(body);
    } catch {
      return json({ outcome: "invalid_request" }, 400);
    }

    const parsed = submissionSchema.safeParse(raw);
    if (!parsed.success) {
      if (
        parsed.error.issues.some((issue) => issue.code === "unrecognized_keys")
      ) {
        return json({ outcome: "invalid_request" }, 400);
      }
      const invalidFields = [
        ...new Set(
          parsed.error.issues
            .map((issue) => issue.path[0])
            .filter((field): field is string => typeof field === "string"),
        ),
      ];
      return json({ outcome: "validation_failed", invalidFields }, 422);
    }
    const validated = createBookingEnquiryFormSchema({
      messages: SERVER_VALIDATION_MESSAGES,
      today: () => tourLocalDate(now()),
    }).safeParse({
      requestedTourDate: parsed.data.requestedTourDate,
      totalGuestCount: String(parsed.data.totalGuestCount),
      guestName: parsed.data.guestName,
      phoneNumber: parsed.data.phoneNumber,
      guestNotes: parsed.data.guestNotes ?? "",
      website: parsed.data.website ?? "",
    });
    if (!validated.success) {
      const invalidFields = [
        ...new Set(
          validated.error.issues
            .map((issue) => issue.path[0])
            .filter((field): field is string => typeof field === "string"),
        ),
      ];
      return json({ outcome: "validation_failed", invalidFields }, 422);
    }
    if (validated.data.website.trim()) {
      return json({ outcome: "rejected" }, 400);
    }
    const fields = normalizeBookingEnquiryFormValues(validated.data);

    const normalized = {
      idempotencyKey,
      requestedTourDate: fields.requestedTourDate,
      totalGuestCount: fields.totalGuestCount,
      guestName: fields.guestName,
      phoneNumber: fields.phoneNumber,
      guestNotes: fields.guestNotes ?? null,
      locale: parsed.data.locale,
      sourcePage: parsed.data.sourcePage,
    } satisfies Omit<PersistBookingEnquiryInput, "payloadFingerprint">;

    try {
      const result = await store.persist({
        ...normalized,
        payloadFingerprint: fingerprint(normalized),
      });

      if (result.outcome === "conflict") {
        return json({ outcome: "conflict" }, 409);
      }

      return json(
        {
          outcome: "recorded",
          replayed: result.outcome === "replayed",
        },
        result.outcome === "stored" ? 201 : 200,
      );
    } catch {
      return json({ outcome: "storage_failed" }, 503);
    }
  };
}
