---
name: Hindsight League
tagline: Predict the Match Before the Reveal
pitch: Watch a classic match with the result hidden and predict each next event before the reveal, scoring points for reading the game.
domains: [SPORT, GAME, LEARN]
created: 2026-10-20T07:45:16Z
issue: 48
rating: 1
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT
- **Creative Twist / Re-imagining Angle:** Turn sports result browsing into a prediction time capsule. An anonymized match unfolds through five checkpoints. At each pause, assign probabilities to home win, draw, and away win before revealing the next passage of play. Compare your evolving confidence with the eventual result.
- **Core Problem & Target User:** Sports fans can explain almost any result afterward but rarely record what they believed while the outcome was uncertain.
- **Core Value Proposition:** Experience a short match mystery and learn whether your confidence fits the evidence.
- **Signature Interaction:** Lock a probability forecast, advance the replay, then reveal the teams and outcome beside your forecast trail.
- **Positioning:** A sports reasoning game with no betting, odds feed, prizes, or money mechanic.

#### 2. USER STORIES
- **Primary User Story:** "As a sports fan, I want to make forecasts at key moments of an unfamiliar match, so that I can challenge my reading of the game without hindsight."
- **Secondary User Story:** "As a returning player, I want to compare my confidence with my results across matches, so that I can recognize when I am consistently overconfident."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Instant mystery match | Start with one explicitly labeled synthetic football match containing five authored checkpoints. Conceal future checkpoints and the outcome in the interface. | Day 1 PoC |
| Probability allocation | Distribute 100 percentage points across home win, draw, and away win using three numeric inputs and a visual allocation bar. | Day 1 PoC |
| Lock and advance | Save each forecast before revealing the next checkpoint, including elapsed time, score, and a short event summary. | Day 1 PoC |
| Forecast trail | Reveal the result and show each forecast with its multiclass Brier score and a plain-language explanation. Save the completed attempt locally. | Day 1 PoC |
| Real match archive | Curate a small pack of historical matches with verified, timestamped facts and provenance. Reveal identities and sources after completion; add a “recognized this match” exclusion. | Month 1 |
| Confidence notebook | Add local history, confidence buckets, and comparisons with simple baselines. Show sample counts and describe small-sample results as exploratory. | Month 2 |
| Asynchronous challenge packs | Export/import seeded challenge packs, add optional friend-group comparison using a shared scoring rule, and provide a validator for community-authored packs. | Month 3 |

**One-day build budget:** 1 hour for the synthetic scenario; 2 hours for probability inputs; 2 hours for replay state and scoring; 1 hour for the forecast trail; 2 hours for validation, accessibility, and deployment.

**Day 1 exclusions:** Live sports feeds, scraped commentary, player models, AI predictions, accounts, public leaderboards, and real-time multiplayer.

#### 4. SOLO DEVELOPER ARCHITECTURE
- **Suggested stack:** React, TypeScript, Vite, Tailwind CSS, and SVG charts; static deployment on Vercel.
- **Core model:** Match pack, checkpoint, observable evidence, outcome, forecast vector, locked timestamp, and attempt.
- **Scoring rule:** For each checkpoint, calculate the sum of squared differences between the three forecast probabilities expressed from 0 to 1 and the one-hot final outcome. Range: 0–2; lower is better. Show the average checkpoint score for the match.
- **Interpretation boundary:** One match can illustrate scoring but cannot establish calibration or forecasting skill. Keep checkpoint-level learning separate from later aggregate analysis.
- **Data boundary:** The static PoC hides future data only in the interface; it is a casual learning game. Any later competitive mode requires server-side staged delivery.
- **Content strategy:** Start synthetic to validate the interaction without an external data dependency. Add real matches only after source and reuse checks.

#### 5. DAY 1 ACCEPTANCE CRITERIA
- [ ] The synthetic nature of the demo is visible before play and at the final reveal.
- [ ] A forecast cannot be locked unless values are non-negative and sum to 100%.
- [ ] A locked forecast cannot be edited after advancing.
- [ ] The interface does not reveal future events before the corresponding checkpoint.
- [ ] Scoring returns 0 for a certain correct forecast and 2 for a certain incorrect forecast.
- [ ] The final screen displays all five forecasts, their scores, and the match average.
- [ ] Refresh restores the current checkpoint and locked forecasts.
- [ ] The replay and chart are usable with keyboard controls and text equivalents.

#### 6. VALIDATION & SUCCESS SIGNAL
Test with five sports fans. Target: four finish the replay unaided, three can explain why an overconfident wrong forecast scores poorly, and three request another match. Validate interest in the reveal loop before investing in historical data ingestion.

**Duplicate check:** Compared with the repository's open issues on 2026-10-20; no concept overlap found.
