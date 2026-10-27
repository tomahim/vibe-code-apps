---
name: The Weekly Whodunit
tagline: A Murder in Five Daily Chapters - Your Table Votes the Theory Before Friday's Reveal
pitch: A serialized cozy mystery: one short chapter lands each weekday, your household or friends debate and vote a suspect, and Friday's finale grades every theory you floated.
domains: [GAME, MEDIA, WRITE]
created: 2026-10-24T03:09:55Z
rating: 2
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Dickens solved the pacing problem in 1836: serialize. The Weekly Whodunit is a five-day mystery drip. Monday: the body. Tuesday through Thursday: two suspects a day, each chapter five minutes of reading - a scene, an interview, one new fact that breaks yesterday's favorite theory. Every evening a prompt: "Who did it, and what's your evidence?" - answered solo or as a household table vote, with a one-line justification that becomes your table's running theory log. Friday: the finale lands, the culprit is named, and the game grades your week: the day you first suspected the right person, the red herring that owned you longest, and the single clue that should have given it away. Tables get a season record ("solved in three days, twice").
- **Core Problem & Target User:** Mystery content is binged and forgotten; families and friend groups lack a shared, low-effort ritual that's clever rather than competitive trivia. Target user: couples, families and friend chats who already share Wordle-style daily results, and cozy-mystery readers who miss having something to argue about mid-week.
- **Core Value Proposition:** A five-minute daily mystery that turns the week into a shared investigation, with a Friday reveal that grades your table's detective work, not just your guess.

#### 2. USER STORIES

- **Primary User Story:** "As a mystery fan, I want one short chapter each weekday with a nightly theory vote, so that the case unfolds alongside my week."
- **Secondary User Story:** "As a table captain, I want a shared vote and theory log for my group, so that Friday's reveal is an event we experience together."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The week | One complete five-chapter case with a polished reading view, the nightly theory prompt, a personal theory log, and the Friday finale with a full solution walkback. | Day 1 PoC |
| Core Mechanism: The grading | Per-player or per-table report: first correct suspicion day, red herrings believed and for how long, the one decisive clue, and a season record. | Day 1 PoC |
| Expansion 1: Tables | Invite links for household or friend tables, shared votes with named justifications, a table chat per chapter, and spoiler-safe pacing (chapters unlock for everyone on the same morning). | Month 1 MVP |
| Expansion 2: The season | A new case weekly with rotating guest styles (locked room, manor weekend, small-town fete), a recurring detective whose arc spans cases, archived cases for late joiners, and a print-style collected edition per season. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. One hand-authored case as typed content files; a simple clock unlocks chapters (with a dev preview mode to read all five); votes and theory log in localStorage. Book-plate illustration style: chapter header art, one small scene illustration per chapter.
- **Core 24-Hour Demo Flow:** Read Monday's chapter - a food critic collapses at his own restaurant's anniversary dinner - and cast your first vote with one line of reasoning. By Wednesday the game surfaces your Monday note back to you: "still standing by this?" **Aha moment:** Friday's report shows the exact Tuesday paragraph where the culprit slipped up, and whether your table caught it.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** "New case opens Monday" - the landing page is the crime-scene chapter of the current case with the first vote prompt right below it, no signup needed for chapter one.
- **Growth Vector:** The weekly rhythm is a natural group-chat export ("our table thinks it's the sommelier"), Friday reveals drive same-day buzz, and Wordle-style spoiler-free result grids share cleanly.

#### 6. RISKS & MITIGATION

- **One writer's bottleneck:** Weekly cases need consistent quality at pace. Mitigation: the format is small (five short chapters), reusable case skeletons (locked room, gathering, journey) keep structure sound, and a backlog buffer of finished cases precedes any season launch.
- **Fair-play obligation:** Readers must be able to solve it from the text. Mitigation: every case follows fair-play rules - the decisive clue appears before Friday, the finale cites it verbatim, and a reader panel test-solves each case pre-release.
- **Spoilers across tables:** Friday's reveal is public knowledge by Saturday. Mitigation: spoiler-free share formats, chapter-gated discussion, and archived-case onboarding so latecomers never arrive to a solved week.
- **Timezone drift:** "Friday reveal" is not the same morning everywhere. Mitigation: chapter unlocks are tied to the table's chosen timezone, with a clear unlock clock shown in the app.
