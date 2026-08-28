import type {
  BookingEnquirySubmissionResult,
  SubmitBookingEnquiry,
} from "./booking-enquiry-contract";

const KNOWN_OUTCOMES = new Set([
  "recorded",
  "validation_failed",
  "storage_failed",
  "conflict",
  "rejected",
  "invalid_request",
]);

export const submitBookingEnquiry: SubmitBookingEnquiry = async (
  payload,
  idempotencyKey,
): Promise<BookingEnquirySubmissionResult> => {
  let response: Response;
  try {
    response = await fetch("/api/booking-enquiries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify(payload),
    });
  } catch {
    return { outcome: "network_or_unknown" };
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    return { outcome: "network_or_unknown" };
  }
  if (!body || typeof body !== "object" || !("outcome" in body)) {
    return { outcome: "network_or_unknown" };
  }

  const candidate = body as Record<string, unknown>;
  if (!KNOWN_OUTCOMES.has(String(candidate.outcome))) {
    return { outcome: "network_or_unknown" };
  }
  if (candidate.outcome === "recorded") {
    if (response.status !== 200 && response.status !== 201) {
      return { outcome: "network_or_unknown" };
    }
    return { outcome: "recorded", replayed: candidate.replayed === true };
  }
  if (candidate.outcome === "validation_failed") {
    if (response.status !== 422) return { outcome: "network_or_unknown" };
    return {
      outcome: "validation_failed",
      invalidFields: Array.isArray(candidate.invalidFields)
        ? candidate.invalidFields.filter(
            (field): field is string => typeof field === "string",
          )
        : [],
    };
  }
  if (candidate.outcome === "storage_failed") {
    return response.status === 503
      ? { outcome: "storage_failed" }
      : { outcome: "network_or_unknown" };
  }
  if (candidate.outcome === "conflict") {
    return response.status === 409
      ? { outcome: "conflict" }
      : { outcome: "network_or_unknown" };
  }
  return { outcome: "rejected" };
};
