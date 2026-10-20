---
name: Ghost Pacer
tagline: Race a Historic Record Holder Over Your Own Training Run
domains: [SPORT, HIST]
created: 2026-10-20T08:36:32Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Ghost runners exist in games, but the ghosts are always your past self. Here the ghost is history: drop in a GPX file of your own run and a pacing ghost of a legendary performance (a world record, a famous ultra win, a pioneering marathoner) is scaled to your distance and elevation and runs the same route beside you on a replay. Each ghost comes with a short story card about the era, shoes, and training of its owner.
- **Core Problem & Target User:** Trail and road runners analyse pace in dull tables. Sports history is read, never felt. Target user: a data-curious runner who trains several times a week and likes race lore.
- **Core Value Proposition:** See in one animated replay where on your route you would have been dropped by a legend, and learn who that legend was.

#### 2. USER STORIES

- **Primary User Story:** "As a runner, I want to race a historic record pace over my own GPX route, so that I understand my effort in a vivid and fun way."
- **Secondary User Story:** "As a sports history fan, I want a short story for each ghost, so that I learn something about the athlete every time I race them."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: Drop a GPX, meet a ghost | GPX parsing in the browser, 6 hand-authored ghosts (record pace curves with a fatigue profile), grade-adjusted scaling to the route, animated 2D replay with two dots and a live gap in seconds. | Day 1 PoC |
| Expansion 1: Ghost library and splits | 30 ghosts across road, track, and trail, per-kilometre split comparison, a "where I lost the legend" chart, shareable result card image, local run history. | Month 1 MVP |
| Expansion 2: Eras and challenges | Era mode (race the 1954 pace vs the 2024 pace), weekly ghost challenge, import from Strava export files, 3D terrain replay, community-submitted ghosts with sources. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. Parse GPX with DOMParser, no backend. Ghosts as a JSON file of pace-vs-distance curves. SVG route plot with two animated markers. localStorage only for the last run.
- **Core 24-Hour Demo Flow:** Open the page, drop a bundled sample GPX or your own, pick a ghost, press Race. Within 30 seconds the replay shows the ghost pulling ahead on the first climb and the gap counter flips as the route flattens. **Aha moment:** the line "Roger Bannister's 1954 pace would have dropped you at km 6.2."

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** A built-in sample route lets anyone race a ghost with zero file hunting.
- **Growth Vector:** A shareable result card ("I lost to Kilian at km 14") fits running communities and club chats.

#### 6. RISKS & MITIGATION

- **Scope Creep:** Real pace data for every legend is a rabbit hole. Mitigation: ship 6 approximate curves, label them as estimates, and add sources later.
- **Technical:** Grade-adjusted scaling can look wrong on steep trails. Mitigation: use a simple published grade-adjusted pace formula and show the assumptions.
- **Retention/Engagement:** One-off novelty. Mitigation: weekly ghost challenge and era mode give a reason to return after each run.
