---
name: Rule Smugglers
tagline: Outsmart a Border That Never Explains Its Rules
domains: [GAME, LEARN]
created: 2026-10-20T07:51:10Z
issue: 51
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Reimagine an inductive logic puzzle as a tiny customs checkpoint. Players submit colorful cargo tokens to a gatekeeper that follows one secret rule. Every accepted or rejected shipment becomes public evidence. The goal is to construct a test that distinguishes competing explanations, then predict unseen outcomes.
- **Core Problem & Target User:** Friends, families, and puzzle lovers want a short shared game that rewards reasoning and discussion without requiring trivia knowledge or a long rules explanation.
- **Core Value Proposition:** Play a five-minute mystery where a well-chosen experiment is more useful than a lucky guess.
- **Signature Interaction:** Send a deliberately chosen cargo token through the checkpoint and watch an “accepted” or “returned” stamp settle an argument about the hidden rule.
- **Example Rule:** “Blue OR triangular.” A blue square and a red triangle pass; a red circle fails. Players must test beyond “blue things pass” to discover the complete pattern.

#### 2. USER STORIES

- **Primary User Story:** "As a puzzle player, I want to test cargo against a hidden rule, so that I can discover the pattern through evidence."
- **Secondary User Story:** "As a friend playing on the same device, I want to record competing explanations and take turns testing them, so that we can reason together before the reveal."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Instant checkpoint | Start a solo or informal pass-and-play round with a clearly explained objective and one hidden rule selected from six authored predicates. | Day 1 PoC |
| Cargo builder | Choose one of three colors, three shapes, and two sizes, creating a finite universe of 18 possible tokens. | Day 1 PoC |
| Evidence ledger | Submit up to six tests. Stamp each token accepted or rejected and preserve the evidence on screen. Include an optional free-text hypothesis field. | Day 1 PoC |
| Final inspection | Predict acceptance for three distinct, previously untested tokens. Show the score, reveal the rule, and explain each result. | Day 1 PoC |
| Deduction campaign | Add an authored progression from single attributes to AND, OR, and NOT rules, with hints built from examples that distinguish remaining candidate rules. | Month 1 |
| Party table | Add explicit two-to-four-player turns, shared evidence, individual final predictions, and optional timed rounds on one device. | Month 2 |
| Rule workshop | Build custom rules through a bounded visual editor, check them across all 18 tokens, and export/import challenge packs. Add seeded daily challenges from validated rules. | Month 3 |

**One-day build budget:** 1 hour for the token universe and six rules; 2 hours for the cargo builder; 2 hours for evidence and round state; 1 hour for reveal explanations; 2 hours for meaningful checks, accessibility, and deployment.

**Day 1 exclusions:** Remote multiplayer, natural-language rule interpretation, AI adjudication, user accounts, leaderboards, arbitrary code execution, and a general procedural puzzle generator.

#### 4. SOLO DEVELOPER ARCHITECTURE

- **Suggested stack:** React, TypeScript, Vite, SVG tokens, Tailwind CSS, and localStorage; static deployment.
- **Core model:** Token, RuleDefinition, TestObservation, Prediction, and RoundState.
- **Rule representation:** Use a small declarative predicate tree with attribute equality and AND/OR/NOT nodes. Evaluate it through a fixed interpreter, never eval or executable user input.
- **Content validation:** Enumerate all 18 tokens to reject rules that accept everything, accept nothing, or duplicate another authored rule's truth table.
- **Scoring boundary:** Score final predictions, not the free-text hypothesis. Multiple explanations may fit the limited observations; the reveal should distinguish observed evidence from the actual selected rule.
- **Engagement loop:** Propose a pattern → choose a discriminating test → update the explanation → predict unseen cargo → reveal.

#### 5. DAY 1 ACCEPTANCE CRITERIA

- [ ] A visitor can submit the first token within 30 seconds without registering.
- [ ] All 18 token combinations can be selected using keyboard controls.
- [ ] Identical tokens always receive identical results within a round.
- [ ] Previously tested tokens are identified and do not consume another test allowance.
- [ ] The rule remains hidden in the interface until the final predictions are submitted.
- [ ] The three final tokens are distinct and were not used in the evidence ledger.
- [ ] Every accepted/rejected state has a text label; color is never the only cue.
- [ ] Reveal shows the actual rule and explains each final result using token attributes.
- [ ] Refresh preserves the active rule, evidence, and remaining tests.

#### 6. VALIDATION & SUCCESS SIGNAL

Test with five solo players or pairs. Target: four understand the feedback without explanation, and three deliberately choose a token to distinguish two hypotheses. Ask them to explain that choice. Replay requests and useful experiments matter more than raw scores.

**Duplicate check:** Reviewed the open issues on 2026-10-20, including #46–#48. This is a deterministic hidden-rule experiment game, distinct from sports probability forecasting, chronology recall, household auctions, and the other ideas in this batch.
