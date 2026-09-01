import { describe, expect, it, vi } from "vitest";

import { runTelegramNotificationRecovery } from "./retry-telegram-notification";

const ENQUIRY_ID = "10f6fdb2-f809-4a24-a9ff-44dbf93b2a22";

describe("trusted Telegram notification recovery", () => {
  it("reports an already delivered notification without asking for another send", async () => {
    const write = vi.fn();
    const deliverStoredEnquiry = vi
      .fn()
      .mockResolvedValue({ outcome: "already_delivered" });

    await expect(
      runTelegramNotificationRecovery({
        enquiryId: ENQUIRY_ID,
        handoff: { deliverStoredEnquiry },
        write,
      }),
    ).resolves.toBe(0);

    expect(deliverStoredEnquiry).toHaveBeenCalledOnce();
    expect(write).toHaveBeenCalledWith(
      "stdout",
      expect.stringContaining("already delivered"),
    );
  });

  it("refuses to resend an ambiguous notification", async () => {
    const write = vi.fn();
    const deliverStoredEnquiry = vi.fn().mockResolvedValue({ outcome: "unknown" });

    await expect(
      runTelegramNotificationRecovery({
        enquiryId: ENQUIRY_ID,
        handoff: { deliverStoredEnquiry },
        write,
      }),
    ).resolves.toBe(3);

    expect(write).toHaveBeenCalledWith(
      "stderr",
      expect.stringContaining("manual investigation"),
    );
  });
});
