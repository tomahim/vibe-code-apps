---
name: Paper Kingdoms
tagline: Sealand, Hutt River, Christiania - A Gazetteer of the Countries That Almost Existed
pitch: Explore the world's micronations and unrecognized states through sourced dossiers - founders, constitutions, stamps, currencies and fates - pinned to the map.
domains: [HIST, LEARN]
created: 2026-11-02T06:02:53Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** For every recognized country there is a stranger shadow: a sea fort that declared itself a principality, a farm that seceded over wheat quotas, a neighborhood that runs on its own flag. Paper Kingdoms is a gazetteer of these almost-countries. Each dossier reads like an almanac entry for a place that cartography refused: the founder and the grievance that started it, the constitution (often real, frequently charming), the stamps and currency it actually issued, its encounters with the real state (court cases, standoffs, indifference), and its fate - extant, dissolved, or legendary. A map layer pins every kingdom to the territory it claimed, and a recognition ladder sorts the whole collection from "disputed state with embassies" down to "one man, one balcony, one flag."
- **Core Problem & Target User:** Micronation lore is scattered across novelty listicles and dead personal websites, told for laughs and stripped of the genuinely interesting questions they raise: what makes a state a state, who gets to say so, and why people keep founding them. Target user: geography and history nerds, vexillology and stamp-collecting types, teachers looking for a civics hook, and anyone who enjoyed learning that Sealand has a royal family.
- **Core Value Proposition:** The internet's most charming rabbit hole, done properly: sourced, organized dossiers on every significant micronation and unrecognized state, explorable by map, era and recognition status.

#### 2. USER STORIES

- **Primary User Story:** "As a curious reader, I want sourced dossiers on micronations pinned to a map, so that I can explore the almost-countries of the world in one trustworthy place."
- **Secondary User Story:** "As a teacher or collector, I want the recognition ladder and the founding documents surfaced, so that the collection teaches what statehood actually means instead of just being trivia."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The dossier | Almanac-style entries (founder, grievance, constitution, stamps and currency, encounters with the real state, fate) with sources cited per claim. | Day 1 PoC |
| Core Mechanism: The claims map | Every kingdom pinned to the territory it claimed, browsable by era and filterable along the recognition ladder. | Day 1 PoC |
| Expansion 1: The archive | Scanned founding documents, stamps and flags gallery, timelines per kingdom, and themed collections (sea platforms, tax revolts, artist republics). | Month 1 MVP |
| Expansion 2: The foreign desk | New and active micronations tracked as they declare and dissolve, a "visit" layer for ones you can actually travel to, and community submissions with source review. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS with a map library and a bundled launch collection of about twenty well-documented kingdoms (Sealand, Hutt River, Christiania, Molossia, and peers), each dossier written from cited public sources. Dossier view, map view, ladder filter. No backend, no accounts; all content static.
- **Core 24-Hour Demo Flow:** Open the map: pins off the English coast, the Australian wheat belt, Copenhagen. Tap the fort: Prince Paddy Roy Bates, a 1967 declaration, a constitution, stamps, a 1978 coup attempt, and a court ruling - all sourced. Slide the recognition ladder and watch the serious claimants separate from the balconies. The "Aha!" moment: realizing the absurd ones and the legally interesting ones are often the same pin.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** Sealand alone is a perfect five-minute dossier, and the map format makes "what almost-countries are near me?" a one-tap question.
- **Growth Vector:** Dossiers are supremely shareable ("did you know this platform has a constitution?"), the visit layer turns reading into travel plans, and collectors (stamps, coins, flags) bring established communities.

#### 6. RISKS & MITIGATION

- **Accuracy risk:** Micronation coverage is full of myth and self-promotion. Mitigation: every dossier cites sources per claim, founder claims are labeled as claims, and the ladder explicitly separates documentation from declaration.
- **Sensitivity risk:** Some unrecognized states involve real conflict, occupation or tragedy. Mitigation: contested-territory dossiers follow neutral encyclopedic framing, distinguish hobbyist micronations from conflicted unrecognized states, and route politics to sources rather than taking sides.
- **Scope creep risk:** Forums, citizenship sales, crypto-nations. Mitigation: the atlas documents; it never sells, endorses, or facilitates any kingdom's offerings.
