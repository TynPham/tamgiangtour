# Define Feature 1 booking-enquiry behavior

Type: grilling
Status: resolved

## Question

Which feature-specific behaviors remain necessary to make “Submit a minimal Vietnamese booking enquiry” ready for `to-spec`, without reopening the locale, content, booking, journey, measurement, launch-gate, or later-version decisions already resolved in V1 Tickets 02–07?

Use the resolved tickets by reference. Clarify only the journey into the enquiry section, field interaction details, server/persistence boundaries, idempotent retry behavior, notification handoff, failure recovery, analytics hooks, accessibility behavior, and high-value acceptance examples that are not already sufficiently explicit.

## Answer

### Entry into the enquiry section

- The enquiry section is always present on Tour Detail; it is not lazy-opened, modal, drawer-based, or conditionally revealed.
- Tour Detail's primary CTA targets one stable enquiry-section anchor. Contact may link to the same Tour Detail URL plus that anchor.
- Activating the anchor places focus on the enquiry-section heading, not the first input, and does not automatically open the mobile keyboard.
- A direct anchored visit shows a compact tour-context summary near the enquiry heading before the fields so the visitor knows which tour the enquiry concerns without scrolling elsewhere.
- Returning to the enquiry anchor during the current page visit does not clear entered values.
- With analytics consent, approved CTA activation emits `primary_cta_clicked`.
- `booking_enquiry_started` emits once per logical form attempt/session on the first field value change or first submit attempt, whichever occurs first. It does not emit merely because the form becomes visible, the anchor is reached, or a field receives focus.
- Preserve normal URL/hash and expected Browser Back behavior.

### Field order and initial state

Use this mobile order:

1. Requested tour date.
2. Total guest count.
3. Guest name.
4. Phone number.
5. Guest notes.

- Start every field blank. Do not preselect a date or assume a guest count.
- Date, guest count, name, and phone are required. Notes are optional.
- Evaluate “today or later” in `Asia/Ho_Chi_Minh`.
- Do not disable dates based on availability, operating days, or advance-notice rules until those rules are approved.
- Use persistent labels and clearly communicate required versus optional fields.
- Allow appropriate browser autofill for guest name and phone, and request appropriate mobile input modes/keyboards for phone and guest count.
- Do not change Ticket 03's authoritative server-validation rules.
- Notes remain plain text with a clearly shown 1,000-character maximum; do not add rich-text editing.
- Do not add tour, time-slot, pickup, child, safety-specific, email, language, separate Zalo-number, or account fields.

### Validation interaction

- Do not show validation errors before a field has been interacted with or the visitor attempts submission.
- After a changed field loses focus, show its client-side error when invalid.
- When a field is corrected, revalidate that field on subsequent interaction without clearing unrelated field errors.
- Validate every field client-side before calling the server.

If client-side validation fails:

- Make no server request.
- Preserve all entered values.
- Show inline field errors and a linked error summary, then move focus to the summary.
- Do not emit `booking_enquiry_validation_failed`; Ticket 06 reserves that event for authoritative server rejection.

If client-side validation passes but the server rejects the input:

- Create no `Booking enquiry` and trigger no operator notification.
- Map safe server errors to the relevant fields where possible.
- Preserve entered values, show inline errors and the linked error summary, and move focus to the summary.
- Emit `booking_enquiry_validation_failed` only when analytics consent exists.

- Error presentation must not rely on color alone or expose raw server, schema, database, or other internal validation messages. Show only safe guest-facing Vietnamese messages.
- Server validation remains authoritative. Re-evaluate “today or later” at submission time in `Asia/Ho_Chi_Minh`, including when the page has remained open across midnight.

### Submit, loading, success, and retry states

Pending state:

- After valid client-side input is submitted, allow only one request in flight.
- Prevent repeated submission and field edits while pending, but keep all entered values visible.
- Mark the form as busy and announce a concise Vietnamese submitting status.
- Do not clear values or show success before the server outcome is known.

After durable storage succeeds:

- Replace the editable form with an in-place receipt in the same enquiry section.
- Clearly state that a `Booking enquiry` was recorded for manual family review and is not a `Confirmed booking`.
- Show the requested date and total guest count only as submitted preferences.
- Do not display a booking code, internal record ID, availability claim, payment state, or response-time promise.
- A notification failure after durable storage still produces the successful receipt state.

After a definite storage failure:

- Preserve every entered value and return the form to an editable state.
- Show a generic Vietnamese retry message and the approved phone fallback.
- Allow retry of the same logical submission.

After a network or ambiguous failure:

- Preserve every entered value and explain that receipt could not be verified.
- Do not claim success or definite storage failure.
- Allow a safe retry of the same logical submission.

With analytics consent:

- Emit `booking_enquiry_submitted` once for the durably stored outcome.
- Emit `booking_enquiry_submission_failed` with `storage` or `network_or_unknown` for the corresponding failed attempt.
- Analytics failure must never change form state, persistence behavior, or retry behavior.

### Idempotency-key lifecycle

- Generate one opaque idempotency key when the first client-valid server submission begins and bind it to an immutable normalized payload snapshot.
- Do not expose the key in the URL, UI, analytics, or guest-facing receipt.
- Reuse the same key and identical payload after a definite storage failure, timeout, lost response, or other ambiguous outcome.
- A matching retry for an already stored enquiry returns the original successful outcome without creating another enquiry or triggering another operator notification.
- Client-side validation failure occurs before server submission and does not establish a submitted payload or key lifecycle.
- After authoritative server validation rejection, no enquiry exists; corrected values begin a new logical server attempt with a new key.
- Do not silently reuse a key after submitted values change.
- If the same key arrives with different normalized values, return a safe conflict outcome without overwriting stored data, creating another enquiry, or notifying the operator.
- While an outcome is ambiguous, keep the submitted payload unchanged for a same-key retry and do not rotate the key automatically.
- If the outcome still cannot be recovered safely, show the approved phone fallback rather than risk an automatic duplicate.
- Retire the key after the successful receipt state is established. Any deliberate later enquiry uses a new key.
- Notification retries remain tied to the stored enquiry and never create a new form submission or enquiry.

### Existing contracts applied by reference

- Ticket 03 remains authoritative for server normalization and validation, durable Supabase persistence semantics, stored enquiry fields and metadata, operator-notification handoff, abuse controls, and the distinction between a `Booking enquiry` and `Confirmed booking`.
- Ticket 05 remains authoritative for the embedded Tour Detail placement, mobile journey, CTA hierarchy, in-place states, dead-end prevention, and accessibility behavior.
- Ticket 06 remains authoritative for consent-gated PostHog events and properties. Analytics and acquisition failure never block or change enquiry processing.
- Ticket 07 remains authoritative for launch gates and future Vitest, Playwright, and manual-review seams.
- No availability, payment, booking code, account, dashboard, booking-status workflow, or later-version behavior belongs to this feature.

### High-value acceptance examples for specification

- A direct visit to the enquiry anchor focuses its heading, shows compact tour context, leaves the form available in the approved field order, and does not open the mobile keyboard.
- Client-invalid input produces correctable inline errors and a focused linked summary without a server request or authoritative-validation analytics event.
- Server-invalid input creates no enquiry or notification, preserves entered values, presents only safe Vietnamese errors, and emits the authoritative validation event only with consent.
- One valid submission creates one durable enquiry, shows the honest in-place receipt, and initiates the configured operator handoff once.
- A matching retry after an ambiguous response returns the original result without a second enquiry or notification.
- Reusing a key with changed normalized values cannot overwrite or create data and produces a safe conflict outcome.
- Definite storage failure preserves values, restores editing, offers retry and the approved phone fallback, and never shows success.
- Notification failure after storage preserves the successful guest receipt, records an observable operational failure, and can be retried without another enquiry.
- Without analytics consent, the complete enquiry journey still works and emits no PostHog event or visit-level attribution.
- Keyboard and screen-reader use can reach the section, understand labels and statuses, correct linked errors, submit, and understand the receipt without a focus trap or color-only meaning.

### Unresolved implementation dependencies

- Confirm and configure the real operator-notification destination, responsible person, monitoring routine, manual follow-up method, and observable notification-recovery action required by Tickets 03 and 07.
- Approve the Vietnamese form labels, helper text, validation messages, pending/failure/conflict/receipt wording, privacy notice, and phone-fallback copy.
- Define the implementation specification for Supabase columns, constraints, indexes, migrations, and bounded enquiry retention within Tickets 03, 04, 06, and 07.
- Finalize Ticket 06's controlled analytics keys, consent implementation, bounded analytics retention, and optional acquisition/correlation handling.
- Supply the approved tour context and public Tour Detail slug used beside and above the enquiry section.

## Comments

- Resolved Feature 1's entry, field interaction, validation, submission-state, safe retry, idempotency, notification-handoff, analytics, accessibility, and high-value acceptance behavior without expanding the V1 booking-enquiry boundary.
