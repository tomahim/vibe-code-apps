---
name: Checklist Forge
tagline: Turn Your Team's Past Review Comments Into a Living PR Checklist
pitch: Mine your team's past review comments into a ranked, living PR checklist with counts and trends.
domains: [PROD, MEDIA]
created: 2026-10-21T05:48:07Z
rating: 1
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Teams repeat the same review comments for months ("missing error handling", "no test for this path"). Checklist Forge mines your repo's own review history (pasted comments or a GitHub export) and clusters recurring remarks into a short, ranked checklist with counts. Each new PR is checked against the list, and checking an item off links back to the original comment that inspired it, so the checklist is institutional memory you can act on.
- **Core Problem & Target User:** Review knowledge lives in old threads and senior heads. Target user: a small team or solo dev with AI reviewers who wants consistent reviews grounded in his own history.
- **Core Value Proposition:** Your own review culture, distilled into a 10-item checklist that improves itself every week.

#### 2. USER STORIES

- **Primary User Story:** "As a reviewer, I want a checklist built from our past comments, so that I stop forgetting the things we always catch."
- **Secondary User Story:** "As a team lead, I want counts per checklist item over time, so that I see which issues training or linting should kill."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: Mine and check | Paste review comments (one per line), keyword clustering into checklist items with counts, a per-PR check-off view, links to source comments, trend of item frequency. | Day 1 PoC |
| Expansion 1: Refinement | Edit, merge and archive items, per-author and per-directory breakdowns, export as REVIEW.md, import from a GitHub comments CSV, local storage. | Month 1 MVP |
| Expansion 2: Automation | GitHub app that posts the checklist on each PR, auto-suggestion of which items apply from the diff, decay of stale items, team dashboard. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. Clustering with keyword groups defined in JSON, localStorage for comments and checklists. No backend, no LLM calls.
- **Core 24-Hour Demo Flow:** Paste 30 sample review comments, watch 8 checklist items appear ranked by frequency, and check items off on a mock PR. **Aha moment:** within 30 seconds you see "missing tests" has cost you 14 comments.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** A sample comment set generates a checklist instantly.
- **Growth Vector:** The exported REVIEW.md lands in the repo and advertises the tool.

#### 6. RISKS & MITIGATION

- **Scope Creep:** NLP clustering quality. Mitigation: editable keyword groups and manual merge.
- **Technical:** Getting comments out of GitHub. Mitigation: paste and CSV in the PoC, API later.
- **Retention/Engagement:** The list goes stale. Mitigation: weekly re-mine nudge and item decay.
