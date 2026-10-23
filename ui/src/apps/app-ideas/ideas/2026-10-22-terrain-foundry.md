---
name: Terrain Foundry
tagline: Stack Independent Procedural Modules Into One Parametric Landscape
pitch: Build a realistic 3D landscape layer by layer - mountains, rocks, rivers, trees, fog - each its own module with its own dials.
domains: [3D, MEDIA]
created: 2026-10-22T16:18:42Z
rating: 3
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** A landscape builder made of independent procedural modules that stack like lenses on a camera. Start from bare terrain. Add the Mountains module and ridges rise from a seed and a ruggedness dial. Add Rivers and water carves through whatever relief exists. Add Trees and forests follow altitude, slope and moisture. Add Rocks and scree appears where the slope says it should. Add Fog and the valley fills according to the hour. Each module is a standalone card you can enable, reorder, tune with a few dials, or remove without breaking the rest. The same seed always rebuilds the same world, so a landscape is a small, shareable recipe: an ordered list of modules plus their settings.
- **Core Problem & Target User:** Procedural generation tools are either toys with one button or professional node editors that take weeks to learn. Target user: a curious hobbyist, game jammer or teacher who wants to sculpt a believable landscape in minutes, on a phone, by composing simple understandable pieces rather than learning a full engine.
- **Core Value Proposition:** A realistic, layered landscape you can actually explain: every feature on screen traces back to one module and a handful of dials you turned yourself.

#### 2. USER STORIES

- **Primary User Story:** "As a hobbyist, I want to add, reorder and tune landscape modules one by one, so that I understand exactly what each one contributes to the final scene."
- **Secondary User Story:** "As a game jammer, I want to copy my landscape's seed and module recipe, so that a friend or teammate rebuilds the identical world in one tap."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: Module stack | A 3D viewport (Three.js), a heightfield terrain base, and a stack of module cards: Mountains (seeded noise ridges), Rivers (downhill flow lines carved into the heightfield), Trees (instanced scatter by altitude and slope), Fog (height-based volumetric haze with an hour dial). Each card has 2-4 dials and an on/off toggle. | Day 1 PoC |
| Core Mechanism: Seed and recipe | One seed drives all modules, a recipe string encodes module order and settings, copy and paste to share, landscape rebuilds identically. | Day 1 PoC |
| Expansion 1: More modules | Rocks (slope-aware scree and boulders), Snowline, Lakes (water level plane from river catchments), Clouds, and a photo mode with free camera. | Month 1 MVP |
| Expansion 2: Ecosystem | Preset packs (Alps, fjord, desert), a gallery of shared recipes, module marketplace where creators publish their own generators, export as glTF for game engines. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS, Three.js with instanced meshes for trees. Heightfield as a typed array, each module a pure function that reads the field and parameters and returns geometry or modifies the field. Seeded PRNG (mulberry32) shared by all modules. No backend, recipe stored in the URL hash.
- **Core 24-Hour Demo Flow:** Open on bare terrain, tap the Mountains card and ridges appear, add Rivers and watch them carve, add Trees and forests follow the valleys, drag the Fog hour dial to dawn and the valley fills with mist. **Aha moment:** toggling one module off and on makes its exact contribution to the scene obvious in a second.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** The app opens on a finished example landscape with its module stack visible, and toggling the top card off visibly removes the forest, teaching the whole concept in one gesture.
- **Growth Vector:** Recipe strings travel through chats and forums as "try this seed: fjord at 6am", and each shared recipe opens the app at exactly that world, one tap from remixing it.

#### 6. RISKS & MITIGATION

- **Scope Creep:** Erosion simulation, caves, weather systems, VR. Mitigation: Day 1 ships four modules with simple heightfield math; anything needing simulation over time is Expansion territory.
- **Performance:** Instanced trees and carved heightfields tax phones. Mitigation: hard caps on instance counts, a quality dial, and fog done as a cheap height-based shader rather than real volumetrics.
- **Realism ceiling:** Simple noise never looks truly real. Mitigation: module parameters are tuned against reference photos during the PoC, and the preset packs ship curated dial values rather than asking users to find them.
- **Overlap with existing ideas:** Alpine Herbarium grows procedural trees from run data and Pocket Range builds terrain from GPX tracks. Mitigation: Terrain Foundry is a creation tool, not a run souvenir, and those ideas could later ship as data-driven modules inside it.
