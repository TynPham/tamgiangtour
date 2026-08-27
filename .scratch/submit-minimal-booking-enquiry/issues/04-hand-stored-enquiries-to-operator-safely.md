# 04: Hand stored enquiries to the operator safely

**What to build:** After Ticket 02 durably stores an enquiry, deliver one actionable notification to the family's confirmed operational destination and make delivery failure observable and recoverable without changing the guest's success outcome or creating another enquiry.

**Blocked by:** 02 — Store one valid enquiry exactly once

**Status:** ready-for-agent

- [ ] Keep notification delivery strictly after durable persistence and separate from Ticket 02's independently completable storage boundary.
- [ ] Send the submitted enquiry fields and enough private internal context for the operator to locate the stored record.
- [ ] Trigger the initial notification once per stored enquiry; a matching form retry must not send another notification.
- [ ] Retain the stored enquiry and successful guest outcome when notification delivery fails.
- [ ] Record minimal delivery diagnostics that make failure observable without copying them into PostHog.
- [ ] Provide a documented recovery/retry action tied to the stored enquiry; retrying delivery must never create another enquiry or guest-facing receipt.
- [ ] Keep the destination private in deployment/integration configuration and out of public content and enquiry fields.
- [ ] Verify with the notification integration seam that success, forced failure, and recovery preserve one enquiry and one guest outcome.
- [ ] Complete a production-like dry run showing that the monitored destination receives enough context to locate the enquiry and contact the guest manually.
- [ ] Do not add an admin dashboard, booking-status workflow, notification-management system, or later-version operations behavior.

External implementation dependencies:

- The family must approve the real operator-notification destination.
- A responsible person must be named and must actively monitor that destination.
- The monitoring routine, manual follow-up method, and failure-recovery routine must be documented.
- The actual delivery provider/setup must be confirmed externally; this ticket must not choose or invent one merely to proceed.
