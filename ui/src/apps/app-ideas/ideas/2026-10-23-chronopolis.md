---
name: Chronopolis
tagline: Watch a City Rebuild Itself in 3D, Century by Century
pitch: Scrub a timeline and a real city morphs in 3D between its historical states, rebuilt from archival imagery and maps.
domains: [3D, HIST]
created: 2026-10-23T06:28:14Z
rating: 3
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** A time machine for one place. Pick a city and scrub a timeline from its first maps to today: the 3D scene morphs continuously as walls rise and fall, a river gets covered, a railway cuts through, a square appears. Each era's geometry is reconstructed from the best sources of its time: old cadastral maps and etchings for the deep past, archival aerial photos for the twentieth century, modern open satellite and street-level imagery for today. Transition moments get the drama: a boulevard pierces a medieval block in one sweep, a station hall rises in seconds. The user can pin two years side by side in split view, and every building carries a tag with the source image it was reconstructed from.
- **Core Problem & Target User:** "This street used to look so different" is a universal feeling with no good tool behind it; before-and-after sliders are flat and limited to photo pairs. Target user: anyone attached to a place, plus teachers and urbanism curious people, who wants to feel a city's change rather than read about it.
- **Core Value Proposition:** An animated, navigable 3D reconstruction of a real city's evolution, sourced image by sourced image, that makes a century of urban change watchable in a minute.

#### 2. USER STORIES

- **Primary User Story:** "As a resident, I want to scrub my city's timeline in 3D, so that I can watch my own neighborhood transform across the decades."
- **Secondary User Story:** "As a teacher, I want to pin two eras side by side with the source images visible, so that students see both the change and the evidence for it."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: Timeline scrub | One city, three to five eras, each a hand-built low-poly 3D scene in Three.js; a timeline slider morphs camera and crossfades geometry between eras, with landmark event cards at transition years. | Day 1 PoC |
| Core Mechanism: Evidence tags | Tappable buildings open their source panel (the archival map crop, etching or aerial photo they were drawn from) so reconstruction never pretends to be photography. | Day 1 PoC |
| Expansion 1: Real data pipeline | Semi-automated reconstruction: georeferenced historical map layers, open aerial archives by decade, and photogrammetry or neural reconstruction from modern open street-level imagery for the present-day layer; split view of two pinned years. | Month 1 MVP |
| Expansion 2: Many cities and stories | A city catalog, narrated "transformation tours" (the covering of a river, the arrival of the railway), user-submitted then-and-now photo pairs anchored into the scene. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS, Three.js. One city (a French one with rich open archives, e.g. Paris around a single square), era scenes as hand-authored low-poly GLTFs built from public-domain maps and etchings, timeline state machine driving morph and crossfade, source panels as static images with licence notes. No backend.
- **Core 24-Hour Demo Flow:** Open on the city in 1850, scrub to 2026, watch the boulevard cut through, tap a building to see the 1860 map crop it came from, then pin 1850 and 2026 in split view. **Aha moment:** the smooth morph makes a century legible in one gesture, and the evidence tag keeps it honest.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** The app opens mid-morph on the most dramatic transition the city has, so the first five seconds carry the whole pitch.
- **Growth Vector:** Local pride: a thirty-second timelapse video export of "your street, 1900 vs today" is made to be shared in neighborhood groups, and each city launch recruits its own local audience.

#### 6. RISKS & MITIGATION

- **Imagery licensing:** Google Street View and Google Earth imagery cannot be scraped, redistributed or rebuilt into a product. Mitigation: the pipeline targets public-domain archival maps, open government aerial archives (many countries publish decades of them), and openly licensed street-level imagery (e.g. Mapillary under its terms); every source panel carries its licence line. Legal review per source before any city ships.
- **Reconstruction fidelity:** Historical 3D reconstruction from sparse images is a research problem, not a weekend feature. Mitigation: Day 1 is hand-authored low-poly with visible evidence tags; automation is Expansion scope and may stay semi-automatic.
- **Scope creep:** Many cities, photorealism, real-time streaming. Mitigation: one city and one square for the PoC, low-poly aesthetic as a feature (it reads as "model", not "fake photo").
- **Data overlap:** Sibling ideas touch place and history (Palimpsest Town grows a town from prose; Expedition Ledger travels historic routes). Mitigation: Chronopolis is about real, sourced city change over time, and could later reuse the others' rendering tricks.
