# 03: Complete the accessible Tour Detail enquiry flow

**What to build:** Let a Vietnamese mobile visitor enter the anchored enquiry section on Tour Detail, submit the approved fields through Ticket 02's real server boundary, and receive honest in-place validation, pending, success, failure, and safe-retry behavior.

**Blocked by:** 02 — Store one valid enquiry exactly once

**Status:** ready-for-agent

- [ ] Keep the enquiry section always present near the end of Tour Detail with a stable anchor, compact approved tour context, and no modal, drawer, separate route, or multi-step flow.
- [ ] Focus the section heading on anchor activation without focusing an input or opening the mobile keyboard; preserve normal hash, Browser Back, and current-page entered-value behavior.
- [ ] Render blank fields in the approved mobile order: requested date, total guest count, guest name, phone, and optional notes, with no additional booking fields.
- [ ] Use approved Vietnamese locale-dictionary copy only; do not invent labels, helper text, errors, status messages, privacy text, or receipt wording.
- [ ] Apply client validation interaction rules without weakening the authoritative server contract.
- [ ] On client failure, make no server request, preserve values, show associated inline errors, and focus a linked error summary.
- [ ] On server rejection, preserve values, map only safe semantic errors, create no enquiry or notification, and focus the linked error summary.
- [ ] Permit only one request in flight, prevent edits and repeated submission while pending, keep values visible, and announce the busy state.
- [ ] After durable success or a matching replay, replace the form with an in-place receipt that identifies requested date and guest count only as preferences and clearly distinguishes a `Booking enquiry` from a `Confirmed booking`.
- [ ] Preserve values after storage or network/unknown failure and implement the approved same-key retry rules; never rotate the key automatically while the original outcome is uncertain.
- [ ] On definite storage failure, restore editing and offer retry plus the approved phone fallback; on ambiguous failure, make neither a success nor definite-storage-failure claim.
- [ ] Present safe idempotency-conflict behavior without exposing the key, internal identifiers, or implementation details.
- [ ] Meet resolved V1 decision Ticket 05's form and anchor accessibility behavior: persistent labels, programmatic relationships, visible focus, announced states, useful input modes/autofill, keyboard operation, zoom/text resilience, and no color-only meaning.
- [ ] Cover the browser seam with high-value tests for anchor entry, field order, client and server validation, pending exclusion, durable receipt, storage failure, ambiguous same-key retry, conflict, phone fallback, and announced state changes.
- [ ] Keep availability, payment, booking codes, accounts, dashboards, booking status, and later-version behavior absent.

External implementation dependencies:

- Approved public Tour Detail slug and compact tour context.
- Approved Vietnamese form, validation, pending, failure, conflict, receipt, privacy-notice, and phone-fallback copy.
