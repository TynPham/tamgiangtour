import type { BookingEnquiryFieldName } from "@/src/booking-enquiries/booking-enquiry-contract";

export type PageKey = "home" | "tour_detail" | "contact";
export type Locale = "vi" | "en";
export type ContactChannel = "phone" | "zalo";
export type FailureCategory = "storage" | "network_or_unknown";

export type AcquisitionSource =
  | "direct"
  | "google_search"
  | "google_maps"
  | "facebook"
  | "tiktok"
  | "other_referrer"
  | "unknown";

export type PageViewedEvent = {
  name: "page_viewed";
  properties: {
    page_key: PageKey;
    locale: Locale;
  };
};

export type PrimaryCtaClickedEvent = {
  name: "primary_cta_clicked";
  properties: {
    cta_key: "enquiry_start";
    destination_key: "booking_enquiry_section";
    page_key: PageKey;
    locale: Locale;
  };
};

export type ContactClickedEvent = {
  name: "contact_clicked";
  properties: {
    contact_channel: ContactChannel;
    page_key: PageKey;
    locale: Locale;
  };
};

export type MapsOpenedEvent = {
  name: "maps_opened";
  properties: {
    meeting_point_key: string;
    page_key: PageKey;
    locale: Locale;
  };
};

export type BookingEnquiryStartedEvent = {
  name: "booking_enquiry_started";
  properties: {
    tour_key: string;
    page_key: PageKey;
    locale: Locale;
  };
};

export type BookingEnquiryValidationFailedEvent = {
  name: "booking_enquiry_validation_failed";
  properties: {
    field_keys: BookingEnquiryFieldName[];
    tour_key: string;
    page_key: PageKey;
    locale: Locale;
  };
};

export type BookingEnquirySubmittedEvent = {
  name: "booking_enquiry_submitted";
  properties: {
    tour_key: string;
    page_key: PageKey;
    locale: Locale;
  };
};

export type BookingEnquirySubmissionFailedEvent = {
  name: "booking_enquiry_submission_failed";
  properties: {
    failure_category: FailureCategory;
    tour_key: string;
    page_key: PageKey;
    locale: Locale;
  };
};

export type CanonicalAnalyticsEvent =
  | PageViewedEvent
  | PrimaryCtaClickedEvent
  | ContactClickedEvent
  | MapsOpenedEvent
  | BookingEnquiryStartedEvent
  | BookingEnquiryValidationFailedEvent
  | BookingEnquirySubmittedEvent
  | BookingEnquirySubmissionFailedEvent;

export type VisitAttribution = {
  landing_page_key: PageKey;
  acquisition_source: AcquisitionSource;
};
