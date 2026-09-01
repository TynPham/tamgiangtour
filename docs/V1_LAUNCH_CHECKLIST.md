# V1 production launch checklist

Record the verifier and date beside each production-only check. Repository tests are evidence for code behavior, not evidence that hosted settings or third-party accounts are configured.

## Deployment

- [ ] Production environment contains every required variable from `.env.example`; server-only values are not exposed to client bundles or logs.
- [ ] All Supabase migrations apply successfully to the intended production project.
- [ ] `booking_enquiries_guest_count_minimum` is present; any historical one-guest rows are reviewed before full constraint validation.
- [ ] `delete-expired-booking-enquiries` is active in `cron.job` and a successful run appears in `cron.job_run_details`.
- [ ] `pnpm build` succeeds in the deployment environment.

## Booking and operator handoff

- [ ] One production-like enquiry creates exactly one stored row and one Telegram notification.
- [ ] Identical idempotent replay creates no duplicate row or Telegram message.
- [ ] Same key with a changed payload conflicts safely.
- [ ] A forced retry-safe Telegram failure is recorded and recovered with `pnpm notifications:retry:telegram -- <enquiry-id>`.
- [ ] `delivered` state is not resent; `unknown` state is manually investigated rather than automatically retried.
- [ ] The named remote operator/developer confirms the Telegram destination and monitoring routine.

## Analytics and privacy

- [ ] PostHog remains uninitialized before affirmative consent and initializes after acceptance.
- [ ] Production PostHog product-analytics event retention is set to 90 days. Verifier/date: __________
- [ ] Autocapture, form autocapture, session replay, and identified person profiles remain disabled.
- [ ] Declining analytics leaves browsing, contact, Maps, and enquiry submission fully usable.
- [ ] No guest form values, raw URLs/query strings, IP addresses, or device fingerprints appear in custom analytics payloads.

## SEO and discovery

- [ ] Canonicals, titles, descriptions, Open Graph, and Twitter metadata resolve correctly on all four public Vietnamese routes.
- [ ] `/sitemap.xml` contains only the four approved public Vietnamese routes.
- [ ] `/robots.txt` permits public pages and excludes `/api/` and `/dev/`.
- [ ] `/dev/booking-enquiry-preview` is unavailable in production and carries noindex protections.
- [ ] Search Console ownership is verified with the real production token. Verifier/date: __________
- [ ] `https://tamgiangtour-ten.vercel.app/sitemap.xml` is submitted in Search Console.

## Security and operations

- [ ] Production responses include the configured CSP, Referrer-Policy, Permissions-Policy, nosniff, frame, and HSTS protections.
- [ ] Google Maps embeds/actions and consented PostHog delivery still function under the production CSP.
- [ ] Process-local rate limiting is acknowledged; production abuse and 429 responses have a named monitor.
- [ ] Phone, Zalo, Google Maps, Supabase, and Telegram destinations are exercised against production configuration.

## Manual public journey

- [ ] Keyboard and screen-reader passes cover Home → Tour Detail → booking/contact/Maps.
- [ ] Representative mobile browsers, zoom, increased text size, focus visibility, error summary, loading, retry, and success states pass.
- [ ] Published business facts, conditional wording, real-media permissions/alt text, and contact destinations receive final owner approval.
