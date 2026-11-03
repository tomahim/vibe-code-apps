---
name: The Team Sheet
tagline: Sunday League, Run Properly - Availability Tuesday, Lineup Friday, Report by Full Time
pitch: An amateur team manager in one flow: weekly availability poll, lineup builder with positions, and a match report that writes itself from events logged live.
domains: [SPORT, PROD]
created: 2026-11-03T06:02:48Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Every amateur team is run out of a chaotic group chat: "who's in Sunday?" buried under forty messages, the lineup decided in the car park, the match forgotten by Wednesday. The Team Sheet gives one volunteer manager the workflow of a professional club at five-a-side scale. Tuesday: the availability poll goes out and players tap in, out or maybe. Friday: the lineup builder shows who is available on a pitch view - drag names onto positions, see who is missing, share the sheet as one clean image. Sunday: live mode logs goals, assists and cards with two taps per event - and at the final whistle the app writes the match report: a deadpan, league-website-style account of the game built from your events, ready to paste back into the same group chat that used to drown the poll.
- **Core Problem & Target User:** The amateur manager's job is real work done for love with zero tooling: chasing availability, balancing sides, remembering who scored. The information exists, scattered and lost weekly. Target user: the one organizer every five-a-side, Sunday-league or workplace team has, plus captains of small clubs who want a season record without admin overhead.
- **Core Value Proposition:** Three recurring chores (availability, lineup, match report) collapsed into one flow that takes minutes a week and leaves the group chat for what it is good at.

#### 2. USER STORIES

- **Primary User Story:** "As a team organizer, I want availability, lineup and match report in one weekly flow, so that running the team stops eating my evenings."
- **Secondary User Story:** "As a player, I want to tap my availability and see the sheet and the report in the chat, so that I always know when and where I am playing without scrolling."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The weekly poll | Availability poll per match with in/out/maybe, a roster of regulars, and a counts view (who answered, who is being chased). | Day 1 PoC |
| Core Mechanism: The sheet and the report | Pitch-view lineup builder placing available players by position, plus live two-tap event logging that compiles into a written match report. | Day 1 PoC |
| Expansion 1: The season book | Season stats (appearances, goals, availability rate), shareable lineup and report cards as images, and opponent and venue records. | Month 1 MVP |
| Expansion 2: The club | Multiple teams, player self-service (own stats and schedule), payment tracking for pitch fees, and league-table import from the FA or league site where one exists. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. Roster editor, the weekly poll (locally simulated responses for the demo), the drag-and-drop pitch view, live event log (goal, assist, card per tap), and the report generator templating prose from events. localStorage only; no backend, no accounts on day 1; sharing via generated images and copy-paste text. Mobile-first.
- **Core 24-Hour Demo Flow:** Open Tuesday: poll out, eleven names, six in, two maybe. Friday: drag the available onto the pitch, share the sheet. Sunday: log two goals and one ludicrous yellow card, full time, and read the generated report: "The away end (three girlfriends and a dog) erupted when..." The "Aha!" moment: a real match report written before the boots are off.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** The demo week runs end to end in three minutes, and every organizer recognizes their own Sunday in it instantly.
- **Growth Vector:** Adoption is viral by design - the report lands in the group chat where the next team's organizer reads it, and season stats give players a reason to keep the app honest.

#### 6. RISKS & MITIGATION

- **Coordination risk:** The poll fails if players must install an app. Mitigation: day one works manager-only with responses recorded on their behalf; link-based player responses arrive with the Month 1 backend, no install required for players ever.
- **Tone risk:** The generated report could feel generic fast. Mitigation: deadpan house style with rotating constructions, manager-editable before sharing, and events carry one optional color note each ("that tackle") that the report weaves in.
- **Scope creep risk:** Tactics analysis, video, payments complexity. Mitigation: the weekly loop (poll, sheet, report) is the product; everything else is a feature of the season book, not the loop.
