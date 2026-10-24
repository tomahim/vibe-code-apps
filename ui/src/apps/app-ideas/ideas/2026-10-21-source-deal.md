---
name: Source Deal
tagline: Draw One Bookmark and Three Constraint Cards, Then Write the Post
pitch: Draw one bookmark and three constraint cards, then write the blog post that hand demands.
domains: [WRITE, MEDIA, GAME]
created: 2026-10-21T05:41:19Z
rating: 1
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** A writing game where the topic is dealt, not chosen. Your read-later bookmarks become a face-down deck. Each session deals you one source card (a bookmarked article) plus three constraint cards (for example: "disagree with one claim", "explain it to a newcomer", "600 words exactly"). You write a blog post that plays all three cards against that source. Harder constraints score more, and a post only counts if every played card is visibly honored.
- **Core Problem & Target User:** Bookmarks pile up unread, and bloggers stall on "what do I write about". Target user: someone with a full read-later queue (wallabag style) who wants to turn consumption into published posts.
- **Core Value Proposition:** One sitting turns a saved article into a shippable blog post, with the fun of a card game instead of a blank page.

#### 2. USER STORIES

- **Primary User Story:** "As an occasional blogger, I want a bookmark and constraints dealt to me, so that I start writing in seconds instead of hunting for a topic."
- **Secondary User Story:** "As a reader with a backlog, I want each played source card to mark the bookmark as processed, so that my queue shrinks as my blog grows."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The deal | A bookmark deck (manual paste or CSV import), 20 authored constraint cards with point values, a deal animation, a writing table with word target, and a self-check showdown that scores the post. | Day 1 PoC |
| Expansion 1: Bookmark import and seasons | Import from a read-later export file, rare constraint cards, seeded daily deal shared with friends, a shipped-post archive with markdown export, local storage. | Month 1 MVP |
| Expansion 2: Live sync and publishing | Direct read-later service sync, post delivery to a blog or newsletter, deck crafting, constraint packs by genre, pass-and-play duels on the same source. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. Bookmarks and cards as JSON, deal as a seeded shuffle, localStorage for deck and posts. No backend, no scraping of article content.
- **Core 24-Hour Demo Flow:** Open with 5 sample bookmarks, press Deal, and get one source plus three constraints; write against them and hit Score. **Aha moment:** within 30 seconds the topic decision is gone and you are already writing.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** A sample deck deals immediately; the first real action is pasting your own links.
- **Growth Vector:** A daily seeded deal lets friends compare posts on the same source and constraints.

#### 6. RISKS & MITIGATION

- **Scope Creep:** Fetching and summarising articles. Mitigation: the writer reads the source themselves in the PoC; the app only stores the link.
- **Technical:** Self-checking constraints is subjective. Mitigation: honest checkbox showdown plus word-count checks where objective.
- **Retention/Engagement:** Runs out of bookmarks. Mitigation: the app nudges you to refill the deck, and seasons add new constraint cards.
