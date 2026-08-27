import { createClient } from "@supabase/supabase-js";

import { createInMemoryRateLimiter } from "@/src/booking-enquiries/in-memory-rate-limiter";
import { createBookingEnquiryHandler } from "@/src/booking-enquiries/submit-booking-enquiry";
import { createSupabaseBookingEnquiryStore } from "@/src/booking-enquiries/supabase-booking-enquiry-store";

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
