---
name: Draft Deck
tagline: Play Constraint Cards, Ship an Atomic Essay
domains: [WRITE, GAME]
created: 2026-10-20T08:05:49Z
issue: 56
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Reimagine the writing habit as a deck-building card game. Each session deals you a hand of constraint cards ("No adjectives", "Open with a question", "Include exactly one number"). You ante into a round by committing to a 100-word atomic essay, choose which constraints to play because harder cards pay more points, write against the table, and ship the essay to cash out and bank your score. Abandon the draft and you lose the ante.
- **Core Problem & Target User:** Aspiring atomic essayists and occasional bloggers stall at the blank page. Streak trackers punish but do not play; the real friction is starting, not editing.
- **Core Value Proposition:** Sit down, get dealt a hand, and leave 15 minutes later with a shippable 100-word essay and a banked score.

#### 2. USER STORIES

- **Primary User Story:** "As an occasional writer, I want writing constraints dealt to me as cards, so that starting an essay feels like playing a hand instead of facing a blank page."
- **Secondary User Story:** "As a habitual drafter, I want my banked scores and shipped essays recorded locally, so that I can see a season of output instead of a pile of unfinished notes."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The hand and the cash-out | 12 authored constraint cards with point values, one writing prompt, a 100-word target editor with live word count, a self-check showdown (tick which constraints you honored), and a Ship button that banks points with a cash-out animation. | Day 1 PoC |
| Expansion 1: Deck progression and daily hand | Unlock harder rare cards as you bank points, a seeded daily hand (same deal for everyone, comparable scores), a streak ledger, and a local essay archive with Markdown export. | Month 1 MVP |
| Expansion 2: Multiplayer tables | Custom card authoring with validation, pass-and-play duels (same prompt, compare hands and drafts), seasonal leagues, and one-tap delivery of shipped essays to a blog or Telegram. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. Card data as a plain JSON deck. Single-screen table UI: hand at the bottom, editor in the center, pot and score at the top. Plain textarea, no rich text. localStorage for score, ante state, and shipped essays. No AI grading, no accounts. Responsive layout for desktop and mobile.
- **Core 24-Hour Demo Flow:** Open the app and a hand of three cards is already dealt face-up next to today's prompt. Tap "Open with a question" to play it (4 points). Type into the editor while the word counter climbs toward 100. Hit the target, tap Ship, and the cards flip as the pot pays out into your bank. The "Aha!" moment (shipping a draft paying out like a winning hand) lands in under 30 seconds of writing.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** The first hand is dealt on load; the only action available is to play a card and start typing.
- **Growth Vector:** The seeded daily hand creates a shared daily challenge people can compare scores on, and shipped essays export as clean Markdown, so the game feeds a real blog instead of a silo.

#### 6. RISKS & MITIGATION STRATEGIES

- **Scope Creep Risk & Mitigation:** Automatic or AI-based prose grading. Mitigation: constraints are self-declared checkboxes at showdown; the game scores discipline, not quality, which keeps the PoC to one day.
- **Technical Risk & Mitigation:** Editor complexity (rich text, cursor handling). Mitigation: a plain textarea with a word counter is the entire editor in the PoC.
- **Retention / Engagement Risk & Mitigation:** Card novelty fades after a few sessions. Mitigation: deck unlocks tied to banked points and the daily seeded hand give progression and a reason to return tomorrow.
