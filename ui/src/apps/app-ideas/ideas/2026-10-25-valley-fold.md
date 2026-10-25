---
name: Valley Fold
tagline: Origami You Can Watch From Every Angle - Each Fold Animated in 3D, Step by Step
pitch: Learn origami from interactive 3D animations: rotate the model at every step, watch each fold form, and fold along at your own pace.
domains: [3D, LEARN]
created: 2026-10-25T06:04:31Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Origami instructions are flat arrows on flat paper, and the hard part - what a fold looks like from the side, mid-motion - is exactly what a diagram can't show. Valley Fold renders each model as an interactive 3D animation: at every step you can orbit the paper freely, play the fold as a smooth animation (paper curving, crease forming, layers stacking with real thickness), and scrub it back and forth until the motion makes sense. Steps carry the classic diagram vocabulary too (valley, mountain, squash, sink), so the app teaches you to read traditional diagrams as a transferable skill. A fold-along mode paces with you: the step stays up until you confirm your paper matches, and a gentle "compare" view shows your target state from the angle you'd naturally hold it. Models are curated from the traditional canon (crane, jumping frog, flapping bird) plus modern originals shared with designer credit.
- **Core Problem & Target User:** Origami learners abandon models at step 12 because a diagram's ambiguous arrow lost them, and video tutorials force a fixed camera and pace. Target user: beginners who want the crane to finally work, parents folding with kids, and paper-craft fans who want hard models (insects, tessellations) to become reachable.
- **Core Value Proposition:** The mid-fold made visible: orbit, scrub and replay every step in 3D until your hands understand it - origami instruction that shows what paper actually does.

#### 2. USER STORIES

- **Primary User Story:** "As a learner, I want to rotate and replay each fold in 3D at my own pace, so that no diagram arrow ever loses me again."
- **Secondary User Story:** "As a returning folder, I want traditional diagram notation shown alongside the 3D animation, so that I build the skill to fold from any book."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The animated step | One classic model (the crane) fully animated in 3D: orbit any step, play and scrub each fold, paper with visible thickness and layers, classic notation labeled on every move. | Day 1 PoC |
| Core Mechanism: Fold along | Step-by-step pacing (the app waits for you), a compare view from the natural holding angle, and one-tap step replay. | Day 1 PoC |
| Expansion 1: A small library | 8-12 models from beginner to intermediate (frog, boat, box, flapping bird), difficulty ratings, a technique glossary (squash, petal, sink) with micro-animations, and session save mid-model. | Month 1 MVP |
| Expansion 2: Mastery | Complex models with 100+ steps, crease-pattern view for advanced folders, designer-credited modern originals with licensing, slow-motion detail views for closed sinks and collapses, and printable companion diagrams. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS, Three.js. The crane's full fold sequence authored as a series of 3D mesh states with smooth interpolation (curved fold motions, real paper thickness), orbit controls, step scrubber, notation labels. All local, no backend.
- **Core 24-Hour Demo Flow:** Reach the petal fold - the step where most beginners quit - and orbit it mid-animation: watch the two layers open, the point rise, the sides close in, from the side angle no book shows. Scrub it three times, fold your paper, confirm. **Aha moment:** seeing the petal fold from the side - the step that kills every paper crane suddenly looks obvious, and the app has earned its place on the craft table.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** "The step everyone quits on, watchable from any angle" - the demo opens directly on the crane's hardest fold, orbitable, and the value is obvious before any signup.
- **Growth Vector:** Finished models are photographed and shared, origami spikes seasonally (holidays, cranes for wishes, school projects), and every folder who struggled with a book diagram is a warm audience.

#### 6. RISKS & MITIGATION

- **Animation fidelity:** A wrong fold animation teaches a wrong fold. Mitigation: every model's sequence is validated by folding the physical model against the animation before release, and errata are published visibly when a step is corrected.
- **Model rights:** Modern origami designs are copyrighted works. Mitigation: the PoC uses traditional models; modern designs appear only with explicit designer permission and visible credit, and crease patterns of copyrighted works are never redistributed without a license.
- **3D production cost:** Authoring smooth fold animations is laborious. Mitigation: models are built on a parametric folding system where each step is defined as crease operations, so new models are authored, not hand-animated frame by frame.
- **Screen at the craft table:** A phone next to wet hands and paper is awkward. Mitigation: big step controls, fold-along pacing that never auto-advances, a glanceable compare view, and landscape stand mode designed for the table.
