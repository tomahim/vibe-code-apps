---
name: The Provenance
tagline: Catalog the Objects You Own Like a Museum Would - Acquisition, Repairs, Previous Lives
pitch: Create museum-grade provenance records for your meaningful belongings: where each came from, what it survived, and why it stays.
domains: [HIST, PROD]
created: 2026-10-29T06:03:02Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Museums keep an object file for everything: acquisition date, previous owners, condition reports, exhibition history, conservation notes. The Provenance brings that discipline to the dozen objects in your home that actually matter. Each entry is a proper object file: a photo, an acquisition line ("Bought from a flea market in Lisbon, May 2019, after twenty minutes of haggling"), a chain of custody where known, condition and repair notes over the years, and a curatorial statement - why this object stays. The app renders your collection as a quiet catalog with numbered plates, the way a museum publishes its holdings, turning "stuff I own" into "the collection I keep."
- **Core Problem & Target User:** The stories behind meaningful objects live only in memory, and they die with the owner or get lost in a move. Meanwhile nobody can answer "where did this come from?" about their own grandparents' belongings. Target user: people who keep objects for their stories - collectors of one, inheritors of boxes, flea-market romantics - and families who want the record to outlive the rememberer.
- **Core Value Proposition:** Your meaningful belongings get the same documentary respect a museum gives its holdings: a permanent, beautiful, exportable record of where each came from and why it matters, assembled in minutes per object.

#### 2. USER STORIES

- **Primary User Story:** "As a keeper of meaningful objects, I want to record each object's provenance and story in a structured object file, so that its history survives even if my memory or the object's context does not."
- **Secondary User Story:** "As a family member or heir, I want the collection readable as a bound catalog, so that the stories attached to inherited things come with them."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The object file | Create an entry with photo, name, acquisition line, estimated date, chain of custody, condition notes and a curatorial statement; rendered as a numbered museum object record. | Day 1 PoC |
| Core Mechanism: The catalog | All object files browsable as a quiet holdings catalog: plate grid, accession numbers, single-object pages in published-catalog style. | Day 1 PoC |
| Expansion 1: The conservation log | Condition and repair entries over time ("re-glued the handle, 2024"), loans ledger ("lent to Claire, due back"), and search across the collection. | Month 1 MVP |
| Expansion 2: The estate binder | Print-ready catalog export as a family document, a disposition field (what should happen to this object), and gentle annual review prompts to update files. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. Object-file form (photo via file picker, text fields with museum-field labels) and the catalog view with auto-assigned accession numbers. localStorage only; photos stored as data URLs on day 1, no backend, no accounts. Desktop-friendly for catalog browsing, mobile for quick capture.
- **Core 24-Hour Demo Flow:** Open to a sample catalog of six objects (a chipped regatta trophy, a grandmother's compass, a concert ticket stub framed). Open the compass: three previous custodians, one repair note, and a curatorial statement that makes a brass trinket read like a museum highlight. Then add your own first object. The "Aha!" moment: watching a five-line record turn a thing on your shelf into an artifact with a file number.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** The sample catalog shows how little text it takes to make an object feel documented; the first real object file takes five minutes and a photo.
- **Growth Vector:** The printed catalog is a genuine family artifact (the natural audience is siblings and children), and estate relevance gives the habit lasting purpose rather than novelty.

#### 6. RISKS & MITIGATION

- **Privacy risk:** Object files can reveal valuables, addresses and inheritance wishes. Mitigation: local-only storage in the PoC, no cloud sync until deliberately designed, and export stays user-initiated with a plain-language note about who should receive it.
- **Engagement risk:** Cataloging sounds like inventory work. Mitigation: the app insists on the meaningful dozen, not the household hundred - one object at a time, story first, fields optional except the acquisition line.
- **Tone risk:** Museum styling could tip into pretension. Mitigation: the format is documentary and warm; the curatorial statement invites plain speech ("why this stays") rather than art-speak.
