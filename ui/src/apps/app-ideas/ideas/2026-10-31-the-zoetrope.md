---
name: The Zoetrope
tagline: Draw Twelve Frames, Spin the Drum, and Watch 1834 Do What No Screen Can
pitch: Create short frame-by-frame loops on a virtual 3D zoetrope, learning real animation principles by making drawings move inside a spinning drum.
domains: [3D, LEARN]
created: 2026-10-31T06:03:35Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** The zoetrope taught the nineteenth century that drawings could live, using nothing but slots, a drum and persistence of vision. The Zoetrope rebuilds it as an animation studio with training wheels: you draw up to twelve frames on a strip (onion-skinning shows the neighbors), wrap the strip around a 3D drum, and spin it. Viewed through the slots, your drawings move - and because the drum enforces a loop, you are learning the hardest animation lesson from frame one: the last frame must feed the first. A lesson track teaches the principles the way they were discovered (squash and stretch with a bouncing ball, follow-through with a galloping horse, anticipation with a jump), each ending with your own loop on the drum. Finished loops live in a gallery you can spin anytime.
- **Core Problem & Target User:** Animation software fronts a brutal learning curve - timelines, layers, rigs - before a beginner ever sees something move, so most quit before the magic. Target user: curious beginners of any age, parents looking for a real craft activity with kids, and designers who want to feel animation principles in their hands rather than read them.
- **Core Value Proposition:** First loop spinning in five minutes with zero timeline UI: the drum's constraints do the teaching, and the lesson track turns historical magic into durable animation craft.

#### 2. USER STORIES

- **Primary User Story:** "As a beginner, I want to draw a handful of frames and spin them on a virtual zoetrope, so that I can make my drawings move within minutes of starting."
- **Secondary User Story:** "As a learner, I want short lessons built around one principle each on the drum, so that I build real animation fundamentals instead of randomly doodling."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The strip and the drum | A 12-frame drawing strip with onion-skinning and basic pens, wrapped onto a spinnable 3D zoetrope with a through-the-slots view. | Day 1 PoC |
| Core Mechanism: The gallery | Saved loops kept in a shelf of drums, each re-spinnable, renameable and deletable. | Day 1 PoC |
| Expansion 1: The lesson track | Guided lessons (bouncing ball, walk cycle, flag wave) with template frames to trace and principle cards explaining what the drum just taught. | Month 1 MVP |
| Expansion 2: The toy shop | Color strips, drum skins and materials, sharing a loop as a short clip or GIF, a praxinoscope mode (mirrors instead of slots), and printable strips for building a real paper zoetrope. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS, Three.js. The strip editor is a 2D canvas with onion-skin ghosts of adjacent frames; the drum is a 3D cylinder textured from the strip, spinning with adjustable speed, plus a "through the slots" camera and a strobe fallback that flicks frames for motion clarity. One starter loop preloaded. localStorage only; no backend, no accounts. Touch-friendly.
- **Core 24-Hour Demo Flow:** Open to a preloaded galloping-horse strip; spin the drum and look through the slots - 1834's magic, running. Then the ball lesson: three template frames to trace, three of your own, wrap, spin. The "Aha!" moment: your own wobbly ball, actually bouncing, because you finally understood that the twelfth frame has to land where the first began.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** The preloaded drum spins within seconds and needs no explanation; the first personal loop is three traced frames away.
- **Growth Vector:** Loop clips are perfect short-form sharing material, the printable-paper-strip export turns digital play into a physical weekend project, and parents bring kids; kids bring parents.

#### 6. RISKS & MITIGATION

- **Motion risk:** A flat video of a spinning drum loses the slot-view illusion that makes a zoetrope work. Mitigation: the through-the-slots camera is the default view, drum speed is user-controlled, and a strobe fallback preserves the effect on any device.
- **Drawing risk:** Weak drawing tools make the craft feel cheap. Mitigation: keep tools minimal but honest (pen, eraser, onion-skin), with template tracing so non-drawers succeed first.
- **Scope creep risk:** Timeline editors, layers, sound. Mitigation: the drum's constraints are the pedagogy; anything that needs a timeline is out of scope by design.
