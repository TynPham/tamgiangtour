# 02: Store one valid enquiry exactly once

**What to build:** Provide an authoritative server submission boundary that validates one V1 `Booking enquiry`, durably stores it in Supabase PostgreSQL, and safely replays the original outcome for matching retries. This ticket proves persistence independently of operator-notification setup or the visitor-facing form.

**Blocked by:** None (can start immediately)

**Status:** resolved

- [x] Accept only resolved V1 decision Ticket 03's approved fields and normalized submission context; reject unexpected fields, unreasonable payloads, invalid honeypot input, and rate-limited automated abuse.
- [x] Enforce the approved name, phone, requested-date, guest-count, and notes rules at the server boundary, including `Asia/Ho_Chi_Minh` date evaluation.
- [x] Persist one valid enquiry plus only the internal operational metadata allowed by resolved V1 decision Tickets 03 and 04, using Supabase client and explicit migrations without an ORM.
- [x] Treat durable storage as the success boundary; invalid or unstored input creates no successful `Booking enquiry`.
- [x] Enforce one durable enquiry per opaque idempotency key and immutable normalized payload snapshot.
- [x] Return the original successful outcome for an identical same-key retry without creating another record.
- [x] Reject same-key reuse with different normalized values without overwriting or creating data.
- [x] Keep abuse-control signals separate from enquiry/customer and acquisition data and avoid persisting prohibited raw request context on the enquiry.
- [x] Expose safe semantic outcomes for success/replay, authoritative validation rejection, idempotency conflict, storage failure, and generic abuse/rate rejection without leaking internal errors.
- [x] Cover the authoritative server seam with high-value tests for normalization, validation, midnight/date behavior, durable storage, replay, conflict, storage failure, unexpected input, and obvious abuse.
- [x] Do not require or choose an operator-notification destination to complete this ticket; Ticket 04 owns notification delivery and recovery.
- [x] Add no availability, payment, booking code, account, dashboard, booking-status workflow, or later-version data model.

## Comments

- Implemented the authoritative POST boundary, minimal Supabase schema and atomic persistence function, normalized validation, safe outcomes, idempotent replay/conflict behavior, bounded payload handling, honeypot, and short-lived in-memory rate-limit seam. Added 21 passing Vitest cases across the HTTP and Supabase adapter seams; scoped lint, type-check, and a production Webpack build pass. The migration still needs to be applied to a configured Supabase environment with `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`; notification, analytics, and UI remain in their later tickets.
