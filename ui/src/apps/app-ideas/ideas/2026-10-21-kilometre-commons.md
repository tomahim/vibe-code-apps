---
name: Kilometre Commons
tagline: Your Club's Indoor Miles Build One Shared World Together
domains: [SPORT, GAME, 3D]
created: 2026-10-21T06:13:05Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** A Zwift-style social app where the world is not given, it is built by the club's legs. Every indoor kilometre any member rides adds material to a shared persistent valley: the first hundred kilometres raise the road, then bridges, a cafe, a velodrome, a monument on the pass. Buildings unlock by collective milestones and are voted on, so the world is a record of the group's winter. Riding together at the same hour earns build speed bonuses, pulling the club online simultaneously.
- **Core Problem & Target User:** Indoor riding is lonely and club spirit evaporates in winter. Target user: a cycling or tri club that wants a shared project, not just shared leaderboards.
- **Core Value Proposition:** The club's winter kilometres become a place you built together and can ride through by spring.

#### 2. USER STORIES

- **Primary User Story:** "As a club member, I want my indoor kilometres to build a shared world, so that my solo sessions contribute to something collective."
- **Secondary User Story:** "As a club organizer, I want milestone votes and build bonuses at set hours, so that members show up together."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: Miles to mortar | A shared valley model (static JSON state), manual or file-based ride logging, a build meter with milestone unlocks, a 3D valley viewer, and a club feed of what was just built. | Day 1 PoC |
| Expansion 1: Votes and rush hours | Building votes, scheduled rush hours with build-speed multipliers, member contributions per building, seasonal themes, local storage or tiny shared file backend. | Month 1 MVP |
| Expansion 2: Ride inside it | Riding avatars in the built valley, FTMS input, inter-club visits, spring reveal event, export of the world as a glTF keepsake. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS, React Three Fiber with drei. Valley as boxes and primitives placed by milestone, a shared state file editable by URL hash for the demo club, localStorage. No real backend in PoC.
- **Core 24-Hour Demo Flow:** Log a 30 km ride and watch the bridge's next segment slide into place with the club feed cheering. **Aha moment:** within 30 seconds your workout visibly changes a world your friends will see.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** The valley already shows the club's progress on first load.
- **Growth Vector:** Club-by-club adoption: one member's invite carries the whole group.

#### 6. RISKS & MITIGATION

- **Scope Creep:** Real-time multiplayer riding. Mitigation: PoC is build-and-view, avatars come in Month 3.
- **Technical:** Shared state without a backend. Mitigation: a small JSON state on a static host or manual sync in the PoC.
- **Retention/Engagement:** Big clubs finish fast, small clubs stall. Mitigation: milestone costs scale with member count.
