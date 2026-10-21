---
name: Bounty Board
tagline: Pay Reviewers in Points for Confirmed Findings, Not Comments
pitch: Open PRs post bounties, and reviewers earn points only for findings the author confirms and fixes.
domains: [GAME, PROD]
created: 2026-10-21T05:48:08Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** PR review as a bug bounty program inside the team. Every open PR posts bounties on a board: find a real bug, catch a missing test, spot a security smell. A finding only pays when the author confirms and fixes it, so quantity farming does not score. Severity multiplies points, and the board keeps a monthly league table of hunters and of authors whose code yields the fewest confirmed findings.
- **Core Problem & Target User:** Reviews attract drive-by comments and few real findings. Target user: a small dev team that wants deeper reviews without process weight.
- **Core Value Proposition:** Incentives pointed at the right outcome: confirmed, fixed findings, with a league table that makes good reviewing visible.

#### 2. USER STORIES

- **Primary User Story:** "As a reviewer, I want points only for findings the author confirms, so that careful review beats comment spam."
- **Secondary User Story:** "As a team lead, I want a league table and finding stats, so that review effort and code quality trends are visible."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: Post, hunt, confirm | A board of PR cards with bounties, a finding form (type, severity, one line), author confirm or dispute flow, point ledger and monthly table. | Day 1 PoC |
| Expansion 1: Leagues and disputes | Dispute resolution by a rotating judge, finding categories with separate tables, streaks for zero-bounty PRs, CSV export, local storage. | Month 1 MVP |
| Expansion 2: GitHub app | Bounties posted automatically on PR open, findings synced from review comments, season finals, cross-team league, badge README. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. PRs and findings as local data, ledger as a pure function, table sorted by points. Mobile-friendly. No backend.
- **Core 24-Hour Demo Flow:** Open the board with 3 sample PRs, file a finding on one, confirm it as the author, and see the league table reorder. **Aha moment:** within 30 seconds you see that only confirmed findings move the score.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** Sample board with a pending finding to confirm.
- **Growth Vector:** Monthly tables and README badges make review status public inside the team.

#### 6. RISKS & MITIGATION

- **Scope Creep:** Real-money rewards. Mitigation: points and pride only.
- **Technical:** Gaming the system. Mitigation: author confirmation gates every point, plus dispute flow.
- **Retention/Engagement:** League dominated by one hunter. Mitigation: category tables and author-side stats so everyone can win something.
