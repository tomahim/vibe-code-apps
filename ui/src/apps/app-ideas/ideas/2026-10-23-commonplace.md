---
name: Commonplace
tagline: A Living Commonplace Book That Deals Your Saved Passages Back to You
pitch: File short passages with one line in your own words; a daily ritual resurfaces them across the years and tracks how your thinking moves.
domains: [WRITE, HIST, LEARN]
created: 2026-10-23T11:21:47Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** The commonplace book was the Renaissance reader's secret weapon: a personal anthology of passages copied by hand, indexed by theme, revisited for life. This app rebuilds it as a living system. You save short passages from anywhere (photo of a book page, pasted text, voice note) and must attach one line in your own words - why this stayed with you - before the card is filed. Cards do not sit in a list: a daily Revisit ritual deals you three cards from your past, one recent, one from months ago, one from your oldest era, and asks for a fresh one-line reaction. When the new reaction contradicts or deepens the old note, the card gains "patina" and both notes stay side by side as a tiny record of how your thinking moved. Cards cluster into constellations by theme, and a timeline view shows your reading eras: the stretches when one obsession dominated.
- **Core Problem & Target User:** Highlights die in apps. People save quotes in Kindle, photos of pages, screenshots, and never see them again; a passage only compounds in value on re-encounter. Target user: readers, writers and researchers who already hoard quotes and wish the pile talked back.
- **Core Value Proposition:** A capture-plus-revisit loop that turns saved passages into a personal canon with a visible intellectual history, instead of a graveyard of highlights.

#### 2. USER STORIES

- **Primary User Story:** "As a reader, I want to file a passage with one line of my own and be dealt old passages back over time, so that what I save keeps mattering."
- **Secondary User Story:** "As a writer, I want my passages clustered by theme and era, so that I can find the quote I half-remember and watch my obsessions change."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: Capture and file | Photo, paste or voice capture (manual entry for PoC), mandatory one-line personal note, theme tags, browsable card library. | Day 1 PoC |
| Core Mechanism: The Revisit ritual | Daily deal of 3 cards (recent, months old, oldest), fresh one-line reaction, patina counter, old note vs new note shown side by side. | Day 1 PoC |
| Expansion 1: Real ingestion and search | OCR for page photos, voice transcription, full-text search, source metadata (book, author, page), import from Kindle or Readwise exports. | Month 1 MVP |
| Expansion 2: Eras and constellations | Theme clustering into constellations, the reading-era timeline, and a printable annual volume of your commonplace book. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. Cards, notes and reactions in localStorage. Seeded with 12 sample passages across 3 themes carrying realistic past dates so the Revisit ritual has depth on first open. No OCR, no backend.
- **Core 24-Hour Demo Flow:** File one passage with a one-line note, then tap Revisit: get dealt a card "filed months ago", write a fresh reaction, and watch the card flip to show old note versus new note with a patina mark. **Aha moment:** your own two takes on the same passage, side by side - the app proves in one screen that revisiting is the point.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** First open asks "what is one line from anything that never left you?" and files that as card number one, so the library starts personal within 30 seconds.
- **Growth Vector:** The printable annual volume (your commonplace book, typeset for the year) is a natural gift and share artifact, and before/after note pairs are inherently quotable screenshots.

#### 6. RISKS & MITIGATION

- **Friction at capture:** A mandatory note can feel like homework. Mitigation: keep it to one line, allow voice input, and make the note the visible payoff of the Revisit screen.
- **Overlap with highlight-sync incumbents:** Readwise already resurfaces Kindle highlights. Mitigation: the difference is the authored note and the patina history, not sync volume; position as a writing practice, and validate the ritual with manual entry before any sync work.
- **Long empty middle:** Value depends on cards aging, which takes weeks. Mitigation: let users backdate cards and file old favorites with their original dates, so the Revisit deal has depth from day one.
- **Copyright in sharing:** Passages are usually copyrighted. Mitigation: the library is private by default, and shared exports carry only the user's own notes plus citation metadata, never full passages.
