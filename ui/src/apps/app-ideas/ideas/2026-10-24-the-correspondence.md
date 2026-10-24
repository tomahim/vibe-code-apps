---
name: The Correspondence
tagline: Real Letters, Delivered Slowly - Writing to Friends the Way It Used to Take Days
pitch: Write letters to friends that take real days to arrive, restoring anticipation and depth to friendship one envelope at a time.
domains: [WRITE, MEDIA]
created: 2026-10-24T05:02:31Z
rating: 1
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Instant messaging made correspondence constant and thin. This app brings back the letter: you write to a friend, seal it, and it travels - genuinely, with a delivery time of one to five days depending on the "distance" you choose. While a letter is in transit you can see it moving on its little route; when it arrives, the recipient opens an envelope, not a notification. The slowness is the product: knowing your words won't be read until Thursday changes what you write - longer, deeper, more considered. Letters can carry enclosures (a photo, a pressed-flower sketch, a recipe), a correspondence shelf keeps each friendship's full archive bound like a volume, and anniversaries resurface "one year ago you wrote..." for rereading. Replying starts your own letter's journey, so a friendship develops a natural rhythm measured in letters per season, not messages per minute.
- **Core Problem & Target User:** Long-distance friendships and family ties run on chat streaks that feel like maintenance, and the depth of a real letter has no digital home. Target user: people with far-away friends, grandparents, partners in other cities - anyone who misses the weight of a letter and knows a chat bubble can't carry it.
- **Core Value Proposition:** Distance and delay as features: letters worth waiting for, friendships measured in volumes, and the return of anticipation.

#### 2. USER STORIES

- **Primary User Story:** "As a letter writer, I want my letters to take real time to arrive and arrive as envelopes, so that writing to a far friend feels significant again."
- **Secondary User Story:** "As a correspondent, I want each friendship kept as a bound volume with anniversaries resurfaced, so that our letters become a shared history we can reread."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The letter | A beautiful writing desk (paper textures, pen-ink typography, envelope sealing), choose transit time, watch the letter travel its route, envelope-opening arrival for the recipient. | Day 1 PoC |
| Core Mechanism: The volume | Each friendship as a bound correspondence volume with letters in order, enclosures, a letters-per-season rhythm view, and one-year-ago resurfacing. | Day 1 PoC |
| Expansion 1: Real correspondence | Accounts and mutual consent per correspondence, delivery windows with notifications on arrival only (never on read), stationery choices, photo enclosures, and quiet hours by timezone. | Month 1 MVP |
| Expansion 2: The post office | Pen-pal matching with consent and safety controls, annual printed volumes of a correspondence, seasonal stationery, and a "first letter" ritual that opens a new correspondence with a keepsake. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. A two-persona demo (writer and recipient views switchable), letters stored locally with simulated transit timers accelerated for demo, paper-and-ink visual craft as the centerpiece. No backend.
- **Core 24-Hour Demo Flow:** Write a letter to "Grand-mere", seal it, choose three-day transit, and watch it travel the route on the shelf - then flip to her view and open the envelope when it "arrives". **Aha moment:** the envelope-opening animation and the ache of waiting a beat before reading - the delay makes the same words land differently, and you feel it in the demo.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** "Write the letter you've been meaning to send" - the first letter flow is free and immediate, with the sealing moment designed to be felt.
- **Growth Vector:** Correspondence is inherently two-sided: every letter recruits its recipient, and the annual printed volume is a gift object that sells the app to the next correspondent.

#### 6. RISKS & MITIGATION

- **Impatience kills the gimmick:** Users may route around the delay. Mitigation: the delay is the brand and chosen at sealing, envelopes can be scheduled for occasions, and the transit view makes waiting part of the pleasure rather than dead time.
- **Safety in pen-pal matching:** Stranger matching carries risk. Mitigation: matching is opt-in and adult-only, mutual consent before any letter moves both ways, block and report at the envelope level, and no address or identity data beyond the app.
- **Notification temptation:** Arrival buzz must not become read-receipt pressure. Mitigation: recipients get one arrival notice, senders never see read status, and rhythm stats celebrate letters exchanged, never speed.
- **Volume over novelty:** If writing feels like homework, volumes stay thin. Mitigation: letter starters ("tell them about the meal, the weather, the small win"), enclosures that lower the blank-page cost, and no minimums, streaks or guilt mechanics anywhere.
