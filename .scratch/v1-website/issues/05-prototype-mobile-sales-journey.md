# Prototype the V1 mobile sales journey and page boundaries

Type: prototype
Status: resolved
Blocked by: 01, 02, 03

## Question

What is the smallest mobile information architecture that lets a Vietnamese or international visitor understand the offer, evaluate trust and fit, book or contact the operator, and get directions without dead ends or duplicated pages?

Create a low-fidelity route/flow artifact for human review. Decide whether Reviews, FAQ, Gallery, and Directions need standalone routes or can be sections reached through clear navigation. Preserve the must-have Contact page and Tour Detail page, and avoid V1.1 conversion patterns.

## Answer

### Core V1 route skeleton

```text
/                                  → redirect to /vi
/vi                                → Home
/vi/{approved-tour-slug}           → Tour Detail
/vi/lien-he                        → Contact
```

- Keep the exact public tour slug unresolved until the final tour name is approved.
- Do not expose `/en` routes until the corresponding English pages are complete and approved.
- Do not add breadcrumbs for this flat V1 hierarchy.
- Preserve standard browser navigation and direct linking.
- Booking placement remains unresolved as the next decision.
- Reviews, FAQ, Gallery, and Directions remain unresolved; this route skeleton does not imply standalone pages for them.

### Booking enquiry placement

- Embed the single V1 enquiry form on Tour Detail as a dedicated high-intent section near the end of the page, after the visitor has enough information to evaluate the offer and key policies.
- Give the section a stable anchor so CTAs can deep-link directly to it.
- Keep enough nearby tour context that a direct anchor visit still makes clear which experience the guest is enquiring about.
- Do not duplicate the form on Home or Contact, create a separate Booking route, use a modal or drawer, or create a multi-step flow.
- Keep validation, loading, failure, retry, and successful-receipt states at the form location.
- Successful receipt clearly states that this is a `Booking enquiry`, not a `Confirmed booking`.
- Do not create a confirmation route, guest-facing booking reference, or booking-status page.
- If submission cannot complete, retain Ticket 03's approved phone fallback.

### Home and Tour Detail content boundary

**Home owns orientation:** approved brand/positioning, real hero media, a compact primary-tour introduction, a small set of approved decision facts such as price and duration, brief experience highlights, a compact trust preview using only approved family/media/review evidence, and clear paths to Tour Detail and Contact.

Home does not contain the full itinerary, full policy set, full FAQ, full gallery, full directions guide, or the `Booking enquiry` form.

**Tour Detail owns evaluation and action:** tour identity and summary; canonical price, duration, timing, and meeting-point facts; full itinerary and experience detail; inclusions/exclusions; suitability and safety; policies; real media; family context; reviews/social proof; FAQ; directions context; the anchored `Booking enquiry` section near the end; and Contact and Maps escape paths where relevant.

- Home previews reference the same canonical content sources. Do not maintain duplicate business facts between Home and Tour Detail.
- Missing optional previews disappear cleanly without empty headings or dead CTAs.
- Missing required facts block the affected page rather than producing filler.
- Home answers: “What is this, why should I consider it, and where do I learn more?”
- Tour Detail answers: “Does this fit me, what exactly is offered, and how do I enquire?”

### Embedded supporting sections

- Keep Reviews as a focused Tour Detail section using only verified attributable content and a public source link where available. Home may show one compact approved proof item.
- Keep FAQ as an ordered Tour Detail section, placing questions near the decision/preparation path they support. Do not create a standalone FAQ route.
- Keep Gallery as a curated Tour Detail media section. Home may show only a compact preview, and media must not imply unapproved itinerary guarantees. Do not create a standalone Gallery route.
- Keep the full practical directions experience on Contact, combining phone, Zalo, meeting point, Google Maps, parking, travel-time guidance, and pickup facts when approved.
- Tour Detail shows only a concise meeting-point summary with paths to Maps and Contact. Do not create a standalone Directions route.
- Give major Tour Detail and Contact sections stable anchors for direct linking. Final public anchor wording may wait for approved Vietnamese terminology.
- Optional media or FAQ items disappear cleanly. Missing required reviews, directions facts, or core media remain launch dependencies; do not create empty standalone pages for missing content.
- Reviews, FAQ, and Gallery support evaluation of the single V1 tour and stay in its main mobile reading path. Directions naturally belongs with the required Contact page, avoiding thin pages and duplicated content.

### Navigation and CTA hierarchy

**Primary navigation:** Brand/Home links to Home; `Trải nghiệm` links to Tour Detail; `Liên hệ` links to Contact. On mobile, use a compact accessible menu when the labeled destinations do not fit beside the brand.

The footer repeats Home, Tour Detail, Contact, the approved phone, approved Zalo, and Maps.

- Reviews, FAQ, Gallery, Directions, and Booking are not top-level navigation items.
- Do not introduce bottom navigation, breadcrumbs, or a sticky CTA.

**Page-level actions:**

- Home primary: view the primary experience on Tour Detail. Home secondary: Contact.
- Tour Detail primary: jump to the `Booking enquiry` section. Secondary: phone and approved Zalo. Contextual: open Maps from meeting-point content.
- Contact primary: call the approved phone number. Secondary: approved Zalo. Directions action: open the verified Google Maps destination.

- Maintain one dominant primary action per page context; do not repeat competing CTA clusters after every section.
- Exact Vietnamese CTA labels remain approval-gated copy.
- If Zalo is not operationally approved, omit its action rather than showing a dead destination. Zalo operational approval remains a V1 launch dependency.
- Navigation and CTA targets have visible labels, keyboard focus, and mobile-appropriate touch targets.

### Mobile reading hierarchy

**Home:**

1. Brand/positioning hero with real media.
2. Compact approved tour facts.
3. Experience highlights.
4. Compact family/review trust preview.
5. Primary path to Tour Detail and secondary path to Contact.
6. Footer contact/navigation links.

**Tour Detail:**

1. Tour identity, summary, real lead media, and enquiry-anchor CTA.
2. Decision facts: price, duration, timing, format, and meeting point.
3. Experience overview and itinerary.
4. Inclusions/exclusions.
5. Suitability and safety.
6. Curated media and factual family context.
7. Verified reviews/social proof.
8. Policies.
9. FAQ.
10. Concise meeting-point/directions summary with Maps and Contact paths.
11. Anchored `Booking enquiry` form with in-place validation, loading, failure, retry, and success states.
12. Footer contact/navigation links.

**Contact:**

1. Short purpose/context statement.
2. Phone primary action and approved Zalo secondary action.
3. Meeting-point identity and verified Maps action.
4. Approved address, parking, travel-time, and pickup guidance.
5. Path back to Tour Detail or its enquiry anchor.
6. Footer navigation.

- Use one vertical mobile reading flow; do not require horizontal swiping for core content.
- Keep heading hierarchy sequential and DOM order aligned with visual and screen-reader order.
- Avoid auto-rotating carousels.
- Optional missing sections collapse completely. Required missing content remains a launch dependency.
- Direct anchor visits preserve a clear heading and enough nearby context to orient the visitor.

### Primary mobile visitor journey

```text
Discovery
  ↓
Home — understand the offer
  ├─→ Tour Detail — evaluate fit and trust
  │     ├─→ Booking enquiry — submit in place
  │     │     ├─→ Success — recorded for manual review
  │     │     └─→ Failure — correct/retry or call
  │     ├─→ Phone / approved Zalo
  │     └─→ Maps / Contact
  └─→ Contact — call, approved Zalo, or directions
        └─→ Tour Detail / enquiry anchor
```

### Dead-end prevention

- Every page retains Home, Tour Detail, and Contact navigation.
- Contact links back to Tour Detail and its enquiry anchor.
- Validation failure keeps values, identifies fields, and supports correction.
- Storage failure offers retry and the approved phone fallback.
- Successful enquiry receipt does not direct the guest as though the tour were confirmed; it explains manual follow-up.
- External Maps, phone, and Zalo actions use clear destination labels.
- Missing optional sections remove their links and headings together.
- Do not add an extra in-page contents menu unless later usability evidence shows it is needed.

### Accessibility contract

- Use semantic header, navigation, main, sections, form, and footer.
- Provide a skip-to-main link and visible keyboard focus.
- Give the mobile menu an accessible name, expanded state, and predictable dismissal.
- Route changes and direct anchors place users at a meaningful page or section heading.
- Use real form labels, required indicators, helper text, and appropriate mobile input modes.
- Provide inline field errors plus a focused, linked error summary after failed submission.
- Announce loading, failure, and success states without stealing focus unnecessarily.
- Meaningful media has approved alt text; decorative media is ignored by assistive technology.
- Do not use color-only meaning, hover-only actions, autoplay, or gesture-only controls.
- Keep touch targets comfortably usable on mobile.
- Browser Back preserves expected navigation; form values remain available through correctable failures.

### Unresolved content dependencies

- Final approved brand, positioning, tour name, and resulting public tour slug.
- Approved price, duration, timing, format, itinerary, inclusions/exclusions, suitability, safety, and policy facts and Vietnamese copy.
- Operationally approved Zalo destination and monitoring.
- Approved address, parking, travel time, pickup facts, and confirmation that the Maps destination is the normal boarding point.
- Approved real media, family/host story and permissions, verified attributable reviews/social proof, and required Vietnamese FAQ content.
- Final Vietnamese navigation, CTA, form-state, and successful-enquiry wording.
- Ticket 03's confirmed operator-notification destination, responsible person, monitoring routine, and recovery path.

## Comments

- Resolved the smallest V1 mobile sales journey as three deep routes—Home, Tour Detail, and Contact—with Reviews, FAQ, and Gallery embedded in Tour Detail, Directions embedded in Contact, and the `Booking enquiry` form anchored within Tour Detail. The prototype also records the approved mobile order, CTA hierarchy, dead-end prevention, and accessibility contract.
