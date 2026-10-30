---
name: The Mobile
tagline: A Calder in Your Pocket - Each Focused Session Adds One Piece, and You Balance It Yourself
pitch: Build a hanging 3D mobile one element at a time through focused work sessions, then tune its arms and weights until it hangs true.
domains: [3D, PROD]
created: 2026-10-30T06:03:31Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** A Calder mobile is productivity's perfect metaphor rendered in wire and tin: every piece hangs from every other, and balance is something you tune, not something you buy. The Mobile turns focused work into sculpture. Each completed focus session (you set the length; the app keeps the timer quiet and the screen dim) earns one element - a shape, a color, a weight - that you hang on the mobile yourself. Placement is the game: hang a heavy disc on a long arm and the whole structure visibly tilts and turns; you slide connection points and counterweight until it settles. A gentle physics simulation keeps the mobile always slowly moving, and a finished mobile joins a gallery shelf above your desk view, still turning months later.
- **Core Problem & Target User:** Focus timers all use the same rewards (streaks, trees, coins) that stop meaning anything, and there is no visible relationship between how you spent your attention and what you got. Target user: people who want a focus ritual with a tactile, cumulative artifact, and design lovers who would rather grow a Calder than a cartoon forest.
- **Core Value Proposition:** Deep work becomes sculpture: each session adds one real piece to an object with real physics, and balancing what you build is its own absorbing practice rather than a points screen.

#### 2. USER STORIES

- **Primary User Story:** "As a focused worker, I want each completed session to add an element to a mobile I am building, so that my attention accumulates into something beautiful and physical-feeling."
- **Secondary User Story:** "As a builder, I want to hang, slide and counterweight each new piece myself, so that the sculpture stays a craft I practice rather than a prize I am handed."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The session and the piece | A quiet focus timer (25 or 50 minutes, screen dims, no stats); completing a session deals one element (shape, color, weight) to hang. | Day 1 PoC |
| Core Mechanism: The balancing | A 3D mobile with real hanging physics: drag pieces onto arms, slide connection points, watch the structure tilt, turn and slowly settle. | Day 1 PoC |
| Expansion 1: The studio | Multiple mobiles in progress, a gallery shelf of finished ones still turning, element rarity tied to longer sessions, and a stillness score for well-balanced hangs. | Month 1 MVP |
| Expansion 2: The exhibition | Room view (your mobiles hanging in a sunlit virtual space), export of a finished mobile as a shareable clip or printable build sheet, and seasonal element sets. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS, Three.js with a simple verlet or rigid-chain physics approximation for hanging arms. Focus timer screen, the mobile editor (drag to hang, slide to balance), and one starter mobile with three pieces pre-hung. localStorage only; no backend, no accounts, no notifications on day 1.
- **Core 24-Hour Demo Flow:** Complete (or demo-skip) a focus session and receive a red disc, heavy, beautiful. Hang it on the long lower arm and watch the whole mobile tip and sway. Slide the connection point inward until it settles into a slow, true turn. The "Aha!" moment: the mobile finding its balance under your hands - a physical understanding of what a week of good attention feels like.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** The physics is the demo: dragging one piece and watching the structure respond is delightful before any productivity framing, and the first session is whatever length you choose.
- **Growth Vector:** Finished mobiles are genuinely pretty objects worth sharing as clips, and the gallery shelf gives long-term users a visible body of work that streak counters never match.

#### 6. RISKS & MITIGATION

- **Technical risk:** Hanging-chain physics can look wrong (jitter, tangles) and cheapen the core artifact. Mitigation: a constrained model (rigid arms, limited joints, damped motion) tuned for slow, calm movement; beauty and stability over simulation completeness.
- **Gimmick risk:** If sessions feel like the price of pieces, users game the timer. Mitigation: sessions of any length count, the reward is the craft of balancing rather than the piece itself, and there are no streaks to protect.
- **Scope creep risk:** Shop economies, social rooms, AR. Mitigation: the roadmap keeps the loop (session, piece, balance) untouched; gallery and room views serve the same single artifact.
