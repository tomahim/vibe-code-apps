---
name: Bookmark Terrarium
tagline: Grow Your Saved Links Into a Tiny 3D Garden That Wilts If You Ignore It
pitch: Saved links grow as plants in a 3D terrarium; read one and note a learning to make it bloom.
domains: [MEDIA, 3D]
created: 2026-10-21T05:02:03Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Bookmarks pile up in lists nobody opens. Here each saved link is a seed in a glass 3D terrarium. The plant species depends on the topic, its size on article length. Reading a link and writing one key learning waters it and it blooms into a flower holding your note. Unread links slowly droop, so the state of your reading backlog is visible as a garden at a glance.
- **Core Problem & Target User:** Read-later queues grow into guilt. Target user: someone who saves many articles (a wallabag or Pocket style reader) and wants a gentle, visual reason to actually read and extract the takeaway.
- **Core Value Proposition:** Turn a guilt pile into a garden you want to tend, and keep a trail of key learnings.

#### 2. USER STORIES

- **Primary User Story:** "As a heavy reader, I want my saved links shown as plants that wilt when unread, so that I see my backlog without opening a list."
- **Secondary User Story:** "As a learner, I want one key learning stored per bloomed plant, so that reading leaves something durable."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: Seed, water, bloom | Paste a URL and a topic tag to plant a seed in a React Three Fiber terrarium, a "water" action that asks for one-line learning, bloom animation, wilting by age, plant detail card. | Day 1 PoC |
| Expansion 1: Import and species | Import from a bookmarks HTML or CSV export, species by topic, seasons, learnings search, local storage, harvest view that exports notes as markdown. | Month 1 MVP |
| Expansion 2: Library sync | Sync from a read-later service API, auto summary suggestion for the learning line, multiple terrariums by theme, weekly garden recap, shareable snapshot image. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS, React Three Fiber with drei. 4 low-poly plant models built from primitives, wilting as a shader or scale and tilt by days since saved. localStorage only. No fetching of page content.
- **Core 24-Hour Demo Flow:** Open with 6 sample seeds, tap a drooping plant, type one learning, and watch it stand up and bloom. **Aha moment:** within 30 seconds you see the garden visibly healthier after one action.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** Pre-planted sample terrarium, then paste your first link.
- **Growth Vector:** Garden snapshots shared next to reading-list posts.

#### 6. RISKS & MITIGATION

- **Scope Creep:** Service integrations. Mitigation: manual paste and CSV only first.
- **Technical:** Many plants can slow mobile. Mitigation: instancing and a visible cap with a compost bin for old plants.
- **Retention/Engagement:** Wilting can feel punishing. Mitigation: wilted plants can be composted into a seed bonus, no deletion shame.
