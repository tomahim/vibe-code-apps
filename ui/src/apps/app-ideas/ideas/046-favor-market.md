---
name: Favor Market
tagline: Trade Chores Without Keeping Score
domains: [PROD, GAME]
date: 2026-10-20
issue: 46
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT
- **Creative Twist / Re-imagining Angle:** Turn the weekly household chore discussion into a five-minute, pass-and-play auction. Everyone receives an equal allowance of fictional energy tokens and bids on the jobs they would prefer to take. The app assigns jobs to maximize expressed preferences within a simple workload limit, then explains the result. Tokens express willingness; they never become debt owed between family members.
- **Core Problem & Target User:** Couples, families, and housemates repeat the same chore negotiations because equal task counts rarely reflect different preferences and available energy.
- **Core Value Proposition:** Produce a mutually editable weekly chore agreement from a short game instead of a long discussion.
- **Signature Interaction:** Reveal the allocations together: chore cards slide into each person's basket, with explanations such as “Alex bid most for cooking; Sam reached their workload limit.”

#### 2. USER STORIES
- **Primary User Story:** "As a housemate, I want to bid on chores I prefer, so that our weekly plan reflects what each person is willing to do."
- **Secondary User Story:** "As someone with less available energy this week, I want to set a workload limit and propose swaps, so that the plan stays realistic."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Instant sample household | Start with two fictional adults, six editable chores, and equal token budgets; no login or onboarding wizard. | Day 1 PoC |
| Private bidding turn | Pass one device between participants. Each distributes 10 tokens across chores and declares a maximum number of jobs. Explain that bids are hidden by the interface, not secured against another device user. | Day 1 PoC |
| Auction reveal | Use a deterministic assignment search for two people and six chores: respect workload caps, maximize total bids, and resolve ties using a displayed rotation rule. Leave impossible assignments visibly unallocated. | Day 1 PoC |
| Negotiated agreement | Allow manual reassignment, flag workload-cap violations, and save the final board in localStorage. | Day 1 PoC |
| Weighted workload | Add user-defined effort estimates, recurring chore templates, and two-to-four-person households. Replace job-count caps with effort budgets. | Month 1 |
| Swap round | Offer mutually beneficial swaps and explicit opt-in agreement; add JSON export/import and a weekly reset. | Month 2 |
| Weekly learning loop | Compare planned and reported effort, let users adjust estimates, and show whether preferences are being accommodated across weeks. Add optional shared household sync only after local use is validated. | Month 3 |

**One-day build budget:** 1 hour for the data model and fixtures; 2 hours for bidding; 2 hours for assignment and reveal; 1 hour for overrides and persistence; 2 hours for accessibility, edge cases, and deployment.

**Day 1 exclusions:** Accounts, remote multiplayer, reminders, payments, AI mediation, and a generalized fairness optimizer.

#### 4. SOLO DEVELOPER ARCHITECTURE
- **Suggested stack:** React, TypeScript, Vite, Tailwind CSS; static deployment on Vercel.
- **Core model:** Household, participant, chore, bid, workload cap, allocation, and rotation seed. Keep assignment logic as a pure function separate from the UI.
- **Algorithm boundary:** Enumerating 64 allocations is sufficient for the six-chore, two-person demo. Treat larger households as a later algorithm milestone.
- **Product constraint:** Present the result as a preference-based suggestion. Equal budgets do not establish objective fairness, and users retain control of the agreement.

#### 5. DAY 1 ACCEPTANCE CRITERIA
- [ ] Two people can complete the sample auction and see a proposed plan in under five minutes.
- [ ] A participant cannot spend more than 10 tokens.
- [ ] Assignment respects declared caps or clearly identifies chores that cannot be allocated.
- [ ] Tie resolution is deterministic and visible.
- [ ] Users can override an allocation and see any resulting cap warning.
- [ ] Refresh preserves the final plan; reset restores the sample.
- [ ] Bidding and reveal work with keyboard controls and reduced motion.

#### 6. VALIDATION & SUCCESS SIGNAL
Run five household trials. Target: at least four complete a round unaided and at least three choose to reuse the resulting plan the following week. Ask whether the game makes negotiation easier; do not use participation as evidence of fairness.

**Duplicate check:** Compared with the repository's open issues on 2026-10-20; no concept overlap found.
