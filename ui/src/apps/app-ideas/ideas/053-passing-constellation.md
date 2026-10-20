---
name: Passing Constellation
tagline: Turn Simple Match Events Into Shapes You Can Explain
domains: [SPORT, 3D]
created: 2026-10-20T07:57:32Z
issue: 53
rating: 1
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Reimagine a raw event log as a constellation that grows across a pitch. A small sequence of passes becomes a luminous spatial shape: nodes are receiving locations, lines carry direction, and a time scrubber lets an analyst watch a passing pattern appear, dissolve, and reform. The user then pins one plain-language observation to a visible pattern.
- **Core Problem & Target User:** Grassroots coaches, football fans, and aspiring analysts can gather a few match events but struggle to turn rows of timestamps and coordinates into a clear tactical observation.
- **Core Value Proposition:** Make a ten-event sequence readable in under a minute, then preserve a grounded observation with the data that supports it.
- **Signature Interaction:** Scrub through a possession and watch its passing constellation rise above a simplified 3D pitch; pause on a triangle or empty channel, pin it, and write what it may indicate.
- **Analytical Principle:** A small event sample can visualize a pattern. It cannot establish a player's quality, a team's overall strategy, or causation.

#### 2. USER STORIES

- **Primary User Story:** "As a grassroots coach, I want to replay a short sequence of passes spatially, so that I can explain one concrete pattern to a player or teammate."
- **Secondary User Story:** "As a football fan learning analysis, I want to add an observation tied to exact events, so that I can distinguish what the data shows from my interpretation."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Instant demo possession | Load one fictional, clearly labeled ten-pass possession on a 105×68 unit pitch. Include event time, origin, destination, and a brief neutral event label. | Day 1 PoC |
| Constellation replay | Advance or scrub through the sequence. Draw pass lines in chronological order, retain receiving nodes, and render an equivalent 2D top-down view beside the modest 3D scene. | Day 1 PoC |
| Pattern pin | Pause on one event range, select a pitch area, and attach a short observation. Display the referenced event numbers and coordinates with the pin. | Day 1 PoC |
| Shareable local snapshot | Save the view state and observation in the browser. Export a compact JSON snapshot and a plain-text summary. | Day 1 PoC |
| Personal event import | Add CSV import with a mapping preview, row-level validation, possession grouping, and a documented coordinate-system selector. | Month 1 |
| Comparative analysis | Compare two sequences using synchronized replays, directional filters, and simple, explicit summaries such as average pass length and occupied zones. | Month 2 |
| Team notebook | Add match collections, player and period filters, annotated clips, image/PDF export, and optional private team sharing with server-side access control. | Month 3 |

**One-day build budget:** 1 hour for a validated sample dataset; 2 hours for replay state and interpolation; 2 hours for the pitch views; 1 hour for annotations and local persistence; 2 hours for coordinate checks, accessibility, and deployment.

**Day 1 exclusions:** Live feeds, proprietary data connectors, video synchronization, player tracking, automated tactics labels, accounts, and public scouting rankings.

#### 4. SOLO DEVELOPER ARCHITECTURE

- **Suggested stack:** React, TypeScript, Vite, React Three Fiber, SVG or Canvas for the 2D pitch, Tailwind CSS, and localStorage.
- **Core model:** MatchSequence, PassEvent, PitchCoordinate, PlaybackState, and PatternPin. Coordinates use a declared origin and normalized 0–100 range before projection into the 105×68 pitch.
- **Deterministic playback:** Sort a sequence by timestamp and stable event ID. Derive all lines and nodes from the current event index so seek, restart, and export always reproduce the same view.
- **Data-quality guardrail:** Reject non-finite coordinates and identify passes outside the chosen pitch range. Keep raw values in the import layer and normalized values in visualization state.
- **Interpretation boundary:** Pins are labeled as observations, not facts. The export includes the event IDs and visible filters so a reader can trace every annotation back to the displayed sample.
- **Engagement loop:** Load a sequence → replay its shape → freeze a moment → state an observation → export or compare another sequence.

#### 5. DAY 1 ACCEPTANCE CRITERIA

- [ ] The app opens directly into a fictional sample possession without registration or external data access.
- [ ] The same event sequence produces the same line order after replay, seeking, refresh, and export/import.
- [ ] Scrubbing to event five displays exactly the first five passes in both pitch views.
- [ ] Coordinates map consistently in the 2D and 3D representations, with a visible orientation label.
- [ ] A pattern pin stores the selected event range, field zone, and observation text.
- [ ] The UI labels the sample as fictional and labels user notes as interpretations.
- [ ] The 2D view supports all core playback and annotation actions if WebGL is unavailable.
- [ ] Keyboard controls can play, pause, step forward/back, and focus an annotation.

#### 6. VALIDATION & SUCCESS SIGNAL

Test with five football fans or coaches using the same demo sequence. Target: four identify and pin a concrete spatial observation without assistance, and three can point to the exact event range that supports it. Follow up by asking whether the replay makes their observation more specific than watching a static list.

**Duplicate check:** Reviewed open issues #16, #33, and #46–#51 on 2026-10-20. This is an explanatory spatial-analysis tool, distinct from #48's outcome-prediction replay and #47's historical 3D chronology puzzle.
