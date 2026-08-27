# 06: Verify the launch-critical booking journey

**What to build:** Prove that the integrated Vietnamese mobile enquiry journey meets the public acceptance contract from anchored entry through durable storage, operator handoff, consent-gated measurement, failure recovery, and accessible receipt behavior. Keep automated and manual verification together and fix only defects within Feature 1's approved scope.

**Blocked by:** 03 — Complete the accessible Tour Detail enquiry flow; 04 — Hand stored enquiries to the operator safely; 05 — Measure the consented enquiry funnel

**Status:** ready-for-agent

Automated Playwright acceptance:

- [ ] Verify direct anchor entry, meaningful heading focus, compact tour context, approved blank field order, and no automatic first-input focus.
- [ ] Verify client validation makes no request and server validation creates or notifies nothing, with preserved values and accessible linked errors.
- [ ] Verify one valid submission creates one durable enquiry, initiates one notification, and shows an honest in-place receipt with no confirmed-booking implication.
- [ ] Verify identical same-key retry returns the original outcome without duplicate enquiry, notification, or submitted-event outcome.
- [ ] Verify changed-payload conflict, definite storage failure, ambiguous retry, and phone fallback produce only the approved observable states.
- [ ] Verify forced notification failure leaves the durable enquiry and guest receipt intact and remains recoverable without duplication.
- [ ] Verify absence/refusal of analytics consent emits no events or visit-level attribution and never blocks the journey.
- [ ] Verify consented event boundaries and properties, including analytics-delivery failure isolation.
- [ ] Verify keyboard-observable form behavior, linked error-summary navigation, and announced pending/failure/success states without binding checks to component structure or CSS pixels.

Manual launch-critical verification:

- [ ] Complete a real keyboard pass with visible focus and no traps.
- [ ] Complete a real screen-reader pass covering anchor arrival, labels, required state, errors, busy state, failure/retry, and receipt meaning.
- [ ] Review representative mobile browsers, orientations, browser zoom, and increased text size for clipping, overlap, hidden content, unusable controls, or horizontal scrolling.
- [ ] Complete a production-like operator-handoff dry run with the real monitored destination and responsible person.
- [ ] Force notification failure and confirm the documented operational recovery action without duplicate enquiry or guest outcome.
- [ ] Inspect the configured PostHog/consent behavior and confirm no form values, prohibited properties, broad autocapture, replay, person profiles, or indefinite retention.
- [ ] Confirm the public journey exposes no availability, payment, booking code, account, dashboard, booking-status workflow, or later-version behavior.

External verification dependencies:

- Tickets 03–05's listed copy, route, notification, consent, controlled-key, and retention dependencies must be resolved for the corresponding production checks.
- No separate QA ticket is required unless implementation reveals a genuinely distinct body of work.
