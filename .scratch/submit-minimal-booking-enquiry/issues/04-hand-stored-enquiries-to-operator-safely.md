# 04: Hand stored enquiries to the operator safely

**What to build:** After Ticket 02 durably stores an enquiry, deliver one actionable notification to the family's confirmed operational destination and make delivery failure observable and recoverable without changing the guest's success outcome or creating another enquiry.

**Blocked by:** 02 — Store one valid enquiry exactly once

**Status:** resolved

- [x] Keep notification delivery strictly after durable persistence and separate from Ticket 02's independently completable storage boundary.
- [x] Send the submitted enquiry fields and enough private internal context for the operator to locate the stored record.
- [x] Trigger the initial notification once per stored enquiry; a matching form retry must not send another notification.
- [x] Retain the stored enquiry and successful guest outcome when notification delivery fails.
- [x] Record minimal delivery diagnostics that make failure observable without copying them into PostHog.
- [x] Provide a documented recovery/retry action tied to the stored enquiry; retrying delivery must never create another enquiry or guest-facing receipt.
- [x] Keep the destination private in deployment/integration configuration and out of public content and enquiry fields.
- [x] Verify with the notification integration seam that success, forced failure, and recovery preserve one enquiry and one guest outcome.
- [x] Complete a production-like dry run showing that the monitored destination receives enough context to locate the enquiry and contact the guest manually.
- [x] Do not add an admin dashboard, booking-status workflow, notification-management system, or later-version operations behavior.

Operational notes:

- Telegram is monitored by the remote operator/developer.
- Notification failures must be recovered from the stored `Booking enquiry` and notification-delivery state.
- Recovery must never resubmit the guest form or create another enquiry.
- Telegram delivery has been verified through a production-like dry run.
- Zalo remains a separate follow-up channel to implement next.

## Comments

- Implemented a channel-agnostic operator-notification handoff with Telegram as the first adapter. Supabase now atomically claims one delivery per enquiry/channel and records attempts, delivered/failed/unknown state, provider message ID, and safe error codes. Matching booking replay never enters notification delivery. A trusted server-side recovery action retries by calling `deliverStoredEnquiry(enquiryId)`; only recorded `failed` deliveries can be reclaimed automatically, while ambiguous `unknown` outcomes require manual investigation to avoid duplicate messages.
- Production-like Telegram delivery, duplicate-safe replay, recorded failure, independent retry, guest-success isolation, and provider delivery state were verified. Telegram is monitored by the remote operator/developer; Zalo remains a separate follow-up channel to implement next.
