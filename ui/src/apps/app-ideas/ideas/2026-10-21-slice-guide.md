---
name: Slice Guide
tagline: Split Any Oversized PR Into a Stack of Small Reviewable Commits
pitch: Split an oversized PR into a stack of small, ordered slices you can approve one at a time.
domains: [PROD]
created: 2026-10-21T05:48:05Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Big PRs get rubber-stamped because nobody wants to review 40 files. Slice Guide reads a branch's diff, groups hunks by file coupling and change type (refactor, feature, test, config), and proposes a sequence of small virtual slices, each with a one-line summary and its own diff view. The reviewer approves slice by slice instead of facing the whole blob, and the author learns how to cut better next time.
- **Core Problem & Target User:** Solo developers and small teams merge under-reviewed code when PRs are large. Target user: a dev who reviews his own or a teammate's PRs and wants each one reviewable in minutes.
- **Core Value Proposition:** Any PR becomes a stack of 5-minute reads, so review quality stops depending on PR size discipline.

#### 2. USER STORIES

- **Primary User Story:** "As a reviewer, I want a large PR grouped into ordered slices with summaries, so that I can approve it in small passes."
- **Secondary User Story:** "As an author, I want a size and coupling report on my PR, so that I learn to submit smaller ones."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The slicer | Paste a diff or point at a local branch, hunk grouping by directory and change keywords, slice list with per-slice diff view and checkboxes, progress bar of reviewed slices. | Day 1 PoC |
| Expansion 1: Coupling and history | Co-change coupling from git history, slice ordering by dependency, a PR size scorecard with trends, export of a review plan as markdown. | Month 1 MVP |
| Expansion 2: GitHub app | PR comment bot posting the slice plan, per-slice approval state synced to checks, stacked-PR generation, team size budgets with CI gate. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. Unified-diff parser in pure TS, heuristic grouping rules, localStorage for review state. No backend.
- **Core 24-Hour Demo Flow:** Paste a bundled sample diff of 30 files, see 6 slices appear with summaries, and check off two slices. **Aha moment:** within 30 seconds a scary PR becomes a checklist you can finish.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** A sample monorepo PR is pre-loaded; paste your own diff next.
- **Growth Vector:** Slice plans shared as PR comments spread the tool inside teams.

#### 6. RISKS & MITIGATION

- **Scope Creep:** Semantic code analysis. Mitigation: heuristic grouping only, labelled as such.
- **Technical:** Diff parsing edge cases. Mitigation: support git unified diff and fail loudly on other formats.
- **Retention/Engagement:** Used only for big PRs. Mitigation: the size scorecard makes it useful on every PR.
