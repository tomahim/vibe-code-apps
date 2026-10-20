---
name: Hand of Miles
tagline: Draw This Week's Workouts From a Deck and Play Them Your Way
domains: [SPORT, GAME]
created: 2026-10-20T20:17:04Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Training planning as a card game. On Monday you are dealt a hand of 6 workout cards (Long Slog, Hill Hunters, Tempo Bluff, Easy Bridge, Wild Card). You must play 4 cards by Sunday, in any order, subject to rules such as "no two hard cards back to back". Each card played scores points and combos, so planning the week is a puzzle you solve before you ever lace your shoes.
- **Core Problem & Target User:** Rigid plans fail when life shifts, and open weeks lack direction. Target user: a runner training 4 times a week who wants structure with flexibility and a game around choice.
- **Core Value Proposition:** A flexible weekly plan that feels like a game hand, which gets you out because the combo is on the line.

#### 2. USER STORIES

- **Primary User Story:** "As a runner with a shifting schedule, I want to choose which workout to play each day from a hand, so that my week adapts without feeling like failure."
- **Secondary User Story:** "As a competitive runner, I want combo scores and a seasonal high score, so that I push for a better week."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: Deal, play, score | A deck of 15 workout cards with intensity and points, a Monday deal of 6, a week board with 7 slots, a rule check (no back-to-back hard days), a "mark as run" button, and a weekly score with combos. | Day 1 PoC |
| Expansion 1: Deck building and import | Earn new cards by milestones, tune the deck to a race goal, import runs from GPX or Strava export to auto-play cards, seasonal leaderboard (local), draw history. | Month 1 MVP |
| Expansion 2: Coach modes and duels | Taper and peak decks for a target race, weekly duels with a friend on the same hand, Strava OAuth sync, calendar export of the played hand. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. Deck as JSON, seeded shuffle by week number, drag or tap to place cards, localStorage for the week. Mobile-first.
- **Core 24-Hour Demo Flow:** Open the app, see your hand, drop three cards on the week board, and watch the combo counter light up when the order is smart. **Aha moment:** under 30 seconds you realise a better order scores double.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** The first hand is dealt on open, with no setup.
- **Growth Vector:** Share your hand and score card, and challenge a friend with the same seed.

#### 6. RISKS & MITIGATION

- **Scope Creep:** Game design can sprawl. Mitigation: 15 cards, one rule, one combo in the PoC.
- **Technical:** Card values could encourage reckless intensity. Mitigation: the rule check and a recovery bonus.
- **Retention/Engagement:** Hands may feel repetitive. Mitigation: unlockable cards, seasons, and duels.
