import {
  OperatorNotificationDeliveryError,
  type OperatorNotificationChannel,
  type OperatorNotificationEnquiry,
} from "./operator-notification";

function escapeTelegramHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function messageFor(enquiry: OperatorNotificationEnquiry) {
  return [
    "🔔 <b>Yêu cầu đặt trải nghiệm mới</b>",
    "",
    `🗓️ <b>Ngày mong muốn:</b> ${escapeTelegramHtml(enquiry.requestedTourDate)}`,
    `👥 <b>Số khách:</b> ${escapeTelegramHtml(String(enquiry.totalGuestCount))}`,
    `👤 <b>Tên khách:</b> ${escapeTelegramHtml(enquiry.guestName)}`,
    `📞 <b>Điện thoại:</b> ${escapeTelegramHtml(enquiry.phoneNumber)}`,
    ...(enquiry.guestNotes
      ? [
          "",
          "📝 <b>Ghi chú:</b>",
          escapeTelegramHtml(enquiry.guestNotes),
        ]
      : []),
    "",
    `<blockquote>🆔 Mã nội bộ: ${escapeTelegramHtml(enquiry.enquiryId)}</blockquote>`,
  ].join("\n");
}

function telegramMessageId(value: unknown) {
  if (typeof value !== "object" || value === null) return null;
  const response = value as Record<string, unknown>;
  if (response.ok !== true) return null;
  if (typeof response.result !== "object" || response.result === null) {
    return null;
  }
  const messageId = (response.result as Record<string, unknown>).message_id;
  return typeof messageId === "number" || typeof messageId === "string"
    ? String(messageId)
    : null;
}

export function createTelegramNotificationChannel({
  botToken,
  chatId,
  fetcher = fetch,
}: {
  botToken: string;
  chatId: string;
  fetcher?: typeof fetch;
}): OperatorNotificationChannel {
  return {
    key: "telegram",
    async send(enquiry) {
      if (!botToken || !chatId) {
        throw new OperatorNotificationDeliveryError(
          "telegram_configuration_missing",
          true,
        );
      }
      let response: Response;
      try {
        response = await fetcher(
          `https://api.telegram.org/bot${botToken}/sendMessage`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              parse_mode: "HTML",
              text: messageFor(enquiry),
            }),
          },
        );
      } catch {
        throw new OperatorNotificationDeliveryError(
          "telegram_network_unknown",
          false,
        );
      }

      if (!response.ok) {
        throw new OperatorNotificationDeliveryError(
          `telegram_http_${response.status}`,
          true,
        );
      }

      let body: unknown;
      try {
        body = await response.json();
      } catch {
        throw new OperatorNotificationDeliveryError(
          "telegram_response_unknown",
          false,
        );
      }
      const providerMessageId = telegramMessageId(body);
      if (!providerMessageId) {
        throw new OperatorNotificationDeliveryError(
          "telegram_response_unknown",
          false,
        );
      }

      return { providerMessageId };
    },
  };
}
