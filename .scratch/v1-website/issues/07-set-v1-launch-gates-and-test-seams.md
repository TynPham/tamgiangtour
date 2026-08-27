# Set the V1 launch gates and future test seams

Type: grilling
Status: resolved
Blocked by: 04, 05, 06

## Question

What observable acceptance gates prove V1 works on mobile in both languages, exposes correct pricing/contact/Maps information, persists and confirms booking enquiries, records agreed analytics, presents real trust content, and meets basic SEO/accessibility expectations?

Name only high-value public seams for later Vitest, Playwright, and manual browser review. Do not write tests, chase coverage targets, or bind the plan to internal component structure.

## Answer

### Vietnamese mobile routes and navigation

- `/` redirects predictably to `/vi`.
- Home, the approved Vietnamese Tour Detail URL, and `/vi/lien-he` load successfully and are directly reachable.
- Header and footer navigation reach Home, Tour Detail, and Contact from every page.
- Tour and Contact anchors land on meaningful labeled sections.
- Browser Back preserves expected navigation.
- Approved primary and secondary CTAs lead to the correct page, anchor, phone/Zalo destination, or Google Maps destination.
- Core content follows the approved vertical mobile reading order with no horizontal scrolling, clipped text, overlapping controls, or important content hidden behind navigation.
- Core actions remain usable with touch, keyboard, browser zoom, and increased text size.
- Optional omitted content leaves no empty headings, dead links, or blank routes.
- Draft or incomplete English routes are not public or indexable; missing English never fails the V1 launch gate.
- Reviews, FAQ, Gallery, Directions, and Booking do not require standalone V1 routes.

### Approved content, contact, and Maps

- Every published Vietnamese page is complete and approved under Ticket 04's publication boundary.
- The public offer uses only approved values for brand, positioning, tour identity and format, canonical VND price, duration, timing, itinerary, inclusions/exclusions, suitability, safety, and policies.
- Required unresolved facts block the affected page. Optional unapproved facts or sections are omitted.
- Conditional or illustrative experiences remain visibly conditional and are never presented as guaranteed.
- Home previews and Tour Detail reference the same canonical facts without conflicting values.
- Phone displays and opens `0332 279 474`; the superseded promotional-banner number appears nowhere.
- Zalo appears only after its destination and monitoring are operationally approved, and every published Zalo action opens the verified destination.
- WhatsApp remains absent unless explicitly approved later.
- Contact and Tour Detail use the canonical approved Maps place, URL, and coordinates.
- The family confirms that this destination is the normal boarding point before launch.
- Approved address, parking, travel-time, and pickup facts remain consistent wherever referenced; every published Maps action opens the verified destination.
- Public output contains no placeholder price or contact value, invented directions fact, unapproved operational claim, or stale superseded business value.

### Booking enquiry validation, persistence, and outcomes

- The form exposes only Ticket 03's approved required and optional fields.
- Browser validation may assist, but authoritative server validation enforces the same approved rules.
- Invalid input creates no `Booking enquiry`, triggers no operator notification, shows no success state, and provides correctable field-specific Vietnamese errors.
- A valid submission shows success only after one durable enquiry record exists.
- Success clearly states that the enquiry awaits manual family review and is not a `Confirmed booking`.
- Success never implies availability, reservation, payment, booking code, account, or status workflow.
- Matching retries with the same idempotency key return the original successful outcome without another record or notification.
- Conflicting reuse of an idempotency key does not overwrite the original record.
- Storage failure shows no success, preserves safely retained values, offers retry and the approved phone fallback, and exposes no internal error details.
- Notification failure after storage retains the enquiry, does not create a duplicate, and does not falsely report storage failure to the guest.
- Analytics failure or lack of consent never prevents validation, storage, notification, or guest confirmation.
- Honeypot, payload limits, unexpected-field rejection, and basic rate limiting prevent obvious automated abuse from creating enquiries or notifications.
- No availability, payment, booking-code, account, dashboard, or V2 behavior is exposed.

### Operator-notification readiness

- One real notification destination is approved and configured before launch.
- A named responsible person actively monitors it, and the monitoring routine and manual follow-up method are documented.
- A production-like dry run proves that one stored enquiry triggers one notification with enough context to locate the stored record.
- The operator can locate the enquiry and contact the guest manually through an approved method.
- Notification retries do not create another enquiry or duplicate guest-facing success.
- A forced notification failure is observable and has a documented recovery action; notification failure is never silently discarded.
- Notification observability remains separate from PostHog analytics.
- The notification destination remains private deployment/integration configuration.
- No dashboard or booking-status workflow is required.
- A public response-time promise is optional and is omitted unless the family deliberately approves one.

### Trust, media, and reviews

- Home and Tour Detail use only real, approved media referenced through the authoritative asset inventory.
- Every published asset has verified source, publication permission/consent, restrictions, and approved alt text where meaningful.
- No stock imagery impersonates the family, hosts, guests, or actual experience.
- Family/host names and portraits require explicit approval. Identifiable guest media requires verified promotional-use consent.
- Ru Cha, lagoon-hut, fishing-result, visible-sunset, SUP-participation, and specific-seafood imagery never implies a guarantee beyond approved operational facts.
- Required hero and core experience media are present and usable on mobile. Optional video, guest imagery, and meeting-point photography may be omitted cleanly.
- Published family/local claims are factual and approved; no invented history, experience, heritage, or generational claims appear.
- At least one real, verified, attributable social-proof source is publicly present before launch.
- Every displayed excerpt, attribution, rating, count, and source link is traceable and approved.
- Aggregate rating/count snapshots include a verified source and capture date; no fabricated or stale unattributed social proof appears.
- Required Vietnamese FAQ and trust copy is approved and introduces no unapproved operational promises.
- Development may use an empty or hidden review structure, but public V1 launch requires the approved social-proof gate to pass.

### Analytics consent and event behavior

- Visitors can browse, contact the family, and submit a valid `Booking enquiry` without accepting analytics.
- Before affirmative analytics consent, emit no PostHog events, create no analytics correlation identifier, and retain no visit-level attribution.
- After consent, emit only Ticket 06's approved eight canonical custom events with approved normalized properties.
- Disable broad click autocapture, broad form autocapture, and session replay. Do not create identified person profiles, capture form values, or create cross-device identity.
- `page_viewed` uses normalized page keys only; do not send raw URL/query data.
- Contact and Maps actions emit only their semantic event and are not double-counted as generic CTA events.
- Validation failure, storage failure, and durable submission remain distinct outcomes. `booking_enquiry_submitted` fires only after durable storage succeeds.
- Consent refusal/absence and analytics delivery failure never affect validation, durable persistence, operator notification, or guest confirmation.
- Optional first-touch acquisition persists only when consent permits it and uses only Ticket 06's approved normalized values.
- Abuse-control signals and notification diagnostics remain separate from PostHog.
- Approved Vietnamese privacy/analytics-consent wording is present.
- Bounded analytics retention and bounded enquiry/acquisition retention are configured; neither dataset is retained indefinitely.
- An analytics dashboard, experiments, partner/referral infrastructure, and expanded campaign attribution are not launch requirements.

### SEO and indexing

- `/vi`, the approved Vietnamese Tour Detail URL, and `/vi/lien-he` return indexable production pages with approved Vietnamese titles and descriptions.
- Every published Vietnamese page has exactly one correct self-referencing canonical URL.
- `/` redirects to `/vi` and is not indexed as a separate content page.
- The production sitemap contains only publicly published canonical routes.
- Draft, preview, incomplete, and unapproved content is excluded from the production sitemap and public indexing.
- Do not expose `/en` routes or emit English `hreflang` until the corresponding English page is complete, approved, and public.
- When no English equivalent exists, the Vietnamese page remains self-canonical without a fabricated alternate.
- If English is published later, apply Ticket 02's reciprocal `vi`/`en` hreflang contract and Vietnamese `x-default`.
- Internal navigation links resolve to canonical URLs without broken links or accidental redirect chains.
- Use the approved public tour slug. If a previously published slug is replaced, redirect the old route to the current canonical route.
- Robots directives allow intended Vietnamese production pages and prevent draft/preview indexing.
- Search Console ownership is verified, and the production sitemap is submitted or ready for submission.
- Advanced structured-data/schema work beyond the agreed basic SEO scope, SEO content expansion, ranking targets, and advanced optimization are not V1 launch gates.

### Accessibility

- The full Home → Tour Detail → enquiry/contact/Maps journey is keyboard-operable without traps.
- A working skip-to-main link is present, focus is visibly indicated, and focus order follows the approved reading order.
- Route changes and direct anchors land on meaningful page or section headings.
- Use appropriate header, navigation, main, section, form, and footer semantics; heading hierarchy remains sequential and meaningful.
- Mobile navigation has an accessible name, correct expanded/collapsed state, and predictable keyboard dismissal.
- Every field has a persistent label; required state is communicated accessibly; helper text and errors are programmatically associated.
- Failed validation provides inline field errors and a focused error summary linked to affected fields.
- Loading, failure, and successful enquiry receipt are announced appropriately.
- Touch targets are comfortably usable. Browser zoom and increased text size do not cause loss of information or functionality.
- Text, controls, focus indicators, and meaningful graphics meet WCAG AA contrast expectations.
- Meaningful images have approved useful alt text; decorative images are ignored by assistive technology; meaning is never conveyed by color alone.
- No core action depends on hover, horizontal swipe, drag, autoplay, animation, or gesture-only interaction. Motion respects reduced-motion preferences.
- Phone, Zalo, Maps, and other external destinations use descriptive visible labels.
- Analytics-consent controls are keyboard- and screen-reader-usable, and declining analytics leaves the complete core journey available.
- Automated accessibility checks may assist, but real keyboard and screen-reader passes are required.
- Tests assert observable behavior rather than CSS pixels or internal component structure.

### High-value future Vitest seams

- Publication contract: required Vietnamese content/facts block publication when incomplete; optional sections and unapproved English pages are omitted; conditional facts cannot become guarantees.
- Booking boundary: approved normalization and validation cases accept valid input and reject invalid, unexpected, or obvious-abuse input without creating an enquiry.
- Persistence/idempotency boundary: a valid logical submission creates one durable enquiry; matching retries reuse its outcome; conflicting keys do not overwrite it; notification retry does not duplicate it.
- Measurement boundary: consent gates every analytics event, only approved event/property shapes pass, acquisition normalization preserves current-visit first touch, and analytics failure cannot change enquiry persistence.
- Locale/SEO contract: published route metadata produces the correct canonical, sitemap, and approved-equivalent hreflang behavior without exposing incomplete English content.

### High-value future Playwright seams

- Vietnamese mobile journey: root redirect → Home → Tour Detail → Contact and back, including header/footer navigation, anchors, Browser Back, and absence of thin standalone routes.
- Enquiry journey: first interaction, accessible validation failure, correction, durable successful submission, honest receipt wording, and no booking-system promises.
- Failure/retry journey: storage failure retains recoverable input and exposes retry/phone fallback; an ambiguous retry does not create a second enquiry.
- Contact journey: phone, approved Zalo, and Maps actions expose and open the canonical destinations without duplicate semantic analytics events.
- Consent journey: decline/absence emits no analytics and never blocks enquiry; consent enables only the approved events/properties; analytics delivery failure still permits successful enquiry storage and confirmation.
- Indexing/browser contract: canonical links, sitemap-visible routes, draft-English absence, and public navigation targets match the approved locale contract.
- Keyboard/accessibility journey: skip link, menu state/dismissal, focus order, anchor focus, form labels, linked error summary, and announced status changes work through observable browser behavior.

### Manual browser and production review gates

- Review the complete journey on representative mobile devices/orientations with browser zoom and increased text size; confirm no clipping, overlap, hidden content, or unusable touch actions.
- Complete real keyboard and screen-reader passes, plus contrast and reduced-motion review.
- Verify approved Vietnamese copy, information order, conditional wording, real media quality/alt text, rights/consent evidence, family claims, FAQ, and attributable social proof.
- Open the production phone, approved Zalo, and every Maps action on real devices; confirm the meeting point and directions with the family.
- Perform a production-like enquiry dry run through durable storage and the monitored operator destination; force notification failure and verify the documented recovery path without duplication.
- Verify consent controls, disabled autocapture/session replay/person profiles, bounded retention settings, and absence of guest form values in analytics.
- Inspect production canonicals, robots directives, sitemap contents, unpublished English behavior, redirects, and Search Console ownership/submission readiness.

### Remaining V1 launch blockers

- Approve the final brand, positioning, tour name/slug, tour format, canonical VND price, duration/timing, repeatable itinerary, inclusions/exclusions, suitability/safety, operating, child, pickup, and policy facts and required Vietnamese copy.
- Confirm the approved Maps destination is the normal boarding point and approve address, parking, travel-time, and pickup guidance.
- Operationally approve Zalo and its monitoring; keep the superseded phone number and unapproved WhatsApp absent.
- Approve the required real media inventory, rights/consent, alt text, factual family/host story, Vietnamese FAQ/trust copy, and at least one verified attributable social-proof source.
- Approve and configure one monitored operator-notification destination, named owner, monitoring routine, production-like dry run, and observable failure-recovery action.
- Approve final Vietnamese navigation, CTA, validation/failure/success, enquiry privacy, and analytics-consent wording.
- Approve bounded enquiry/acquisition and analytics retention periods through operational/legal review.
- Finalize controlled CTA/destination/acquisition mappings and production analytics/consent configuration within Ticket 06's contract.
- Complete implementation and verification of the approved V1 routes, content boundary, Supabase enquiry persistence, analytics isolation, SEO/indexing, and accessibility gates.
- English translation, QA, and publication remain non-blocking. WhatsApp, optional video/guest imagery/meeting-point photography, advanced SEO, dashboards, experiments, referrals, payments, availability, accounts, booking codes/status, and all V1.1+ capabilities remain outside the V1 gate.

## Comments

- Resolved observable V1 launch acceptance across Vietnamese mobile navigation, approved content/destinations, durable enquiry behavior, operator handoff, trust evidence, consent-gated measurement, SEO/indexing, and accessibility, with only high-value Vitest, Playwright, and manual review seams.
