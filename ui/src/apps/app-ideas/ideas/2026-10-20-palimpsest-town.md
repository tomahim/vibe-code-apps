---
name: Palimpsest Town
tagline: Grow a Tiny Procedural Town From Every Paragraph You Write
pitch: Every paragraph you write becomes a building shaped by your prose style, growing a town of your drafts.
domains: [3D, WRITE]
created: 2026-10-20T08:36:31Z
rating: 1
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** A writing app where the text builds a place. Every paragraph you write becomes a building in a low-poly town, shaped deterministically by the writing itself: sentence length sets height, vocabulary variety sets colour, punctuation sets roof style. Rewriting a paragraph rebuilds the house, so the town is a living palimpsest of drafts. Dense, tangled prose makes crooked towers. Clean, short prose makes tidy streets.
- **Core Problem & Target User:** Writers get no feedback on the shape of their text except word count. Target user: bloggers and atomic essayists who want a playful reading of their own style.
- **Core Value Proposition:** Write, and see your style as architecture, with a town you want to keep growing.

#### 2. USER STORIES

- **Primary User Story:** "As a writer, I want my paragraphs to turn into buildings, so that I can see the rhythm and density of my writing at a glance."
- **Secondary User Story:** "As a regular blogger, I want a persistent town across sessions, so that my output over weeks becomes a place I can walk through."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: Paragraph to building | Text editor on the left, 3D town on the right. Each paragraph hashes to a seed and metrics (length, variety, punctuation) drive a procedural low-poly building placed on a grid. Edits rebuild the building with a small animation. | Day 1 PoC |
| Expansion 1: Districts and weather | Documents become districts, orbit and street-level camera, day/night by writing time of day, a "readability weather" overlay, local save of documents, PNG snapshot of the town. | Month 1 MVP |
| Expansion 2: Living town | Town growth over weeks, landmarks for finished essays, export of a town as a glTF file, optional markdown import from a notes folder, shareable read-only town links. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS, React Three Fiber with drei. Seeded random from a string hash, simple box and prism geometry, instanced meshes. localStorage for the text. No backend.
- **Core 24-Hour Demo Flow:** Paste or type three paragraphs. Three buildings rise within a second of each pause. Edit one sentence and watch the building reshape. **Aha moment:** within 30 seconds you shorten a sprawling paragraph and see a crooked tower turn into a neat house.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** Starts with a sample text already built into a town, so the effect is visible before typing anything.
- **Growth Vector:** Town snapshots are attractive images that writers share next to their posts.

#### 6. RISKS & MITIGATION

- **Scope Creep:** Procedural generation can absorb unlimited time. Mitigation: three building archetypes only for the PoC.
- **Technical:** Rebuild on every keystroke can stutter. Mitigation: debounce, instancing, and a cap on town size.
- **Retention/Engagement:** The novelty may fade. Mitigation: persistent town growth and landmarks for finished essays create long-term attachment.
