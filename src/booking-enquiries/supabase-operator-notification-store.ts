import type {
  OperatorNotificationClaim,
  OperatorNotificationCompletion,
  OperatorNotificationDeliveryStore,
} from "./operator-notification";

type RpcResult = { data: unknown; error: unknown };

type OperatorNotificationRpcClient = {
  rpc(
    functionName:
      | "claim_booking_enquiry_notification"
      | "complete_booking_enquiry_notification",
    parameters: Record<string, unknown>,
  ): PromiseLike<RpcResult>;
};

const DELIVERY_STATES = [
  "pending",
  "sending",
  "delivered",
  "failed",
  "unknown",
] as const;

function isDeliveryState(value: unknown): value is (typeof DELIVERY_STATES)[number] {
  return DELIVERY_STATES.includes(value as (typeof DELIVERY_STATES)[number]);
}

function mapClaim(value: unknown): OperatorNotificationClaim | null {
  if (typeof value !== "object" || value === null) return null;
  const row = value as Record<string, unknown>;
  if (row.claim_outcome === "not_claimed" && isDeliveryState(row.delivery_state)) {
    return { outcome: "not_claimed", state: row.delivery_state };
  }
  if (
    row.claim_outcome !== "claimed" ||
    typeof row.attempt_token !== "string" ||
    typeof row.enquiry_id !== "string" ||
    typeof row.requested_tour_date !== "string" ||
    typeof row.total_guest_count !== "number" ||
    typeof row.guest_name !== "string" ||
    typeof row.phone_number !== "string" ||
    !(typeof row.guest_notes === "string" || row.guest_notes === null)
  ) {
    return null;
  }

  return {
    outcome: "claimed",
    attemptToken: row.attempt_token,
    enquiry: {
      enquiryId: row.enquiry_id,
      requestedTourDate: row.requested_tour_date,
      totalGuestCount: row.total_guest_count,
      guestName: row.guest_name,
      phoneNumber: row.phone_number,
      guestNotes: row.guest_notes,
    },
  };
}

export function createSupabaseOperatorNotificationStore(
  client: OperatorNotificationRpcClient,
): OperatorNotificationDeliveryStore {
  return {
    async claim(enquiryId, channel) {
      const { data, error } = await client.rpc(
        "claim_booking_enquiry_notification",
        { p_channel: channel, p_enquiry_id: enquiryId },
      );
      const claim = mapClaim(Array.isArray(data) ? data[0] : null);
      if (error || !claim) {
        throw new Error("Operator notification claim failed");
      }
      return claim;
    },

    async complete(completion: OperatorNotificationCompletion) {
      const { data, error } = await client.rpc(
        "complete_booking_enquiry_notification",
        {
          p_attempt_token: completion.attemptToken,
          p_channel: completion.channel,
          p_enquiry_id: completion.enquiryId,
          p_error_code: completion.errorCode ?? null,
          p_provider_message_id: completion.providerMessageId ?? null,
          p_state: completion.state,
        },
      );
      if (error || data !== true) {
        throw new Error("Operator notification completion failed");
      }
    },
  };
}
