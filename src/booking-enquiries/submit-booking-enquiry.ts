import { createHash } from "node:crypto";

import { z } from "zod";

const TOUR_TIME_ZONE = "Asia/Ho_Chi_Minh";
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

function localDate(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TOUR_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((candidate) => candidate.type === type)?.value ?? "";

  return `${part("year")}-${part("month")}-${part("day")}`;
}

function isCalendarDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const candidate = new Date(Date.UTC(year, month - 1, day));

  return (
    candidate.getUTCFullYear() === year &&
    candidate.getUTCMonth() === month - 1 &&
    candidate.getUTCDate() === day
  );
}

function normalizePhone(value: string) {
  const trimmed = value.trim();
  if (!/^\+?[\d\s().-]+$/.test(trimmed)) return null;

  const normalized = trimmed.replace(/[\s().-]/g, "");
  return /^\+?\d{8,15}$/.test(normalized) ? normalized : null;
}

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
    if ((parsed.data.website ?? "").trim().length > 0) {
      return json({ outcome: "rejected" }, 400);
    }

    const guestName = parsed.data.guestName.trim();
    const phoneNumber = normalizePhone(parsed.data.phoneNumber);
    const guestNotes = parsed.data.guestNotes?.trim() || null;
    const requestedTourDate = parsed.data.requestedTourDate;

    const invalidFields: string[] = [];
    if (
      guestName.length === 0 ||
      guestName.length > 100 ||
      !/\p{L}/u.test(guestName)
    ) {
      invalidFields.push("guestName");
    }
    if (!phoneNumber) invalidFields.push("phoneNumber");
    if (
      !isCalendarDate(requestedTourDate) ||
      requestedTourDate < localDate(now())
    ) {
      invalidFields.push("requestedTourDate");
    }
    if (
      !Number.isInteger(parsed.data.totalGuestCount) ||
      parsed.data.totalGuestCount < 1
    ) {
      invalidFields.push("totalGuestCount");
    }
    if ((guestNotes?.length ?? 0) > 1_000) {
      invalidFields.push("guestNotes");
    }
    if (invalidFields.length > 0) {
      return json({ outcome: "validation_failed", invalidFields }, 422);
    }
    const normalizedPhoneNumber = phoneNumber as string;

    const normalized = {
      idempotencyKey,
      requestedTourDate,
      totalGuestCount: parsed.data.totalGuestCount,
      guestName,
      phoneNumber: normalizedPhoneNumber,
      guestNotes,
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
