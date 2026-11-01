---
name: Plain Speech
tagline: Take One Piece of Jargon a Day and Rewrite It So a Tired Reader Gets It First Try
pitch: A daily rewriting exercise that hands you dense professional prose (legal, medical, corporate) and coaches you to make it plain, concrete and human.
domains: [WRITE, LEARN]
created: 2026-11-01T06:02:14Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Plain language is a skill everyone admires and nobody practices. Plain Speech makes it a daily rep: each day deals one real-style passage of impenetrable professional prose - a contract clause, a hospital discharge letter, an HR policy, a planning notice - and your job is the rewrite. The app then works your version with a clarity lens: it flags nominalizations ("utilization" for "use"), throat-clearing openings, passive constructions that hide who acts, and sentences past the comfort line, and it lets you compare your rewrite against a reference plain version - not as the answer, but as one good hand's take. A running clarity profile shows which habits you are actually breaking.
- **Core Problem & Target User:** Professionals write in institutional voice because everyone around them does; the result is documents real people cannot act on, and the fix (plain-language training) is a workshop nobody attends twice. Target user: developers writing docs and error messages, analysts writing for executives, public servants, lawyers and clinicians who want lay readers to understand them, and anyone who suspects their emails are longer than they need to be.
- **Core Value Proposition:** Five minutes a day of the exact skill clear writing is made of - rewriting real-world bad prose - with concrete mechanical feedback and a visible trail of habits breaking.

#### 2. USER STORIES

- **Primary User Story:** "As a professional, I want one dense passage a day to rewrite plainly with mechanical feedback, so that clear writing becomes a drilled habit instead of a good intention."
- **Secondary User Story:** "As a learner, I want to compare my rewrite against a reference version and track my recurring faults, so that I know which specific habits to attack next."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The daily passage | One curated passage per day from rotating domains (legal, medical, corporate, government); a clean side-by-side rewriting desk. | Day 1 PoC |
| Core Mechanism: The clarity lens | Deterministic checks on your rewrite: nominalizations, passive voice, sentence length, throat-clearing openers, readability estimate, plus the reference rewrite for comparison. | Day 1 PoC |
| Expansion 1: The habit ledger | A profile of your recurring faults over time, streak-free progress view, domain packs, and a "rewrite your own" mode that lints text you paste. | Month 1 MVP |
| Expansion 2: The desk reference | Short principle cards behind each flag, a personal banned-phrases list, team style decks for workplaces, and export of before-and-after pairs. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. A bundled deck of about twenty curated passages with reference rewrites; the side-by-side desk; deterministic lint checks implemented in plain TypeScript (regex and word lists, no AI). localStorage only; no backend, no accounts. Desktop-first, mobile workable.
- **Core 24-Hour Demo Flow:** Open to today's passage: a 90-word lease clause. Rewrite it in forty words, run the clarity lens, and watch it catch the two nominalizations you missed and congratulate the cut you made. Compare against the reference version and steal one move. The "Aha!" moment: seeing your own rewrite flagged for the same habits you just fixed in the original.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** The first rewrite takes five minutes and the lens gives instant, concrete feedback - no account, no course, no waiting.
- **Growth Vector:** Before-and-after pairs are natural workplace sharing material, and the "lint your own text" mode turns a practice app into a daily tool people keep open.

#### 6. RISKS & MITIGATION

- **Feedback risk:** Mechanical checks can be gamed or can punish good style. Mitigation: flags are advisory and explained, the reference rewrite models judgment over rules, and the copy repeats that clarity serves the reader, not the linter.
- **Content risk:** The passage deck is the product; weak or samey passages kill the rep. Mitigation: a curated launch deck across four domains with realistic register, expanded slowly, and paste-your-own mode arriving in Month 1 to remove content dependence.
- **Tone risk:** Plain-language apps can sneer at the professions they quote. Mitigation: passages are realistic composites rather than shaming real documents, and the framing respects that jargon exists for reasons before it gets cut.
