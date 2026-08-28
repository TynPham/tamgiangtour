import { createClient } from "@supabase/supabase-js";

import { createInMemoryRateLimiter } from "@/src/booking-enquiries/in-memory-rate-limiter";
import { createBookingEnquiryHandler } from "@/src/booking-enquiries/submit-booking-enquiry";
import { createOperatorNotificationHandoff } from "@/src/booking-enquiries/operator-notification";
import { createSupabaseBookingEnquiryStore } from "@/src/booking-enquiries/supabase-booking-enquiry-store";
import { createSupabaseOperatorNotificationStore } from "@/src/booking-enquiries/supabase-operator-notification-store";
import { createTelegramNotificationChannel } from "@/src/booking-enquiries/telegram-notification-channel";

export const runtime = "nodejs";

const rateLimiter = createInMemoryRateLimiter({
  limit: 10,
  windowMs: 60_000,
});

function environment(name: "SUPABASE_URL" | "SUPABASE_SERVICE_ROLE_KEY") {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required server environment: ${name}`);
  return value;
}

function productionHandler() {
  const client = createClient(
    environment("SUPABASE_URL"),
    environment("SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );

  return createBookingEnquiryHandler({
    store: createSupabaseBookingEnquiryStore(client),
    notifications: createOperatorNotificationHandoff({
      channel: createTelegramNotificationChannel({
        botToken: process.env.TELEGRAM_BOT_TOKEN ?? "",
        chatId: process.env.TELEGRAM_CHAT_ID ?? "",
      }),
      store: createSupabaseOperatorNotificationStore(client),
    }),
    rateLimiter,
  });
}

export async function POST(request: Request) {
  try {
    return await productionHandler()(request);
  } catch {
    return Response.json({ outcome: "storage_failed" }, { status: 503 });
  }
}
