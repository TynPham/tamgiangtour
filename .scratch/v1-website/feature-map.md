# V1 Website Feature Map

## V1 completion definition

V1 is complete when its primary Vietnamese audience can use approved Vietnamese content to understand the primary tour, judge its price/itinerary/suitability, see credible photos and reviews, resolve common concerns, contact the family operator by phone or Zalo, open the correct Google Maps destination, submit a simple booking enquiry, and receive an honest submission confirmation. English content is secondary and never blocks V1 launch.

The operator receives a durable, server-validated enquiry through the agreed V1 handoff. PostHog records the agreed page, CTA, and booking-funnel events plus the minimum lawful acquisition context. The site has correct basic metadata/indexing support, functioning CTAs, real media and social proof, an observable mobile critical journey, and a localization-ready content boundary.

V1 does not require WhatsApp and does not promise availability, instant confirmation, a booking code/status portal, payment, customer accounts, a dashboard, referral infrastructure, or PWA behavior.

## Vertical slices

### Feature 1 — Submit a minimal Vietnamese booking enquiry

A visitor reaches a minimal real offer in approved Vietnamese, starts an enquiry, submits valid contact/trip details through a server boundary, persists the enquiry in Supabase, and sees confirmation wording that matches the operator's actual follow-up process. Capture the agreed acquisition context and essential funnel events in the same slice while keeping customer-facing content outside the components.

Why first: it proves the revenue journey and the highest-risk integration end to end before richer presentation work accumulates.

Likely future test seams:

- Browser journey: real offer → booking form → successful confirmation.
- Server boundary: valid input creates one durable enquiry; invalid input does not.
- Confirmation contract: the UI never implies an instantly confirmed tour unless that is explicitly decided.

### Feature 2 — Contact the operator or navigate to the meeting point

A visitor can use the approved phone, confirmed Zalo, and Google Maps actions from a mobile-friendly contact/directions experience. Each action opens the correct target and records the agreed event. WhatsApp is included only if an actively monitored account is approved later.

Likely future test seams:

- Browser-visible contact actions expose the approved destinations.
- Analytics boundary receives the canonical contact and Maps event names.

### Feature 3 — Decide whether the primary tour fits

A visitor can evaluate the tour in Vietnamese through clear price, duration, timing, meeting point, itinerary, experiences, inclusions/exclusions, suitability, policies, and authentic photos/video, with a direct path to booking or contact. English may ship later page by page when complete and approved.

Likely future test seams:

- Content contract exposes required Vietnamese tour facts while keeping locale-independent values canonical.
- Browser journey preserves a clear booking/contact path at mobile widths.

### Feature 4 — Trust the family operator and resolve objections

A visitor can see the family/local story, real reviews and social proof, safety information, and practical FAQ answers, then continue to booking, contact, or Maps without losing context. Separate pages versus sections should follow the approved mobile journey rather than an assumed sitemap.

Likely future test seams:

- Required trust content is present in approved Vietnamese.
- FAQ and review interactions remain keyboard- and screen-reader-usable where interactive.

### Feature 5 — Close the V1 launch loop

A production review demonstrates that every V1 Vietnamese route is mobile-usable, reachable, correctly indexed, instrumented according to the measurement contract, and connected to the real contact, Maps, and enquiry destinations. The root redirect works, and no incomplete English route is public or indexable. This closes gaps; it does not introduce V1.1 optimization work.

Likely future test seams:

- Playwright critical journeys for booking, contact, locale routing, and Maps.
- Server-side booking validation integration seam.
- Manual browser review for responsive layout, real media, accessibility, and metadata/Search Console setup.

## Recommended implementation sequence

1. Submit a minimal Vietnamese booking enquiry.
2. Contact the operator or navigate to the meeting point.
3. Decide whether the primary tour fits.
4. Trust the family operator and resolve objections.
5. Close the V1 launch loop.

Every slice should pass through `grill-with-docs` → `to-spec` → `to-tickets` → implementation with agreed TDD seams → `code-review`. Each slice should remain independently observable and avoid creating infrastructure solely for later versions.
