---
name: Lithotheque
tagline: A Jewel-Bright 3D Gallery of Earth's Rocks, Minerals and Landforms
pitch: Wander a beautiful digital museum hall of realistic 3D geological specimens, each with the story of how deep time made it.
domains: [3D, LEARN, HIST]
created: 2026-10-23T20:19:37Z
rating: 3
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Natural history museums keep their best rocks in dim cabinets with small labels. This app builds the gallery they deserve: a luminous, mobile-first 3D hall where every specimen is a small work of art - an amethyst geode you rotate and crack open, a fold of gneiss you can run your finger across, a volcano cross-section with magma still glowing inside. Each piece sits on a plinth with a one-line hook ("this rock was once a beach 400 million years ago"), and tapping it opens its story: how it formed, where on Earth you could find it, and which chapter of deep time it belongs to. Specimens are organized as themed rooms - Crystals, Volcanics, Fossil Beds, Desert Varnish, Glacial Scars - and a "deep time ribbon" along the floor places every piece on a 4.5-billion-year timeline you can stroll.
- **Core Problem & Target User:** Geology is spectacular in person and flat everywhere else: textbook photos don't rotate, museum visits are rare, and the timescale never lands emotionally. Target user: curious learners, parents exploring with kids, hikers who keep picking up stones, and anyone who liked Strata Stories but wanted the specimens themselves to be the stars.
- **Core Value Proposition:** A beautiful, tactile, scientifically honest gallery that makes mineralogy and deep time feel like walking through a jewelry store built by the planet.

#### 2. USER STORIES

- **Primary User Story:** "As a curious learner, I want to rotate realistic 3D rocks and landforms and read a short vivid story about each, so that geology feels like treasure rather than terminology."
- **Secondary User Story:** "As a parent or teacher, I want themed rooms and a deep-time timeline I can walk through with a child, so that one sitting teaches both the specimens and the scale of Earth history."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The gallery hall | A single elegant 3D room with 8-10 handcrafted specimens on plinths; orbit/zoom each one, soft studio lighting, saturated true-to-life mineral colors, tap for its story card (name, one-line hook, how it formed, where it is found, era). | Day 1 PoC |
| Core Mechanism: Interactive specimen moments | Two signature interactions that teach mechanism, not just appearance: crack the geode open with a tap to reveal crystals, and drag across the volcano cross-section to make it erupt in cutaway. | Day 1 PoC |
| Expansion 1: Real specimen realism | Photogrammetry or gaussian-splat models of real museum specimens from open 3D collections (Smithsonian Open Access and CC-licensed sources), a specimen inspector with measurement and locality map, and themed rooms beyond the first hall. | Month 1 MVP |
| Expansion 2: Deep time and collection play | The full deep-time ribbon linking every specimen to its era, a field-log mode where hikers photograph and identify their own finds to place beside the gallery pieces, and curated guided tours ("five stones that were once alive"). | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS, Three.js (React Three Fiber). All models are handcrafted procedural/low-poly meshes with rich materials (iridescent labradorite sheen via shader, translucent amethyst, layered sediment strata), so no external model pipeline is needed. Story cards from a typed content file. Fully static, no backend.
- **Core 24-Hour Demo Flow:** Open on the gallery hall, pinch into the amethyst geode, tap to crack it - crystals catch the light and the story card slides up: "gas bubbles in ancient lava, lined with quartz over millions of years". Then stroll the floor ribbon from a 4.4-billion-year-old zircon to a 10,000-year-old glacial erratic. **Aha moment:** the ribbon makes the visitor physically walk the distance between "older than life" and "younger than agriculture".

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** The first screen is the geode, closed and mysterious, with one invitation: "tap to crack it open". The reveal is the whole pitch in five seconds.
- **Growth Vector:** Specimen reveals are inherently shareable (a cracking geode is a perfect short video), teachers get ready-made "room tours" for class, and each new themed room is a natural relaunch moment.

#### 6. RISKS & MITIGATION

- **Realism versus effort:** Truly realistic 3D minerals are hard to handcraft. Mitigation: Day 1 aims for beautiful and plausible, not photoreal; the roadmap moves to photogrammetry of openly licensed real specimens, and every model card credits its source and method.
- **Overlap with Terrain Foundry:** Terrain Foundry is procedural landscape generation and play; Lithotheque is a curated museum of individual specimens with educational stories. Mitigation: keep the gallery framing and pedagogy central, no terrain building tools.
- **Scientific accuracy:** Simplified stories can drift into error. Mitigation: each story card sticks to formation process, locality and era, keeps numbers approximate and honest ("about 400 million years"), and avoids disputed claims.
- **Mobile performance:** Rich 3D on phones can stutter. Mitigation: one room at a time, instanced low-poly geometry, capped pixel ratio, and baked lighting for the PoC.
