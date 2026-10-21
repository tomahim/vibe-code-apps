---
name: Pocket Range
tagline: Turn Any Run Into a Miniature Mountain Diorama You Can Print
pitch: Turn any run into a miniature 3D mountain diorama with a glowing trail thread, ready to print.
domains: [SPORT, 3D, HIST]
created: 2026-10-21T06:09:44Z
rating: 1
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Not your stats, the place itself. Feed a run's GPX and the app builds a miniature procedural diorama of the terrain you crossed: an exaggerated little mountain range with the trail as a glowing thread, tiny pine trees where the real forest was, a flag at the summit, and a brass plate with date and time. Vertical exaggeration turns modest hills into handsome peaks. The diorama is a souvenir of the place, the way alpine museums keep models of famous routes.
- **Core Problem & Target User:** The memory of a great route fades into a line on a map. Target user: a trail runner who wants a physical-feeling keepsake of special runs.
- **Core Value Proposition:** Any run becomes a museum-grade miniature of the terrain, viewable in 3D and printable.

#### 2. USER STORIES

- **Primary User Story:** "As a trail runner, I want a 3D miniature of the terrain from my GPX, so that I keep the place, not just the numbers."
- **Secondary User Story:** "As a maker, I want an STL with a base plate, so that I can print my favourite runs."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The diorama | GPX parsing, terrain synthesized from the track's own elevation (no external DEM in PoC), vertical exaggeration control, glowing route thread, instanced trees, brass plate with stats. | Day 1 PoC |
| Expansion 1: Real terrain and print | Optional elevation API for true topography, manifold STL export with base, wood and snow materials, local library of dioramas. | Month 1 MVP |
| Expansion 2: Collections and gifts | Multi-run ranges that join into one landscape, race dioramas with checkpoints, gift mode (render from a friend's GPX), turntable video export, Strava OAuth. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS, React Three Fiber with drei. Heightfield from track elevation with radial falloff, seeded instancing for trees, localStorage. No backend.
- **Core 24-Hour Demo Flow:** Drop a GPX, drag the exaggeration slider, and watch a cute mountain range rise with your trail lit across it. **Aha moment:** within 30 seconds your Sunday run looks like a national park model.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** A sample diorama loads ready to orbit.
- **Growth Vector:** Printed dioramas are gifts, and gift mode pulls non-users in.

#### 6. RISKS & MITIGATION

- **Scope Creep:** Real-world DEM integration is heavy. Mitigation: synthesized terrain first, API as Expansion 1.
- **Technical:** Large GPX files. Mitigation: track simplification before heightfield generation.
- **Retention/Engagement:** One diorama per special run. Mitigation: joining ranges into a growing landscape keeps the collection alive.
