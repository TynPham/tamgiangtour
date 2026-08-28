"use client";

import { useCallback, useRef, useState } from "react";

import type {
  BookingEnquiryAnalyticsEvent,
  BookingEnquiryFieldName,
  BookingEnquiryPayload,
  SubmitBookingEnquiry,
} from "./booking-enquiry-contract";

export type BookingEnquiryFailure =
  | "storage"
  | "ambiguous"
  | "conflict"
  | "rejected";

type SubmissionAttempt = {
  key: string;
  payload: BookingEnquiryPayload;
  serialized: string;
};

export function useBookingEnquirySubmission({
  createIdempotencyKey,
  emit,
  onValidationFailure,
  submitEnquiry,
}: {
  createIdempotencyKey: () => string;
  emit: (event: BookingEnquiryAnalyticsEvent) => void;
  onValidationFailure: (invalidFields: string[]) => BookingEnquiryFieldName[];
  submitEnquiry: SubmitBookingEnquiry;
}) {
  const [pending, setPending] = useState(false);
  const [failure, setFailure] = useState<BookingEnquiryFailure | null>(null);
  const [receipt, setReceipt] = useState<BookingEnquiryPayload | null>(null);
  const attemptRef = useRef<SubmissionAttempt | null>(null);

  const submitAttempt = useCallback(
    async (attempt: SubmissionAttempt) => {
      setPending(true);
      setFailure(null);
      try {
        const result = await submitEnquiry(attempt.payload, attempt.key);
        if (result.outcome === "recorded") {
          attemptRef.current = null;
          setReceipt(attempt.payload);
          emit({ name: "booking_enquiry_submitted" });
          return;
        }
        if (result.outcome === "validation_failed") {
          attemptRef.current = null;
          const fieldKeys = onValidationFailure(result.invalidFields);
          emit({ name: "booking_enquiry_validation_failed", fieldKeys });
          return;
        }
        if (result.outcome === "storage_failed") {
          setFailure("storage");
          emit({
            name: "booking_enquiry_submission_failed",
            failureCategory: "storage",
          });
          return;
        }
        if (result.outcome === "conflict") {
          setFailure("conflict");
          return;
        }
        if (result.outcome === "rejected") {
          setFailure("rejected");
          return;
        }
        setFailure("ambiguous");
        emit({
          name: "booking_enquiry_submission_failed",
          failureCategory: "network_or_unknown",
        });
      } catch {
        setFailure("ambiguous");
        emit({
          name: "booking_enquiry_submission_failed",
          failureCategory: "network_or_unknown",
        });
      } finally {
        setPending(false);
      }
    },
    [emit, onValidationFailure, submitEnquiry],
  );

  const submitPayload = useCallback(
    async (payload: BookingEnquiryPayload) => {
      const serialized = JSON.stringify(payload);
      let attempt = attemptRef.current;
      if (!attempt || attempt.serialized !== serialized) {
        attempt = {
          key: createIdempotencyKey(),
          payload,
          serialized,
        };
        attemptRef.current = attempt;
      }
      await submitAttempt(attempt);
    },
    [createIdempotencyKey, submitAttempt],
  );

  const retryAmbiguous = useCallback(async () => {
    const attempt = attemptRef.current;
    if (attempt) await submitAttempt(attempt);
  }, [submitAttempt]);

  return {
    failure,
    pending,
    receipt,
    retryAmbiguous,
    submitPayload,
  };
}
