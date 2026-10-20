---
name: Strata Stories
tagline: Excavate History One Layer at a Time
domains: [3D, HIST, LEARN]
created: 2026-10-20T07:45:13Z
issue: 47
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT
- **Creative Twist / Re-imagining Angle:** Reimagine a chronology quiz as a miniature archaeological excavation. Historical event tiles arrive in a scrambled tray. Place each tile into a vertical stack of time layers, then slice the stack open to reveal the correct order and causal connections.
- **Core Problem & Target User:** Curious adults and visual learners remember isolated historical facts but struggle to place them relative to one another.
- **Core Value Proposition:** Build a memorable mental timeline through one tactile, three-minute puzzle.
- **Signature Interaction:** Press “Excavate” and watch the stack separate into floating layers, revealing misplaced events and a short explanation of why their order matters.
- **Visual Rule:** The stack represents chronology, not a claim that these events occurred in a shared physical excavation site.

#### 2. USER STORIES
- **Primary User Story:** "As a visual learner, I want to arrange historical events into layers, so that I can understand their sequence through spatial memory."
- **Secondary User Story:** "As a curious reader, I want to inspect a surprising connection and its source, so that I can continue learning beyond the puzzle."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| One curated excavation | Ship one six-event history pack with verified dates, concise explanations, and source URLs. Use a tightly bounded theme with unambiguous ordering. | Day 1 PoC |
| Layer placement | Select an event, then select a numbered slot in a simple 3D stack. Provide equivalent HTML controls for keyboard and touch use. | Day 1 PoC |
| Exploded reveal | Separate the layers, show the correct order, highlight correct placements with text and color, and explain two important relationships. | Day 1 PoC |
| Instant replay | Shuffle the same pack, retry, and preserve the latest result locally. | Day 1 PoC |
| Curated chapter library | Add six to eight small packs, each with editorial source checks, difficulty labels, and a reusable JSON content schema. | Month 1 |
| Uncertain chronology | Support date intervals, simultaneous events, and multiple valid placements. Explain uncertainty instead of inventing precision. | Month 2 |
| Memory expeditions | Revisit previously missed relationships using local spaced review; add custom pack import/export and an accessible 2D mode. | Month 3 |

**One-day build budget:** 2 hours to curate and verify six events; 2 hours for basic box geometry and camera; 2 hours for placement and reveal; 2 hours for accessible controls, content checks, and deployment.

**Day 1 exclusions:** Geographic globe, photorealistic artifacts, physics, generated historical facts, user accounts, procedural content, and a content-management backend.

#### 4. SOLO DEVELOPER ARCHITECTURE
- **Suggested stack:** React, TypeScript, Vite, Three.js through React Three Fiber, and Tailwind CSS; static deployment on Vercel.
- **Core model:** Pack, event, sortable date, display date, source URL, relationship explanation, attempt, and placement.
- **Rendering boundary:** Use reusable box meshes and HTML event labels. Keep the puzzle state independent of WebGL so HTML controls remain usable if rendering fails.
- **Content boundary:** Day 1 accepts only distinct, verified event dates. Date intervals and partial ordering require a separate validator in Month 2.
- **Engagement loop:** Arrange → excavate → discover a relationship → retry or open the next chapter.

#### 5. DAY 1 ACCEPTANCE CRITERIA
- [ ] A visitor can start the sample puzzle immediately without registering.
- [ ] Six events can be placed, moved, and submitted using pointer or keyboard controls.
- [ ] Reveal correctly identifies placements and displays the full chronological order.
- [ ] Every historical event includes a source link; relationship explanations distinguish chronology from demonstrated causation.
- [ ] Dates stay concealed until reveal.
- [ ] Reduced motion disables layer animation while preserving feedback.
- [ ] Missing WebGL does not prevent completion through HTML controls.
- [ ] Restart produces a shuffled tray without losing the curated content.

#### 6. VALIDATION & SUCCESS SIGNAL
Test with five learners. Target: four finish unaided, and three correctly recall at least one previously missed event relationship after a short distraction. Use the result to decide whether to invest in more packs before expanding the 3D environment.

**Duplicate check:** Compared with the repository's open issues on 2026-10-20; no concept overlap found.
