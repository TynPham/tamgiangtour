# Tam Giang Tour — V1

Vietnamese-first Next.js website for the family-operated Tam Giang Lagoon experience. V1 helps a visitor evaluate the tour, contact the family, and submit a durable `Booking enquiry`. An enquiry is not a confirmed booking: the family reviews it and confirms the trip manually.

## Local setup

Requirements:

- Node.js 22
- pnpm 10
- A Supabase project for enquiry persistence
- A Telegram bot/chat for operator notification
- A PostHog project for consented analytics

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

The application starts at `http://localhost:3000` and redirects `/` to `/vi`.

## Environment variables

Copy `.env.example` to `.env.local`. Never commit `.env.local` or real credentials.

| Variable | Visibility | Purpose |
| --- | --- | --- |
| `SUPABASE_URL` | Server only | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Calls private enquiry/notification RPCs; never expose in browser code |
| `TELEGRAM_BOT_TOKEN` | Server only | Telegram Bot API credential |
| `TELEGRAM_CHAT_ID` | Server only | Monitored operator destination |
| `NEXT_PUBLIC_POSTHOG_KEY` | Public | PostHog project key; collection remains consent-gated |
| `NEXT_PUBLIC_POSTHOG_HOST` | Public | PostHog ingestion host; defaults to `https://us.i.posthog.com` |
| `GOOGLE_SITE_VERIFICATION` | Server/build | Optional Search Console verification token content |

## Supabase deployment

Migrations live in `supabase/migrations/` and are forward-only. Apply all unapplied migrations to the linked production project with the team's Supabase CLI/deployment workflow, for example:

```bash
supabase link --project-ref <production-project-ref>
supabase db push
```

The pre-launch migrations:

- enforce `total_guest_count >= 2` for new writes without rewriting historical rows;
- install a daily `pg_cron` job that deletes enquiries older than 12 months;
- delete related notification-delivery rows through the existing `ON DELETE CASCADE` relationship.

After deployment, verify:

```sql
select conname, convalidated
from pg_constraint
where conname = 'booking_enquiries_guest_count_minimum';

select jobname, schedule, command, active
from cron.job
where jobname = 'delete-expired-booking-enquiries';

select status, start_time, end_time, return_message
from cron.job_run_details
where jobid = (
  select jobid from cron.job
  where jobname = 'delete-expired-booking-enquiries'
)
order by start_time desc
limit 5;
```

If historical one-guest rows exist, the new constraint remains `NOT VALID` but still protects all new writes. Review those rows before explicitly validating the constraint; do not silently rewrite or delete them.

## Telegram operator notification

Configure the bot token and monitored chat ID, then perform a production-like enquiry dry run. Telegram delivery happens only after durable enquiry storage. Delivery failure never changes the guest's successful receipt.

To retry a recorded `failed` Telegram delivery from existing state:

```bash
pnpm notifications:retry:telegram -- <booking-enquiry-uuid>
```

The command loads `.env.local` when present and prints a clear outcome:

- `delivered`: retry succeeded;
- `already delivered`: no message was resent;
- `failed`: failure remains safely retryable;
- `busy`: another delivery attempt is active;
- `unknown`: do not resend automatically; compare stored notification state with Telegram before taking action.

Recovery never submits the guest form and never creates another enquiry.

## PostHog and privacy

PostHog initializes only after affirmative analytics consent. V1 uses eight controlled custom events, no broad click/form autocapture, no session replay, and no identified person profiles. Analytics failure or consent refusal never blocks the booking journey.

Repository code cannot enforce hosted PostHog retention. In the production PostHog project/environment:

1. Open the project/environment data-retention setting.
2. Set product analytics event retention to **90 days**.
3. Save, reopen the setting, and record the verifier and date in the launch checklist.
4. Confirm session replay remains disabled and no form values or identified profiles are captured.

Do not claim this check is complete until an authorized PostHog administrator verifies the saved production setting.

## Search Console

If meta-tag verification is used, set `GOOGLE_SITE_VERIFICATION` to the token value supplied by Google (not the full HTML tag), deploy, and verify the tag on the production home page. Then submit:

`https://tamgiangtour.vn/sitemap.xml`

No placeholder verification token is shipped.

## Rate limiting

V1 retains the existing low-volume, process-local rate limiter together with authoritative validation, unexpected-field rejection, payload limits, and a honeypot. The limiter is not shared across server instances and resets on restart. This is an accepted V1 limitation, not a claim of distributed abuse prevention. Monitor production abuse/429 behavior and add an external shared limiter only if real traffic demonstrates the need.

## Verification and deployment

```bash
pnpm test
pnpm test:e2e
pnpm typecheck
pnpm lint
pnpm build
```

`pnpm build` is the deployment build command. If local Turbopack verification is blocked by an environment-specific port restriction, use the verified application-equivalent fallback:

```bash
pnpm exec next build --webpack
```

Do not describe a sandbox port-binding failure as an application build failure.

The final operational checks are tracked in [docs/V1_LAUNCH_CHECKLIST.md](docs/V1_LAUNCH_CHECKLIST.md).
