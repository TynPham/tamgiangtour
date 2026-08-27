# V1 Website Wayfinder Map

Type: map
Status: open

## Destination

V1 is clear enough to implement as small vertical slices that produce a mobile-first, Vietnamese-first website capable of generating measurable contact leads and booking enquiries for the primary Tam Giang Lagoon tour. Vietnamese alone determines launch readiness; English remains localization-ready but secondary and non-blocking.

The route is complete when the V1 feature sequence, product contracts, content inputs, dependencies, and likely test seams are explicit without deciding or implementing any V1.1-or-later capability.

## Notes

- Scope is strictly Version 1 in `docs/PRODUCT_PLAN.md`; Version 0 inputs may be treated only as prerequisites needed to publish V1.
- V1's primary audience is Vietnamese travelers. Phone and Zalo are required launch channels; WhatsApp is optional and must not block launch.
- Vietnamese canonical routes live under `/vi`; `/` redirects to `/vi`. English uses `/en` only when the affected pages are complete, approved, and publishable. Missing English never blocks V1.
- Preserve the fixed choices in `docs/TECH_STACK.md`: Next.js 16 App Router, TypeScript, Tailwind CSS, shadcn/ui, React Hook Form, Zod, Supabase, Markdown/MDX, PostHog, Search Console, Vercel, Vitest, and Playwright.
- The repository is currently the stock single-route Next.js starter. It has no product UI, content model, database integration, analytics, or ADRs; `CONTEXT.md` contains the current domain glossary.
- Work decision tickets with `grill-with-docs`; apply `domain-modeling` whenever business language is resolved. Create `CONTEXT.md` or ADRs lazily, only when the applicable skill criteria are met.
- Use `.scratch/v1-website/feature-map.md` as the high-level vertical-slice route. Feature-specific behavior belongs in later grill/spec/ticket cycles, not in this map.
- Do not implement code while working this map.

## Decisions so far

- [Approve the V1 launch inputs](issues/01-approve-v1-launch-inputs.md): Classified the real V1 sources, explicit launch blockers, optional omissions, and the two-role approval/evidence model without inventing missing facts.
- [Define the V1 locale and content contract](issues/02-define-bilingual-url-and-content-contract.md): Made Vietnamese the sole V1 launch language while preserving explicit, approval-driven `/en` localization without fallback or launch blocking.
- [Define the V1 booking enquiry contract](issues/03-define-booking-enquiry-contract.md): Defined the minimal enquiry fields, server-authoritative validation, durable-storage success boundary, manual operator handoff, idempotent retries, lightweight abuse controls, and Ticket 06-owned acquisition context without introducing booking-system behavior.
- [Choose the V1 editable content boundary](issues/04-choose-v1-editable-content-boundary.md): Assigned localized editorial copy to Markdown/MDX, canonical single-tour facts and curated social proof to small typed repository sources, and visitor-generated enquiries alone to Supabase persistence.

## Not yet specified

- Detailed behavior, edge cases, and acceptance examples for each feature remain fog until the remaining cross-cutting content, booking, and journey decisions are resolved.
- Exact visual art direction and responsive composition should be clarified within the relevant feature grill, using real available media rather than an abstract design-system exercise.
- Exact validation cases, failure/retry behavior, analytics properties, and test cases should graduate into feature specs after their public seams are agreed.
- The final split between reusable page sections and feature-local components should emerge from the first two slices rather than being designed upfront.

## Out of scope

- V1.1 conversion experiments: sticky CTA, availability messaging, campaign landing pages, A/B tests, and conversion-specific refinements.
- V1.5 PWA work: installability, service workers, offline fallback, cached pages, and push notifications.
- V2 booking-platform work: availability, capacity, slots, booking codes/status workflows, My Trip, customer accounts, authentication, and an admin dashboard.
- V2.5 growth systems: partners, referral codes, referral reporting, campaign infrastructure, and automated review flows.
- V3 payment and operations: deposits, online payments, refunds, revenue reporting, assignments, and operational automation.
- V4 scale features: multiple tours/boats/operators/meeting points, roles, CRM, loyalty, native apps, queues, and advanced infrastructure.
- A CMS, custom Maps API experience, AI chatbot, global client-state library, separate REST API, ORM, microservices, Redis, or other speculative architecture.
