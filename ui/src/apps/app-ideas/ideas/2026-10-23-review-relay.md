---
name: Review Relay
tagline: One Company PR Queue, a Clear Review Pulse, and Credit for the Handoffs
pitch: Find the PRs waiting across company repositories, follow review delays over time, and see who is carrying the review load in a transparent reviewer leaderboard.
domains: [PROD, GAME]
created: 2026-10-23T12:38:00Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** A company-wide review control room with two linked lenses: "what needs a hand now?" and "who has been helping?" A repository/team/date filter drives the PR queue, trend cards, review activity and reviewer leaderboard together. Tap a leaderboard count to see the exact PRs behind it; tap a waiting PR to see its review handoffs. Recognition stays connected to work rather than becoming a mysterious score.
- **Core Problem & Target User:** Developers and team leads must hop between company repositories to find waiting reviews, spot overloaded reviewers and understand where PRs stall.
- **Core Value Proposition:** One actionable cross-repository queue plus auditable review metrics and a leaderboard that recognizes participation without pretending counts measure code quality.
- **Inspiration:** Thomas's supplied "DevFlow / PR Dashboard" screenshot: overview cards, PR queue, leaderboard, activity feed and repository/team/time filters. The screenshot is visual inspiration only; the product identity and its example numbers are not verified.

#### 2. USER STORIES

- **Primary User Story:** "As a developer, I want one queue of ready PRs across company repositories, so that I know which review to pick up next."
- **Secondary User Story:** "As a team lead, I want review wait trends and a transparent reviewer leaderboard, so that I can spot bottlenecks, spread the load and recognize help."
- **Admin User Story:** "As an organization admin, I want an explicit repository allowlist and clear metric definitions, so that the dashboard only exposes approved data and the team can trust the numbers."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Review control room | Synthetic multi-repo JSON, shared filters, open/merged/waiting cards, ready PR queue, reviewer leaderboard with evidence drilldown, activity list. | Day 1 PoC |
| Approved organization ingestion | Read-only GitHub App for explicitly selected repos, paginated historical sync, idempotent event storage, retry/backoff and visible sync coverage. | Month 1 MVP |
| Trustworthy live metrics | Authenticated dashboard, repository/team mappings, review-request/ready timestamps, median/p90 delays, bot/self-review exclusions, period comparison and data-freshness states. | Month 1 MVP |
| Team recognition and follow-up | Configurable windows and bot accounts, team-approved leaderboard visibility, review-load context, optional internal digests and business-hour timing. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** Existing React/Vite UI with pure metric functions and synthetic fixtures covering 3 repos, 2 teams and multiple reviewers. No credentials, no company data, no backend or authentication work in the one-day demo. Mobile cards stack instead of shrinking the screenshot's desktop columns.
- **Core 24-Hour Demo Flow:** Open the seeded dashboard, filter a team, select an aging PR, inspect its timeline, then tap a reviewer's count to see which PRs contributed. **Aha moment:** the same filter reveals both the review backlog and who is carrying it in under 30 seconds.
- **Metric contract:** Open PRs and waiting queue are current snapshots, independent of the historical date window. Open includes drafts but labels them; waiting excludes drafts and counts ready open PRs awaiting first non-author human submitted review. Merged counts use merged_at in the window. A reviewer's count is distinct PRs with at least one submitted APPROVED, CHANGES_REQUESTED or COMMENTED review in the window, once per reviewer/PR; pending reviews, self-reviews, bots and ordinary issue comments do not count. A dismissed submitted review remains historical participation, never a current approval. Leaderboard measures participation, not correctness or productivity.
- **Timing contract:** First-review wait starts at ready-for-review (created_at for non-drafts), ends at first submitted human non-author review, and reports median/p90 plus sample size for PRs whose first review occurs in the selected window. Reviewer response starts at an explicit reviewer request; missing request timestamps are unavailable, not zero. Use elapsed UTC durations initially; business hours are later. Show draft time separately and flag incomplete historical timelines.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** An honest "Sample data" dashboard works immediately, with no company-token request.
- **Growth Vector:** An internal weekly review ritual: pick the oldest waiting handoff, inspect load distribution and thank the reviewers helping the team. Any digest or sharing requires a later explicit audience/channel decision.
- **Build vs buy:** Compare existing products before building ingestion. Swarmia and LinearB cover broader engineering metrics; small open-source leaderboard scripts cover ranking; a custom build is justified only if the lightweight queue + auditable recognition workflow is materially better for this team.

#### 6. RISKS & MITIGATION

- **Scope creep:** A full engineering-intelligence platform is not a solo one-day build. Start with fixtures; GitHub only for the first live version. No automated code review, merge controls, HR scoring or payroll links.
- **Gaming and fairness:** Repeated approvals and comment spam must not inflate counts. Count unique reviewer/PR pairs, show underlying evidence, exclude bots/self-reviews, show sample sizes and workload context. Do not rank review quality or use counts for performance decisions.
- **Privacy and authority:** Company, Git host, repositories, team membership and installation rights are unknown. Before live ingestion, obtain company approval, repo allowlist, access policy and retention rules. Keep metadata private; do not ingest source diffs or comment bodies by default. Tailscale alone is not multi-user authorization.
- **Technical:** Missed webhooks, pagination, drafts, dismissed reviews and incomplete history distort metrics. Store stable IDs, reconcile periodically, label sync gaps and test edge cases. Never show "Live" without verified freshness.
- **Retention:** A decorative scoreboard becomes background noise. Make the default view the actionable waiting queue and trends, with recognition as a companion view.

#### 7. EXISTING SOLUTIONS AND SOURCES

Checked 2026-10-23. Product capabilities below are documented, not independently trialed. Prices, company eligibility, security approvals and exact leaderboard availability need evaluation before selection.

- [Swarmia code metrics](https://help.swarmia.com/features/metrics/code-metrics): PR cycle-time breakdown, time to first review, trends and PR drilldowns. Strong buy candidate for broader engineering flow; do not assume it provides this exact leaderboard.
- [LinearB metrics dashboards](https://linearb.helpdocs.io/article/c2vts5j3h9-default-metrics-dashboards): delivery/quality/throughput dashboards with repo, people, team and PR-label filters, drilldown and export. Broader alternative, not proof of an identical reviewer competition.
- [Pull Request Analytics Action](https://github.com/marketplace/actions/pull-request-analytics): reports in GitHub issues, lifecycle/reviewer response metrics and contribution summaries. Useful low-overhead benchmark, not this standalone interactive control room.
- [markokajzer/code-review-leaderboard](https://github.com/markokajzer/code-review-leaderboard): Ruby CLI for one/multiple repos or an organization, with explicit counting rules. Closest narrow leaderboard baseline; assess maintenance, license and security before reuse.
- [lachiejames/code-review-leaderboard](https://github.com/lachiejames/code-review-leaderboard): multi-provider organization leaderboard CLI (GitHub/GitLab/Azure Repos); repository is archived, so reference rather than a default production dependency.
- [GitHub Pulse](https://docs.github.com/en/repositories/viewing-activity-and-data-for-your-repository/using-pulse-to-view-a-summary-of-repository-activity): built-in repository activity summary; a baseline, not a company-wide reviewer leaderboard.
- [GitHub review API](https://docs.github.com/en/rest/pulls/reviews): primary source for submitted-review records and permissions when designing ingestion.
- [SPACE research, ACM](https://cacm.acm.org/practice/the-space-of-developer-productivity/): activity counts alone cannot measure developer productivity. This supports keeping the leaderboard contextual and separate from performance evaluation.

**Duplicate check:** Compared all 60 current idea files. Bounty Board rewards confirmed findings; Review Tour guides a single diff; Raid Review coordinates file coverage; Checklist Forge mines recurring comments. Review Relay instead follows company-wide PR flow, waiting work and reviewer participation. No implementation or company integration has been performed.
