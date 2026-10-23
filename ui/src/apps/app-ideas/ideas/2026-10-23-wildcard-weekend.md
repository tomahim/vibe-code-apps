---
name: Wildcard Weekend
tagline: Draw Three Constraint Cards, Then Have the Micro-Adventure They Demand
pitch: The app deals you a budget, a radius and a weird rule, and your weekend micro-adventure must honor all three.
domains: [GAME, SPORT]
created: 2026-10-23T05:03:12Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Deciding what to do this weekend is the hard part; the app removes the decision by dealing it. You draw three constraint cards: a budget card (under 15 euros total), a radius card (stay within 20 km, no car allowed), and a wildcard rule (must include water, must bring back one photo of something round, must talk to one stranger about their street). The combination is the adventure brief. You head out, log the proof (photos, a GPS trace, one line of journal), and the completed brief joins a wall of past weekends as a polaroid grid. Failed briefs can be re-rolled once, but re-rolling costs you the streak.
- **Core Problem & Target User:** Weekends evaporate into default plans, and people who would love a small adventure never pick one. Target user: a parent or young adult who wants to be out the door in ten minutes with a plan that feels like a dare rather than a chore.
- **Core Value Proposition:** Turn "what should we do this weekend" into a card draw, a dare, and a growing wall of proof that your weekends are interesting.

#### 2. USER STORIES

- **Primary User Story:** "As a parent, I want to draw a ready-made adventure brief on Saturday morning, so that we are out the door before the kids finish breakfast."
- **Secondary User Story:** "As a player, I want each finished brief saved as a polaroid with its photo and trace, so that the year of weekends becomes a wall I am proud of."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The draw | Three card decks (budget, radius, wildcard), a satisfying card-draw animation, the combined brief rendered as one readable sentence, one re-roll per weekend. | Day 1 PoC |
| Core Mechanism: Proof wall | Mark the brief done with a photo and an optional GPS trace import, rendered as a polaroid on a scrollable wall, streak of consecutive weekends. | Day 1 PoC |
| Expansion 1: Smarts | Season-aware and weather-aware decks (no river cards in a storm), kid-mode deck with gentler wildcards, and suggested spots near you that satisfy the drawn radius. | Month 1 MVP |
| Expansion 2: Social | Weekend challenges shared with another family (same seed, same cards, compare polaroids), a yearly wrapped of your adventures, and custom cards written by the family itself. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. Three JSON card decks, a seeded weekly draw (same cards all weekend for everyone in a family), photos via the device camera API, polaroid wall in localStorage. No backend.
- **Core 24-Hour Demo Flow:** Draw "under 10 euros, 5 km on foot, must photograph something blue taller than you", complete it with a photo of a blue door, and pin the polaroid to the wall. **Aha moment:** the re-roll costs the streak, so keeping a weird brief feels like a decision with weight.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** The first draw happens on first open with no setup, so the brief exists before any account or preference form could kill the momentum.
- **Growth Vector:** The polaroids are built to be shared, and the same-seed family challenge spreads the app one family at a time through group chats.

#### 6. RISKS & MITIGATION

- **Content fatigue:** A static wildcard deck repeats within months. Mitigation: wildcards are combinatorial fragments (subject, action, constraint) so fifty cards yield thousands of briefs; family-written cards extend it further.
- **Safety:** Dares must never push risky behavior. Mitigation: the deck is curated wholesome, location suggestions stay in public places, and nothing ever asks users to trespass or spend unsafely.
- **Weather and seasons:** A rigid deck deals impossible briefs. Mitigation: Expansion 1 filters by season and weather; Day 1 simply avoids weather-dependent cards.
