# 05: Measure the consented enquiry funnel

**What to build:** Add resolved V1 decision Ticket 06's approved consent-gated measurement to the working enquiry journey while proving that consent refusal and analytics failure cannot affect validation, persistence, notification, retry, or the guest receipt.

**Blocked by:** 03 — Complete the accessible Tour Detail enquiry flow

**Status:** ready-for-agent

- [ ] Emit only the approved `primary_cta_clicked`, `booking_enquiry_started`, `booking_enquiry_validation_failed`, `booking_enquiry_submitted`, and `booking_enquiry_submission_failed` hooks at their defined Feature 1 boundaries.
- [ ] Emit nothing before affirmative analytics consent and keep the complete enquiry journey available without consent.
- [ ] Emit `booking_enquiry_started` once on the first value change or submit attempt, not on visibility, anchor arrival, or focus.
- [ ] Reserve `booking_enquiry_validation_failed` for authoritative server rejection and include only invalid semantic field keys.
- [ ] Emit `booking_enquiry_submitted` only for the durable stored outcome and do not double-count a matching idempotent replay.
- [ ] Classify submission failures only as `storage` or `network_or_unknown` and keep notification failures outside PostHog.
- [ ] Use only resolved V1 decision Ticket 06's approved normalized page, locale, tour, CTA, destination, acquisition, and optional correlation values.
- [ ] Never send form values, requested trip details, idempotency keys, raw errors, URLs/query strings, or custom identifying network/device data to analytics.
- [ ] Persist optional first-touch acquisition or correlation metadata only when consent permits it; absence must never invalidate an enquiry.
- [ ] If required, extend implementation Ticket 02's persistence shape only with the minimal fields approved by resolved V1 decision Ticket 06, keeping the change backward-compatible with existing enquiry records and avoiding pre-designed analytics infrastructure.
- [ ] Disable broad click/form autocapture, session replay, identified person profiles, and cross-device identity for this journey.
- [ ] Verify through observable tests that consent gates every event, event/property shapes remain approved, replays are not double-counted, and PostHog failure cannot change the enquiry outcome.
- [ ] Add no dashboard, experiment, partner/referral system, expanded campaign model, or later-version attribution behavior.

External implementation dependencies:

- Approved Vietnamese analytics-consent wording.
- Approved bounded PostHog and enquiry/acquisition retention periods.
- Final controlled CTA/destination keys and recognized acquisition-source mapping within resolved V1 decision Ticket 06's fixed vocabulary.
