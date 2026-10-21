---
name: Column Contract
tagline: Sign a Weekly Column Deal: One Bookmark, Fixed Constraints, Your Name on It
domains: [WRITE, PROD, GAME]
created: 2026-10-21T05:41:20Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Blogging as a columnist contract. You define a recurring column once: a name, a bookmark shelf it draws from (a topic tag in your read-later pile), and a fixed set of constraint cards that define its voice (for example: "one chart described in words", "always end with a question", "400 to 600 words"). Every week the app deals the next article from that shelf and holds you to the contract. Breaking a self-imposed constraint is a visible foul on your record, so the column keeps a consistent identity.
- **Core Problem & Target User:** Blogs die from inconsistency of both rhythm and voice. Target user: a writer who wants a recognisable weekly column sourced from what he already reads.
- **Core Value Proposition:** A column that writes its own brief each week: the topic comes from your bookmarks, the style from your contract.

#### 2. USER STORIES

- **Primary User Story:** "As a blogger, I want a weekly brief drawn from my bookmark shelf with my column's fixed constraints, so that every post feels like the same column."
- **Secondary User Story:** "As a writer building a habit, I want fouls and kept contracts tracked, so that I see my consistency over a season."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: Contract and brief | A contract editor (column name, shelf tag, 3 fixed constraint cards), a weekly brief that draws the next bookmark from the shelf, a writing desk with live constraint checklist, and a sign-off stamp that records kept or fouled. | Day 1 PoC |
| Expansion 1: Several columns and import | Multiple columns with different shelves, bookmark CSV import, foul analytics, season view of issues, markdown export per issue, local storage. | Month 1 MVP |
| Expansion 2: Readers and syndication | Public column page via static export, read-later service sync, subscriber count as a score, guest constraint weeks, scheduled brief reminders. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. Contracts, shelf and issues in localStorage, brief from the oldest unwritten bookmark with the shelf tag, sign-off as a CSS stamp animation. No backend.
- **Core 24-Hour Demo Flow:** Create a column in one minute, get the first brief from the shelf, write, tick the constraints, and stamp the issue. **Aha moment:** under 30 seconds the contract makes a vague "I should blog" into a specific assignment.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** A template contract ("The Sunday Margin") creates a column in one tap.
- **Growth Vector:** Exported issues and the public column page attract readers, and the contract gimmick invites imitation.

#### 6. RISKS & MITIGATION

- **Scope Creep:** Full publishing platform features. Mitigation: markdown export only in the PoC.
- **Technical:** Shelf sync with external services. Mitigation: CSV import first, API later.
- **Retention/Engagement:** A weekly cadence can lapse. Mitigation: gentle brief reminders and a visible kept-contract streak with no punishment copy.
