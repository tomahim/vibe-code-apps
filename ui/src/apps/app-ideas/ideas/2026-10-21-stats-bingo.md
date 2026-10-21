---
name: Stats Bingo
tagline: Your Strava History Secretly Fills a Bingo Card of Absurd Achievements
domains: [SPORT, GAME]
created: 2026-10-21T05:57:42Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** A bingo card where every square is a weird running achievement, filled retroactively from your Strava data: "ran exactly 10.00 km", "ran on your birthday", "negative split", "ran in the rain 3 weeks in a row", "finished a run at 23:5x", "climbed more than 1000 m before 8 am". You never chase squares directly; new runs just dab themselves. Full lines unlock badges, and a season blackout (all 25) is the long game.
- **Core Problem & Target User:** Achievements in running apps are predictable (distance, streak). Target user: a runner who wants surprise and delight from his own history and a long-term collection goal.
- **Core Value Proposition:** Every run you already did becomes a reveal, and future runs carry a little suspense about what they might dab.

#### 2. USER STORIES

- **Primary User Story:** "As a runner, I want a bingo card of quirky achievements filled from my data, so that my history surprises me."
- **Secondary User Story:** "As a collector, I want line and blackout badges with dates, so that I have a long-term goal beyond pace and distance."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The card | Strava export CSV parsing, 25 square checkers as pure functions, a bingo grid with dab animations, line detection, badge reveal. | Day 1 PoC |
| Expansion 1: Card generator | New card each season from a pool of 100 squares, FIT and GPX support, per-square evidence (which run dabbed it), shareable card image, local storage. | Month 1 MVP |
| Expansion 2: Live dab and duels | Strava OAuth sync with dab notifications after each run, friend cards from the same seed for blackout races, weekly near-miss report ("2 squares from a line"). | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. Square checkers as pure functions over parsed activities, localStorage for the card. No backend, data stays local.
- **Core 24-Hour Demo Flow:** Drop the sample export and watch squares dab themselves one by one until a line completes and a badge pops. **Aha moment:** within 30 seconds you have 9 squares you never knew you earned.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** The retroactive fill is the demo: your own past does the work.
- **Growth Vector:** Same-seed friend cards turn the season into a blackout race.

#### 6. RISKS & MITIGATION

- **Scope Creep:** Hundreds of square ideas. Mitigation: 25 hand-picked squares for the PoC.
- **Technical:** Some squares need weather data. Mitigation: PoC squares use only activity fields; weather squares come with API access later.
- **Retention/Engagement:** Card fills and ends. Mitigation: seasonal cards and the blackout long game.
