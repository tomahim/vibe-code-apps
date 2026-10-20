---
name: Evidence Cabinet
tagline: Rebuild a Historical Claim From Its Sources
domains: [HIST, LEARN, GAME]
date: 2026-10-20
issue: 52
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Reimagine a history quiz as a curator's evidence table. A bold historical claim begins on a confidence shelf. Players open a small, curated set of source cards—each marked with author, date, perspective, proximity, and limits—then move the claim to the shelf they think the evidence warrants: *well supported*, *plausible*, *uncertain*, or *unsupported*. The reveal compares their judgment with the case editor's reasoned assessment and exposes which sources genuinely changed the case.
- **Core Problem & Target User:** Curious adults and students often retain historical assertions as settled facts without seeing the evidence, ambiguity, or competing viewpoints behind them.
- **Core Value Proposition:** Learn to ask “what would justify this claim?” in a five-minute interactive case, rather than merely memorizing an answer.
- **Signature Interaction:** Drag a claim card across the confidence shelves after inspecting a source. The cabinet's balance beam shifts to show which evidence supports, complicates, or is too weak to settle the claim.
- **Editorial Principle:** The game evaluates the quality and limits of the presented evidence set. It does not pretend to calculate historical truth or reduce contested scholarship to a single score.

#### 2. USER STORIES

- **Primary User Story:** "As a curious learner, I want to assess a historical claim against a small set of sources, so that I can understand why confidence in a claim should be limited or strengthened."
- **Secondary User Story:** "As a teacher or discussion host, I want to replay a curated case with the source context visible, so that I can prompt a conversation about evidence rather than test recall."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| One bounded case | Publish one six-card case around a narrowly phrased historical claim, with paraphrased source summaries, dates, source links, and editorial notes reviewed before release. | Day 1 PoC |
| Evidence cabinet | Show the claim, four confidence shelves, and a deck of source cards. Let the learner open cards in any order and add short private notes. | Day 1 PoC |
| Reasoned placement | Require the learner to place the claim and select at least one source that influenced their judgment. There is no numerical “truth meter.” | Day 1 PoC |
| Curator reveal | Reveal the editorial assessment, show supporting and limiting evidence separately, and explain why reasonable learners could still differ within a stated range. Save the completed case locally. | Day 1 PoC |
| Case library | Add six to eight cases spanning political, social, scientific, and local history, each using a shared content schema and an editorial checklist. | Month 1 |
| Competing interpretations | Support paired historian perspectives, source comparison prompts, and explicit uncertainty ranges without forcing a false consensus. | Month 2 |
| Discussion toolkit | Add facilitator mode, printable/exportable case packets, local class or book-club notes, and a validated authoring workflow for contributors. | Month 3 |

**One-day build budget:** 3 hours to research, source, and edit one defensible case; 2 hours for cabinet interaction; 1 hour for the reveal; 2 hours for accessibility, content review, persistence, and deployment.

**Day 1 exclusions:** AI-generated historical claims, user-submitted facts, grading, source scraping, accounts, multiplayer debate, and quantitative confidence scoring.

#### 4. SOLO DEVELOPER ARCHITECTURE

- **Suggested stack:** React, TypeScript, Vite, Tailwind CSS, localStorage, and static deployment on Vercel.
- **Core model:** Case, Claim, SourceCard, EvidenceRole (`supports`, `complicates`, `context`), Assessment, and Attempt. Every source card stores a permanent source URL, access date, summary author, and a limitation note.
- **Content boundary:** The PoC uses a manually authored JSON case. Source excerpts should be short, licensed where necessary, or paraphrased with a direct link; it should never fabricate quotations.
- **Assessment boundary:** The editorial assessment is an explanation with cited reasoning, not an automated inference. The interface keeps primary evidence, interpretation, and the learner's note visually separate.
- **Engagement loop:** Encounter a claim → inspect evidence → state a justified confidence level → compare reasoning → try another case.

#### 5. DAY 1 ACCEPTANCE CRITERIA

- [ ] A visitor can begin the case immediately without creating an account.
- [ ] Every source card exposes author or origin, date, perspective or provenance, a limitation note, and a direct source link.
- [ ] A learner can inspect source cards in any order and record a private note.
- [ ] Completing the case requires a confidence placement and identification of at least one influential source.
- [ ] The reveal distinguishes evidence that supports the claim from evidence that limits or contextualizes it.
- [ ] The app does not present the final assessment as a calculated factual probability.
- [ ] Refresh preserves the in-progress case and notes locally.
- [ ] The cabinet works by keyboard and screen reader labels; color is never the sole evidence-role cue.

#### 6. VALIDATION & SUCCESS SIGNAL

Test the PoC with five learners. Target: four can explain one limitation of a source after completing the case, and three change or qualify their initial confidence placement after viewing the reveal. Measure explanation quality through a short follow-up prompt, not whether their first shelf matched the editor's assessment.

**Duplicate check:** Reviewed open issues #16, #33, and #46–#51 on 2026-10-20. This is evidence-based historical reasoning, distinct from the chronological placement puzzle in #47 and the rule-discovery game in #51.
