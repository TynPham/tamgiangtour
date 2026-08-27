import type {
  BookingEnquiryStore,
  PersistBookingEnquiryInput,
  PersistBookingEnquiryResult,
} from "./submit-booking-enquiry";

type RpcResult = {
  data: unknown;
  error: unknown;
};

type BookingEnquiryRpcClient = {
  rpc(
    functionName: "submit_booking_enquiry",
    parameters: Record<string, unknown>,
  ): PromiseLike<RpcResult>;
};

type PersistenceRow = {
  outcome: "stored" | "replayed" | "conflict";
  enquiry_id: string | null;
};

function isPersistenceRow(value: unknown): value is PersistenceRow {
  if (typeof value !== "object" || value === null) return false;

  const row = value as Record<string, unknown>;
  return (
    (row.outcome === "stored" ||
      row.outcome === "replayed" ||
      row.outcome === "conflict") &&
    (typeof row.enquiry_id === "string" || row.enquiry_id === null)
  );
}

export function createSupabaseBookingEnquiryStore(
  client: BookingEnquiryRpcClient,
): BookingEnquiryStore {
  return {
    async persist(
      input: PersistBookingEnquiryInput,
    ): Promise<PersistBookingEnquiryResult> {
      const { data, error } = await client.rpc("submit_booking_enquiry", {
        p_guest_name: input.guestName,
        p_guest_notes: input.guestNotes,
        p_idempotency_key: input.idempotencyKey,
        p_locale: input.locale,
        p_payload_fingerprint: input.payloadFingerprint,
        p_phone_number: input.phoneNumber,
        p_requested_tour_date: input.requestedTourDate,
        p_source_page: input.sourcePage,
        p_total_guest_count: input.totalGuestCount,
      });

      const row = Array.isArray(data) ? data[0] : undefined;
      if (error || !isPersistenceRow(row)) {
        throw new Error("Booking enquiry persistence failed");
      }
      if (row.outcome === "conflict") return { outcome: "conflict" };
      if (!row.enquiry_id) {
        throw new Error("Booking enquiry persistence failed");
      }

      return {
        outcome: row.outcome,
        enquiryId: row.enquiry_id,
      };
    },
  };
}
