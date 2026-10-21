---
name: Tide Table
tagline: Build a Tiny Island Before the Sea Comes Back
pitch: Place buildings on a procedural island, then watch the tide flood the low tiles at the end of each round.
domains: [3D, GAME]
created: 2026-10-20T17:35:17Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** A two-player pass-and-play board game on a procedural 3D island that breathes with the tide. On your turn you place a building tile or raise land; at the end of each round the sea level rises or falls by a seeded amount and floods low tiles. Terrain is the game clock, so the board changes under your plans instead of staying static.
- **Core Problem & Target User:** Casual board games feel static on screen, and 3D toy worlds lack stakes. Target user: couples or friends wanting a quick social game on one device.
- **Core Value Proposition:** A 10-minute strategy duel where reading the tide is the skill.

#### 2. USER STORIES

- **Primary User Story:** "As a player, I want the board terrain to flood and recede each round, so that every turn is a new tactical puzzle."
- **Secondary User Story:** "As a developer-minded player, I want seeded islands, so that we can replay and compare the same map."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: Place, flood, score | Seeded 8x8 heightmap island in React Three Fiber, two players alternate placing houses or raising a tile, a tide step floods tiles below water level, score is dry houses after 8 rounds. | Day 1 PoC |
| Expansion 1: Tide cards and biomes | Tide forecast cards, tile types (farm, tower, dyke), island seeds by date, undo, sound, local match history. | Month 1 MVP |
| Expansion 2: Online and campaign | Async play via shareable move strings, AI opponent, campaign of handcrafted islands, sea-level storms, daily challenge island. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS, React Three Fiber with drei. Simplex noise heightmap, instanced boxes, animated water plane. Game state in a reducer, localStorage for the last seed. No backend.
- **Core 24-Hour Demo Flow:** Open, tap Play, place two houses, press End Round, and watch the water climb and swallow one of them. **Aha moment:** within 30 seconds you learn the tide rule by losing a house.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** One screen, no rules page: the first flood teaches the mechanic.
- **Growth Vector:** A daily seeded island and a shareable move string invite friends to beat your score.

#### 6. RISKS & MITIGATION

- **Scope Creep:** Rules can balloon. Mitigation: only two actions and one flood rule for the PoC.
- **Technical:** Water animation and flooding logic can desync. Mitigation: compute flood on the grid first and render from state.
- **Retention/Engagement:** Pass-and-play needs two people. Mitigation: a simple AI opponent and daily solo challenge by Month 3.
