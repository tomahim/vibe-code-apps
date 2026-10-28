---
name: Vanishing Point
tagline: Learn Perspective by Copying Real 3D Scenes You Can Rotate, Grid and Unbuild
pitch: Practice perspective drawing against interactive 3D scenes with toggleable vanishing lines and grids, and measure your sketch against the model's true projection.
domains: [3D, LEARN]
created: 2026-10-28T06:03:41Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Perspective is taught from static diagrams that hide the one thing that matters: how the same scene changes when your eye moves. Vanishing Point teaches it from the inside. Each exercise is a small real-time 3D scene (a street corner, a row of chairs, a stairwell) that you can rotate, pan and raise your eye level through, with optional overlays that reveal the actual vanishing points, horizon line and construction grid of whatever you are looking at. You sketch the scene on a canvas layer, then ask the app to project the true wireframe over your drawing and show where your lines converge wrong. Lessons build from one-point boxes to two-point streets to three-point towers looking up.
- **Core Problem & Target User:** Drawing learners hit a wall at perspective: books explain the rules but a printed cube cannot show why your sketch looks off, and life drawing gives no feedback at all. The gap between "I know the rule" and "my hand obeys it" needs a subject that answers back. Target user: self-taught sketchers, concept-art beginners, and designers who want spatial confidence on paper.
- **Core Value Proposition:** A drawing subject that reveals its own construction: rotate the scene, see the vanishing points move, sketch, then get your convergence errors shown as honest geometry instead of vague critique.

#### 2. USER STORIES

- **Primary User Story:** "As a drawing learner, I want to sketch interactive 3D scenes with revealable vanishing lines, so that I can connect the rules of perspective to what my eye actually sees."
- **Secondary User Story:** "As a practicing sketcher, I want my drawing compared against the scene's true projection, so that I get concrete feedback on where my convergence drifts."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The glass model | One interactive 3D street-corner scene (Three.js): orbit, eye-level control, and toggles for horizon line, vanishing points and construction grid that update live as the view moves. | Day 1 PoC |
| Core Mechanism: The tracing desk | A drawing canvas layered over the scene viewport with opacity control, so you can sketch what you see and compare it against the model by fading the 3D underneath. | Day 1 PoC |
| Expansion 1: The curriculum | A lesson ladder (one-point, two-point, three-point, inclined planes, curves in perspective) with a scene per lesson, plus sketch overlay comparison that highlights where your lines should have converged. | Month 1 MVP |
| Expansion 2: The open studio | Scene gallery (interiors, exteriors, objects), timed sketch mode, saved side-by-side progress pairs, and photo-import calibration that estimates vanishing points in your own reference photos. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS, Three.js. One modeled street corner of simple boxes and awnings; orbit and eye-level controls; overlay toggles computing horizon and vanishing points from the camera each frame. A transparent canvas layer with pen, eraser and an opacity slider over the viewport. No backend, no accounts; drawings stay in localStorage.
- **Core 24-Hour Demo Flow:** Open to the street corner. Drag to orbit and watch the red vanishing points slide along the horizon as your eye moves. Toggle the grid off, sketch the corner on the canvas, then fade the 3D model up underneath and see exactly which of your rooflines missed the point. The "Aha!" moment: the first time your sketch and the true wireframe disagree, and you can see why.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** Rotating the scene and watching vanishing points move is a thirty-second revelation even before you draw anything; the first sketch comparison is immediate and concrete.
- **Growth Vector:** Before-and-after overlay pairs are natural sharing artifacts for art communities, and the lesson ladder gives a clear reason to return daily.

#### 6. RISKS & MITIGATION

- **Technical risk:** Overlay comparison that truly measures convergence error is hard to make fair (line detection on messy sketches). Mitigation: Day 1 ships honest visual comparison (fade the truth underneath), and automated error highlighting is explicitly Month 1 scope with a manual-alignment fallback.
- **Pedagogy risk:** Tool-first learners may orbit forever and never draw. Mitigation: lessons lock overlays behind a sketch-first step ("draw it, then reveal"), keeping the model a teacher rather than a cheat.
- **Scope creep risk:** Full paint tools, brushes, layers, cloud galleries. Mitigation: the canvas stays deliberately minimal; this is a perspective teacher, not a drawing app.
