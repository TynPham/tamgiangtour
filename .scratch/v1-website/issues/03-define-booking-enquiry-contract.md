# Define the V1 booking enquiry contract

Type: grilling
Status: resolved

## Question

What exactly does a V1 booking enquiry mean, which fields and business rules are required, what does successful submission promise, how does the family operator receive and act on it, and what must happen for validation failure, submission failure, duplicates, or obvious abuse?

Keep this a request rather than an availability, payment, booking-code, customer-account, or status-management system. Resolve the canonical domain terms while answering and capture them in `CONTEXT.md` if they become stable.

## Answer

### Guest identity and contact

- Guest name and phone number are required.
- Zalo is an allowed follow-up channel, but V1 does not collect a separate Zalo number by default.
- The submitted phone number may be used for Zalo follow-up only if the family confirms that this is operationally valid. A different Zalo number can be reconsidered later if it becomes a real need.
- V1 omits email, WhatsApp, language selection, account details, and secondary contact details.
- The phone number is contact information only. V1 does not verify ownership, use OTP, treat it as identity proof, or create an account.

### Requested trip details

- Requested tour date and total guest count are required. Guest notes are optional.
- The requested date is a preference only. Submitting it does not confirm availability or reserve a slot.
- V1 has one primary experience, so it does not need a tour selector. It also omits a time-slot selector.
- Pickup fields remain deferred until the pickup policy is approved.
- Child count, child ages, and safety-specific fields remain deferred until child-participation and safety rules are approved.
- Free-text notes must not substitute for required structured child or safety information once those requirements are known.

### Validation

- Guest name is trimmed, must contain meaningful non-empty text, accepts Vietnamese characters, and has a maximum length of 100 characters.
- Phone input is trimmed of surrounding whitespace and common formatting characters, then must contain 8–15 digits with an optional leading `+`. Do not force a Vietnamese prefix or infer or rewrite country codes beyond this basic normalization.
- Requested date must be a valid calendar date that is today or later. Do not enforce advance-notice, operating-day, or availability rules until approved.
- Total guest count must be a whole number with a minimum of 1. Do not enforce an unapproved maximum capacity.
- Guest notes are optional, trimmed, and limited to 1,000 characters.
- Enforce the same rules at the server boundary even when browser-side validation exists.
- Validation protects input quality only. Passing validation does not imply availability, suitability, acceptance, or confirmation.

### Successful submission

- Show success only after the server has durably stored a valid `Booking enquiry`.
- Success guarantees only that the enquiry was recorded for manual family review.
- Guest-facing confirmation states that the enquiry is not a `Confirmed booking` and that the family must follow up directly before the trip is confirmed.
- Do not promise a response channel or response time until the real follow-up routine is approved.
- V1 does not imply availability, reserve capacity, accept payment, create an account, or issue a guest-facing booking code or confirmation reference.
- An internal record identifier may exist for persistence, diagnostics, or operations, but it is not a guest-facing booking code.

### Family handoff and action

- A durably stored `Booking enquiry` is not sufficient by itself for operational handoff.
- Before V1 launch, every stored enquiry must trigger a notification to one confirmed, actively monitored family/operator destination.
- Do not choose or infer the destination. Email, Zalo, SMS, Telegram, Slack, and all other channels remain unapproved until the family confirms the real destination.
- The notification includes the submitted enquiry fields and enough internal context to locate the stored enquiry record.
- Do not introduce an admin dashboard.
- The family reviews the requested date and total guest count, then contacts the guest manually. Phone is approved; Zalo may be used only if using the submitted phone number for Zalo is operationally confirmed.
- The family's direct acceptance creates the `Confirmed booking`.
- The notification destination, responsible person, monitoring routine, whether Zalo follow-up can reliably use the submitted phone number, and any publishable response-time expectation remain required launch dependencies.

### Validation failure

- Invalid input does not create a `Booking enquiry` or trigger an operator notification.
- Server-side validation is authoritative.
- Validation errors are field-specific and suitable for Vietnamese presentation. They explain what the guest should correct without exposing internal implementation details.
- The guest may correct the submitted values and retry. No success confirmation is shown.
- A validation failure is not treated as a successful enquiry submission.
- Ticket 03 distinguishes validation failure from successful submission; Ticket 06 owns exact analytics events and properties.

### Storage and notification failure

- If the server cannot durably store the enquiry, it does not create a successful `Booking enquiry`, send an operator notification, or show success confirmation.
- Show a generic Vietnamese retry message without exposing database, provider, stack, internal error, or other implementation details.
- Preserve the guest's entered values where safely possible, allow retry, and offer the approved phone number as the fallback contact path.
- If storage succeeds but operator notification fails, keep the stored `Booking enquiry` and do not tell the guest that submission failed solely because notification failed. Success means durable recording; it does not guarantee that the family has already seen the enquiry.
- Record notification failure for operational diagnosis and provide an implementation seam for retrying or surfacing it. Notification failure must not be silently discarded.
- Do not introduce an admin dashboard or booking-status workflow, and do not create a duplicate enquiry merely to retry notification.
- The later implementation/spec must define an observable recovery path without expanding V1 into a full operations system.
- If storage may have succeeded but the client did not receive the response, apply the duplicate-submission contract.

### Duplicate submissions and retries

- Each logical form submission uses an opaque idempotency key. Retries caused by timeouts or ambiguous client/server outcomes reuse that key.
- The server creates at most one `Booking enquiry` for a given idempotency key. A matching retry returns the original successful outcome rather than creating another enquiry.
- Reusing the same key with different submitted values must not overwrite the original enquiry; treat it as a conflicting request.
- Operator notification is triggered once for the stored enquiry. Retrying notification does not create another enquiry.
- The idempotency key is internal implementation plumbing, not a guest-facing booking code, booking reference, or confirmation identifier.
- Do not deduplicate solely by guest name, phone number, requested date, guest count, IP address, user agent, or fuzzy time windows.
- A deliberate new submission receives a new idempotency key.

### Abuse and spam

- Enforce authoritative server-side validation, reasonable payload-size limits, rejection of unexpected fields, a non-visible honeypot, and basic server-side rate limiting.
- Rate limiting may use minimal technical signals such as IP address, but those signals are not guest identity and must not become `Booking enquiry` duplicate-detection rules.
- Obvious automated abuse does not create a `Booking enquiry` or trigger operator notification. Return a generic failure or retry-later response without revealing detection rules.
- V1 does not introduce accounts, OTP, manual moderation workflows, an abuse dashboard, permanent device fingerprinting, or CAPTCHA by default.
- CAPTCHA may be considered later only if observed abuse shows lighter controls are insufficient.
- Retain only enough operational information to detect repeated abuse and tune controls; avoid unnecessary retention of personal or technical data.
- Exact thresholds, event names, analytics properties, and provider-specific implementation remain implementation details or Ticket 06 concerns.

### Enquiry context and acquisition boundary

- Store a server-generated submission timestamp, submitting locale, and source page with every enquiry. Locale and source page use normalized internal values.
- Acquisition context is optional. Its absence never invalidates a `Booking enquiry`.
- Ticket 06 owns canonical attribution fields, capture rules, precedence, consent/privacy boundaries, retention, event names, and analytics properties.
- Ticket 03 permits only the minimal attribution snapshot or stable correlation identifier later defined by Ticket 06 to be associated with the enquiry.
- Do not store raw URLs, raw query strings, IP addresses, user agents, cookies, or device fingerprints on the enquiry by default.
- Keep abuse-control signals separate from customer and acquisition data.
- Do not introduce partner codes, referral codes, campaign infrastructure, or other V2.5 growth-system behavior.
- Internal record ID, idempotency key, server creation timestamp, and notification-delivery diagnostics are internal operational metadata, not guest-facing booking data or booking references.

### Unresolved launch dependencies

- Confirm one actively monitored operator-notification destination, the responsible person, and the monitoring routine.
- Confirm whether the submitted phone number can reliably be used for Zalo follow-up and whether any response-time expectation may be published.
- Define the observable notification-failure recovery mechanism during specification/implementation without adding an operations system.
- Approve pickup, child-participation, safety, operating-day, and advance-notice rules. Revisit structured fields or validation only where those real rules require it.
- Ticket 06 must define the optional attribution schema and privacy boundary before acquisition context is attached to enquiries.
- Approve the final Vietnamese validation, failure, retry, and submission-confirmation copy.

## Comments

- Resolved the minimal V1 `Booking enquiry` contract: required contact and trip fields, server-authoritative validation, durable-storage success semantics, manual family acceptance, operator handoff requirements, failure and idempotent retry behavior, lightweight abuse controls, and a narrow attribution boundary owned in detail by Ticket 06.
