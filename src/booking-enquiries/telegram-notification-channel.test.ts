import { describe, expect, it, vi } from "vitest";

import { createTelegramNotificationChannel } from "./telegram-notification-channel";

describe("Telegram operator notification adapter", () => {
  it("sends only the actionable stored enquiry details", async () => {
    const fetcher = vi.fn().mockResolvedValue(
      Response.json({ ok: true, result: { message_id: 42 } }),
    );
    const channel = createTelegramNotificationChannel({
      botToken: "test-bot-token",
      chatId: "test-chat-id",
      fetcher,
    });

    await expect(
      channel.send({
        enquiryId: "enquiry-<1>",
        requestedTourDate: "2026-08-29",
        totalGuestCount: 2,
        guestName: "Nguyễn <An> & gia đình",
        phoneNumber: "+84332279474",
        guestNotes: "Ăn tối <cùng> gia đình & tránh 'cay'.",
      }),
    ).resolves.toEqual({ providerMessageId: "42" });

    expect(fetcher).toHaveBeenCalledWith(
      "https://api.telegram.org/bottest-bot-token/sendMessage",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }),
    );
    const request = fetcher.mock.calls[0]?.[1] as RequestInit;
    expect(JSON.parse(String(request.body))).toEqual({
      chat_id: "test-chat-id",
      parse_mode: "HTML",
      text: [
        "🔔 <b>Yêu cầu đặt trải nghiệm mới</b>",
        "",
        "🗓️ <b>Ngày mong muốn:</b> 2026-08-29",
        "👥 <b>Số khách:</b> 2",
        "👤 <b>Tên khách:</b> Nguyễn &lt;An&gt; &amp; gia đình",
        "📞 <b>Điện thoại:</b> +84332279474",
        "",
        "📝 <b>Ghi chú:</b>",
        "Ăn tối &lt;cùng&gt; gia đình &amp; tránh &#39;cay&#39;.",
        "",
        "<blockquote>🆔 Mã nội bộ: enquiry-&lt;1&gt;</blockquote>",
      ].join("\n"),
    });
  });
});
