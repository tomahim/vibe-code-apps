---
name: Folklore Atlas
tagline: Every Place Has a Story - Map the Legends, Ghosts and Odd Customs Where They Happened
pitch: A map of local folklore where each tale is pinned to the place it happened, sourced and labeled, so a walk anywhere becomes a guided tour of its stories.
domains: [HIST, MEDIA]
created: 2026-10-31T06:02:57Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Every village has a lane that is haunted, a rock with a name, a custom nobody can explain. Folklore Atlas pins these stories back onto the map where they belong. Each entry is a tale card: the story retold in two hundred words, the place pinned, the tradition type (ghost, giant, custom, buried treasure, saint, warning), and - the part that makes it trustworthy - a provenance label: documented in a named collection or archive, attested in local journalism, or community-reported and marked as such. Open the atlas on a walk and the countryside narrates itself; open it at home and a "story trail" mode chains five nearby tales into a themed evening route with a map and a reading for each stop.
- **Core Problem & Target User:** Local folklore is disappearing into dying websites and out-of-print county collections, and what survives online is unsourced copy-paste with no way to tell documented tradition from recent invention. Target user: walkers, families looking for outings, amateur historians, travelers who want the layer under the guidebook, and anyone who suspects their own neighborhood is weirder than it looks.
- **Core Value Proposition:** The landscape's hidden narrative layer, restored with standards: every tale pinned to its place and labeled by source quality, so folklore gets explored with the same respect as history.

#### 2. USER STORIES

- **Primary User Story:** "As a walker, I want to open the map and read the documented tales attached to the places around me, so that an ordinary walk becomes a narrated landscape."
- **Secondary User Story:** "As a contributor, I want to submit a local tale with its source or a clear community-reported label, so that the atlas grows without blurring documented tradition and hearsay."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The pinned tale | A browsable map of tale cards (story, tradition type, provenance label, source citation), clustered by place and filterable by type. | Day 1 PoC |
| Core Mechanism: The story trail | Pick any point and the atlas chains nearby tales into a numbered trail with a route and a reading per stop. | Day 1 PoC |
| Expansion 1: The collector | Submission flow with provenance fields, an editorial queue for source review, county and country collections browsable as reading rooms, and offline trail packs. | Month 1 MVP |
| Expansion 2: The living atlas | Seasonal customs layer (what happens here, on which date), community verification of community-reported tales, and a print-ready trail booklet. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS with a map library and a bundled starter collection of about forty well-documented tales from one region, each with a real cited source. Map view, tale card view, trail generator over the bundled data. No backend, no accounts; starter content is static. Mobile-first, since the atlas lives outdoors.
- **Core 24-Hour Demo Flow:** Open the map over the starter region and watch the pins cluster: a drowned village, a giant's throwing-stone, a fairy thorn nobody will cut. Read the thorn's card with its 1911 collection citation. Then tap "trail from here" and get a five-stop evening route. The "Aha!" moment: realizing every field on the map has a story attached, and yours could be next.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** The starter region proves the density immediately; one scroll of the map makes anyone check their own home coordinates.
- **Growth Vector:** Trails are shared as plans ("Saturday, five stops, ending at the pub"), local groups submit their own tales, and every region added recruits its own audience.

#### 6. RISKS & MITIGATION

- **Accuracy risk:** Folklore attracts invention; an atlas that mixes documented tradition with made-up content loses its reason to exist. Mitigation: the provenance label is mandatory and visible on every card, community-reported tales are styled distinctly until corroborated, and entries always name their source.
- **Content risk:** Starter coverage decides whether the app feels alive. Mitigation: launch deep in one region rather than thin everywhere, with the submission flow feeding an editorial queue from day one.
- **Sensitivity risk:** Some tales attach to private homes, sacred sites or living families. Mitigation: pins snap to public landmarks rather than private addresses, sensitive sites carry access notes, and takedown requests get a direct channel.
