import { z } from "zod";

export const BOOKING_ENQUIRY_FIELD_NAMES = [
  "requestedTourDate",
  "totalGuestCount",
  "guestName",
  "phoneNumber",
  "guestNotes",
] as const;

export type BookingEnquiryFieldName =
  (typeof BOOKING_ENQUIRY_FIELD_NAMES)[number];

export type BookingEnquiryValidationMessages = Record<
  BookingEnquiryFieldName,
  string
>;

export type BookingEnquiryFormValues = {
  requestedTourDate: string;
  totalGuestCount: string;
  guestName: string;
  phoneNumber: string;
  guestNotes: string;
  website: string;
};

export type ValidatedBookingEnquiryFields = {
  requestedTourDate: string;
  totalGuestCount: number;
  guestName: string;
  phoneNumber: string;
  guestNotes?: string;
  website?: string;
};

export type BookingEnquiryPayload = ValidatedBookingEnquiryFields & {
  locale: "vi";
  sourcePage: "tour_detail";
};

export type BookingEnquirySubmissionResult =
  | { outcome: "recorded"; replayed: boolean }
  | { outcome: "validation_failed"; invalidFields: string[] }
  | { outcome: "storage_failed" }
  | { outcome: "conflict" }
  | { outcome: "rejected" }
  | { outcome: "network_or_unknown" };

export type SubmitBookingEnquiry = (
  payload: BookingEnquiryPayload,
  idempotencyKey: string,
) => Promise<BookingEnquirySubmissionResult>;

export type BookingEnquiryAnalyticsEvent =
  | { name: "booking_enquiry_started" }
  | {
      name: "booking_enquiry_validation_failed";
      fieldKeys: BookingEnquiryFieldName[];
    }
  | { name: "booking_enquiry_submitted" }
  | {
      name: "booking_enquiry_submission_failed";
      failureCategory: "storage" | "network_or_unknown";
    };

export const EMPTY_BOOKING_ENQUIRY_FORM: BookingEnquiryFormValues = {
  requestedTourDate: "",
  totalGuestCount: "",
  guestName: "",
  phoneNumber: "",
  guestNotes: "",
  website: "",
};

const TOUR_TIME_ZONE = "Asia/Ho_Chi_Minh";

export function tourLocalDate(date: Date) {
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

export function formatBookingEnquiryDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: "UTC",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(Date.UTC(year, month - 1, day)));
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

function addFieldIssue(
  context: z.RefinementCtx,
  field: BookingEnquiryFieldName,
  message: string,
) {
  context.addIssue({ code: "custom", path: [field], message });
}

export function createBookingEnquiryFormSchema({
  messages,
  today,
}: {
  messages: BookingEnquiryValidationMessages;
  today: () => string;
}) {
  return z
    .object({
      requestedTourDate: z.string(),
      totalGuestCount: z.string(),
      guestName: z.string(),
      phoneNumber: z.string(),
      guestNotes: z.string(),
      website: z.string(),
    })
    .superRefine((values, context) => {
      const guestName = values.guestName.trim();
      const totalGuestCount = Number(values.totalGuestCount);

      if (
        !isCalendarDate(values.requestedTourDate) ||
        values.requestedTourDate < today()
      ) {
        addFieldIssue(
          context,
          "requestedTourDate",
          messages.requestedTourDate,
        );
      }
      if (
        values.totalGuestCount.trim() === "" ||
        !Number.isInteger(totalGuestCount) ||
        totalGuestCount < 1
      ) {
        addFieldIssue(context, "totalGuestCount", messages.totalGuestCount);
      }
      if (
        guestName.length === 0 ||
        guestName.length > 100 ||
        !/\p{L}/u.test(guestName)
      ) {
        addFieldIssue(context, "guestName", messages.guestName);
      }
      if (!normalizePhone(values.phoneNumber)) {
        addFieldIssue(context, "phoneNumber", messages.phoneNumber);
      }
      if (values.guestNotes.trim().length > 1_000) {
        addFieldIssue(context, "guestNotes", messages.guestNotes);
      }
    });
}

export function normalizeBookingEnquiryFormValues(
  values: BookingEnquiryFormValues,
): ValidatedBookingEnquiryFields {
  const guestNotes = values.guestNotes.trim();
  const website = values.website.trim();

  return {
    requestedTourDate: values.requestedTourDate,
    totalGuestCount: Number(values.totalGuestCount),
    guestName: values.guestName.trim(),
    phoneNumber: normalizePhone(values.phoneNumber) as string,
    ...(guestNotes ? { guestNotes } : {}),
    ...(website ? { website } : {}),
  };
}

export function createBookingEnquiryPayload(
  fields: ValidatedBookingEnquiryFields,
): BookingEnquiryPayload {
  return {
    ...fields,
    locale: "vi",
    sourcePage: "tour_detail",
  };
}
