---
name: Suitcase Draft
tagline: Family Packing as a Snake Draft, With a Weight Budget and a Referee
pitch: Draft who packs what for a family trip, flag the duplicates, and close each bag with a photo.
domains: [GAME, PROD]
created: 2026-10-22T05:02:31Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Packing for a family trip as a fantasy draft. The app lists everything the trip needs (clothes per person, baby gear, chargers, medicines, the crib sheet nobody remembers) and travelers pick items in snake-draft turns. Owning an item means owning its packing. The referee layer flags three phone chargers drafted by three people, enforces a weight budget per bag, and assigns a "bag captain" who closes each bag with a photo before departure. Undrafted essentials at the end trigger a final scramble round.
- **Core Problem & Target User:** Packing for a family with kids means one person carries the whole mental list, things get packed twice or not at all, and the car leaves late. Target user: a parent packing for several people who wants the load shared and the forgetting to stop.
- **Core Value Proposition:** Turn the worst pre-trip chore into a ten-minute game that produces a fair, complete, photographed packing state.

#### 2. USER STORIES

- **Primary User Story:** "As a parent, I want the packing list split fairly by draft, so that I stop carrying the whole mental load alone."
- **Secondary User Story:** "As a traveler, I want a photo of each closed bag with its contents list, so that repacking at the hotel takes minutes."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The draft | Trip setup (travelers, bags, days, weather hint), a generated item list, snake-draft turns on one shared screen, duplicate detection, and a per-bag weight budget. | Day 1 PoC |
| Core Mechanism: Bag close | Per-bag contents view, captain assignment, and a closing photo stored with the list for the return trip. | Day 1 PoC |
| Expansion 1: Templates | Reusable packing templates by trip type (weekend, ski, baby visit), learned item weights, and a "last time you forgot" reminder fed by trip history. | Month 1 MVP |
| Expansion 2: Multiplayer | Real-time draft on several phones, kid-friendly pick mode with pictures, and airline cabin rules per carrier. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. A seeded item library per traveler type (adult, child, infant), draft state machine in localStorage, photo via the device camera API. No backend.
- **Core 24-Hour Demo Flow:** Create a trip for 5 adults, 2 kids and a baby, run the draft pass-and-play on one phone, watch the duplicate warning fire on the third charger, then close a bag with a photo. **Aha moment:** the undrafted-items alarm catches the crib sheet before the door closes.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** A demo trip loads mid-draft so the duplicate flag fires within thirty seconds.
- **Growth Vector:** The closed-bag photo card is shareable to the family chat, where every other parent immediately wants one.

#### 6. RISKS & MITIGATION

- **Scope Creep:** Airline rules and item databases. Mitigation: Day 1 ships one generic library with manual add, no carrier data.
- **Engagement:** Seasonal use. Mitigation: templates and history make the second trip one minute of setup, which is the retention hook.
- **UX risk:** Draft turns feel slow for small trips. Mitigation: a quick-assign mode keeps the referee and photo features without the full draft.
