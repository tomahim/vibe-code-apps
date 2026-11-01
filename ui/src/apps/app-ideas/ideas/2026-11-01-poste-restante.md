---
name: Poste Restante
tagline: Letters That Wait - Seal One Today, and the Post Holds It Until the Date You Choose
pitch: Write letters to your future self or to someone you love, sealed until a date you set, kept in an archive of waiting envelopes with countdowns.
domains: [HIST, WRITE]
created: 2026-11-01T06:02:49Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Poste restante was the traveler's post office: letters waited at the counter until you arrived to claim them, sometimes for months. Poste Restante revives the institution for time instead of place. You write a letter - to yourself in one year, to your daughter on her eighteenth birthday, to your future spouse on the wedding morning - choose the delivery date, and seal it. The app keeps it in the waiting room: a wall of sealed envelopes, each with its claim date and a quiet countdown, unopenable until the day arrives. When a letter comes due, it is delivered as an artifact: the envelope, the date it was written stamped on the back, and the person who wrote it - you, some years younger - suddenly present again.
- **Core Problem & Target User:** Time-capsule intentions die in drawers and notes apps because nothing enforces the seal and nothing performs the delivery. Meanwhile the moments worth writing from (new job, new baby, diagnosis, decision) pass undocumented precisely because they feel too big to journal. Target user: parents, couples, people at thresholds, and anyone who has wished their past self had left a note.
- **Core Value Proposition:** The emotional weight of a sealed letter with the reliability of an institution: write once, seal it for real, and the app guarantees both the waiting and the arrival.

#### 2. USER STORIES

- **Primary User Story:** "As someone at a milestone, I want to write a letter sealed until a date I choose, so that my future self or someone I love receives who I was today."
- **Secondary User Story:** "As a keeper of letters, I want my sealed envelopes visible with their claim dates, so that the waiting itself is part of the experience and no letter is forgotten."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The writing desk | A distraction-free letter desk (addressee, claim date, the letter itself) ending in a seal action that locks the text, even from the writer. | Day 1 PoC |
| Core Mechanism: The waiting room | A wall of sealed envelopes with claim dates and countdowns; on the day, an envelope opens into the delivered letter with its writing-date stamp. | Day 1 PoC |
| Expansion 1: The standing instructions | Recurring annual letters (write to yourself every birthday), delivery by email or notification on the claim date, and a plain-text export of delivered letters. | Month 1 MVP |
| Expansion 2: The estate of letters | Letters addressed to other people delivered by link on the claim date, a guardian contact who can claim letters if you cannot, and a printed-delivery option for milestone letters. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. The writing desk with a deliberate seal flow (confirm twice: sealed means sealed), the waiting-room wall, and delivery rendering. localStorage only; no backend, no accounts; day-one seals are enforced in the UI with an honest note that real guarantees need the Month 1 backend. Mobile and desktop.
- **Core 24-Hour Demo Flow:** Open to a waiting room with three sample sealed envelopes: "To me, on my 40th birthday", "To June, when she turns 18", "To whoever buys this house". One sample letter came due yesterday - open it and read a stranger's past talking. Then write your own and seal it. The "Aha!" moment: the seal confirmation - realizing this is the first app that will not let you peek.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** The sample waiting room makes the concept visceral in ten seconds, and writing the first letter needs no setup beyond a date.
- **Growth Vector:** Letters to children and partners recruit entire families, milestones renew the habit naturally (every birthday, every move), and each delivery is a story people tell.

#### 6. RISKS & MITIGATION

- **Longevity risk:** A sealed letter is a promise spanning years; an abandoned app breaks it. Mitigation: plain-text and print export of everything delivered, honest local-first limits on day one, and the Month 1 backend scoped around durable delivery rather than features.
- **Emotional risk:** Letters to the future can surface heavy material, and guardian delivery touches mortality. Mitigation: copy stays warm but unsentimental, guardian flows are opt-in with plain language, and nothing in the app nudges toward confessional content.
- **Security risk:** Sealed letters are among the most private texts a person writes. Mitigation: local-only storage in the PoC, encryption before any backend sync, and no analytics on letter content ever.
