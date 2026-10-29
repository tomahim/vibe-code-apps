---
name: Chalk Talk
tagline: Draw the Play on the Board, Then Watch It Run in 3D From Any Seat in the Stadium
pitch: Sketch football plays on a tactics board with simple drag-and-draw tools, then watch them animate as 3D runs you can view from any camera angle.
domains: [SPORT, 3D]
created: 2026-10-29T06:03:38Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Every coach, pundit and group-chat tactician has drawn arrows on a napkin. Chalk Talk makes the napkin move. You place players on a 2D tactics board, draw runs and passes with drag gestures, set timing by ordering the moves - then press play and the board lifts into 3D: the same play runs with players in space, and you can watch from the stands, from behind the goal, or from the runner's own shoulder. A set-piece studio handles corners and free kicks with blockers and decoy runs, because that is where drawn plays actually win matches.
- **Core Problem & Target User:** Football ideas are spatial and sequential, but fans and amateur coaches only have static boards and hand-waving. Explaining "the third-man run" takes five minutes of pointing; showing it takes seconds. Target user: amateur coaches preparing sessions, five-a-side organizers, punditry-inclined fans, and parents trying to show a kid where to run.
- **Core Value Proposition:** From napkin sketch to animated play in under a minute: draw it in 2D like a coach, watch it in 3D like a broadcaster, and share a clip that actually explains the idea.

#### 2. USER STORIES

- **Primary User Story:** "As an amateur coach, I want to draw a play in 2D and watch it run in 3D from any angle, so that I can explain spatial ideas to my players in seconds instead of minutes."
- **Secondary User Story:** "As a fan, I want to recreate a goal I just watched and share the animation, so that my tactical point survives outside the group chat."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The board | A 2D tactics board: drag players (two teams plus ball), draw runs and passes as timed steps, play the sequence back in 2D. | Day 1 PoC |
| Core Mechanism: The lift | One button renders the same sequence in 3D (simple player figures on a pitch) with a free camera: stands, behind-goal, and player-shoulder views. | Day 1 PoC |
| Expansion 1: The set-piece studio | Corner and free-kick templates with blockers, decoy runs and zones; save and name a playbook of set pieces; per-step timing and delays. | Month 1 MVP |
| Expansion 2: The analysis desk | Shareable clip export, offside line and distance rulers, half-field futsal mode, and recreating famous goals as a community challenge format. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS, Three.js. The 2D board is a canvas with drag-and-draw; the play script (positions plus timed moves) feeds a Three.js pitch with low-poly figures interpolating the same waypoints. Free orbit camera plus three named views. No backend, no accounts; plays save to localStorage. Works on desktop and tablet first.
- **Core 24-Hour Demo Flow:** Open to a preloaded drawn play: a give-and-go ending in a cutback. Press play in 2D, then hit Lift to 3D and watch the same move from behind the goal. Then draw your own: two players, one run, one pass, play, lift, orbit. The "Aha!" moment: seeing your own napkin arrows become a moving play you can circle around in space.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** The preloaded play demonstrates the lift in five seconds; drawing your first own play takes under a minute with no tutorial.
- **Growth Vector:** Recreated goals travel ("here is how the winner actually worked"), amateur coaches share set pieces within clubs, and the clip export makes every user a broadcaster for the app.

#### 6. RISKS & MITIGATION

- **Technical risk:** 2D-to-3D fidelity can feel wrong (speeds, spacing) and break trust in the animation. Mitigation: the 3D view renders the exact same waypoints and timings as the 2D board by construction, and the first version favors readability over physical realism.
- **Complexity risk:** Timing and multi-step sequences can overwhelm casual users. Mitigation: the PoC caps plays at a handful of steps with sane defaults; advanced timing lands in Month 1, not on day one.
- **Scope creep risk:** Match simulation, player stats, AI defending. Mitigation: the app animates what you draw - nothing decides outcomes; simulation is explicitly out of scope.
