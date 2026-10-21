---
name: Myth Cabinet
tagline: Test What You Think You Know
pitch: Sort real evidence for and against a common belief, in any theme, and see whether it survives.
domains: [LEARN, GAME, MEDIA]
created: 2026-10-21T12:05:14Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** A fork of Evidence Cabinet (idea 52), generalized from historical claims to any theme where intuition misleads: science, health, food, personal relationships, society, money, sports. A familiar belief starts on the "everyone knows this" shelf: "cracking your knuckles causes arthritis", "you lose most body heat through your head", "opposites attract", "more choice makes us happier". The player opens a small deck of evidence cards (studies, meta-analyses, base rates, expert consensus, known limitations) and moves the belief to the shelf the evidence warrants: *holds up*, *partly true*, *mostly myth*, or *we genuinely don't know*. The reveal shows the editor's reasoned placement and which cards actually moved the case.
- **Core Problem & Target User:** Curious adults carry dozens of preconceived ideas picked up from family, media, and habit. They rarely see the actual evidence behind them, and debunking articles usually preach an answer instead of letting the reader weigh it.
- **Core Value Proposition:** A five-minute interactive case that trains the reflex "what is the evidence for what I believe?" across everyday themes, not just history.
- **Signature Interaction:** Drag the belief card across the confidence shelves after inspecting each piece of evidence. The cabinet's balance beam shows which cards support, mitigate, or are too weak to settle the belief, and a theme picker deals cases from science, health, relationships, or society.
- **Editorial Principle:** The game evaluates the quality and limits of the presented evidence set. Nuance is the point: many beliefs are mitigated rather than false, and the reveal says so plainly instead of crowning a winner.

#### 2. USER STORIES

- **Primary User Story:** "As a curious person, I want to test a belief I hold against real evidence, so that I can update it with reasons instead of vibes."
- **Secondary User Story:** "As a friend, partner, or parent, I want to share a case about a belief we argue about, so that the discussion starts from the same evidence instead of opinions."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| One bounded case per theme | Publish four six-card cases, one each for science, health, relationships, and society, with paraphrased evidence summaries, links, and limitation notes reviewed before release. | Day 1 PoC |
| Evidence cabinet | Show the belief, four confidence shelves, and the evidence deck. Let the player open cards in any order and add short private notes. | Day 1 PoC |
| Reasoned placement | Require a shelf placement and at least one card that influenced it. No numerical "truth meter". | Day 1 PoC |
| Curator reveal | Reveal the editorial placement with its reasoning, separate supporting from mitigating evidence, and state what would change the assessment. Save completed cases locally. | Day 1 PoC |
| Case library | Grow to twelve cases across the four themes on a shared content schema, with an editorial checklist and an uncertainty range per case. | Month 1 |
| Belief intake | Let players submit beliefs they want tested; curators pick defensible ones and publish them with sources. | Month 2 |
| Sharing and discussion | Add shareable case links with hidden reveal, a "we disagreed" compare view for two players, and a validated authoring workflow for contributors. | Month 3 |

**One-day build budget:** 3 hours to research and edit four defensible cases; 2 hours for the cabinet interaction (reused from Evidence Cabinet's design); 1 hour for the reveal; 2 hours for accessibility, content review, persistence, and deployment.

**Day 1 exclusions:** Medical or financial advice framing, AI-generated evidence, user-submitted "facts" without curation, grading, accounts, and quantitative confidence scoring.

#### 4. SOLO DEVELOPER ARCHITECTURE

- **Suggested stack:** React, TypeScript, Vite, Tailwind CSS, localStorage, and static deployment on Vercel.
- **Core model:** Case, Belief, EvidenceCard, EvidenceRole (`supports`, `mitigates`, `context`), Assessment, and Attempt. Every card stores a permanent source link, publication date, study type or provenance, and a limitation note. Theme is a first-class field on Case.
- **Content boundary:** The PoC uses manually authored JSON cases. Health and relationship cases must cite meta-analyses or consensus bodies where they exist, and every case states its uncertainty range in plain words.
- **Assessment boundary:** The editorial assessment is an explanation with cited reasoning, not an automated inference. Cases about contested topics present the strongest evidence on each side.
- **Engagement loop:** Pick a theme → meet a belief you probably hold → weigh the evidence → place it → compare reasoning → deal the next case.

#### 5. DAY 1 ACCEPTANCE CRITERIA

- [ ] A visitor can pick a theme and begin a case immediately without an account.
- [ ] Every evidence card exposes origin, date, study type or provenance, a limitation note, and a direct source link.
- [ ] A player can inspect cards in any order and record a private note.
- [ ] Completing a case requires a shelf placement and at least one influential card.
- [ ] The reveal separates supporting from mitigating evidence and states the uncertainty range in plain words.
- [ ] The app never frames the outcome as medical, psychological, or financial advice.
- [ ] Refresh preserves in-progress cases and notes locally.
- [ ] The cabinet works by keyboard and screen reader labels; color is never the sole evidence-role cue.

#### 6. VALIDATION & SUCCESS SIGNAL

Test the PoC with five players across at least two themes. Target: four can name one piece of evidence that surprised them, and three change or qualify their initial placement after the reveal, including at least one player who lands on "partly true" for a belief they first called obviously true or obviously false. Measure through a short follow-up prompt, not shelf-matching with the editor.

**Duplicate check:** Direct fork of 2026-10-20 Evidence Cabinet (052, rated 3 stars by Thomas, who asked for this generalization on 2026-10-21). Same cabinet mechanics, new content domain: everyday beliefs across science, health, relationships, and society instead of historical claims. No other idea in the folder covers misconception testing.
