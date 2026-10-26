---
name: Mole in the Diff
tagline: One Planted Bug Hides in This PR, Find It Before You Approve
pitch: Hunt the one deliberately planted bug hiding in a practice diff before you approve it.
domains: [GAME, LEARN]
created: 2026-10-21T05:48:09Z
rating: 1
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** A review training game with a hidden traitor. The author (or the app) plants exactly one deliberate bug in a practice PR, an off-by-one, a flipped condition, a swallowed error. Reviewers hunt it under a timer; points for finding it, bigger points for explaining why it is wrong, penalties for false alarms. Over time the planted bugs get subtler and drawn from a taxonomy of real defect types, so the game is a gym for review skill.
- **Core Problem & Target User:** Review skill only grows on real PRs, where mistakes are costly. Target user: devs who want to sharpen their eye, and teams onboarding juniors into review duty.
- **Core Value Proposition:** A safe, game-shaped place to practice the exact skill of catching bugs in diffs.

#### 2. USER STORIES

- **Primary User Story:** "As a dev, I want to hunt one planted bug per practice PR, so that I train finding real defect patterns."
- **Secondary User Story:** "As an author, I want to plant bugs for my teammates, so that we learn each other's blind spots."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: Plant and hunt | 8 authored practice PRs with one planted bug each, a diff view with line-level accusation, timer and scoring, explanation box, reveal with taxonomy tag. | Day 1 PoC |
| Expansion 1: Taxonomy and duels | 30 scenarios ranked by subtlety, defect taxonomy progress map, author mode to plant your own bug in a pasted diff, pass-and-play duels, local stats. | Month 1 MVP |
| Expansion 2: Team season | Weekly planted PR in the real repo, team leaderboard, auto-generated bugs from common patterns, calibrated difficulty per player. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. Scenarios as JSON (diff text, bug line, explanation), localStorage for scores and progress. No backend.
- **Core 24-Hour Demo Flow:** Open scenario 1, scan the diff, tap a line to accuse, and get the reveal with the taxonomy tag. **Aha moment:** within 30 seconds you either caught a realistic bug or learned the pattern you missed.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** Scenario 1 loads on open with no setup.
- **Growth Vector:** Author mode: teammates plant bugs for each other and share scenarios.

#### 6. RISKS & MITIGATION

- **Scope Creep:** Auto-generated bugs. Mitigation: hand-authored scenarios in the PoC.
- **Technical:** Line-accurate accusation in a diff view. Mitigation: fixed line numbering from the stored diff.
- **Retention/Engagement:** Finite scenarios. Mitigation: author mode and weekly planted PRs in Month 3.
