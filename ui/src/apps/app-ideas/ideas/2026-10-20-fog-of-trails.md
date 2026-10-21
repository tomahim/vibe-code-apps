---
name: Fog of Trails
tagline: Reveal a Procedural 3D World With Every Kilometre You Run
pitch: Every run you log clears fog on a procedural 3D landscape, revealing a world seeded just for you.
domains: [SPORT, 3D, GAME]
created: 2026-10-20T20:14:03Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Your running log becomes a fog-of-war exploration game. A huge procedural 3D landscape is hidden under fog, and each kilometre you run (from a Strava export or a GPX file) clears a path of fog along a mirrored trail across the map. Elevation gain raises mountains, long runs reveal landmarks, and the world is seeded so it is unique to you. You do not unlock stats, you unlock places.
- **Core Problem & Target User:** Training logs are numbers, and motivation on a cold evening is hard to find. Target user: a trail or ultra runner who trains 4 times a week and is curious about the next valley more than the next pace chart.
- **Core Value Proposition:** A concrete reason to run today: you want to see what is behind the fog.

#### 2. USER STORIES

- **Primary User Story:** "As a runner, I want each run to reveal part of a 3D world, so that going out for a run feels like exploring."
- **Secondary User Story:** "As a data-minded athlete, I want to see my weekly distance and climbing as terrain, so that I read my training at a glance."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: Runs clear fog | Drop GPX files (or a sample set), generate a seeded noise terrain in React Three Fiber, convert each run to a winding path that clears fog radius proportional to distance and raises terrain by D+. | Day 1 PoC |
| Expansion 1: Landmarks and Strava export | Landmarks unlocked by milestones (100 km, 5000 m D+), Strava export CSV and FIT parsing, weekly "next fog edge" teaser, seed by user name, local save. | Month 1 MVP |
| Expansion 2: Living world | Biomes by running time of day, seasons that follow the real calendar, race countdown as a distant peak (such as a Mont-Blanc 90K target), Strava OAuth sync, sharable world snapshots. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS, React Three Fiber with drei. Simplex noise terrain, a fog mask as a canvas texture updated per run. GPX parsed with DOMParser. localStorage for imported runs. No backend and no Strava API.
- **Core 24-Hour Demo Flow:** Open the page with a foggy island, drop 3 sample GPX files, and watch the fog peel back along three paths while mountains rise. **Aha moment:** within 30 seconds you see a still-hidden region and want one more run to reach it.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** Sample runs play instantly, and dropping your own file works with no account.
- **Growth Vector:** Snapshots of your explored world are more shareable than a pace chart.

#### 6. RISKS & MITIGATION

- **Scope Creep:** Rich world art can drift. Mitigation: one noise terrain and one fog mask in the PoC.
- **Technical:** Strava API access has rate limits and approval. Mitigation: file-based import first, OAuth later.
- **Retention/Engagement:** The world could be fully revealed. Mitigation: it scales with lifetime distance and grows new regions.
