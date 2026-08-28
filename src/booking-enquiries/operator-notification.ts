export type OperatorNotificationDeliveryOutcome =
  | { outcome: "delivered" }
  | { outcome: "already_delivered" }
  | { outcome: "busy" }
  | { outcome: "failed" }
  | { outcome: "unknown" };

export type OperatorNotificationEnquiry = {
  enquiryId: string;
  requestedTourDate: string;
  totalGuestCount: number;
  guestName: string;
  phoneNumber: string;
  guestNotes: string | null;
};

export type OperatorNotificationClaim =
  | {
      outcome: "claimed";
      attemptToken: string;
      enquiry: OperatorNotificationEnquiry;
    }
  | {
      outcome: "not_claimed";
      state: "pending" | "sending" | "delivered" | "failed" | "unknown";
    };

export type OperatorNotificationCompletion = {
  enquiryId: string;
  channel: string;
  attemptToken: string;
  state: "delivered" | "failed" | "unknown";
  providerMessageId?: string;
  errorCode?: string;
};

export interface OperatorNotificationDeliveryStore {
  claim(enquiryId: string, channel: string): Promise<OperatorNotificationClaim>;
  complete(completion: OperatorNotificationCompletion): Promise<void>;
}

export interface OperatorNotificationChannel {
  readonly key: string;
  send(
    enquiry: OperatorNotificationEnquiry,
  ): Promise<{ providerMessageId?: string }>;
}

export class OperatorNotificationDeliveryError extends Error {
  constructor(
    readonly code: string,
    readonly retrySafe: boolean,
  ) {
    super("Operator notification delivery failed");
    this.name = "OperatorNotificationDeliveryError";
  }
}

export interface OperatorNotificationHandoff {
  deliverStoredEnquiry(
    enquiryId: string,
  ): Promise<OperatorNotificationDeliveryOutcome>;
}

export function createOperatorNotificationHandoff({
  channel,
  store,
}: {
  channel: OperatorNotificationChannel;
  store: OperatorNotificationDeliveryStore;
}): OperatorNotificationHandoff {
  return {
    async deliverStoredEnquiry(enquiryId) {
      const claim = await store.claim(enquiryId, channel.key);
      if (claim.outcome === "not_claimed") {
        if (claim.state === "delivered") {
          return { outcome: "already_delivered" };
        }
        if (claim.state === "unknown") return { outcome: "unknown" };
        return { outcome: "busy" };
      }

      try {
        const sent = await channel.send(claim.enquiry);
        await store.complete({
          attemptToken: claim.attemptToken,
          channel: channel.key,
          enquiryId,
          ...(sent.providerMessageId
            ? { providerMessageId: sent.providerMessageId }
            : {}),
          state: "delivered",
        });
        return { outcome: "delivered" };
      } catch (error) {
        const knownError =
          error instanceof OperatorNotificationDeliveryError ? error : null;
        const state = knownError?.retrySafe ? "failed" : "unknown";
        await store.complete({
          attemptToken: claim.attemptToken,
          channel: channel.key,
          enquiryId,
          errorCode: knownError?.code ?? "unexpected_error",
          state,
        });
        return { outcome: state };
      }
    },
  };
}
