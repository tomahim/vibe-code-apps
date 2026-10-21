---
name: Angle Auction
tagline: Bid Constraint Cards Against Bookmark Topics and Write the Winning Angle
pitch: Pair angle cards with your bookmarked articles, then write the pairing that promises the most original take.
domains: [WRITE, MEDIA, LEARN]
created: 2026-10-21T05:41:21Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** A solo auction game for choosing what to write. The app lays 5 of your bookmarked articles on the table and reveals 5 angle cards (for example: "steel-man the opposing view", "extract the one number that matters", "connect it to a different field"). Each round you assign angle cards to bookmarks in a silent auction against yourself: every assignment costs ambition points, and a post is only scored when written. The game is finding the pairing where an ordinary article becomes an original take, and it teaches angle-spotting as a skill.
- **Core Problem & Target User:** Writers with a bookmark pile write summaries instead of takes, because finding an angle is the hard part. Target user: a reader-blogger who wants posts with a point of view, built from what he already saves.
- **Core Value Proposition:** A playful matching game that trains the real skill of blogging: finding the angle hiding in a saved article.

#### 2. USER STORIES

- **Primary User Story:** "As a blogger, I want to match angle cards to my saved articles, so that I discover non-obvious takes instead of writing summaries."
- **Secondary User Story:** "As a learner, I want my winning pairings and their scores recorded, so that I learn which kinds of angles I execute well."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The auction table | 5 bookmark cards on the table, 5 angle cards in hand, drag or tap to pair them, a score preview per pairing (rarity of the angle plus fit), then a writing desk for the winning pair with a word target. | Day 1 PoC |
| Expansion 1: Angle library and import | 40 angle cards with categories, bookmark CSV import, angle stats (which you win and finish), rewrite a pairing with a twist card, markdown export, local storage. | Month 1 MVP |
| Expansion 2: Multiplayer table | Pass-and-play auctions where the best angle wins the bookmark, read-later service sync, audience vote on two angles of the same source, seasonal angle packs. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. Bookmarks and angles as JSON, pairing as tap-to-assign, scoring as a small pure function, localStorage for the table and posts. No backend.
- **Core 24-Hour Demo Flow:** Open with sample bookmarks, deal 5 angle cards, pair three of them, and see one pairing light up as the high-value take. **Aha moment:** within 30 seconds an article you would have summarised becomes a piece you want to write.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** Sample table deals instantly, so the first pairing happens in seconds.
- **Growth Vector:** Share the winning pairing card, and friends auction the same bookmarks.

#### 6. RISKS & MITIGATION

- **Scope Creep:** Automatic angle suggestions from article content. Mitigation: human judgment is the game; no article fetching in the PoC.
- **Technical:** Scoring pairings fairly. Mitigation: a transparent rarity-plus-fit formula shown on the card.
- **Retention/Engagement:** The game ends when writing begins. Mitigation: finishing a post banks the pairing's points, so writing is part of the loop.
