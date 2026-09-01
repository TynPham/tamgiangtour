import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

function migration(name: string) {
  return readFileSync(join(process.cwd(), "supabase", "migrations", name), "utf8");
}

describe("V1 pre-launch database migrations", () => {
  it("enforces the approved two-guest minimum without rewriting historical rows", () => {
    const sql = migration("20260831000000_enforce_two_guest_minimum.sql");

    expect(sql).toContain("check (total_guest_count >= 2) not valid");
    expect(sql).toContain("validate constraint booking_enquiries_guest_count_minimum");
    expect(sql).not.toMatch(/delete\s+from\s+public\.booking_enquiries/i);
    expect(sql).not.toMatch(/update\s+public\.booking_enquiries/i);
  });

  it("schedules an auditable 12-month enquiry cleanup through PostgreSQL", () => {
    const sql = migration("20260831010000_schedule_booking_enquiry_retention.sql");

    expect(sql).toContain("interval '12 months'");
    expect(sql).toContain("delete_expired_booking_enquiries");
    expect(sql).toContain("cron.schedule");
  });
});
