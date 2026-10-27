---
name: The Long Year
tagline: Live One Historical Year Day by Day - Every Morning, That Day's Life Arrives
pitch: Subscribe to a year in history and receive its daily entries each morning - letters, prices, weather, news - experiencing the era at the pace it actually happened.
domains: [HIST, MEDIA]
created: 2026-10-25T06:03:55Z
rating: 3
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** History apps give you the summary; nobody gives you the Tuesday. The Long Year syncs a historical year to your calendar: pick 1348, 1789, 1913, or 1968, and every morning you receive what that day held - a merchant's letter, the price of bread, a court record, the weather as chronicled, the rumor crossing the city. Days with rich sources are full; quiet days are honestly quiet ("little survives from this week - the harvest was in"). The power is pace: events you know are coming don't announce themselves. The plague in 1348 arrives the way it arrived - rumors first, then nearer towns, then the parish register's handwriting changing. You live inside the year at one day per day, and a private journal lets you note your own reactions alongside the entries, so December-you can look back at what March-you didn't yet understand.
- **Core Problem & Target User:** History is consumed as finished narratives with the suspense edited out; the texture of ordinary days - what things cost, what people feared, what nobody knew yet - is invisible. Target user: history readers who want immersion over summary, and ritual-app lovers (the Heirloom Radio crowd) who like a small daily appointment with meaning.
- **Core Value Proposition:** Historical empathy through real time: a year lived at walking pace, sourced day by day, where the biggest events in history surprise you again because you experience the not-knowing.

#### 2. USER STORIES

- **Primary User Story:** "As a history lover, I want one historical year's daily texture delivered each morning, so that the era unfolds for me at the pace it was lived."
- **Secondary User Story:** "As a journal keeper, I want to note my reactions alongside the entries, so that my own year of reading becomes a record worth rereading."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The year | One complete year (1348) as 365 dated entries from published primary sources and standard scholarship, delivered one per day, with quiet days marked honestly. | Day 1 PoC |
| Core Mechanism: The journal | A private day-by-day journal beside each entry, a reread mode that shows your notes next to what happened later, and a year map showing how far through you are. | Day 1 PoC |
| Expansion 1: More years | 1789 Paris, 1913 across Europe, 1968 as a global year - each curated with the same sourcing discipline; thematic lenses per year (a baker's economy, a family's letters); catch-up mode for late joiners. | Month 1 MVP |
| Expansion 2: Deep texture | Audio readings of letters, maps that animate the year's movements, "this day in your year" widgets, small-group years where friends take the same year and discuss monthly, and an end-of-year bound keepsake of entries plus your journal. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. 365 entries for 1348 as authored content files with source notes; the daily unlock uses the device date with a preview mode; journal in localStorage. Letter-paper aesthetic with period-appropriate typography, no fake parchment kitsch.
- **Core 24-Hour Demo Flow:** Open on your assigned day - a Florentine notary's letter about wool prices, one line about "sickness in the east". Note in your journal: "probably nothing". Six simulated weeks later the entries darken, and the app resurfaces your own note. **Aha moment:** being wrong in your own handwriting - the not-knowing you only get from living a year at real pace.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** "Pick your year. It starts tomorrow morning." - the first entry arrives with no feed to binge, which is itself the pitch.
- **Growth Vector:** The daily ritual drives word of mouth at exactly one moment a day; year-mates (friends in the same year) form natural book-club energy, and the end-of-year keepsake is a gift that recruits the next reader.

#### 6. RISKS & MITIGATION

- **Source coverage:** No historical year has 365 documented days. Mitigation: quiet days are a designed feature marked honestly, entries always cite their source type (document, chronicle, scholarship), and nothing is invented to fill gaps - absence is part of the texture.
- **Accuracy of daily texture:** Prices, weather and letters must be defensible. Mitigation: content is drawn from published primary sources and standard scholarship with citations, and composite days are labeled as composites.
- **Sensitive content:** 1348 is a plague year; other years carry war and upheaval. Mitigation: the register is human, not ghoulish - sources are chosen and framed with care, and each year opens with a content note.
- **Ritual fatigue:** Daily apps decay. Mitigation: entries stay under three minutes, the journal gives personal stakes, and the year's arc provides momentum that a generic daily-fact app lacks.
