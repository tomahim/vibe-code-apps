---
name: The Minutes
tagline: Your Household, Formally Recorded - Mock-Official Minutes of the Meetings Your Life Actually Holds
pitch: Turn everyday domestic events into deadpan formal meeting minutes - motions, votes, action items - kept as a bound archive of your household's secret history.
domains: [WRITE, MEDIA]
created: 2026-10-26T06:02:31Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Every household and friend group runs on unacknowledged governance: disputes, motions carried, standing rules nobody wrote down. The Minutes makes it official, in deadpan corporate formality. After any domestic event - the thermostat negotiation, the seating-chart incident, the dishwasher-loading controversy - you open a session and the app walks you through proper minutes: attendees (with titles like "Minister of the Remote"), agenda items, motions proposed and seconded, votes recorded, action items assigned with owners and deadlines, and one line of "matters arising" from last week's unresolved business. The writing assist keeps the register pitch-perfect ("The Committee notes with concern the state of the fridge. Motion: that Someone deal with it. Carried, 2-1, one abstention"). Sessions file into a bound volume per household, action items gently resurface until resolved or formally abandoned, and the annual general meeting compiles the year's statistics: motions tabled, most-litigated topic, longest-standing action item.
- **Core Problem & Target User:** Family and flatmate life generates comedy that evaporates; group chats bury it, and nobody keeps the record. Target user: couples, flatshares and friend groups with an ear for absurdity, and anyone who has ever said "we should write this down" after a ridiculous negotiation.
- **Core Value Proposition:** Your domestic life, immortalized in the language of a board meeting - a writing ritual that turns minor friction into a shared archive of comedy you'll reread for decades.

#### 2. USER STORIES

- **Primary User Story:** "As a household member, I want to minute a domestic event in proper formal style with guided structure, so that our everyday absurdities become a written record."
- **Secondary User Story:** "As a group, I want a bound archive with action items that resurface and an annual general meeting summary, so that our governance accumulates into legend."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The session | A guided minutes flow (attendees with titles, agenda, motions with seconder and vote tally, action items with owners, matters arising), with a register-perfect writing assist offering formal phrasings. | Day 1 PoC |
| Core Mechanism: The volume | A bound archive per household with numbered sessions, an action-item ledger with states (outstanding, discharged, formally abandoned), and full-text search. | Day 1 PoC |
| Expansion 1: The committee | Shared households where members get notified of motions concerning them, countersign minutes, propose amendments ("the record fails to note WHO left the light on"), and vote remotely. | Month 1 MVP |
| Expansion 2: The AGM | An annual general meeting compilation with statistics and awards (most motions, longest unresolved item, filibuster of the year), printable bound volumes, standing orders and constitutional amendments, and guest observers with read-only access. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. Single-household demo with the guided session flow, two seeded historic sessions for texture, the action-item ledger, and a ledger-book visual style (ruled paper, serif, session seals). All local.
- **Core 24-Hour Demo Flow:** Minute "the thermostat negotiation": attendees get titles, the motion "that the temperature be set to 21 degrees" is proposed, seconded, and carried 2-1 with one recorded grievance; an action item is assigned ("Minister of the Remote to source blankets"). **Aha moment:** reading the finished minutes aloud - your ordinary argument rendered in flawless bureaucratese, and the group is already asking to minute the next thing.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** "Your household just held a meeting. Minute it." - the template is pre-filled with a thermostat dispute anyone can edit into their own life in ninety seconds.
- **Growth Vector:** Minutes are screenshot-gold and inherently shared between the people in them; the AGM year summary is a December ritual, and every flatshare that tries it recruits its successor households.

#### 6. RISKS & MITIGATION

- **Tone misfires:** Formality jokes about real grievances can sting. Mitigation: the register stays affectionate and self-aware, templates steer toward the gently absurd, and the app never minutes sensitive topics by suggestion - the user chooses every agenda item.
- **Writing-assist sameness:** If every minute reads alike, the comedy flattens. Mitigation: the assist offers varied phrasings and learns the household's recurring vocabulary (titles, standing jokes), and free text is always one tap away.
- **Collaboration consent:** Being named in minutes without seeing them can rankle. Mitigation: shared households require member consent, members see every minute that names them, and amendment and dissent are first-class features, not afterthoughts.
- **Ritual decay:** Novelty apps fade after the first laugh. Mitigation: the action-item ledger and matters-arising chain sessions into an ongoing governance story, and the AGM gives the archive a destination.
