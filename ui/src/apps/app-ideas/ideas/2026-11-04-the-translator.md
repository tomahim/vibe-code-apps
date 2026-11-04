---
name: The Translator
tagline: Same Moment, Seven Registers - Render a Sunset as a Legal Clause, a Forecast, a Match Report
pitch: A daily writing game that hands you one small scene and asks you to rewrite it in a borrowed register, training voice control through joyful constraint.
domains: [WRITE, LEARN]
created: 2026-11-04T06:02:52Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Style is the ability to say the same thing seven ways. The Translator practices it directly: each day deals one small concrete scene (a cat knocking a glass off a table, a missed train, a first snow) and one borrowed register - legal contract, shipping forecast, football commentary, obituary, recipe, insurance claim, nature documentary narration. You rewrite the scene in that voice, and the app gives you the two tools registers are actually made of: a lexicon card (the words and constructions that mark the register) and a rhythm note (its cadence and sentence shapes). Finished translations stack side by side, and the joy is the comparison: the same dropped glass as liability waiver and as match commentary.
- **Core Problem & Target User:** Writers develop one voice and get stuck in it; rhetoric classes teach register abstractly with no reps. The fastest way to grow range is imitation with a twist - but inventing the daily exercise yourself is the friction that kills it. Target user: fiction and copy writers growing their range, students of style, language learners playing with tone, and anyone who finds Queneau's Exercises in Style the funniest book about writing ever made.
- **Core Value Proposition:** A two-minute daily rep that builds real stylistic range: one scene, one borrowed voice, a lexicon to steal from, and a growing shelf of your own transformations.

#### 2. USER STORIES

- **Primary User Story:** "As a writer, I want one scene and one register each day to translate between, so that I build voice control through short, playful reps."
- **Secondary User Story:** "As a reader of my own work, I want my translations of the same scene stacked side by side, so that I can see which registers I command and which flatten me."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The daily translation | One scene card plus one register card (with its lexicon and rhythm notes); a clean writing field with a soft word budget. | Day 1 PoC |
| Core Mechanism: The stack | Your translations of the same scene bound side by side; the shelf of past scenes and registers browsable as a personal Exercises in Style. | Day 1 PoC |
| Expansion 1: The register library | Themed register packs (officialdom, sport, the sacred, the scientific, the kitchen), a compare mode against a reference translation, and favorite-marking for your best transformations. | Month 1 MVP |
| Expansion 2: The salon | Same-scene-same-register comparisons between two writers, a community register of the week, and print-ready export of a scene with all its translations as a chapbook. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. Bundled decks of about fifteen scenes and fifteen registers, each register with its lexicon and rhythm card; the pairing deal, the writing field, and the side-by-side stack view. localStorage only; no backend, no accounts. Mobile-first.
- **Core 24-Hour Demo Flow:** Today's deal: "a missed train" as a shipping forecast. Read the register card (named regions, steady cadence, warnings issued with absolute calm), write your four lines, seal it, and flip to the sample stack: the same missed train as a legal clause and as match commentary. The "Aha!" moment: hearing your own sentence come out wearing someone else's voice - and noticing it still sounds like you.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** The sample stack is funny within ten seconds, and the first personal translation takes two minutes with the lexicon doing the heavy lifting.
- **Growth Vector:** Translations are inherently shareable (the same scene in an absurd register begs to be read aloud), writing groups adopt the format instantly, and the chapbook export is a natural keepsake.

#### 6. RISKS & MITIGATION

- **Depth risk:** Without feedback, writers may repeat surface tricks. Mitigation: the lexicon and rhythm cards teach the register's mechanics rather than its costume, and the compare-against-reference mode in Month 1 adds calibration.
- **Content risk:** The decks carry the product; thin registers kill the joke. Mitigation: a small curated launch set with real craft in the register cards, expanded slowly, with quality over count.
- **Tone risk:** Some registers (obituary, religious) need care. Mitigation: sensitive registers are framed respectfully and paired with fitting scenes; the app punches at bureaucratese, not at grief.
