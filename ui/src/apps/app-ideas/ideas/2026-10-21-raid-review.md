---
name: Raid Review
tagline: The Whole Team Raids the Big PR: Every File Claimed, the Diff Boss Falls
pitch: The whole team raids a big PR as a 3D keep, claiming and clearing files until no room ships unseen.
domains: [GAME, 3D]
created: 2026-10-21T05:48:10Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Large PRs become co-op raid bosses. The diff is rendered as a small 3D keep whose towers are directories and whose HP is lines changed. Teammates claim rooms (files), and each substantive review comment or approval deals damage to that room. The boss falls only when every room is cleared, so no file ships unseen. A timer counts down to the merge deadline and the keep gets a health regen if the author pushes new commits.
- **Core Problem & Target User:** On big PRs everyone reviews the same easy files and the hard core ships unread. Target user: a team that wants full diff coverage to be visible and fun.
- **Core Value Proposition:** Coverage you can see: the raid is not won until every file had a real reviewer.

#### 2. USER STORIES

- **Primary User Story:** "As a reviewer, I want to claim files and see my comments damage the boss, so that my review feels like progress we share."
- **Secondary User Story:** "As a team lead, I want a hard rule that uncleared files block the win, so that coverage stops depending on goodwill."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: Claim and clear | Paste a diff, a low-poly keep generated from the file tree, file claiming, comment or approve deals damage, uncleared rooms glow, win state when all rooms fall. | Day 1 PoC |
| Expansion 1: Roles and regen | Reviewer classes (test hunter, security scout), damage by comment type, commit-push regen, merge deadline timer, raid recap card, local storage. | Month 1 MVP |
| Expansion 2: GitHub app | Raid spawned per PR, damage synced from review events, season stats per dungeon, spectator link for stakeholders, badges. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS, React Three Fiber with drei. Keep built from boxes per directory, damage from a pure function over logged actions, localStorage. No backend.
- **Core 24-Hour Demo Flow:** Load a sample PR, claim two files, log comments, and watch two rooms collapse while a third glows unreviewed. **Aha moment:** within 30 seconds the glowing uncleared room makes the coverage gap physical.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** Sample raid mid-fight shows the mechanic instantly.
- **Growth Vector:** Raid recap cards in PR threads, and spectator links pull the whole team in.

#### 6. RISKS & MITIGATION

- **Scope Creep:** 3D polish. Mitigation: primitive geometry, effort into the claiming loop.
- **Technical:** Comment quality gating. Mitigation: minimum length and author veto on junk damage.
- **Retention/Engagement:** Novelty per PR. Mitigation: classes, regen events, and season stats.
