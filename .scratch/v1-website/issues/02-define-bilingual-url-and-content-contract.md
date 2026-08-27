# Define the V1 locale and content contract

Type: grilling
Status: resolved

## Question

Given that V1 is Vietnamese-first while the current plan still calls for `/vi` and `/en`, should English remain required for V1, become a secondary launch commitment, or move to a later milestone? Under that decision, what is the contract for default-locale behavior, locale switching, translated route slugs, canonical/hreflang behavior, incomplete translations, and any minimum English quality required at launch?

The answer must prevent translatable UI strings from scattering through components and must not introduce a CMS.

## Answer

### Language commitment

- Vietnamese is the only language that determines V1 launch readiness.
- English is secondary and non-blocking. V1 does not require English translation, review, or QA to launch.
- The architecture and content model remain localization-ready so English can be added without restructuring the site.
- Incomplete, draft, or unapproved English pages are not publicly exposed or indexed.

### Locale URLs and default locale

- Vietnamese canonical routes use an explicit `/vi/...` prefix from V1.
- `/en/...` is reserved for complete, approved English content.
- `/` redirects to `/vi` and is not a separate canonical content page.
- Vietnamese is always the default locale. Do not redirect based on browser language, geography, or inferred preference.
- Adding English later must not change existing Vietnamese canonical URLs.

### Language switching

- V1 shows no English switcher while no approved English pages exist.
- A target locale is shown only when the current page has a complete, approved equivalent.
- Switching opens the equivalent page, never a locale homepage fallback.
- If no approved equivalent exists, expose no target-locale option and do not reveal draft content.
- Locale availability reflects publishable content, not implementation capability.

### Route slugs

- Visitor-facing slugs are localized; Vietnamese and English equivalents may differ.
- Vietnamese slugs use lowercase, unaccented, hyphen-separated text.
- Equivalent pages are connected by a stable internal content key, not matching slug text.
- Do not finalize tour slugs until the public tour name is approved.
- Do not publish English slugs before the corresponding English page is complete and approved.
- Preserve a published old slug through a redirect when it changes.

### Canonical and hreflang

- Every published Vietnamese page is self-canonical under `/vi/...`.
- Do not emit English hreflang until a complete, approved English equivalent is publicly available.
- Once both equivalents are published, each stays self-canonical and publishes reciprocal `hreflang="vi"` and `hreflang="en"` references.
- The Vietnamese equivalent is `x-default`.
- Draft, preview, incomplete, and unapproved English content is non-indexable and excluded from canonical/hreflang relationships.

### Missing content and fallbacks

- Missing required Vietnamese content blocks the affected V1 page from launch.
- Missing English content never blocks V1. An English page remains unpublished until all required customer-facing content for that page is complete and approved.
- Never mix Vietnamese fallback copy into an English page or English fallback copy into a Vietnamese page.
- Optional missing sections are omitted cleanly rather than filled with placeholders.
- Do not use automatic or AI translation as a publish-time fallback.
- Translation availability is explicit and approval-driven.

### Centralized translatable content

- Guest-facing components do not hard-code translatable customer-facing copy.
- Shared UI text uses centralized locale dictionaries with stable semantic keys.
- Page/content records use stable internal keys with locale-specific titles, slugs, and copy.
- Locale-independent facts such as phone, coordinates, and an approved VND price have one canonical source; surrounding labels and explanations remain localized.
- A localized page is publishable only when its required customer-facing content is explicitly complete and approved.
- Adding English later adds locale content rather than duplicating or restructuring components.
- Ticket 04 owns MDX-versus-typed-content, file organization, and content-loading decisions.
- Do not introduce a CMS.

## Comments
