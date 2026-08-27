# PRODUCT_PLAN.md

# Product Plan — Tam Giang Lagoon Family Tour Website & PWA

> **Goal:** Build a mobile-first website that can sell real tours first, then progressively evolve into a PWA and a lightweight operations platform for a family-run local tour business.
>
> **Scope of this document:** Product planning and features only. Technology choices are documented separately in `TECH_STACK.md`.

---

## 1. Product Goals

The website should not be just a brochure. It should support the customer journey from discovery to booking, trip preparation, and post-tour review.

### Primary goals

- Help visitors quickly understand what the tour is, who it is for, what it costs, and how it works.
- Build trust through real photos, real reviews, clear information, and visible local family operators.
- Minimize booking friction, especially on mobile.
- Help guests find the correct meeting point and prepare for the trip.
- Track where visitors and bookings come from so marketing performance can be measured.
- Create a foundation for availability, deposits, booking management, referral tracking, and PWA capabilities later.
- Never require customers to install an app just to use the service.

---

## 2. Primary User Groups

| User | Main Need | What They Need to See |
|---|---|---|
| Vietnamese traveler | Quickly understand price and book through familiar channels | Clear pricing, itinerary, photos, reviews, Zalo, Maps |
| International traveler | If supported, understand the experience, safety, location, and booking process | English content, reviews, meeting point, FAQ |
| Couples / friend groups / families | Know whether the tour fits their group | Group size, family suitability, private/group format, real photos |
| Confirmed guest | Know when and where to go and whether the booking is confirmed | My Trip, Maps, hotline, preparation instructions |
| Family operator | Manage bookings and understand customer sources | Booking list, status, deposit status, source attribution |
| Referral partner | Refer guests easily and receive attribution | Referral links/codes, concise tour information |

### V1 audience priority

V1 is Vietnamese-first. Vietnamese travelers are the primary launch audience; international-specific channels and operations must not drive V1 requirements.

Vietnamese is the only language that determines V1 launch readiness. English is secondary and non-blocking: the site remains localization-ready, but incomplete or unapproved English pages are neither public nor indexable.

---

## 3. Product Principles

1. **Mobile-first**  
   Assume most visitors come from phones.

2. **Booking-first**  
   Every important page should have a clear path toward booking or contacting the operator.

3. **Low friction**  
   Customers should not need to create an account to book.

4. **Concrete information**  
   Pricing, timing, location, policies, inclusions, and suitability must be clear.

5. **People before logos**  
   Real family members, local guides, and real guests should be more visible than corporate branding.

6. **Progressive enhancement**  
   Build an excellent website first, then add PWA features only when useful.

7. **Measurable**  
   Important actions such as Zalo clicks, phone calls, booking submissions, and Maps opens should be trackable. Track optional channels such as WhatsApp only when enabled.

8. **Easy to update**  
   Prices, itinerary, FAQs, reviews, and content should be maintainable without large rewrites.

---

## 4. High-Level Site Structure

### 4.1 Home

Purpose: convince a visitor within the first 10–20 seconds.

Content:

- Hero photo or video.
- Core positioning statement.
- Key differentiators.
- Main experiences.
- Starting price.
- Featured reviews.
- Booking CTA.
- Directions CTA.

### 4.2 Tour Detail

Content:

- Tour name.
- Duration.
- Start time.
- Meeting point.
- Price.
- Itinerary.
- Main experiences.
- Included / not included.
- Who the tour is suitable for.
- Policies.
- Booking CTA.

### 4.3 Gallery / Experience

- Real guest photos and videos.
- Sunset / sunrise.
- SUP.
- Fishing / trap-pulling experience.
- Mangrove scenery.
- Food.
- Local family members and guides.

### 4.4 Reviews

- Real reviews.
- Guest photos.
- Rating.
- Link to Google Maps reviews.
- Highlighted testimonials.

### 4.5 Booking

- Date.
- Guest count.
- Tour / time slot when applicable.
- Name.
- Phone.
- Zalo / WhatsApp when relevant.
- Pickup requirement.
- Notes.
- Submit booking request.

### 4.6 Directions

- Exact meeting point.
- Open in Google Maps.
- Parking instructions.
- Approximate travel time from central Hue.
- Pickup information if available.
- Hotline.

### 4.7 FAQ

Examples:

- Can children join?
- Are life jackets provided?
- What happens if it rains?
- What should guests wear?
- Is food included?
- Is pickup from central Hue available?
- How long does it take to reach the lagoon?
- What is the cancellation/change policy?

### 4.8 Tam Giang Travel Guide

Used for SEO and purchase support.

Examples:

- What time is best for Tam Giang Lagoon?
- Sunset or sunrise?
- How far is Tam Giang Lagoon from central Hue?
- How much does a Tam Giang tour cost?
- Is the experience suitable for children?
- What should visitors prepare?

### 4.9 My Trip

For confirmed guests.

- Booking code.
- Date and time.
- Guest count.
- Meeting point.
- Open Maps.
- Hotline / Zalo.
- Preparation instructions.
- Deposit status.
- Confirmation status.

---

## 5. Core Customer Journey

```text
TikTok / Facebook / Google / Referral Partner
                    ↓
                 Website
                    ↓
               View Tour
                    ↓
             Check Details
                    ↓
                Book Tour
                    ↓
               Confirmation
                    ↓
                 Take Tour
                    ↓
           Review / Refer Others
```

Every release should preserve a smooth version of this journey on mobile.

---

## 6. Feature Catalogue

### 6.1 Tour Presentation & Sales

- Hero section.
- Positioning statement.
- Tour information.
- Pricing.
- Itinerary.
- Experiences.
- Included / excluded.
- Audience suitability.
- Booking CTA.
- Contact CTA.
- Group offers when needed.

### 6.2 Trust

- Real photos and videos.
- Family/operator story.
- Reviews.
- Local story.
- Basic safety information.
- FAQ.
- Booking / deposit / cancellation policies.

### 6.3 Booking

- Select date.
- Select guest count.
- Select tour/slot.
- Contact information.
- Pickup request.
- Notes.
- Submission confirmation.
- Booking code.
- Booking status.
- Availability calendar later.
- Deposit/payment later.

Suggested status model:

```text
NEW
CONFIRMED
DEPOSITED
COMPLETED
CANCELLED
```

### 6.4 Contact & Directions

- Zalo.
- Messenger.
- WhatsApp when actively supported; optional for V1.
- Phone.
- Google Maps.
- Parking instructions.
- Meeting point.
- Travel time.

### 6.5 My Trip

- Date and time.
- Guest count.
- Meeting point.
- Maps.
- Hotline.
- Preparation instructions.
- Booking status.
- Deposit status.
- Change/cancellation policy.
- Offline access in the PWA stage.

### 6.6 Marketing & Growth

- SEO.
- Traffic attribution.
- Booking attribution.
- Track Zalo / phone / Maps clicks, plus optional channels when enabled.
- Campaign links.
- Referral links.
- Partner codes.
- Campaign landing pages.
- Post-tour review flow.
- Social sharing.

### 6.7 Internal Operations

- Booking list.
- Bookings by date.
- Search / filters.
- Booking status.
- Deposit status.
- Internal notes.
- Customer source.
- Guest totals.
- Revenue.
- Source attribution.
- Partner referrals.

### 6.8 PWA

- Add to Home Screen.
- App icon.
- App-like opening experience.
- Cache important pages.
- Offline fallback.
- Cache My Trip information.
- Fast reopen.
- Push notifications only if a real use case exists.

---

# 7. Product Roadmap

## Version 0 — Content & Positioning Preparation

### Goal

Prepare enough real content and business information so the website does not become an empty template.

### Work

- Finalize brand name.
- Finalize positioning statement.
- Finalize the primary tour.
- Finalize price.
- Finalize duration.
- Finalize itinerary.
- Finalize meeting point.
- Finalize policies.
- Prepare a minimum real photo set.
- Prepare short-form video assets.
- Write the family/local story.
- Prepare practical FAQs.
- Standardize:
  - phone number;
  - Zalo;
  - WhatsApp only if actively supported;
  - Google Maps location.

### Definition of Done

A person who has never heard of the tour can read the material and understand what they are buying.

---

## Version 1 — MVP Website That Can Sell Tours

### Goal

Generate real leads and booking requests.

### Must-have

- Mobile-first home page.
- Tour detail page.
- Pricing.
- Itinerary.
- Experiences.
- Photos/videos.
- Reviews.
- FAQ.
- Contact page.
- Google Maps.
- Zalo CTA.
- Phone CTA.
- Simple booking enquiry form.
- Booking submission confirmation.
- Approved Vietnamese content, with a localization-ready structure for later English content.
- Basic tracking.

### Not Needed Yet

- Customer accounts.
- Online payment.
- Push notifications.
- Complex admin dashboard.
- Loyalty system.
- Full PWA capabilities.

### Primary KPIs

- Website visitors.
- CTA clicks.
- Real booking enquiries.
- Known customer acquisition source.

---

## Version 1.1 — Conversion Optimization

### Goal

Improve:

```text
Visitor → Lead → Booking
```

### Features

- Sticky mobile CTA.
- Shorter booking form.
- Stronger reviews presentation.
- Clearer policy presentation.
- “Check availability” CTA.
- Landing pages for:
  - sunset;
  - sunrise;
  - private;
  - family.
- More detailed attribution.
- Zalo or another approved contact prompt after form submission.
- A/B testing when useful.

### KPIs

- Conversion rate.
- Booking requests per visitor.
- CTA click rate.
- Lead → confirmed booking rate.

---

## Version 1.5 — Basic PWA

### Goal

Make the website feel more app-like without requiring a native app.

### Features

- Add to Home Screen.
- App icon.
- App-like launch experience.
- Cache:
  - home;
  - tour;
  - FAQ;
  - contact;
  - My Trip.
- Offline fallback.
- Fast reopen.
- My Trip usable with weak connectivity.

### Important Note

Do not optimize around “PWA installs” as a primary KPI.

Primary KPIs remain booking, conversion, speed, and UX.

---

## Version 2 — Booking System

### Goal

Reduce manual booking management.

### Features

- Availability by date.
- Time slots.
- Capacity.
- Booking code.
- Booking status.
- My Trip.
- Deposit status.
- Confirmation workflow.
- Date changes.
- Cancellation.
- Basic internal booking dashboard.
- Guest list by date.
- Booking source attribution.

### Minimum Dashboard

```text
Today
- Total bookings
- Total guests
- Upcoming tours
- Unconfirmed bookings
- Unpaid deposits
```

---

## Version 2.5 — Marketing & Referral Engine

### Goal

Know exactly which channels and partners generate bookings.

### Features

- Referral links.
- Referral codes.
- Links for:
  - hotels;
  - homestays;
  - drivers;
  - guides;
  - creators;
  - campaigns.
- Booking source attribution.
- Source reporting.
- Campaign landing pages.
- Promo codes.
- Review request workflow.
- Referral tracking.

---

## Version 3 — Payment & Operations

### Goal

Reduce manual operations as booking volume grows.

### Features

- Online deposit.
- Online payment.
- Automatic confirmation after deposit.
- Payment status.
- Refund handling.
- Date changes.
- Revenue dashboard.
- Metrics:
  - revenue;
  - guest count;
  - no-show;
  - cancellation;
  - average booking value.
- Assign operator/guide.
- Assign boat if needed.
- Daily / weekly / monthly reports.

---

## Version 4 — Scale Up

> Only build when the business has grown beyond a small family-run tour operation.

Possible features:

- Multiple tours.
- Multiple slots.
- Multiple meeting points.
- Multiple boats.
- Multiple operators.
- Partner portal.
- Roles and permissions.
- Advanced capacity management.
- Lightweight CRM.
- Loyalty.
- Push notifications.
- Native app only if the PWA no longer satisfies a real requirement.

---

# 8. Priority Matrix

| Feature | Priority | Version |
|---|---:|---:|
| Tour detail | Very High | V1 |
| Pricing / itinerary | Very High | V1 |
| Zalo / phone | Very High | V1 |
| WhatsApp | Optional | Later if actively supported |
| Booking form | Very High | V1 |
| Google Maps | Very High | V1 |
| Reviews | Very High | V1 |
| Mobile UX | Very High | V1 |
| Vietnamese | High | V1 |
| English | Secondary, non-blocking | Later when approved |
| Source attribution | High | V1–V1.1 |
| SEO | High | V1–V1.1 |
| PWA | Medium | V1.5 |
| My Trip | High | V2 |
| Availability | High when bookings grow | V2 |
| Dashboard | High when bookings grow | V2 |
| Referral system | High | V2.5 |
| Deposit/payment | Medium → High | V3 |
| Push notifications | Low | V4 |
| Native app | Very Low now | V4+ |

---

# 9. Suggested Booking Flow

```text
1. Visitor lands on the website
2. Visitor views the tour
3. Visitor chooses Book Tour
4. Visitor selects date
5. Visitor selects guest count
6. Visitor enters contact details
7. Visitor submits booking request
8. System records the booking
9. Family operator confirms it
10. Guest receives My Trip information
11. If deposit exists → status becomes DEPOSITED
12. Guest takes the tour
13. Status becomes COMPLETED
14. Request review
```

---

# 10. Minimum Booking Data

## Customer

- Name
- Phone
- Email
- Language

## Tour

- Tour
- Date
- Time slot
- Guest count

## Logistics

- Pickup required
- Pickup location
- Notes

## Status

- Booking status
- Confirmation status

## Payment

- Deposit
- Remaining amount
- Payment status

## Marketing

- Source
- Campaign
- Referral code
- Partner

## Internal

- Assigned operator
- Internal notes

---

# 11. Metrics to Track

## Traffic

- Website visitors.
- Traffic source.
- Top landing pages.

## Conversion

- CTA clicks.
- Form submissions.
- Zalo clicks.
- Phone clicks.
- WhatsApp clicks when the channel is enabled.
- Maps clicks.

## Sales

- Leads.
- Confirmed bookings.
- Guest count.
- Revenue.
- Average booking value.

## Marketing

- Bookings from TikTok.
- Bookings from Facebook.
- Bookings from Google.
- Bookings from Google Maps.
- Bookings from hotels/homestays.
- Bookings from creators.

## Operations

- Cancellation rate.
- No-show rate.
- Deposit rate.

## Reputation

- Google review count.
- Average rating.
- Referral bookings.

---

# 12. Explicitly Out of Scope for Early Versions

Do not build early:

- Mandatory customer accounts.
- Social network features.
- AI chatbot just for novelty.
- Complex interactive maps.
- Gamification.
- Loyalty program.
- Bulk push notifications.
- Native app.
- Complex role system.
- Large CRM.
- Heavy animation.
- Too many tours before the primary tour sells consistently.

---

# 13. Definition of Done by Release

## V1

- [ ] Works well on mobile.
- [ ] Pricing is clear.
- [ ] Itinerary is clear.
- [ ] Maps location is correct.
- [ ] CTAs work.
- [ ] Zalo works.
- [ ] Booking form works.
- [ ] Basic tracking exists.
- [ ] Real photos exist.
- [ ] Reviews/social proof exist.
- [ ] Required Vietnamese content is complete and usable.

## V1.5

- [ ] Add to Home Screen works.
- [ ] PWA icon exists.
- [ ] Offline fallback exists.
- [ ] Important pages are cached.
- [ ] My Trip tolerates weak connectivity.

## V2

- [ ] Booking has a code.
- [ ] Booking has a status.
- [ ] Availability exists.
- [ ] Dashboard exists.
- [ ] My Trip exists.
- [ ] Booking source is stored.

## V2.5

- [ ] Referral links exist.
- [ ] Partner codes exist.
- [ ] Source reporting exists.
- [ ] Review flow exists.
- [ ] Campaign landing pages exist.

## V3

- [ ] Deposit/payment works.
- [ ] Revenue dashboard exists.
- [ ] Payment status is tracked.
- [ ] Cancellation/refund flow exists.
- [ ] Manual operational work is materially reduced.

---

# 14. Roadmap Summary

```text
V0
Content + Positioning
        ↓
V1
Website That Sells Tours
        ↓
V1.1
Conversion Optimization
        ↓
V1.5
PWA
        ↓
V2
Booking System
        ↓
V2.5
Referral + Marketing Engine
        ↓
V3
Payment + Operations
        ↓
V4+
Scale
```

---

# 15. Anti-Scope-Creep Rule

Before adding any feature, ask:

1. Does it increase bookings?
2. Does it increase trust?
3. Does it reduce manual work?
4. Is there a real current pain point that requires it?

If the answer to all four is “no,” move it to the backlog.

---

# 16. Product North Star

The product succeeds when:

```text
Visitors understand quickly
          ↓
Visitors trust the operator
          ↓
Visitors can book easily
          ↓
The family can manage bookings easily
          ↓
Marketing sources are measurable
          ↓
Marketing can improve using real data
```

**Priority order: Booking > Trust > UX > Analytics > Automation > Feature Count.**
