---
name: The Overlay
tagline: Flood Zones, Soil, Noise, Trees - Stack Real Map Layers Until Your Question Answers Itself
pitch: A friendly geospatial workbench that stacks open map layers with transparency sliders so anyone can answer "what is this place really like?" without touching GIS software.
domains: [PROD, LEARN]
created: 2026-11-04T06:02:16Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** GIS professionals answer everyday questions by stacking layers, but the tools gatekeep the method behind software with a thousand buttons. The Overlay is the layer-stacking method as a consumer tool. You ask a question in plain terms - "Is this flat in a flood zone?", "How noisy is this street?", "Where in this city can I run on soft ground under trees?" - and the app builds the stack: flood-risk polygons under noise contours under tree canopy under your candidate addresses. Each layer gets a transparency slider, so you literally see the answer darken where conditions overlap. Every layer card cites its source, vintage and resolution, and a "read this stack" panel explains what the overlap does and does not prove.
- **Core Problem & Target User:** Decisions people make constantly (where to live, where to run, where to plant, where to open a shop) depend on spatial data that is public but practically unreachable: scattered portals, incompatible formats, expert software. Target user: home hunters, runners and cyclists, gardeners, small business owners scouting locations, journalists checking a claim about a place, and the generally map-curious.
- **Core Value Proposition:** The power of GIS thinking with none of the GIS: real open layers, stacked visually against your actual question, with the sources and the caveats always one tap away.

#### 2. USER STORIES

- **Primary User Story:** "As a non-expert, I want to stack real map layers over a place with transparency sliders, so that I can answer a practical question about it myself."
- **Secondary User Story:** "As a careful user, I want each layer's source, date and limits visible, so that I know how much to trust the picture the stack is showing me."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The stack | A map with a curated starter library of open layers (flood risk, elevation, tree canopy, noise, land use), each with a transparency slider and a source card. | Day 1 PoC |
| Core Mechanism: The question | Guided question flows (home check, run route, garden spot) that pre-select the relevant layers and end with a plain-language reading of the overlap. | Day 1 PoC |
| Expansion 1: The workbench | Save and share named stacks, layer search across national and EU open data portals, draw-your-own layer (trace a zone, compare it against the stack), and before/after pairs of the same place. | Month 1 MVP |
| Expansion 2: The analyst | Import your own GeoJSON or CSV points, simple intersect-and-count questions ("how many of my customers fall in this zone?"), printable stack reports with sources, and classroom packs. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS with a map library and tiled or vector-layer overlays. A bundled starter set of open layers for one region (served as static tiles or GeoJSON with clear licenses), the slider stack, layer source cards, and two guided question flows. No backend, no accounts; static data only on day 1.
- **Core 24-Hour Demo Flow:** Open the "home check" flow for a sample address: drag the flood layer to full opacity (one corner of the street goes blue), add the noise layer (a red band along the main road), then the canopy layer (a quiet green pocket behind the building). The reading panel summarizes what the stack suggests and what it cannot tell you. The "Aha!" moment: watching three public datasets you have heard of separately collide into one legible answer.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** The guided question is the demo: anyone who has ever wondered about a flood zone or a noisy road gets a real answer about a real place in the first minute.
- **Growth Vector:** Shared stacks travel naturally ("look at the flood layer under this listing"), journalists and teachers adopt a citation-first map tool, and every new layer added recruits its own community.

#### 6. RISKS & MITIGATION

- **Misreading risk:** Stacked layers feel authoritative; correlations on a map invite overconfidence. Mitigation: every stack carries its reading panel with explicit limits (resolution, vintage, what the data never measured), and source cards are visible by default, not buried.
- **Data risk:** Open datasets differ wildly in freshness and license. Mitigation: a curated layer library with license and update-date displayed per layer; stale layers are labeled stale rather than silently served.
- **Scope creep risk:** Routing, editing geometries, real-time sensors. Mitigation: the product is stacking and reading; anything that changes the world rather than the view is out of scope.
