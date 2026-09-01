import type { OperatorNotificationHandoff } from "./operator-notification";

type RecoveryStream = "stdout" | "stderr";
type RecoveryWriter = (stream: RecoveryStream, message: string) => void;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function runTelegramNotificationRecovery({
  enquiryId,
  handoff,
  write,
}: {
  enquiryId: string;
  handoff: OperatorNotificationHandoff;
  write: RecoveryWriter;
}) {
  if (!UUID_PATTERN.test(enquiryId)) {
    write("stderr", "Invalid enquiry ID: expected a UUID.");
    return 64;
  }

  try {
    const result = await handoff.deliverStoredEnquiry(enquiryId);
    switch (result.outcome) {
      case "delivered":
        write("stdout", `Telegram notification delivered for enquiry ${enquiryId}.`);
        return 0;
      case "already_delivered":
        write(
          "stdout",
          `Telegram notification was already delivered for enquiry ${enquiryId}; no message was resent.`,
        );
        return 0;
      case "failed":
        write(
          "stderr",
          `Telegram delivery failed and remains retryable for enquiry ${enquiryId}.`,
        );
        return 1;
      case "busy":
        write(
          "stderr",
          `Telegram delivery is already in progress for enquiry ${enquiryId}; no retry was started.`,
        );
        return 2;
      case "unknown":
        write(
          "stderr",
          `Telegram delivery has an ambiguous outcome for enquiry ${enquiryId}; manual investigation is required and no message was resent.`,
        );
        return 3;
    }
  } catch {
    write(
      "stderr",
      `Could not inspect or retry Telegram delivery for enquiry ${enquiryId}.`,
    );
    return 1;
  }
}
