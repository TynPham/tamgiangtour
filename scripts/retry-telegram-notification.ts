import { createClient } from "@supabase/supabase-js";

import { createOperatorNotificationHandoff } from "../src/booking-enquiries/operator-notification";
import { runTelegramNotificationRecovery } from "../src/booking-enquiries/retry-telegram-notification";
import { createSupabaseOperatorNotificationStore } from "../src/booking-enquiries/supabase-operator-notification-store";
import { createTelegramNotificationChannel } from "../src/booking-enquiries/telegram-notification-channel";

function requiredEnvironment(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment: ${name}`);
  return value;
}

async function main() {
  const enquiryId = process.argv[2] ?? "";
  let supabaseUrl: string;
  let serviceRoleKey: string;
  let botToken: string;
  let chatId: string;

  try {
    supabaseUrl = requiredEnvironment("SUPABASE_URL");
    serviceRoleKey = requiredEnvironment("SUPABASE_SERVICE_ROLE_KEY");
    botToken = requiredEnvironment("TELEGRAM_BOT_TOKEN");
    chatId = requiredEnvironment("TELEGRAM_CHAT_ID");
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : "Missing environment"}\n`);
    return 78;
  }

  const client = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const handoff = createOperatorNotificationHandoff({
    channel: createTelegramNotificationChannel({ botToken, chatId }),
    store: createSupabaseOperatorNotificationStore(client),
  });

  return runTelegramNotificationRecovery({
    enquiryId,
    handoff,
    write(stream, message) {
      process[stream].write(`${message}\n`);
    },
  });
}

void main().then((exitCode) => {
  process.exitCode = exitCode;
});
