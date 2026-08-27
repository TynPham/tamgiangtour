# AGENT_WORKFLOW.md

# Unified Agent Workflow — Tam Giang Lagoon Tour Project

> This document standardizes how the project uses the `mattpocock/skills` agent skill set.
>
> This workflow is the default for milestones, features, and coding tasks.

---

# 1. Unified Flow

```text
PRODUCT PLAN / MILESTONE
        ↓
WAYFINDER
        ↓
FEATURE MAP + DECISION MAP
        ↓
SELECT NEXT FEATURE
        ↓
GRILL-WITH-DOCS
        ↓
REQUIREMENTS ARE CLEAR
        ↓
TO-SPEC
        ↓
SPEC APPROVED
        ↓
TO-TICKETS
        ↓
IMPLEMENTATION TICKETS + DEPENDENCIES
        ↓
IMPLEMENT
        ↓
TDD LOOP AT PRE-AGREED TEST SEAMS
        ↓
CODE REVIEW
        ↓
MERGE / SHIP
        ↓
REAL-WORLD FEEDBACK
        ↓
NEXT FEATURE
```

Short version:

```text
PLAN
 ↓
WAYFINDER
 ↓
FEATURE
 ↓
GRILL
 ↓
SPEC
 ↓
TICKETS
 ↓
IMPLEMENT + TDD
 ↓
REVIEW
 ↓
SHIP
 ↓
LEARN
```

---

# 2. Product Plan / Milestone

Answers:

> What are we trying to build?

Example:

```text
V1
├── Homepage
├── Tour Detail
├── Booking
├── Reviews
├── FAQ
├── Maps
├── i18n
└── Analytics
```

The Product Plan is a product-level roadmap.

It is not yet an implementation plan.

---

# 3. Wayfinder

## Purpose

Use Wayfinder for a body of work too large to resolve safely in a single agent session.

It is not for writing code.

It is used to:

- define the destination;
- divide the problem space into decision areas;
- identify unresolved decisions;
- identify high-level dependencies;
- create a shared map;
- clarify the route before execution begins.

## Wayfinder Answers

> How should this large problem be divided and what decisions must be resolved before implementation?

## Example

```text
V1 Website
│
├── Foundation
│
├── Marketing Experience
│   ├── Homepage
│   ├── Tour Detail
│   └── Reviews
│
├── Conversion
│   └── Booking
│
├── Discoverability
│   ├── SEO
│   └── Maps
│
└── Analytics
```

## Use It For

- starting V1;
- starting a large booking platform milestone;
- starting payment/operations;
- major migrations;
- major architecture work.

## Do Not Use It For

Small tasks or already-bounded features.

### Rule

Usually:

```text
1 large milestone
≈
1 Wayfinder pass
```

Do not run Wayfinder for each button or component.

---

# 4. Select the Next Feature

After Wayfinder, do not implement the entire map.

Select one feature using:

1. Business value.
2. Dependency.
3. Ability to generate early feedback.
4. Risk.
5. Scope small enough for one execution loop.

Examples:

```text
Tour Detail
```

or:

```text
Booking
```

Final priority remains a human product decision.

Agents assist with dependency analysis and execution planning, not full product strategy ownership.

---

# 5. Grill-with-docs

## Purpose

Clarify a feature before creating its spec.

This skill should be used frequently.

## Grill Answers

> How must this feature actually behave?

For Booking, questions may include:

```text
Is a booking only a request or instantly confirmed?

Does the guest select a date or a time slot?

What is the guest limit?

How does pickup work?

Which fields are required?

What happens when a slot is unavailable?

What happens on submission failure?

What does the guest see after submission?

Does V1 already have booking codes?

Is cancellation part of this version?
```

## Grill May Also Refine

- domain terminology;
- business rules;
- shared language;
- ADRs;
- `CONTEXT.md`.

## When It Can Be Skipped

A tiny task with unambiguous behavior.

Example:

```text
"The Open Maps button opens URL X in a new tab."
```

## When It Should Almost Always Be Used

```text
Booking
Availability
Payment
Referral
Authentication
Pricing
Cancellation
```

---

# 6. To-spec

## Purpose

Convert an already clarified conversation into an implementation contract.

## The Spec Should Include

- Problem Statement.
- Goal.
- User stories.
- Expected behavior.
- Business rules.
- Edge cases.
- Constraints.
- Success conditions.
- Test seams.
- Out of scope.

## The Spec Should Avoid Over-Reliance On

- volatile file paths;
- implementation code snippets;
- low-level implementation details that do not need to be fixed yet.

## After Approval

The requirements are treated as frozen for the current implementation cycle.

If business behavior changes materially:

```text
GRILL
↓
UPDATE SPEC
↓
TICKETS / IMPLEMENT
```

Do not silently change requirements while coding.

---

# 7. To-tickets

## Purpose

Break an approved spec into small implementation tickets with explicit dependencies.

## To-tickets Answers

> In what small steps should this spec be implemented?

## Prefer Tracer-Bullet / Vertical Slices

Avoid, when possible:

```text
Ticket 1: database
Ticket 2: backend
Ticket 3: frontend
```

Prefer:

```text
Ticket 1:
Guest can submit a minimal booking end-to-end

Ticket 2:
Booking supports pickup

Ticket 3:
Booking records marketing attribution

Ticket 4:
Guest receives booking confirmation
```

Each ticket should create an observable capability.

## Dependency Example

```text
Minimal Booking
├── Pickup
├── Attribution
└── Confirmation
```

---

# 8. Implement

## Purpose

Write code from the approved spec and current ticket.

The agent must:

1. Read repository instructions.
2. Read relevant domain docs.
3. Read the approved spec.
4. Read the current ticket.
5. Inspect the existing codebase.
6. Implement only the approved scope.
7. Use TDD at the agreed seams.
8. Run typecheck/tests frequently.
9. Avoid speculative architecture changes.
10. Complete review before merge.

## Rule

Do not implement unrelated features just because it is convenient.

---

# 9. TDD Skill

## What Is TDD?

TDD = **Test-Driven Development**.

The skill uses a feedback loop:

```text
RED
 ↓
GREEN
 ↓
REFACTOR
 ↓
NEXT VERTICAL SLICE
```

### RED

Write one test that describes a required behavior.

The test should fail because the behavior does not exist yet.

### GREEN

Write the minimum implementation needed to make the test pass.

### REFACTOR

Improve the code while preserving behavior and keeping the test suite green.

Then move to the next behavior.

---

# 10. What the TDD Skill Is For

TDD is not primarily about maximizing test coverage.

Its main purpose is:

> Use tests as executable specifications for important behavior and provide a tight feedback loop for the coding agent.

A good test reads like a requirement:

```text
A guest can submit a booking with valid contact details.
```

A weaker test is tied to internals:

```text
BookingService calls BookingRepository.save once.
```

The first protects behavior.

The second protects implementation structure.

If internals change while behavior remains correct, good tests should usually keep passing.

---

# 11. What Is a Test Seam?

A **seam** is a public boundary through which behavior can be observed and tested.

Example:

```text
createBooking(input)
```

may be a domain seam.

A browser journey can also be a seam:

```text
Booking Form
↓
Submit
↓
Confirmation
```

## Important Rule

Do not test everything.

Before writing tests:

1. Identify public interfaces.
2. Propose test seams.
3. Agree on the seams.
4. Only then write tests.

This prevents agents from creating large suites around implementation details.

---

# 12. Standard TDD Loop

```text
Choose one behavior
      ↓
Use an agreed seam
      ↓
Write one failing test
      ↓
RED
      ↓
Write minimal implementation
      ↓
GREEN
      ↓
Refactor if useful
      ↓
Next behavior
```

Think:

```text
1 seam
1 behavior
1 test
1 minimal implementation
```

---

# 13. Avoid Horizontal TDD

Avoid:

```text
Write 30 tests
↓
Then implement everything
```

This is horizontal slicing.

It encourages agents to invent future behavior before enough implementation feedback exists.

Prefer:

```text
Test 1
↓
Implementation 1
↓
Test 2
↓
Implementation 2
↓
Test 3
↓
Implementation 3
```

This is vertical / tracer-bullet development.

---

# 14. TDD Anti-Patterns

## 14.1 Testing Implementation Details

Avoid tests such as:

```text
expect(mockRepository.save).toHaveBeenCalledOnce()
```

when the real requirement is:

```text
a booking is successfully created
```

## 14.2 Testing Private Methods

Private methods are not public behavior.

## 14.3 Excessive Mocking

If a test only proves one mock called another mock, it does not prove the feature works.

## 14.4 Tautological Tests

Do not derive expected output from the exact implementation under test.

Expected values should come from:

- the spec;
- a worked example;
- a known literal;
- an independent source of truth.

## 14.5 Testing Everything

Not every helper requires a test.

Prioritize:

- business logic;
- critical customer journeys;
- complex rules;
- regression-prone behavior.

---

# 15. TDD Examples for This Project

## Example 1 — Booking Validation

Seam:

```text
createBooking()
```

Behavior:

```text
A booking cannot be created with zero guests.
```

Cycle:

```text
RED:
guestCount = 0 must fail

GREEN:
implement minimum validation

REFACTOR if needed

NEXT
```

---

## Example 2 — Booking Submission

E2E seam:

```text
Booking Page
↓
Submit
↓
Confirmation Page
```

Behavior:

```text
A guest can submit a valid booking and see confirmation.
```

This has high value because it protects the primary revenue journey.

---

## Example 3 — Availability

Seam:

```text
reserveSlot()
```

Behavior:

```text
A slot cannot accept bookings beyond its capacity.
```

Test the behavior, not the SQL query.

---

## Example 4 — Pricing

Seam:

```text
calculateBookingPrice()
```

Behavior:

```text
A four-person booking uses the configured four-person pricing rule.
```

Expected values come from product/business rules.

---

# 16. TDD and UI

Do not TDD every visual detail.

Avoid testing:

```text
button has class px-4
```

Prefer testing behavior:

```text
When a user submits an incomplete form,
validation feedback is shown.
```

or:

```text
When the user chooses Maps,
the correct meeting-point action is available.
```

Visual quality should be checked through:

- browser review;
- screenshots;
- visual inspection;
- accessibility checks.

---

# 17. TDD with Vitest and Playwright

TDD is a method, not a framework.

Use:

```text
Vitest
```

for domain and integration seams.

Use:

```text
Playwright
```

for browser/E2E seams.

Example:

```text
Business rule
→ Vitest

Critical booking journey
→ Playwright
```

---

# 18. Where TDD Sits in the Unified Flow

TDD is not a separate phase after implementation.

It is part of `implement`.

Correct structure:

```text
SPEC
 ↓
TICKETS
 ↓
IMPLEMENT
      │
      ├─ choose agreed seam
      ├─ RED
      ├─ GREEN
      ├─ REFACTOR
      ├─ next vertical slice
      └─ finish ticket
 ↓
CODE REVIEW
```

---

# 19. Code Review

After implementation:

```text
/code-review
```

Review across two independent axes.

## A. Spec Compliance

- Does the feature match the requirements?
- Is any required behavior missing?
- Was out-of-scope behavior added?

## B. Engineering Quality

- Type safety.
- Security.
- Naming.
- Complexity.
- Duplication.
- Error handling.
- Test quality.
- Maintainability.

Both must pass.

---

# 20. Merge / Ship

Merge only when relevant checks pass:

```text
typecheck ✅
lint ✅
focused tests ✅
critical E2E ✅
spec compliance ✅
code review ✅
```

---

# 21. Learn / Feedback

After shipping:

```text
Deploy
↓
Use
↓
Measure
↓
Learn
```

Example:

```text
Guests mostly click Zalo
and rarely submit the booking form
```

That is product feedback.

The roadmap may change because of real data.

Do not blindly implement the full roadmap.

---

# 22. Skill Routing Table

| Situation | Skill / Step |
|---|---|
| Milestone is too large / many decisions | `wayfinder` |
| Feature is ambiguous | `grill-with-docs` |
| Requirements are clear | `to-spec` |
| Spec needs execution breakdown | `to-tickets` |
| Coding | `implement` |
| Important behavior should be test-first | `tdd` |
| Implementation is complete | `code-review` |

---

# 23. Three Valid Workflow Shapes

## A. Large Milestone

```text
WAYFINDER
→ GRILL
→ SPEC
→ TICKETS
→ IMPLEMENT + TDD
→ REVIEW
→ SHIP
```

Example:

```text
V1 Website
```

## B. Medium Feature

```text
GRILL
→ SPEC
→ TICKETS
→ IMPLEMENT + TDD
→ REVIEW
```

Examples:

```text
Booking
Availability
Referral
```

## C. Small, Clear Task

```text
IMPLEMENT
→ TEST
→ REVIEW
```

Example:

```text
Update Google Maps URL
```

Do not force every small task through unnecessary ceremony.

---

# 24. Project Routing Rule

The product owner can describe requirements in normal language.

Example:

```text
"I want to build the homepage next."
```

The requirement analyst / prompt architect should determine:

```text
Is Wayfinder needed?
Are requirements clear enough?
Is Grill needed?
Is a formal Spec needed?
Are Tickets needed?
Where are the test seams?
```

The product owner should not need to manually choose the skill every time.

---

# 25. Current Project State

```text
PRODUCT PLAN     ✅
TECH STACK       ✅
AGENT WORKFLOW   ✅
NEXT.JS SOURCE   ✅

NEXT:

INSTALL mattpocock/skills
↓
RUN setup-matt-pocock-skills ONCE
↓
WAYFINDER FOR V1
```

Do not run Wayfinder across V0 → V4.

Use it only to make **V1** small and clear enough to execute safely.

Then:

```text
select Feature #1
↓
GRILL
↓
SPEC
↓
TICKETS
↓
IMPLEMENT + TDD
↓
REVIEW
```

---

# 26. Core Principle

```text
Plan at the right level.
Clarify before specifying.
Specify before ticketing.
Ticket before implementing.
Test behavior, not internals.
Review against both spec and engineering quality.
Ship small.
Learn quickly.
```
