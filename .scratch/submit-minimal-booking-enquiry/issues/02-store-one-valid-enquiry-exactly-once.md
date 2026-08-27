# 02: Store one valid enquiry exactly once

**What to build:** Provide an authoritative server submission boundary that validates one V1 `Booking enquiry`, durably stores it in Supabase PostgreSQL, and safely replays the original outcome for matching retries. This ticket proves persistence independently of operator-notification setup or the visitor-facing form.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] Accept only resolved V1 decision Ticket 03's approved fields and normalized submission context; reject unexpected fields, unreasonable payloads, invalid honeypot input, and rate-limited automated abuse.
- [ ] Enforce the approved name, phone, requested-date, guest-count, and notes rules at the server boundary, including `Asia/Ho_Chi_Minh` date evaluation.
- [ ] Persist one valid enquiry plus only the internal operational metadata allowed by resolved V1 decision Tickets 03 and 04, using Supabase client and explicit migrations without an ORM.
- [ ] Treat durable storage as the success boundary; invalid or unstored input creates no successful `Booking enquiry`.
- [ ] Enforce one durable enquiry per opaque idempotency key and immutable normalized payload snapshot.
- [ ] Return the original successful outcome for an identical same-key retry without creating another record.
- [ ] Reject same-key reuse with different normalized values without overwriting or creating data.
- [ ] Keep abuse-control signals separate from enquiry/customer and acquisition data and avoid persisting prohibited raw request context on the enquiry.
- [ ] Expose safe semantic outcomes for success/replay, authoritative validation rejection, idempotency conflict, storage failure, and generic abuse/rate rejection without leaking internal errors.
- [ ] Cover the authoritative server seam with high-value tests for normalization, validation, midnight/date behavior, durable storage, replay, conflict, storage failure, unexpected input, and obvious abuse.
- [ ] Do not require or choose an operator-notification destination to complete this ticket; Ticket 04 owns notification delivery and recovery.
- [ ] Add no availability, payment, booking code, account, dashboard, booking-status workflow, or later-version data model.
