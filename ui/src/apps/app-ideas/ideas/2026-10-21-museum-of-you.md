---
name: Museum of You
tagline: Your Strava History Curated as a Museum, Eras, Exhibits and Records
pitch: Walk a small 3D museum of your running history: era rooms, a record shelf and a hall of extremes.
domains: [SPORT, HIST, 3D]
created: 2026-10-21T05:57:43Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Your running history presented as a small 3D museum you walk through. Each training era becomes a period room ("The Comeback Spring", "The Flat Summer") with exhibits: the run that changed your curve, your record shelf with plaques per distance, a hall of extremes (hottest, coldest, earliest, longest), and a gift shop with shareable postcards of each record. Curator labels are written with dry museum voice about your own data.
- **Core Problem & Target User:** Personal records and history sit in tables nobody revisits. Target user: a runner with months or years of Strava data who wants to appreciate his own arc.
- **Core Value Proposition:** A place, not a chart: wander your own running history and leave with postcards worth sharing.

#### 2. USER STORIES

- **Primary User Story:** "As a runner with a long history, I want my data curated into eras and exhibits, so that I can see my arc as a story."
- **Secondary User Story:** "As a record hunter, I want a record shelf with plaques and dates, so that I know exactly which record is oldest and softest."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The museum | Strava export CSV parsing, era segmentation by volume and pace shifts, a 3-room 3D gallery in React Three Fiber (era room, record shelf, hall of extremes) with curator labels. | Day 1 PoC |
| Expansion 1: Curation and postcards | More rooms (races wing, geography map), shareable record postcards, record age and softness ranking, FIT and GPX support, local storage. | Month 1 MVP |
| Expansion 2: Live exhibits | Strava OAuth sync with a "new exhibit" alert when a record falls, audio-guide mode reading labels aloud, visiting a friend's museum, yearly expansion of the building. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS, React Three Fiber with drei. Era detection as a simple change-point heuristic, labels generated from templates over the data, localStorage. No backend.
- **Core 24-Hour Demo Flow:** Drop the sample export, walk into the era room, and read a plaque: "June 2026, first sub-50 10K, unbroken since." **Aha moment:** within 30 seconds your own history reads like an exhibit worth visiting.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** A sample athlete museum is open on load.
- **Growth Vector:** Record postcards shared when a plaque falls; friends visit each other's museums.

#### 6. RISKS & MITIGATION

- **Scope Creep:** Rich 3D environments. Mitigation: three simple rooms with strong copy in the PoC.
- **Technical:** Era detection can misfire. Mitigation: show the detected boundaries and let the user nudge them.
- **Retention/Engagement:** A museum is visited rarely. Mitigation: new-exhibit alerts and falling records bring you back.
