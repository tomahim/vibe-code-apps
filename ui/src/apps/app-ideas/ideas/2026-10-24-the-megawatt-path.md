---
name: The Megawatt Path
tagline: Follow One Electron From the Grid to the GPU - An Interactive Anatomy of a Data Center's Electrical Heart
pitch: An animated cutaway that traces power through a data center - substation, switchgear, transformers, UPS, busbar, rack - with live gauges and a pull-the-plug outage simulation.
domains: [LEARN, 3D]
created: 2026-10-24T09:31:44Z
rating: 3
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Everyone talks about the cloud; almost nobody can say what's between the fence and the chip. Inspired by SemiAnalysis's Datacenter Anatomy series, this is a Mechanical Experiments-style interactive plate of a data center's electrical system: one electron's journey from the high-voltage grid, through the on-site substation, medium-voltage switchgear, the transformer stepping down to 415V, the UPS and its batteries, the PDU and overhead busbar, down into a single rack's power supplies and finally a GPU. Each stage is an animated cutaway component with live gauges - voltage stepping down stage by stage, amps climbing as it does (same power, P=UI), utilization percent, and the N+1 / 2N redundancy shown as twin paths with one greyed out. The signature interaction: pull the plug. Kill utility power and watch the UPS bridge the gap in milliseconds, the ATS signal the diesel generator, the generator spin up and take the load - then restore the grid and watch the handback. A second mode plays with density: swap a legacy 10kW rack for a 130kW liquid-cooled AI rack and watch the whole chain strain.
- **Core Problem & Target User:** AI has made data centers front-page news (power demand, gigawatt campuses, why Meta demolished a half-built one), yet the internal workings stay invisible - no public, beautiful, honest visualization exists between marketing renders and engineering PDFs. Target user: the tech-and-infrastructure curious, developers who deploy to "the cloud" without knowing what it weighs, students, and fans of the Mechanical Experiments plates who want the same treatment for infrastructure.
- **Core Value Proposition:** The data center explained the way the Swiss watch was: one flowing animated path, real numbers, every stage inspectable - plus the outage drill that makes redundancy visceral instead of a bullet point.

#### 2. USER STORIES

- **Primary User Story:** "As a curious technologist, I want to follow power step by step from grid to GPU with live voltage and load gauges, so that I finally understand what's inside a data center."
- **Secondary User Story:** "As a learner, I want to simulate a utility outage and watch the UPS, ATS and generator save the day in sequence, so that N+1 redundancy becomes something I've seen, not read."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The path | One animated cutaway plate of the electrical chain (grid, substation, MV switchgear, transformer, UPS, PDU/busbar, rack, GPU), stage-by-stage steps, live gauges (voltage, current, load%), and per-stage explainer cards grounded in the public article. | Day 1 PoC |
| Core Mechanism: The outage drill | Interactive utility-failure simulation: UPS bridges instantly, generator spins up, ATS transfers, handback on grid return - with a timeline gauge of the switch sequence and redundancy paths lighting up. | Day 1 PoC |
| Expansion 1: The density story | Rack-density mode (legacy 10kW vs AI 130kW liquid-cooled), cooling path as a second plate (chillers, CRAH units, direct-to-chip loops), tier classifications (Rated 1-4) as selectable redundancy presets, retail vs wholesale vs hyperscale scale slider. | Month 1 MVP |
| Expansion 2: The living facility | A bill-of-materials explorer (what fraction of CapEx each component eats), supplier landscape as a neutral educational layer, seasonal load and PUE gauges, and a gigawatt-campus zoom-out placing one building in a 300MW campus context (200,000-households comparison). | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** A single self-contained HTML artifact in the gallery's Mechanical Experiments format (React-free, Three.js or SVG isometric cutaway per house style, brass/steel/energy-glow palette, step buttons down the left, live gauges at the bottom, big-idea card). All content from the public portions of the source article plus standard electrical knowledge; no backend.
- **Core 24-Hour Demo Flow:** Step through the chain as gauges drop from >100kV at the fence to 415V at the data hall to 48V/12V at the tray, amps climbing inversely - then hit "SIMULATE OUTAGE" and watch the UPS carry the load for its bridge window while the generator spools up and the ATS flips. **Aha moment:** seeing the electron's path and the redundancy handoff as one continuous animation - "so THAT'S what a UPS is actually for" lands in ten seconds.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** The plate opens with "This building uses as much power as 200,000 homes. Follow one electron through it." and the first step is already moving.
- **Growth Vector:** Data centers are a live public conversation (AI power demand, grid strain, local siting debates); a beautiful explainer is exactly what gets linked in every argument, and it pairs naturally with Cloud Census (find them outside, understand them inside).

#### 6. RISKS & MITIGATION

- **Source fidelity:** The source article's deeper sections are paywalled; the idea is grounded in its free portion and general electrical knowledge. Mitigation: every number shown cites its basis ("public reporting", "typical values"), paywalled specifics are never guessed at, and the framing is "a representative facility", never a named real site.
- **Accuracy of the chain:** Electrical mistakes will draw expert correction. Mitigation: keep the topology to the standard published path (substation, MV switchgear, transformer, ATS/generator, UPS, PDU, rack), label illustrative simplifications (single-line diagram, not a real plant), and invite correction with a visible feedback note.
- **Overlap with Cloud Census:** Cloud Census finds data centers from the outside. Mitigation: this is explicitly the inside view - anatomy, not detection - and the two are cross-referenced as companions rather than merged.
- **Vendor sensitivity:** Naming suppliers can read as endorsement. Mitigation: components are shown generically (transformer, UPS, busbar), suppliers appear only in the optional educational landscape layer, listed neutrally with several names and no rankings.
