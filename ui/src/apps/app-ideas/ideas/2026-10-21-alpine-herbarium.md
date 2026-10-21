---
name: Alpine Herbarium
tagline: Grow a Procedural 3D Forest Where Every Tree Is One Run
pitch: Every run grows a unique L-system tree from its metrics, turning your season into a walkable grove.
domains: [SPORT, 3D, GAME]
created: 2026-10-21T06:09:45Z
rating: 3
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** A forest grown by L-systems where each tree is literally one of your runs. Distance sets height, elevation gain sets trunk twist, pace consistency sets branch symmetry, the hour of the run sets leaf colour from dawn gold to night blue. Your season becomes a grove: spring runs flower, the race is a great cedar at the center. Walk it in first person, and a botanist label hangs on each tree with the run's stats and date. Fog carries your consistency: each consecutive week with at least one run clears more fog and widens the visible landscape, so a long streak opens a vast, sharp vista while a broken streak lets the mist roll back over the grove.
- **Core Problem & Target User:** Yearly training volume is invisible once logged. Target user: a runner who wants a beautiful, calm place that accumulates his season instead of another chart.
- **Core Value Proposition:** A living procedural forest that is your running year, beautiful enough to revisit weekly.

#### 2. USER STORIES

- **Primary User Story:** "As a runner, I want each run to grow a unique tree in my forest, so that my season becomes a place."
- **Secondary User Story:** "As a data lover, I want each tree's shape to decode into the run's stats, so that the forest is also a readable record."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The grove | GPX or Strava export parsing, an L-system tree generator parameterized by run metrics, a first-person grove with botanist labels, and a season ground-cover that changes with the calendar. | Day 1 PoC |
| Core Mechanism: Streak fog | Weekly streaks computed from run dates drive a fog layer: every consecutive week with a run thins the fog and expands the visible landscape, a missed week brings the fog back. Volumetric-style fog via layered transparency and distance fade, tuned for mobile. | Day 1 PoC |
| Expansion 1: Species and weather | Species by run type (trail, road, race), wind and day-night ambience, a key mapping shape to stats, local storage, PNG postcards of the grove. | Month 1 MVP |
| Expansion 2: Live forest | Strava OAuth with a tree planted after each run, visiting friends' forests, a shared club forest, yearly time-lapse of the grove growing, race trees that bloom on race day anniversaries. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS, React Three Fiber with drei. A small recursive branch generator with seeded parameters, instanced foliage, localStorage. No backend.
- **Core 24-Hour Demo Flow:** Drop an export with 20 runs and watch 20 distinct trees grow in fast-forward, then walk to the tallest and read its label. **Aha moment:** within 30 seconds the difference between your easy weeks and your race is visible as landscape, and the fog itself tells your consistency: gaps in your training weeks show up as mist swallowing the far trees.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** A sample grove loads in bloom.
- **Growth Vector:** Postcards and shared club forests spread through running groups.

#### 6. RISKS & MITIGATION

- **Scope Creep:** Botanical realism. Mitigation: one stylised tree model with strong parameters in the PoC.
- **Technical:** Many trees on mobile. Mitigation: instancing, LOD, and a grove size cap with a "deep forest" archive view.
- **Retention/Engagement:** Forests are ambient. Mitigation: anniversary blooms and club forests give returning moments, and the streak fog gives a gentle weekly reason to run: keep the view clear.
