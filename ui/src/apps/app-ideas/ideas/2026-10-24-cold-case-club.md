---
name: Cold Case Club
tagline: A Monthly Evidence Pack, a Corkboard, and a Case Nobody Solved
pitch: Each month a fictional cold case arrives as an evidence pack - letters, photos, transcripts - and you pin connections on a corkboard before submitting your theory against the buried truth.
domains: [GAME, LEARN]
created: 2026-10-24T03:09:38Z
rating: 1
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Unsolved-case games ship as expensive physical boxes; this makes the format a beautiful monthly digital ritual. The pack lands like a found archive: scanned letters with real handwriting styles, a coroner's note, phone transcripts, photos with things in the background nobody flagged. Your workspace is a corkboard - pin items, drag strings between them, attach your own notes to any string. The game never tells you if a connection is right; it only tracks that you made it. When you submit, the reveal is layered: first the true solution, then a "case review" showing which of your strings were load-bearing, which were red herrings you lovingly crafted, and which clue everyone misses. Cases are fictional but researched, each teaching a real investigative concept (timeline reconstruction, motive versus means, the unreliability of witness memory).
- **Core Problem & Target User:** Armchair detective content (unresolved mysteries, cold case documentaries) is passive; the physical subscription boxes are brilliant but pricey and one-shot. Target user: true-crime and puzzle fans who want the corkboard experience monthly, and couples or friends who want a shared night of "wait - look at this."
- **Core Value Proposition:** The full evidence-box ritual as a monthly digital pack, with an honest scoring reveal that shows you how you actually think.

#### 2. USER STORIES

- **Primary User Story:** "As an armchair detective, I want a rich fictional evidence pack and a free-form corkboard, so that I can build my own case theory instead of following a guided one."
- **Secondary User Story:** "As a player, I want the reveal to show which of my connections held up and which I invented, so that I get better at reasoning, not just at guessing."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The pack | One complete fictional cold case: 12-15 evidence artifacts rendered as tactile scanned documents, viewable full-screen, with a case dossier framing the known facts. | Day 1 PoC |
| Core Mechanism: The corkboard | Free-form pin board: place artifacts, draw strings, label connections, save multiple board states; theory submission with confidence per claim; the layered reveal with your personal case review. | Day 1 PoC |
| Expansion 1: The monthly club | A new case monthly with season-long threads, discussion rooms that unlock only after you submit (no spoilers), a "case everyone got wrong" hall of fame, and difficulty ratings per pack. | Month 1 MVP |
| Expansion 2: Deeper craft | Cases co-written with crime writers, audio artifacts (voicemail you can scrub), print-your-pack export for a physical table night, and a multiplayer mode where two players share one board live. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. Artifacts are hand-authored HTML/SVG "scans" with paper texture and handwriting-style fonts; the corkboard is a simple canvas with drag, string drawing, and notes, state in localStorage. The reveal logic is a claims table mapping possible strings to true/red-herring status.
- **Core 24-Hour Demo Flow:** Open the pack: a lighthouse keeper vanished in 1987. Pin the logbook, the grocery order for two, the postcard with a torn corner. String the postcard to the ferry schedule, submit your theory - and the review tells you the string you almost didn't draw was the case. **Aha moment:** the reveal re-shows YOUR board with your strings marked true or invented, and it's brutally personal.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** The landing page shows one artifact - the logbook with its final entry - and asks "what's wrong with this page?" with free text entry; everyone has a theory in twenty seconds.
- **Growth Vector:** Monthly cadence builds a club identity; post-submission discussion rooms create community; the format begs for "we solved it over dinner" social sharing without spoiling (share only your score and your most embarrassing wrong string).

#### 6. RISKS & MITIGATION

- **Fairness of the solution:** A cold case that can't actually be solved from the pack breeds distrust. Mitigation: every case passes a solvability audit - all load-bearing facts are present in the artifacts, and the reveal cites the exact items that prove the solution.
- **Real-victim sensitivity:** True-crime framing can exploit real tragedy. Mitigation: all cases are fictional, set in an invented town, with period detail for texture only; the LEARN layer teaches reasoning concepts, never real cases.
- **Artifact production cost:** Beautiful documents take craft. Mitigation: a small set of reusable document types (letter, transcript, photo, form) with strong templates; one excellent case beats three thin ones.
- **Spoilers killing the club:** One shared solution ruins a monthly pack. Mitigation: spoiler-gated discussion, per-pack codes, and the share format designed to never reveal content.
