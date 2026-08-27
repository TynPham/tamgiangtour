# TECH_STACK.md

# Tech Stack — Tam Giang Lagoon Family Tour Website & PWA

> **Goal:** Choose a stack optimized for self-development, AI-assisted coding, strong SEO, fast iteration, and a gradual path from marketing website → booking system → PWA → operations dashboard.
>
> **Principle:** Do not choose technology because it is fashionable. Prefer a mature ecosystem, strong AI tooling, type safety, easy debugging, easy deployment, and a clear upgrade path.

---

## 1. Proposed Stack

```text
Frontend / Full-stack
Next.js 16.x
TypeScript

UI
Tailwind CSS
shadcn/ui
Lucide Icons

Forms / Validation
React Hook Form
Zod

Backend / Database
Supabase
├── PostgreSQL
├── Auth
├── Storage
├── Realtime (when needed)
└── Edge Functions (when needed)

Content
Markdown / MDX

PWA
Serwist

Analytics
PostHog
Google Search Console

Testing
Vitest
Playwright

Deployment
GitHub
Vercel
Supabase

AI-assisted Development
AGENTS.md
Supabase MCP
shadcn MCP
Browser automation / E2E testing
```

---

# 2. Framework — Next.js

## Choice

**Next.js 16.x + App Router**

## Why

- Suitable for both marketing websites and web applications.
- Strong SEO capabilities.
- Flexible static, server, and dynamic rendering.
- One codebase can contain:
  - landing pages;
  - tour pages;
  - blog;
  - booking;
  - My Trip;
  - admin dashboard;
  - partner/referral pages.
- Large React ecosystem.
- Excellent AI coding familiarity and examples.
- Strong tooling for agent-assisted development.
- Easy preview and deployment workflows.

## Project Role

```text
Next.js
├── Marketing Site
├── Tour Pages
├── Blog / SEO
├── Booking Flow
├── My Trip
├── Admin Dashboard
└── Partner Portal
```

## Why Not Astro as the Main Framework

Astro is excellent for content-heavy/static sites.

However, the roadmap is:

```text
Website
↓
Booking
↓
Availability
↓
My Trip
↓
Dashboard
↓
Payment
↓
Partner Portal
```

The product will progressively become a web application, making Next.js a more natural long-term fit.

## Why Not Nuxt

Nuxt 4 is a strong option if Vue is preferred.

This project instead prioritizes:

- AI coding ecosystem;
- React ecosystem;
- shadcn/ui;
- breadth of examples and references;
- agent familiarity.

Therefore Next.js is preferred.

---

# 3. Language — TypeScript

## Choice

**TypeScript with strict mode**

## Why

AI can generate code quickly, but type systems provide an essential guardrail.

TypeScript helps:

- catch mistakes early;
- encode domain rules;
- reduce runtime bugs;
- make refactors safer;
- serve as executable documentation for agents.

Example:

```ts
type BookingStatus =
  | "new"
  | "confirmed"
  | "deposited"
  | "completed"
  | "cancelled";
```

## Rule

Do not use plain JavaScript for application logic.

---

# 4. UI — Tailwind CSS + shadcn/ui

## Choice

```text
Tailwind CSS
+
shadcn/ui
+
Lucide Icons
```

## Tailwind Reasons

- Fast UI development.
- Strong mobile-first workflow.
- AI generates Tailwind effectively.
- Less custom CSS abstraction.
- Easy consistency.

## shadcn/ui Reasons

Component source lives directly in the project, which is valuable for AI-assisted development.

Agents can:

- inspect components;
- modify components;
- compose components;
- build a local design system;
- reuse patterns without depending on a black-box package.

Likely components:

```text
Button
Card
Dialog
Drawer
Sheet
Form
Calendar
Popover
Tabs
Badge
Table
Dropdown
Toast
```

## Rule

Do not combine multiple UI frameworks without a strong reason.

Avoid:

```text
shadcn
+
Material UI
+
Ant Design
+
Bootstrap
```

One primary design system is enough.

---

# 5. Icons — Lucide

Use for:

- phone;
- map;
- booking;
- calendar;
- guest count;
- navigation;
- admin actions.

Avoid mixing icon libraries unnecessarily.

---

# 6. Forms — React Hook Form

Use for:

- booking form;
- admin forms;
- tour editing;
- referral forms;
- customer information.

Why:

- mature;
- performant;
- large ecosystem;
- good Zod integration;
- well understood by coding agents.

---

# 7. Validation — Zod

## Choice

**Zod**

Schema should serve as a contract across:

```text
Form
Backend
Database input
AI
Tests
```

Example:

```ts
const bookingSchema = z.object({
  tourDate: z.coerce.date(),
  guestCount: z.number().int().min(1),
  customerName: z.string().min(2),
  phone: z.string().min(8),
  pickupRequired: z.boolean(),
});
```

## Rule

Validation must not exist only in the frontend.

Important inputs must be validated at server boundaries.

---

# 8. Backend / BaaS — Supabase

## Choice

**Supabase**

Components:

```text
Supabase
├── PostgreSQL
├── Auth
├── Storage
├── Realtime
└── Edge Functions
```

Not all components need to be used in V1.

---

## 8.1 PostgreSQL

Primary database.

Expected data model areas:

```text
tours
tour_slots
bookings
customers
booking_guests
payments
partners
referrals
reviews
media
```

Booking is naturally relational:

```text
Tour
↓
Tour Slot
↓
Booking
↓
Customer
↓
Payment
```

PostgreSQL keeps the model explicit and reduces platform lock-in.

---

## 8.2 Supabase Auth

### V1

Customers do not need accounts.

Only admin/staff may need authentication later.

### Future Roles

```text
admin
staff
partner
```

Prefer simple authentication:

- email/password;
- magic link.

Do not build a custom authentication system.

---

## 8.3 Supabase Storage

Use for:

- tour images;
- guest images;
- avatars;
- review images;
- internal media.

Avoid storing large marketing videos directly unless there is a clear need.

Long videos can live on:

- YouTube;
- TikTok;
- Instagram;
- a dedicated video CDN later.

---

## 8.4 Supabase Realtime

Not required in V1.

Potential later use:

- multiple people managing bookings;
- live dashboard updates;
- live slot changes.

---

## 8.5 Supabase Edge Functions

Use only when needed.

Potential use cases:

- payment webhooks;
- transactional email;
- external APIs;
- scheduled work;
- server-side integrations.

Do not move business logic into Edge Functions if Next.js server-side logic is sufficient.

---

# 9. Content — Markdown / MDX

## Initial Choice

**Markdown / MDX**

Use for:

- blog;
- long-form FAQ;
- travel guides;
- SEO content;
- policies;
- content marketing.

Example:

```text
/content
├── vi
│   ├── blog
│   └── guides
└── en
    ├── blog
    └── guides
```

## Why No CMS Yet

V1 may only have:

- 1–3 tours;
- a few dozen articles;
- a manageable FAQ set.

A CMS adds unnecessary complexity early.

## When to Add a CMS

When non-developers need to regularly:

- edit pricing;
- add articles;
- update tours;
- manage media;

without touching the codebase.

---

# 10. Internationalization

Design from the beginning around:

```text
/vi
/en
```

Examples:

```text
/vi/tour/hoang-hon-pha-tam-giang
/en/tours/tam-giang-sunset
```

Reasons:

- SEO;
- stable URL structure;
- avoid expensive later refactors.

## Rule

Do not hard-code translatable UI strings throughout the application.

---

# 11. Maps

## V1

No complex Maps API integration.

Use:

- Google Maps link;
- embedded map if helpful;
- “Get Directions” CTA.

Flow:

```text
Open Google Maps
↓
Meeting Point
↓
Navigation
```

Use a Maps API only if later requirements justify:

- multiple pickup points;
- route planning;
- live transport;
- custom map behavior.

---

# 12. PWA — Serwist

## Start in

**V1.5**

## Choice

**Serwist**

Goal:

```text
Website
↓
Installable
↓
Fast reopen
↓
Offline fallback
↓
My Trip offline
```

Cache candidates:

- home;
- tour;
- FAQ;
- contact;
- My Trip;
- static assets.

Do not blindly cache changing data such as availability.

Push notifications should only be enabled for a real use case.

---

# 13. Analytics — PostHog

## Choice

**PostHog**

Suggested events:

```text
page_view
tour_view
booking_cta_clicked
booking_started
booking_submitted
zalo_clicked
whatsapp_clicked
phone_clicked
maps_clicked
booking_confirmed
```

Critical funnel:

```text
Visitor
↓
Tour View
↓
Booking CTA
↓
Booking Started
↓
Booking Submitted
↓
Booking Confirmed
```

Goal:

- identify high-performing pages;
- measure CTA effectiveness;
- understand channel attribution;
- identify funnel drop-offs.

---

# 14. SEO — Google Search Console

Track:

- keywords;
- impressions;
- clicks;
- CTR;
- ranking;
- index status.

Example queries:

```text
tour phá tam giang
phá tam giang sunset
tour phá tam giang huế
tam giang lagoon tour
what to do in hue
```

---

# 15. Testing

AI-assisted coding makes automated feedback more important, not less.

## 15.1 Unit / Integration — Vitest

Use for:

- pricing logic;
- availability logic;
- booking validation;
- helpers;
- date rules.

## 15.2 E2E — Playwright

Critical journey:

```text
Visitor
↓
Tour Page
↓
Book Tour
↓
Fill Form
↓
Submit
↓
Confirmation
```

## Rule

If the core booking journey fails, do not merge.

---

# 16. Deployment

## Source Control

**GitHub**

## Hosting

**Vercel**

## Backend

**Supabase**

Flow:

```text
Local
↓
Git Branch
↓
Pull Request
↓
Preview Deployment
↓
Test
↓
Merge
↓
Production
```

Preview deployments are especially valuable for AI-assisted coding because generated work can be reviewed before production.

---

# 17. Environments

Maintain at least:

```text
Local
Development / Preview
Production
```

Prefer separate Supabase environments:

```text
Supabase Development
Supabase Production
```

AI agents should not have broad default access to production.

---

# 18. AI-Native Development Workflow

AI should be used to build the product, not as a mandatory customer-facing feature.

Repository structure should be agent-friendly.

Suggested docs:

```text
/
├── AGENTS.md
├── README.md
│
├── docs/
│   ├── PRODUCT_PLAN.md
│   ├── TECH_STACK.md
│   ├── AGENT_WORKFLOW.md
│   ├── V1_SPEC.md
│   ├── BOOKING_FLOW.md
│   ├── DATABASE.md
│   └── DESIGN_SYSTEM.md
│
├── app/
├── components/
├── lib/
├── content/
├── supabase/
└── tests/
```

---

# 19. AGENTS.md

This file should tell coding agents:

- what the product is;
- product priorities;
- architecture;
- stack;
- folder conventions;
- naming conventions;
- business rules;
- source of truth;
- migration process;
- testing process;
- commands required before completing work;
- changes agents must not make without approval.

Example:

```text
Before completing a task:

1. Run typecheck
2. Run lint
3. Run affected tests
4. Run booking E2E if booking flow changed
5. Never modify the production database directly
```

---

# 20. MCP & AI Tooling

## Supabase MCP

Useful for:

- schema inspection;
- migrations;
- database work;
- functions;
- logs/debugging.

Security rule:

AI may have broader permissions in development.

Production access should be limited and read-only where practical.

## shadcn MCP

Useful for:

- discovering components;
- installing components;
- composing UI;
- browsing registries.

Example agent request:

```text
Build the booking form using shadcn Card,
Calendar, Form, Drawer and Button components.
```

## Browser Automation

Agents should be able to:

```text
start app
↓
open localhost
↓
click
↓
fill booking
↓
submit
↓
inspect output
↓
fix issue
```

This feedback loop is central to reliable AI-assisted development.

---

# 21. AI Must Not Freely Change Architecture

A common failure mode in AI coding is speculative dependency growth.

Agents must not independently:

- change framework;
- change database;
- add an ORM;
- add another UI framework;
- add global state management;
- add CMS;
- add queue infrastructure;
- add Redis;
- add microservices;

without a clear, approved reason.

Major dependencies require justification.

---

# 22. State Management

## V1

Avoid Redux/Zustand unless a real need appears.

Prefer:

```text
Server state
URL state
React local state
Form state
```

Add global client state only when a real pain point exists.

---

# 23. ORM

## Initial Recommendation

No separate ORM initially.

Use Supabase client and explicit SQL/migrations.

Reasons:

- fewer abstractions;
- easier for agents to understand;
- fewer dependencies;
- PostgreSQL remains the source of truth.

Consider an ORM only if the domain/query layer becomes complex enough to justify it.

---

# 24. API Architecture

Do not create a separate REST API just so the frontend can call the project's own backend.

Prefer:

```text
Next.js Server Components
Server Actions / Server-side handlers
Supabase
```

Use external-facing APIs only when integration requirements demand them.

---

# 25. Payment

Do not lock the payment provider in V1.

Prepare the data model for:

```text
total_amount
deposit_amount
remaining_amount
payment_method
payment_status
transaction_reference
```

Potential future providers:

- bank QR;
- VNPay;
- MoMo;
- Stripe;
- other providers.

Payment integrations should be adapter-based rather than tightly coupled to the entire application.

---

# 26. Email / Notifications

Not mandatory in V1.

Possible later uses:

- booking confirmation;
- payment confirmation;
- reminders;
- cancellation notices.

Zalo/WhatsApp may remain the primary customer communication channels.

---

# 27. Native App

Not part of the near-term roadmap.

Only reconsider if a real use case appears that PWA cannot solve.

Current direction:

```text
Responsive Web
↓
PWA
```

---

# 28. AI Inside the Product

## V1

**Not needed.**

Do not add a chatbot simply because AI is fashionable.

Potential later uses:

### Admin AI

```text
"Summarize today's bookings."
```

### Review Analysis

```text
"What are guests complaining about most this month?"
```

### Content Assistant

```text
"Draft an English article about Tam Giang sunset."
```

### Analytics Assistant

```text
"Why did conversion drop this week?"
```

### FAQ Assistant

Only if support volume becomes large enough.

Every AI feature must solve a real problem.

---

# 29. High-Level Architecture

```text
                    Traffic Sources
         TikTok / Facebook / Google / Partner
                         │
                         ▼
┌─────────────────────────────────────────────────┐
│                   NEXT.JS                       │
│                                                 │
│ Marketing      Booking       Customer     Admin │
│ ─────────      ───────       ────────     ───── │
│ Home           Form          My Trip      Home  │
│ Tour           Slots         Maps         Trips │
│ Blog           Confirm       Support      Data  │
│ FAQ                                             │
│                                                 │
│            Tailwind + shadcn/ui                 │
└──────────────────────┬──────────────────────────┘
                       │
                       ▼
              ┌──────────────────┐
              │     SUPABASE     │
              │                  │
              │ PostgreSQL       │
              │ Auth             │
              │ Storage          │
              │ Edge Functions   │
              └──────────────────┘

Additional layers:

PostHog
Google Search Console
Serwist PWA
Playwright
Vitest
```

---

# 30. Stack by Product Version

## V0

```text
GitHub
Markdown Docs
Content Assets
```

## V1

```text
Next.js
TypeScript
Tailwind
shadcn/ui
React Hook Form
Zod
Supabase
Markdown/MDX
PostHog
Search Console
Vercel
Playwright
```

## V1.5

Add:

```text
Serwist
Service Worker
Offline fallback
```

## V2

Expand Supabase for:

```text
booking tables
availability
auth
dashboard
My Trip
```

## V2.5

Add:

```text
referrals
partners
campaign attribution
analytics dashboard
```

## V3

Add:

```text
payment integration
transaction handling
operational reporting
```

## V4+

Only add infrastructure when real traffic or operational volume requires it.

Possible:

```text
background jobs
queue
advanced caching
advanced monitoring
multi-role access
```

---

# 31. Dependency Rule

Before adding a dependency, answer:

1. Can the framework/platform already solve this?
2. Does the dependency reduce complexity?
3. Can AI agents understand and maintain it well?
4. Is the library actively maintained?
5. What is the migration cost if it is removed later?

If there is no strong reason, do not add it.

---

# 32. AI Coding Responsibilities

## AI Should Handle

- scaffolding;
- boilerplate;
- UI implementation;
- forms;
- tests;
- refactoring;
- migrations;
- docs;
- repetitive tasks;
- accessibility checks;
- bug fixing.

## Human Must Decide

- product direction;
- business rules;
- UX priority;
- architecture;
- database semantics;
- security decisions;
- pricing logic;
- production changes.

---

# 33. Definition of Done for a Coding Task

A task is complete only when:

- [ ] Feature matches the spec.
- [ ] TypeScript passes.
- [ ] Important lint issues are resolved.
- [ ] Validation is complete.
- [ ] Mobile UI works.
- [ ] Loading/error/empty states are handled where relevant.
- [ ] Relevant tests pass.
- [ ] Core booking flow is not broken.
- [ ] No unnecessary dependencies were added.
- [ ] Docs are updated when architecture/business rules change.

---

# 34. Final Stack Decision

## Core

```text
Next.js 16.x
TypeScript
Tailwind CSS
shadcn/ui
React Hook Form
Zod
Supabase
Vercel
```

## PWA Stage

```text
Serwist
```

## Analytics

```text
PostHog
Google Search Console
```

## Quality

```text
Vitest
Playwright
```

## AI Workflow

```text
AGENTS.md
Supabase MCP
shadcn MCP
Browser automation
Structured docs
```

---

# 35. Guiding Principle

> **Boring architecture, fast development, strong AI tooling.**

Architecture should evolve as:

```text
Marketing Website
      ↓
Booking Website
      ↓
PWA
      ↓
Booking Platform
      ↓
Operations Platform
```

The stack should only expand when the product genuinely requires it.
