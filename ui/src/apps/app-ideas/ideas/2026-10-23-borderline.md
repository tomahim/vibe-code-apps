---
name: Borderline
tagline: Guess the French Commune From Its Outline Alone
pitch: One commune silhouette a day, five guesses, proximity hints - Wordle for French geography nerds.
domains: [GAME, LEARN]
created: 2026-10-23T05:03:11Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** France has about 35,000 communes, each with a real, often absurd outline: communes shaped like a boot, a star, a dog's head. The app shows one commune silhouette per day, drawn from open geographic data, and you guess which one it is. Each wrong guess earns a hint: the department number, the region, the population band, then the distance and direction from your last guess. Streaks track consecutive solves, and a weekly mode swaps communes for department or country outlines. Because the shapes are real administrative boundaries, the game quietly teaches the geography of wherever the player lives.
- **Core Problem & Target User:** Geography games are either world-scale capitals trivia or full map explorers that demand time. Target user: a map lover who wants a two-minute daily ritual with a French local flavor, playable while the coffee brews.
- **Core Value Proposition:** A daily silhouette puzzle that turns the odd shapes of real communes into a streak game and a geography lesson at once.

#### 2. USER STORIES

- **Primary User Story:** "As a geography fan, I want one commune outline to guess each day, so that I get a quick daily puzzle with a local twist."
- **Secondary User Story:** "As a player, I want hints that narrow by distance and direction from my guesses, so that even an unknown commune stays solvable through reasoning."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: Daily outline | A seeded daily commune pick, its simplified silhouette rendered on a plain background, five guesses with autocomplete over commune names, hint ladder (department, region, population, distance-direction), streak counter in localStorage. | Day 1 PoC |
| Core Mechanism: Share card | A spoiler-free result card (grid of hint emojis, guesses used) that copies to the clipboard for the family chat. | Day 1 PoC |
| Expansion 1: Modes | Departments and countries outline modes, a practice mode with unlimited random silhouettes, and a "my department only" filter so players learn their own area first. | Month 1 MVP |
| Expansion 2: Social and depth | Friend leaderboards by invite link, silhouette facts after the solve (why the border zigzags: a river, a ridge, an 1808 decree), and a map view of all communes solved so far. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. A static JSON of preprocessed commune outlines (simplified polygons, a few hundred communes to start) bundled with the app, name autocomplete from the same file, seeded daily pick by date, haversine for distance hints. No backend, no external API at runtime.
- **Core 24-Hour Demo Flow:** Open to today's silhouette (a recognizable boot-shaped commune), type three wrong guesses, watch the hint ladder narrow it, solve on the fifth try, and copy the share card. **Aha moment:** the solved silhouette drops onto a tiny map of France and you see where the odd shape actually lives.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** The first silhouette is a famously shaped commune most locals recognize, so the first solve lands within a minute.
- **Growth Vector:** The spoiler-free share card travels through family and colleague chats, and the daily cadence gives groups a reason to compare scores every morning.

#### 6. RISKS & MITIGATION

- **Content scale:** 35,000 outlines is a lot of preprocessing. Mitigation: Day 1 ships a curated few hundred; the full dataset is an Expansion 1 batch job, not a runtime dependency.
- **Difficulty spread:** Obscure hamlets frustrate casual players. Mitigation: the daily pick weights population so weekdays are guessable and Sundays are savage, labeled as such.
- **Data licence:** Administrative boundaries come from open government data. Mitigation: verify the licence (usually open with attribution) during the PoC and ship the attribution line in the app.
