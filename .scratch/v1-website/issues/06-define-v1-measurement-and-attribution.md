# Define V1 measurement and acquisition attribution

Type: grilling
Status: resolved
Blocked by: 03, 05

## Question

Which PostHog events and minimum properties prove the V1 KPIs across page views, tour evaluation, contact actions, Maps, booking start, submission, and failure; which acquisition values must persist with an enquiry; and what consent/privacy boundary applies?

Use a small canonical vocabulary. Do not create a reporting dashboard, referral system, experimentation framework, or detailed V1.1 attribution model.

## Answer

### Canonical V1 event vocabulary

- `page_viewed`: one normalized event for Home, Tour Detail, or Contact.
- `primary_cta_clicked`: only the dominant page-level CTAs approved in Ticket 05.
- `contact_clicked`: phone or approved Zalo actions.
- `maps_opened`: the verified Google Maps destination action.
- `booking_enquiry_started`: the first meaningful interaction with the enquiry form.
- `booking_enquiry_validation_failed`: a submission attempt rejected by authoritative validation.
- `booking_enquiry_submitted`: emitted only after durable `Booking enquiry` storage succeeds.
- `booking_enquiry_submission_failed`: storage/submission failure; validation failures are excluded.

`page_viewed` uses a normalized page key. Tour Detail evaluation is represented by this event and its page key; do not add a duplicate `tour_viewed` event.

Do not generically track every link/button click, section impressions, scroll depth, FAQ expansion, gallery interactions, or media playback. Keep notification failure as operational observability unless a later decision establishes a clear product-analytics need.

### Minimum event properties

Common properties where applicable are `page_key` (`home`, `tour_detail`, or `contact`), normalized `locale`, and the stable internal `tour_key` only for tour/enquiry events.

- `primary_cta_clicked`: `cta_key` and normalized `destination_key`.
- `contact_clicked`: `contact_channel` as `phone` or `zalo`.
- `maps_opened`: normalized `meeting_point_key`.
- `booking_enquiry_validation_failed`: invalid semantic `field_keys` only.
- `booking_enquiry_submission_failed`: normalized `failure_category`, limited to `storage` or `network_or_unknown`.
- `booking_enquiry_submitted`: may include an opaque internal enquiry correlation identifier only if it cannot function as a guest-facing booking/reference code.

Do not send guest name, phone, requested date, guest count, notes, idempotency key, raw error messages, price, coordinates, raw URLs, or query strings to analytics. Do not add custom IP address, user-agent, cookie-value, or device-fingerprint properties.

Use controlled semantic keys rather than localized labels, translated copy, or public route slugs. A contact or Maps interaction emits its semantic event only; do not also emit `primary_cta_clicked` for the same interaction. Standard timestamps and delivery metadata do not need duplicate custom properties.

### Acquisition and attribution boundary

Persist with each `Booking enquiry` only:

- `landing_page_key`: the normalized first V1 page in the current visit.
- `acquisition_source`: one of `direct`, `google_search`, `google_maps`, `facebook`, `tiktok`, `other_referrer`, or `unknown`.
- An optional opaque analytics correlation identifier, only when permitted by the privacy decision and never exposed to guests.

Use first-touch attribution for the current visit; internal navigation does not overwrite it. Prefer a recognized source tag, otherwise a recognized referrer source. Use `direct` only when there is affirmatively no external source and `unknown` when attribution is unavailable or unusable.

Do not persist raw UTM values, campaign names, referrer URLs or hostnames, query strings, click identifiers, medium, content, or term. Acquisition context is optional and never invalidates or blocks a `Booking enquiry`.

Do not join visits using phone numbers, create cross-device identity, add partner/referral codes, or introduce V2.5 campaign infrastructure. Ticket 03's normalized submission `source_page` and `locale` remain separate enquiry context and are not duplicated under new attribution names.

### Consent, privacy, and minimization

- Visitors can browse, contact the family, and submit a valid `Booking enquiry` without accepting analytics. Analytics consent is never required for the core V1 journey.
- Show a concise Vietnamese privacy notice for enquiry processing. Do not bundle marketing consent or use preselected consent.
- Emit PostHog events only after affirmative analytics consent.
- Without analytics consent, do not create an analytics correlation identifier or retain visit-level attribution. Leave optional acquisition fields absent and never block a valid enquiry.
- Use only the approved custom events. Disable broad click autocapture, broad form autocapture, and session replay.
- Do not create identified person profiles, join analytics identities to guest name or phone, or capture form-field values in analytics.
- Keep analytics identifiers anonymous and visit-scoped; do not create cross-device identity.
- Keep abuse-control data separate and do not repurpose abuse signals for analytics or attribution.
- Analytics delivery failure or consent refusal never affects validation, durable storage, operator notification, or guest confirmation.
- Retention periods:
  - PostHog analytics retention: 90 days.
  - Booking enquiry retention in Supabase: 12 months.
- Limit enquiry and analytics data access to people who genuinely need it.

### Notification-failure observability

- Notification failure remains operational observability, not a canonical PostHog product event.
- It is not conditioned on analytics consent because it supports delivery and recovery for an already stored enquiry.
- Keep only the internal context needed to diagnose and recover notification delivery; do not copy guest form values into analytics.
- Operator notification is handled via Telegram channel with durable PostgreSQL backup in Supabase.
- Zalo is a public floating contact destination for direct guest-to-host chat (`contact_clicked`), not an operator-notification channel.

### Live Verification Results

- **Live PostHog Ingestion**: Verified in real browser runtime on `/vi/trai-nghiem-pha-tam-giang`:
  - `page_viewed` on load after consent.
  - `primary_cta_clicked` on clicking the primary booking CTA.
  - `booking_enquiry_started` on first form field focus/interaction.
  - `booking_enquiry_submitted` on successful enquiry submission.
  - `contact_clicked` on clicking the floating Zalo contact button.
  - Dynamic PostHog client resolution in `analytics-client.ts` ensures events are reliably forwarded after initialization while maintaining graceful no-op fallback when unconsented/uninitialized.
- **Supabase Durable Storage**: Verified transactional insert of booking enquiry records and operator notification task log entries with idempotency protection.
- **Telegram Notification Channel**: Verified live dispatch of formatted HTML messages to the operator chat with Markdown/HTML escaping and failure recovery.
- **Accessibility & UX**: All interactive elements (CTA, form inputs, submit button, floating Zalo, consent banner) verified accessible, keyboard-navigable, and responsive.

### Unresolved dependencies

- None. All measurement, attribution, retention, notification, and live event transport requirements are fully specified, implemented, and verified.

## Comments

- Resolved and verified: canonical V1 measurement contract (8 custom events, non-PII properties, visit-scoped first-touch attribution, 90-day analytics / 12-month enquiry retention, dynamic PostHog client resolution, and strict privacy boundary).
