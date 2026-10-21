---
name: Run Wrapped
tagline: Your Strava Season as a Set of Ridiculous, Shareable Stat Cards
pitch: Your Strava season as deadpan, shareable stat cards mined from your own data.
domains: [SPORT, MEDIA]
created: 2026-10-21T05:57:41Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** A Wrapped-style recap, but built to be funny rather than flattering. From a Strava export it mines the stats nobody shows you: your most common excuse hour (the time you actually start runs), the ratio of "easy" runs that were not easy, the climb you have done more often than anyone sane, total vertical expressed as "times up the Eiffel Tower", longest break and its excuse window, and your single most average run. Each finding becomes a bold shareable card with deadpan copy.
- **Core Problem & Target User:** Strava stats are serious dashboards; fun recaps happen once a year and only if the platform builds them. Target user: a runner who wants to laugh at his own data and share it in his club chat.
- **Core Value Proposition:** Drop an export, get 10 cards that are actually funny, accurate, and ready to share.

#### 2. USER STORIES

- **Primary User Story:** "As a runner, I want unexpected stats mined from my own history, so that I see my habits in a way a dashboard never shows."
- **Secondary User Story:** "As a social runner, I want each stat as a clean shareable card, so that I can post it to my running group."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: Mine and card | Strava export CSV parsing in the browser, 12 stat miners (time-of-day, pace honesty, repeat climbs, Eiffel equivalents, streaks), a card carousel with bold typography, PNG export per card. | Day 1 PoC |
| Expansion 1: FIT files and seasons | FIT and GPX parsing, per-season recaps, card themes, comparison mode between two seasons, local processing only, share links as images. | Month 1 MVP |
| Expansion 2: Live sync and group wrapped | Strava OAuth sync, monthly mini-wrapped, club wrapped comparing anonymised group stats, race-day special card, printed poster export. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. CSV parsing with a small hand-rolled parser, stat miners as pure functions, html-to-image for card PNG export. localStorage only. No backend, data never leaves the browser.
- **Core 24-Hour Demo Flow:** Drop the bundled sample export, and the first card flips over: "72% of your 'easy' runs were under 75% HR max. Sure." **Aha moment:** within 30 seconds a stat makes you laugh because it is true.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** A sample athlete's cards are visible before you upload anything.
- **Growth Vector:** The cards are built for sharing, each one carries the app name.

#### 6. RISKS & MITIGATION

- **Scope Creep:** Every conceivable stat. Mitigation: 12 curated miners in the PoC.
- **Technical:** Strava export format variants. Mitigation: support the activities CSV first, show a clear error otherwise.
- **Retention/Engagement:** Recap is inherently occasional. Mitigation: monthly mini-wrapped in the MVP stage.
