---
name: Tessellate
tagline: Bend One Tile Until It Interlocks, Then Watch It Cover the Plane - and the Vase
pitch: Design Escher-like tessellations by deforming a base tile under real symmetry rules, watch the pattern fill the plane live, and extrude your tile into a 3D-printable relief.
domains: [3D, LEARN]
created: 2026-11-04T06:03:29Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Escher's lizards are not magic; they are seventeen wallpaper symmetry groups wearing costumes. Tessellate teaches the costume and the group at once. You start with a base tile (a hexagon, a square, a triangle) and its symmetry rule shown as little operation arrows. Deform one edge - the rule deforms the matching edge automatically, so the tile always still tiles. Carve a bird out of a hexagon and the plane fills with interlocking birds, live, as you drag. Then the workshop: extrude your tile into a 3D relief (a coaster, a wall panel, a vase wrap), preview it lit like clay, and export an STL. A gallery track walks the seventeen wallpaper groups from simple translations to glide reflections, each unlocked by making a tile that satisfies it.
- **Core Problem & Target User:** Symmetry groups are the prettiest math almost nobody gets to feel: textbooks show finished Eschers, and the step from "admire" to "make one" requires knowing the constraints before you have intuition. Target user: design and math-curious people, teachers, makers with a 3D printer or laser cutter, parents looking for real math that looks like art class.
- **Core Value Proposition:** The moment an abstract symmetry rule becomes a physical law you can feel with your cursor - deform here, the mirror edge moves there - ending with your own tiling as an object you can hold.

#### 2. USER STORIES

- **Primary User Story:** "As a maker, I want to deform a tile under symmetry constraints and watch the plane fill with my pattern live, so that I can create real tessellations without studying group theory first."
- **Secondary User Story:** "As a learner, I want the seventeen wallpaper groups as a progression I unlock by making, so that the math lands through the hand rather than the formula."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The living tile | A base tile editor where deforming an edge applies the symmetry rule's matching deformation automatically, with the plane tiling live beside your cursor. | Day 1 PoC |
| Core Mechanism: The relief | One tap extrudes the tile into a 3D relief with clay-like lighting, rotatable, exportable as STL. | Day 1 PoC |
| Expansion 1: The seventeen doors | A guided progression through the wallpaper groups (each introduced by its operation arrows, unlocked by your own working tile), plus color symmetries and interlocking two-tile systems. | Month 1 MVP |
| Expansion 2: The print shop | Tiling patterns applied to objects (coasters, panels, wraps), community gallery of tiles with their symmetry group labeled, and a classroom mode with Escher's own works as study plates. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS, Three.js. The tile editor is a 2D canvas with draggable edge control points and one symmetry rule applied (p6 hexagons for the demo); the live plane view re-renders the tiling each frame; the relief view extrudes the tile boundary in Three.js with STL export. localStorage only; no backend, no accounts.
- **Core 24-Hour Demo Flow:** Open to a hexagon covering the plane. Drag a bite out of one edge - the opposite edge grows the matching bite automatically, and the plane keeps closing. Three more drags and your hexagon is a fish, and a hundred fish interlock. Tap "relief": your fish rises out of the plane in clay light, ready to print. The "Aha!" moment: the constraint doing the hard part - your doodle mathematically cannot fail to tile.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** The first drag demonstrates the entire concept, and a credible creature tile takes five playful minutes - no math vocabulary required to start.
- **Growth Vector:** STL export puts user patterns in the physical world (printed coasters are the best advertising), teachers adopt the seventeen-doors progression, and the Escher lineage gives the app a built-in audience.

#### 6. RISKS & MITIGATION

- **Math risk:** Misapplying a symmetry rule would produce tiles that fail when printed, breaking trust at the worst moment. Mitigation: the deformation constraints are enforced by construction (the editor physically cannot break the rule), and each group's operations are unit-tested against its mathematical definition.
- **Complexity risk:** Seventeen groups is a lot of subtle distinction. Mitigation: the progression orders groups by intuition (translations first, glides late), each door needs one working tile, and nobody is tested on notation.
- **Scope creep risk:** Full vector editor, animation, Penrose and 3D tilings. Mitigation: the loop stays deform, tile, extrude; aperiodic tilings and solids are explicitly beyond Month 3.
