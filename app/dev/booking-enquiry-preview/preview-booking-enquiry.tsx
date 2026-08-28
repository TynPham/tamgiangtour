"use client";

import { type SubmitBookingEnquiry } from "@/src/booking-enquiries/booking-enquiry-contract";
import {
  BookingEnquirySection,
  type BookingEnquiryCopy,
} from "@/src/booking-enquiries/booking-enquiry-section";

const previewCopy: BookingEnquiryCopy = {
  heading: "Booking enquiry form preview",
  introduction:
    "Review-only interface text. It is not approved customer-facing copy or a published offer.",
  requiredHint: "Required",
  optionalHint: "Optional",
  fields: {
    requestedTourDate: {
      label: "Requested date",
      error: "Choose today or a later date.",
    },
    totalGuestCount: {
      label: "Total guests",
      error: "Enter a whole number of at least one.",
    },
    guestName: {
      label: "Guest name",
      error: "Enter a name using no more than 100 characters.",
    },
    phoneNumber: {
      label: "Phone number",
      error: "Enter 8–15 digits with an optional leading plus sign.",
    },
    guestNotes: {
      label: "Notes",
      error: "Keep notes within 1,000 characters.",
      hint: "Optional, maximum 1,000 characters.",
    },
  },
  submit: "Preview submission",
  submitting: "Simulating submission…",
  errorSummaryHeading: "Review these fields",
  storageFailure: {
    heading: "Preview storage-failure state",
    message: "This neutral message exists only to review the failure layout.",
    retry: "Retry preview",
  },
  ambiguousFailure: {
    heading: "Preview unknown-outcome state",
    message: "This neutral message exists only to review the retry layout.",
    retry: "Retry preview",
  },
  conflictFailure: {
    heading: "Preview conflict state",
    message: "This neutral message exists only to review the conflict layout.",
  },
  rejectedFailure: {
    heading: "Preview rejected state",
    message: "This neutral message exists only to review the rejected layout.",
  },
  phoneFallback: "Preview phone fallback",
  receipt: {
    heading: "Preview receipt state",
    message: "The preview interaction completed without storing an enquiry.",
    notConfirmed: "No booking or booking enquiry was created.",
    requestedDateLabel: "Entered date",
    guestCountLabel: "Entered guest count",
    preferenceNote: "These values are shown only to review the receipt layout.",
  },
};

const simulateSubmission: SubmitBookingEnquiry = async () => {
  await new Promise((resolve) => window.setTimeout(resolve, 400));
  return { outcome: "recorded", replayed: false };
};

export function PreviewBookingEnquiry() {
  return (
    <BookingEnquirySection
      tour={{
        key: "development-preview",
        title: "Neutral preview context",
        summary:
          "Sample context for reviewing hierarchy and spacing. It does not describe a real tour.",
      }}
      copy={previewCopy}
      phone={{ display: "preview only", href: "#preview-phone-not-configured" }}
      submitEnquiry={simulateSubmission}
    />
  );
}
