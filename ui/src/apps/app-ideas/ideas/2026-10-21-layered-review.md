---
name: Layered Review
tagline: Read Any PR as Layers of Behavior Changes and Design Choices
pitch: Open a pull request and read it as a few ordered layers that highlight the key lines, instead of one flat diff.
domains: [PROD]
created: 2026-10-21T05:48:05Z
rating: 3
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Big PRs get rubber-stamped because nobody wants to review 40 files. Layered Review decomposes a PR into a small set of ordered layers - behavior changes vs design choices. Each layer has a title, a one-to-two line summary, and highlights the specific lines of code that carry its main change; noise (formatting, mechanical renames) is grouped or collapsed, not dropped. Reviewers read intent first and details second, instead of facing one flat diff.
- **Core Problem & Target User:** Solo developers and small teams merge under-reviewed code when PRs are large, and in an organization the review work is scattered across repositories. Target user: a developer who reviews their own or teammates' PRs and wants each one understandable in minutes.
- **Core Value Proposition:** Any PR becomes a stack of 5-minute reads, so review quality stops depending on PR size discipline.

#### 2. USER STORIES

- **Primary User Story:** "As a reviewer, I open a PR and see it decomposed into ordered layers (behavior changes vs design choices), each highlighting the key lines, so I understand what changed and why before checking details."
- **Secondary User Story:** "As an organization member, I browse open PRs across all my org's repositories in one inbox and open any of them in the layered view."
- **Secondary User Story:** "As an organization member, I log in with GitHub and comment on the PR from the app; my comment lands back on the GitHub PR under my identity."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: Layered PR view | Paste a GitHub PR URL (public repos), fetch the diff via the GitHub API, split it into ordered layers with title, summary and type (behavior change / design choice); each layer highlights its key lines with jump-to-line navigation into the full diff, and the complete set of changes stays reachable. Layer derivation (LLM-assisted splitting vs heuristics) is an open choice; the PoC may start from a fixed sample PR. | Day 1 PoC |
| Expansion 1: Org PR inbox + GitHub login | One inbox listing open PRs across the org's repositories (repo, author, age, review state; filter by repo and author), each opening into the layered view; GitHub OAuth sign-in restricted to organization members. | Month 1 MVP |
| Expansion 2: Comments synced to GitHub + IDE extension | Comment from the layered view, posted back to the GitHub PR as the signed-in user; explore shipping the layered view as a VS Code extension. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. GitHub API for the diff (unauthenticated is enough for public repos), unified-diff parser in pure TS, heuristic layer grouping to start, localStorage for reading state. No backend.
- **Core 24-Hour Demo Flow:** Open a bundled sample PR of 30 files, see about 6 ordered layers with type labels and highlighted key lines, jump from a layer into the diff, mark layers as read. **Aha moment:** within 30 seconds a scary PR becomes a short reading list you can finish.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** A sample PR is pre-loaded; paste your own PR URL next.
- **Growth Vector:** The org-wide inbox makes it a daily starting point for a whole team, and a VS Code extension would put layers where reviewers already work.

#### 6. RISKS & MITIGATION

- **Layer quality:** Bad splitting ruins trust. Mitigation: start with transparent heuristics, labelled as such; LLM-assisted splitting is an open option, not a dependency.
- **Scope Creep:** Replacing GitHub review mechanics (approvals, suggested changes, merge controls), CI/checks gates, review analytics. Mitigation: explicitly out of scope; metrics belong to Review Relay.
- **Technical:** GitHub API rate limits and diff parsing edge cases. Mitigation: cache fetches, support git unified diff and fail loudly on other formats.

Tracked as a Linear project: [Layered Review](https://linear.app/tomahim/project/layered-review-6d0f68abf647).
