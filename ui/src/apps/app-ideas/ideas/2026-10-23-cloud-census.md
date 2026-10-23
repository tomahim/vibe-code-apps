---
name: Cloud Census
tagline: Find the Physical Cloud - Spot Data Centers From Open Satellite Imagery
pitch: A map that hunts data centers in open satellite imagery, scores each candidate's confidence, and turns verification into a game.
domains: [LEARN, GAME]
created: 2026-10-23T06:57:21Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** The cloud is made of buildings, and most of them are hiding in plain sight. The app scans open satellite imagery (Sentinel-2, Landsat, open aerial layers) for the visual signature of data centers: huge flat roofs, cooling arrays, substations, security perimeters, telltale water infrastructure. Each candidate appears on a map as a card with its imagery chips and a confidence score with reasons ("roof area 40,000 m2", "adjacent substation", "cooling plume in thermal band"). Nothing is claimed as certain: every site stays a "candidate" no matter how high the score, and the game is about what public evidence exists - players review chips, vote real or not, and earn a reputation score when later evidence (permits, news, operator listings) proves them right. A site is only ever labeled "publicly documented" when such an external source is attached, never on the model score alone - players review chips, vote real or not, and earn a reputation score when later evidence (permits, news, operator listings) proves them right. Over time the map becomes a living census of the physical internet, with estimated capacity context where public data exists.
- **Core Problem & Target User:** Data centers shape energy grids, water use and land prices, yet their locations are scattered across press releases and planning documents. Target user: the map-and-infrastructure curious, journalists, students, and anyone who has wondered where "the cloud" physically sits.
- **Core Value Proposition:** A crowdsourced, honest-by-design map of likely data center sites from open imagery, where confidence is shown, uncertainty is explicit, and verification is fun.

#### 2. USER STORIES

- **Primary User Story:** "As an infrastructure nerd, I want to explore candidate data center sites on a map with confidence scores and evidence chips, so that I can see where the physical cloud lives."
- **Secondary User Story:** "As a player, I want to vote on unverified candidates and build a reputation when my calls prove right, so that my time improving the census feels like a game."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The census map | A map of one region seeded with hand-picked known and candidate sites, each with imagery chips, a rule-based confidence score (roof area, substation proximity, cooling signatures) and visible reasons. | Day 1 PoC |
| Core Mechanism: The verification game | Unverified candidates enter a review queue; players vote with the imagery in front of them, earn reputation, and see each site's status change as votes accumulate. | Day 1 PoC |
| Expansion 1: Real detection | A trained model (public building footprint datasets plus labeled data centers from public listings) scanning open imagery tiles automatically, thermal and water-infrastructure signals, and a corrections feed that retrains the scorer. | Month 1 MVP |
| Expansion 2: Context and scale | Public-record enrichment (permits, grid connections, operator announcements with sources), capacity and water-use estimates labeled as estimates, worldwide coverage, trend view of new builds over time. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS, MapLibre with open satellite basemaps. A curated static dataset of around fifty sites (mix of known, likely, and decoy industrial buildings) with pre-cut imagery chips and rule-based scores computed offline. Voting state in localStorage. No backend, no live imagery API.
- **Core 24-Hour Demo Flow:** Open the map on a region, tap a glowing candidate, read "confidence 72%: roof 38,000 m2, substation 200 m, no signage", then review three unverified chips and vote. **Aha moment:** a site the player backed flips to "community says likely" with the vote count, and the map feels owned.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** The first screen shows one famous hyperscale campus and one anonymous shed side by side and asks "which is the data center?" - most people guess wrong, and the reasons panel teaches the signature instantly.
- **Growth Vector:** Local scoops travel: "someone found an unlisted build outside town X" spreads through local groups and tech press, and each discovery recruits new reviewers.

#### 6. RISKS & MITIGATION

- **Accuracy honesty:** Automated detection will produce false positives (distribution warehouses look similar). Mitigation: every site carries confidence and reasons, no site is ever presented as confirmed on model confidence alone, and the copy never claims identification - it says "candidate", upgrading only to "publicly documented" with an external source cited.
- **Imagery rights and freshness:** Commercial satellite imagery is licensed; open sources have lower resolution and update slowly. Mitigation: build on openly licensed imagery only (Sentinel-2, Landsat, national open aerial programs), show the imagery date on every chip, and verify each source's licence during the PoC.
- **Sensitivity:** Mapping critical infrastructure can raise concerns. Mitigation: use only publicly available imagery and public records, aggregate rather than expose security details, and follow the precedent of published open-source journalism in this space.
- **Training data:** A good detector needs labeled examples. Mitigation: Day 1 is rule-based on a curated set; the model is Expansion scope and starts from public operator listings and planning documents as labels.
