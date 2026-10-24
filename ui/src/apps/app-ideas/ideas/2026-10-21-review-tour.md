---
name: Review Tour
tagline: Walk Every PR on a Guided Path, Riskiest Stops First
pitch: Walk any PR along a guided path, riskiest stops first, with one question to answer per stop.
domains: [PROD, LEARN]
created: 2026-10-21T05:48:06Z
rating: 2
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Reviewing a PR as a guided museum tour instead of a file list. The tool orders the changed files into a walking route: entry point first, then the files where behaviour changes most, risky spots flagged with audio-guide style notes ("this function lost its null check"). Each stop is a small card with the hunk and a question to answer, so a review becomes a sequence of decisions rather than scrolling.
- **Core Problem & Target User:** Reviewers open the file list top to bottom and miss the important change buried in the middle. Target user: a dev who wants a repeatable, thorough review routine.
- **Core Value Proposition:** A fixed path through every PR that surfaces the risky change first and turns review into a series of small explicit decisions.

#### 2. USER STORIES

- **Primary User Story:** "As a reviewer, I want files ordered by risk with a question per stop, so that I review the important code first and decide explicitly."
- **Secondary User Story:** "As a junior dev, I want the tour notes to explain why a stop is risky, so that I learn review heuristics while reviewing."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The tour | Paste a diff or select a local branch, risk scoring per file (deleted guards, new branches, touched tests), an ordered stop list with hunk view and a question card per stop, verdict buttons per stop. | Day 1 PoC |
| Expansion 1: Rules and recap | Custom risk rules per repo, a tour recap that drafts the review comment, author mode that pre-answers stops, local storage of tours. | Month 1 MVP |
| Expansion 2: GitHub app and team stats | PR check that posts the tour link, stop verdicts synced as review comments, team analytics on stops and findings, guided tours for onboarding into a codebase. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. Diff parser, a transparent risk heuristic, localStorage. Keyboard navigation between stops. No backend.
- **Core 24-Hour Demo Flow:** Load the sample PR, land on stop 1 (the riskiest change) with its question, answer it, and move on. **Aha moment:** within 30 seconds you have judged the most important hunk instead of reading imports.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** Sample tour starts on open.
- **Growth Vector:** The drafted recap comment carries the tour link into the team's PRs.

#### 6. RISKS & MITIGATION

- **Scope Creep:** Perfect risk scoring. Mitigation: a small documented heuristic set.
- **Technical:** Language-specific parsing. Mitigation: treat code as text, no AST in the PoC.
- **Retention/Engagement:** Extra step per PR. Mitigation: the recap drafts the final comment, saving time overall.
