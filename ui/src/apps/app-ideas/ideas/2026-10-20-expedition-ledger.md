---
name: Expedition Ledger
tagline: Cross History's Great Routes One Training Week at a Time
pitch: Your weekly kilometres move a caravan along a real historic route, unlocking a journal card at every checkpoint.
domains: [SPORT, HIST, GAME]
created: 2026-10-20T20:17:03Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Virtual challenge apps drop you on a generic map. Here your weekly kilometres and climbing walk a real historic expedition, such as Hannibal's Alpine crossing, a Silk Road leg, or the Camino, and every checkpoint you reach unlocks a short journal card written as the era's travelogue. Your 4 runs a week are the pace of a caravan, and the story only moves when you do.
- **Core Problem & Target User:** Weekly totals feel anonymous, and history is usually read passively. Target user: a runner who likes lore and long journeys and wants a narrative reason to log kilometres.
- **Core Value Proposition:** Every run advances a story you want to finish, and you learn real history on the way.

#### 2. USER STORIES

- **Primary User Story:** "As a runner, I want my distance to move me along a historic route, so that each run pushes a story forward."
- **Secondary User Story:** "As a history fan, I want checkpoint journal cards with real context, so that I learn something at every milestone."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: Kilometres move the caravan | One route of 12 checkpoints with distances and elevation, a run entry form, an SVG route map with a moving marker, and unlockable journal cards at each checkpoint. | Day 1 PoC |
| Expansion 1: Route library and imports | 8 routes with sources, GPX and Strava export import, elevation-weighted progress, route choice by season, local progress and a trophy shelf. | Month 1 MVP |
| Expansion 2: Shared expedition | Co-op expeditions with friends (combined kilometres), a 3D terrain flyover of the route, Strava OAuth sync, printable travelogue of your journey. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. Route and journal data as JSON, SVG path with a marker animated along it, localStorage for progress. Mobile-first.
- **Core 24-Hour Demo Flow:** Open the app on checkpoint 3, log a 15 km run, watch the marker travel to the next pass and unlock a journal card. **Aha moment:** under 30 seconds you read the first card and want the next one.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** Start with a pre-selected famous route and one-tap logging.
- **Growth Vector:** Share a travelogue card at each milestone, and invite friends into a co-op crossing.

#### 6. RISKS & MITIGATION

- **Scope Creep:** Researching many routes is heavy. Mitigation: one carefully sourced route for the PoC.
- **Technical:** Route data accuracy. Mitigation: label approximate distances and cite sources in each card.
- **Retention/Engagement:** A finished route ends the story. Mitigation: a library of routes and seasonal expeditions.
