---
name: Plot Device
tagline: A Mystery Novelist Embedded With a Police Squad, and Your Wildest Theory Might Crack the Case
pitch: A Castle-style detective game where you play a crime writer shadowing detectives; solving cases takes both evidence and the outrageous narrative theories only a novelist would pitch.
domains: [GAME, WRITE]
created: 2026-10-24T03:09:21Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** The fun of Castle is that the writer solves cases differently: detectives follow evidence, the novelist follows story. This game makes that duality the mechanic. Each episode is a murder case told in chapters - the body, the suspects, the interviews, the lab results - and at every beat you can do two things: tag evidence like a detective, or pitch a theory like a writer ("the grieving husband's alibi is too perfect - this is chapter-three misdirection"). The game tracks both meters. Evidence grounds you and unlocks interrogation options; narrative instinct lets you make leaps the police can't, but pitch a theory the facts later embarrass and your credibility with the squad drops. The case cracks when story sense and hard evidence finally point at the same person, and the finale is you explaining the whole plot back as a chapter outline.
- **Core Problem & Target User:** Detective games are either evidence spreadsheets or pure story where choices don't matter. Target user: fans of cozy crime TV (Castle, Murder She Wrote, Only Murders) who want to feel clever twice - once for spotting the clue, once for calling the twist.
- **Core Value Proposition:** A detective procedural where being a writer is a real game mechanic: genre savviness is a resource, and the best move is sometimes a hunch about how stories work.

#### 2. USER STORIES

- **Primary User Story:** "As a player, I want to work a murder case chapter by chapter, tagging evidence and pitching narrative theories, so that solving it feels like both detecting and writing."
- **Secondary User Story:** "As a mystery fan, I want my genre instincts rewarded - and occasionally punished when the story outwits me - so that every case keeps me honest."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The case | One complete episode (6 chapters): illustrated scenes, tappable evidence, suspect interviews with dialogue choices, and a case file that organizes what you've found. | Day 1 PoC |
| Core Mechanism: The two meters | Evidence meter and Narrative meter; theory pitches at story beats, squad credibility that rises and falls with your calls, and a finale where you reconstruct the crime as a chapter outline. | Day 1 PoC |
| Expansion 1: A season of cases | 8-10 episodes with an overarching season plot (a recurring nemesis who leaves literary clues), difficulty tiers, and case recap "previously on" cards. | Month 1 MVP |
| Expansion 2: The writer's desk | Player-named characters and a generated "novel excerpt" after each solved case retelling it in prose, co-op mode where one player is the writer and one the detective with different information, community case packs. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. One hand-authored case as typed content files (scenes, evidence, dialogue trees, theory-pitch outcomes); state machine in the client, no backend. Comic-noir illustrated style with bold chapter cards.
- **Core 24-Hour Demo Flow:** Chapter one: the victim is a chess grandmaster found in a locked study. Tag the wrong-move chessboard and the rain-dry umbrella, then pitch "the alibi is the murder weapon" at the beat prompt. The detective partner raises an eyebrow - and chapter four proves you right. **Aha moment:** the game explicitly scores you for thinking like a novelist, with your partner saying "that's insane - say more."

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** The cold open is the crime scene with three tappable oddities and one prompt: "Something here is a plot device. Find it."
- **Growth Vector:** The post-case generated "novel excerpt" retelling your solution is inherently shareable, and episodic structure gives a weekly rhythm fans of cozy crime already keep.

#### 6. RISKS & MITIGATION

- **Theory pitching feels arbitrary:** Leaps must be fair, not guess-the-author. Mitigation: every correct theory is planted with at least two subtle story cues earlier in the case, and wrong pitches get in-fiction feedback, not just a score hit.
- **Writing quality is the product:** A writer-led game dies on weak prose. Mitigation: one small case written well over many thin ones; every line passes a read-aloud test; no generated prose in the PoC.
- **Tone balance:** Murder plus charm is a fine line. Mitigation: cozy-crime register throughout - wit, no gore, victims treated with weight, humor aimed at situations not suffering.
- **Replayability:** Once solved, a case is spent. Mitigation: the season model accepts this; replay value comes from missed-cue detection stats and alternative theory endings, not procedural generation.
