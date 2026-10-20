---
name: Exit Interview
tagline: Give Every Saved Link a Job or Let It Go
domains: [MEDIA, PROD]
created: 2026-10-20T07:57:34Z
issue: 54
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Reimagine read-later triage as a respectful exit interview. Instead of asking “save or delete?”, the app presents one link and asks what job it earned: *act on it*, *quote it*, *teach it*, *save for reference*, or *release it*. The answer turns an abstract backlog into a small, observable next step—or deliberately clears it.
- **Core Problem & Target User:** People accumulate bookmarks because deleting an interesting link feels like losing a possibility. The queue grows until none of it is useful.
- **Core Value Proposition:** Reduce a reading queue with intentional decisions, leaving each retained item attached to a purpose rather than a vague promise.
- **Signature Interaction:** Choose “teach it” for an article and the card collapses into a 30-word takeaway plus a date to revisit; choose “release it” and watch its place on the shelf open for the next item.
- **Product Principle:** The app should reward a well-reasoned release as much as a saved item. Retention count is not a success metric.

#### 2. USER STORIES

- **Primary User Story:** "As someone with an overwhelming read-later list, I want to decide what practical job a saved link has, so that I can keep only the items I intend to use."
- **Secondary User Story:** "As a reader who worries about deleting good material, I want a lightweight record of why I released or retained an item, so that I can trust the decision and avoid re-saving it."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Sample inbox | Start with six original sample links plus an input for a title, URL, and one-line reason it was saved. No login or browser extension. | Day 1 PoC |
| One-card interview | Present one item at a time with five explicit jobs. Retained jobs require a short concrete follow-up; release optionally accepts a short reason. | Day 1 PoC |
| Purposeful destinations | Place items in a small action board: Act, Quote, Teach, Reference, or Released. “Teach” includes a 30-word takeaway; “Act” includes a next action. | Day 1 PoC |
| Session receipt | End with counts by decision, the next three actions, and a downloadable Markdown receipt. Persist the queue and decisions locally. | Day 1 PoC |
| Personal queue hygiene | Add tags, filters, a delayed revisit date, bulk import/export, and a deduplication warning based on normalized URL. | Month 1 |
| Retrieval review | Surface retained items when their job becomes due, record whether the promised action happened, and suggest release after repeated non-use. | Month 2 |
| Capture and publication | Add a browser capture flow, shareable decision receipts, cross-device sync, and integrations only after the local decision loop proves useful. | Month 3 |

**One-day build budget:** 1 hour for the link and decision model; 2 hours for interview flow; 2 hours for purpose-specific fields and board; 1 hour for receipt and persistence; 2 hours for usability, keyboard support, and deployment.

**Day 1 exclusions:** Web scraping, automatic article summaries, browser extensions, account sync, inbox integrations, AI prioritization, social sharing, and a recommendation feed.

#### 4. SOLO DEVELOPER ARCHITECTURE

- **Suggested stack:** React, TypeScript, Vite, Tailwind CSS, localStorage, and static deployment on Vercel.
- **Core model:** SavedLink, Decision, Purpose, FollowUp, and SessionReceipt. A decision stores a snapshot of title and URL, decision time, optional rationale, and purpose-specific follow-up.
- **URL handling:** Normalize protocol and hostname for local duplicate detection, while preserving the entered URL for display and export. Do not fetch pages or inspect personal browsing data in the PoC.
- **Workflow invariant:** Every non-released item has one explicit purpose. “Act” requires a next action; “Teach” requires a takeaway; “Reference” requires a retrieval cue. The user can edit a decision at any time.
- **Engagement loop:** Capture a link → interview it → assign a use or release → finish with a smaller queue and an actionable receipt.

#### 5. DAY 1 ACCEPTANCE CRITERIA

- [ ] A visitor can triage the sample inbox immediately without registration.
- [ ] Every card ends in exactly one of the five stated decisions.
- [ ] “Act,” “Teach,” and “Reference” enforce their required follow-up fields before completion.
- [ ] “Release” removes an item from the active queue but keeps it in the session receipt with its optional rationale.
- [ ] The action board and Markdown receipt agree on every item and purpose.
- [ ] Refresh retains the active queue, decision history, and unfinished interview.
- [ ] A user can revise a decision without duplicating the link.
- [ ] The full flow works with keyboard input and gives text feedback for each move.

#### 6. VALIDATION & SUCCESS SIGNAL

Test with five people who maintain a read-later list. Give each six sample links and ask them to complete a session. Target: four can complete it unaided, three release at least one item without feeling they lost useful information, and three act on a retained item within a week. Measure completed follow-ups and queue clarity rather than total links saved.

**Duplicate check:** Reviewed open issues #16, #33, and #46–#51 on 2026-10-20. This focuses on intentional consumption and backlog reduction; it is distinct from #49, which turns two retained ideas into a source-linked piece of writing.
