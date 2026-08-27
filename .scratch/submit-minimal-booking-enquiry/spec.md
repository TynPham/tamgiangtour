# Submit a minimal Vietnamese booking enquiry

Status: ready-for-agent

## Problem Statement

A Vietnamese mobile visitor needs a low-friction way to express interest in the single V1 tour after evaluating it. The family needs each valid request durably recorded and handed off for manual review without the website implying availability, reservation, payment, or confirmation. Retries and failures must be honest and must not create duplicate enquiries or notifications.

## Solution

Add one always-present, anchored `Booking enquiry` section near the end of Tour Detail. The visitor submits the minimum approved contact and trip details through an authoritative server boundary. A successful outcome means exactly that one valid enquiry has been durably stored for manual family review. Operator notification follows persistence through a private integration boundary, while consent-gated analytics remains isolated from the core journey.

Use the domain meanings in `CONTEXT.md` and the cross-cutting contracts in resolved V1 Tickets 03, 05, 06, and 07. The resolved Feature 1 behavior artifact is authoritative for interaction details that those tickets do not specify.

## User Stories

1. As a mobile visitor, I want the primary Tour Detail action to take me directly to the enquiry section, so that I can act after evaluating the tour.
2. As a visitor arriving through a direct enquiry anchor, I want concise tour context before the form, so that I know which experience my enquiry concerns.
3. As a visitor, I want a short form containing only necessary fields, so that submitting an enquiry is not burdensome.
4. As a Vietnamese visitor, I want clear persistent labels, helper text, and safe Vietnamese errors, so that I can understand and correct the form.
5. As a visitor, I want invalid fields identified without losing other values or errors, so that correction is predictable.
6. As a visitor, I want my requested date treated as a preference in the tour's local timezone, so that the form never implies availability.
7. As a visitor, I want only one submission to be processed when I tap repeatedly or retry an uncertain request, so that I do not accidentally create duplicate enquiries.
8. As a visitor, I want an honest in-place receipt only after durable storage, so that I know what the website actually accomplished.
9. As a visitor, I want failures to preserve recoverable input and offer a safe retry or phone fallback, so that I am not left at a dead end.
10. As a visitor, I want to complete the enquiry without accepting analytics, so that tracking consent is not a condition of service.
11. As a keyboard or screen-reader user, I want meaningful focus, labels, error relationships, and announced states, so that I can complete the same journey independently.
12. As the family operator, I want one notification for each stored enquiry with enough context to find it, so that I can review it and follow up manually.
13. As the family operator, I want notification failure to be visible and recoverable without duplicating the enquiry, so that a delivery problem is not silently lost.
14. As the product owner, I want funnel measurement that contains no submitted guest data and cannot affect persistence, so that V1 measurement remains proportionate and safe.

## Implementation Decisions

### User-visible journey and states

- The form is always rendered on Tour Detail in the dedicated enquiry section. It is not a modal, drawer, multi-step flow, separate route, or conditionally revealed UI.
- Tour Detail's primary CTA and the optional Contact return path target one stable section anchor. Anchor activation focuses the section heading without focusing an input or opening the mobile keyboard. Normal URL/hash and Browser Back behavior remain intact.
- A compact tour-context summary precedes the fields. Returning to the anchor during the current page visit preserves entered values.
- Fields begin blank and appear in this mobile order: requested tour date, total guest count, guest name, phone number, guest notes.
- Before submission, field errors appear only after an interacted-with field loses focus or after a submit attempt. Correcting one field revalidates it without clearing unrelated errors.
- A client-valid submit permits one request in flight, prevents edits and repeat submission, keeps values visible, marks the form busy, and announces a concise submitting status.
- Durable success replaces the editable form with an in-place receipt. The receipt states that a `Booking enquiry` was recorded for manual family review and is not a `Confirmed booking`. It may show requested date and total guest count only as submitted preferences.
- The receipt never displays an internal identifier, booking code, availability or reservation claim, payment state, or response-time promise.

### Field and validation contract

- Required fields are requested tour date, total guest count, guest name, and phone number. Guest notes are optional.
- Guest name is trimmed, accepts Vietnamese characters, must be meaningful non-empty text, and is at most 100 characters.
- Phone input is trimmed of surrounding whitespace and common formatting characters, then accepts 8–15 digits with an optional leading `+`. Do not force a Vietnamese prefix or infer/rewrite country codes beyond the approved basic normalization.
- Requested date is a valid calendar date equal to or later than the current date in `Asia/Ho_Chi_Minh`. Re-evaluate it at server submission time, including when the page remained open across midnight. Do not enforce availability, operating-day, or advance-notice rules.
- Total guest count is a whole number of at least 1. Do not impose an unapproved maximum.
- Notes are trimmed plain text of at most 1,000 characters. Show the limit; do not add rich text.
- Do not collect tour or time-slot selection, pickup details, child or safety fields, email, language, a separate Zalo number, account data, or secondary contact data.
- Client validation improves interaction, but server validation is authoritative and applies the same contract. Reject unexpected fields and unreasonable payload sizes.
- Client validation failure makes no server request and emits no authoritative-validation event. It preserves values, presents inline errors plus a linked error summary, and moves focus to that summary.
- Server validation rejection creates no enquiry or notification. Map safe errors to semantic fields where possible, preserve values, and never expose raw schema, provider, database, or internal messages.

### Server boundary and persistence

- The server accepts the validated guest fields, an opaque idempotency key, the non-visible abuse-control input, normalized submission locale and source-page context, and only the optional consent-permitted acquisition context defined by Ticket 06.
- Apply server-authoritative normalization and validation, reject unexpected input, enforce the approved honeypot and basic rate-limit boundary, and keep abuse signals separate from enquiry/customer and acquisition data.
- Durable storage in Supabase PostgreSQL is the success boundary. Persist the validated fields and Ticket 03's required internal metadata; do not use Supabase as the source of public tour content.
- A server outcome must distinguish: durable success or matching replay, authoritative validation rejection, idempotency conflict, definite storage failure, and generic abuse/rate rejection. A lost or unusable response is treated by the client as `network_or_unknown`.
- Never notify the operator before durable storage. Analytics delivery is outside the transaction and can neither cause nor prevent persistence.

### Idempotency and retries

- Generate the idempotency key at the first client-valid server attempt and bind it to an immutable normalized payload snapshot. Never expose it through URLs, UI, analytics, or the guest receipt.
- A definite storage failure or ambiguous transport outcome retries the identical snapshot with the same key.
- Enforce at most one durable enquiry per key. A matching retry for an existing enquiry returns the original successful outcome without another record or operator notification.
- Reuse of a key with different normalized values is a safe conflict: overwrite nothing, create nothing, and notify no one.
- Client-only validation failure starts no key lifecycle. After authoritative server validation rejection, corrected values begin a new logical attempt with a new key.
- Do not automatically rotate a key while its outcome is uncertain. If a same-key outcome cannot be recovered safely, offer the approved phone fallback instead of risking an automatic duplicate.
- Retire the key after establishing the successful receipt. A deliberate later enquiry uses a new key.

### Operator notification

- After durable persistence, initiate one notification to the single confirmed, actively monitored operator destination required by Tickets 03 and 07. Include the submitted fields and enough private internal context to locate the stored record.
- The guest success contract does not depend on notification delivery. If notification fails after storage, retain the enquiry and show the durable-success receipt.
- Record notification-delivery diagnostics through an operational seam that makes failure observable and supports a documented retry/recovery action. Notification retry remains tied to the stored enquiry and cannot create another enquiry or guest-facing receipt.
- Keep notification diagnostics outside PostHog and keep the destination in private deployment/integration configuration. This feature adds no operator dashboard or booking-status workflow.

### Failure behavior

- Definite storage failure restores editing, preserves all values, shows only a generic Vietnamese retry message, offers the approved phone fallback, and allows a same-key retry. It never shows success or sends a notification.
- A network or ambiguous failure preserves the immutable submitted values, explains that receipt could not be verified, makes no success or definite-failure claim, and offers a same-key retry.
- A conflicting key/payload combination returns safe guest-facing failure behavior without revealing internal details or silently creating a new logical attempt.
- Validation, storage, notification, and analytics failures remain distinct. No failure path may fabricate confirmation or expose internal implementation details.

### Analytics and acquisition hooks

- All PostHog emission requires affirmative analytics consent. Refusal, absence of consent, or analytics delivery failure never changes validation, persistence, notification, form state, or guest receipt.
- Emit `primary_cta_clicked` for the approved enquiry CTA activation.
- Emit `booking_enquiry_started` once per logical form attempt/session on the first value change or first submit attempt, whichever occurs first; visibility, anchor arrival, and focus do not count.
- Emit `booking_enquiry_validation_failed` only for authoritative server rejection and include only invalid semantic field keys.
- Emit `booking_enquiry_submitted` once for the durable stored outcome, including a correlation identifier only where Ticket 06 permits it. A matching success replay must not double-count the stored outcome.
- Emit `booking_enquiry_submission_failed` with only `storage` or `network_or_unknown` for the corresponding submission failure.
- Use Ticket 06's normalized `page_key`, `locale`, and `tour_key` where applicable. Never send form values, requested trip facts, idempotency keys, raw errors, URLs, query strings, or custom identifying device/network data.
- Persist optional first-touch acquisition context with the enquiry only when consent permits it. Its absence never invalidates the enquiry.

### Accessibility

- Use a semantic section and form, a focusable section heading for anchor arrival, persistent labels, accessible required/optional communication, associated helper text, and suitable autofill/input-mode hints.
- Inline field errors and the post-submit error summary are programmatically associated; the summary receives focus and links to affected fields.
- Busy, failure, and success changes are announced without unnecessary focus theft. Pending controls remain understandable while edits are prevented.
- The full interaction is keyboard-operable with visible focus, no traps, no color-only meaning, and usable touch targets. Zoom and increased text size do not remove information or functionality.
- The receipt and every retry or phone action have descriptive visible labels. Apply Ticket 05's journey rules and Ticket 07's observable accessibility gate.

## Testing Decisions

- Test public behavior rather than component structure, CSS pixels, private helper calls, or provider internals. Prefer two seams: the browser journey and the authoritative server submission boundary.
- At the server seam, verify normalization/validation, timezone-sensitive date handling, unexpected-field and abuse rejection, durable success, same-key replay, changed-payload conflict, storage failure, and one-notification semantics.
- At the browser seam, verify direct-anchor focus/context, initial field order/state, client and server validation experiences, pending-state submission exclusion, honest success receipt, storage and ambiguous retry behavior, phone fallback, and state announcements.
- Verify notification failure independently as an operational integration seam: storage remains successful, failure is observable, recovery does not create another enquiry, and the guest receipt remains unchanged.
- Verify analytics as observable consent-gated effects: the approved hooks fire at their defined boundaries, contain only approved properties, do not double-count replays, and cannot affect a valid enquiry.
- Reuse Ticket 07's high-value Vitest and Playwright seams. Do not chase coverage targets, overuse mocks, bind tests to component boundaries, or write tests for unavailable/payment/account/dashboard behavior.

## Acceptance Criteria

1. A direct enquiry-anchor visit focuses the section heading, shows tour context, leaves fields blank in the approved order, and does not open the mobile keyboard.
2. Client-invalid input makes no server request, preserves values, shows linked accessible errors, and emits no authoritative-validation event.
3. Server-invalid input creates and notifies nothing, preserves values, presents only safe Vietnamese errors, and emits the validation event only with consent.
4. One valid submission creates exactly one durable `Booking enquiry`, initiates one operator notification, and shows an in-place receipt that explicitly denies confirmed-booking semantics.
5. A same-key retry with identical normalized values returns the original success without another enquiry, notification, or submitted-event outcome.
6. The same key with different normalized values overwrites nothing, creates and notifies nothing, and returns safe conflict behavior.
7. Definite storage failure preserves values, restores editing, offers same-key retry and the approved phone fallback, and never shows success.
8. An ambiguous outcome makes no unsupported claim and can safely retry the unchanged payload with the same key.
9. Notification failure after storage leaves one durable enquiry and the success receipt, records an observable failure, and can be recovered without duplication.
10. Without analytics consent—or when PostHog fails—the complete validation, storage, notification, and receipt journey still works and retains no visit-level attribution.
11. A keyboard and screen-reader pass can enter through the anchor, understand and correct the form, follow status changes, submit, and understand the receipt without traps or color-only meaning.
12. Public behavior exposes no availability, payment, booking code, account, dashboard, booking-status workflow, or other later-version capability.

## Out of Scope

- Availability, slot reservation, operating-day or advance-notice enforcement.
- Payment, deposits, refunds, or payment state.
- Booking codes, guest references, customer accounts, booking status, confirmation routes, or My Trip.
- Admin dashboards, moderation queues, operator booking management, or a notification-management system.
- Tour/time-slot selectors, pickup, child, safety-specific, email, language, separate Zalo-number, or account fields.
- OTP, phone ownership verification, CAPTCHA by default, permanent fingerprinting, or cross-device identity.
- English publication, automatic translation, V1.1 conversion experiments, V2 booking behavior, referral/campaign infrastructure, or PWA behavior.
- Detailed component structure, database migrations, provider-specific notification setup, final customer-facing copy, and test implementation.

## Further Notes

### Unresolved implementation dependencies

- Confirm and configure the real operator-notification destination, responsible person, monitoring routine, manual follow-up method, and observable recovery action.
- Approve Vietnamese labels, helper text, validation, pending, conflict, failure, receipt, privacy-notice, and phone-fallback copy.
- Define Supabase columns, constraints, indexes, explicit migrations, and bounded enquiry/acquisition retention while preserving Tickets 03 and 04.
- Finalize Ticket 06's controlled analytics keys, consent integration, bounded PostHog retention, recognized acquisition mapping, and optional correlation behavior.
- Supply the approved public Tour Detail slug and approved compact tour context used at the enquiry section.
- Confirm whether the submitted phone number can reliably support Zalo follow-up. This does not add a separate Zalo field.

These dependencies may block implementation completion or launch readiness, but they do not require reopening this feature's product behavior. The feature is ready for `to-tickets` once this specification is accepted.
