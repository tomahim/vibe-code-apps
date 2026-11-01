---
name: The Whistle
tagline: You Are the Referee - Real Incidents, Three Seconds to Decide, the Laws to Answer To
pitch: Watch real amateur football incidents, make the call under time pressure, and get the verdict from the Laws of the Game with the reasoning referees actually use.
domains: [SPORT, LEARN]
created: 2026-11-01T06:03:26Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Everyone in the stands knows the Laws; almost nobody has made the call at speed from one angle with players shouting. The Whistle is a decision trainer built from real amateur match incidents. Each clip freezes at the moment of contact or appeal: you get three seconds, the referee's angle, and the four buttons (play on, foul, card, offside). Then the app rules on it - not with "the correct answer" but the way an assessor would: which Law applies, what the deciding factor was (point of contact, denial of an obvious chance, deliberate play vs deflection), and where honest referees split. Difficulty ladders from Sunday-league clear fouls to handball situations that divide professional panels. A consistency table tracks your calls by incident type against the Laws over time.
- **Core Problem & Target User:** Football fans argue refereeing constantly with zero training in how decisions are actually made, and grassroots referees get almost no decision reps between matches. Target user: fans who want their opinions earned, grassroots referees building judgment, and coaches and parents who would watch games differently if they understood the Laws.
- **Core Value Proposition:** The rep nobody can get from the sofa: hundreds of real incidents called under time pressure, each explained through the Laws and the actual factors referees weigh.

#### 2. USER STORIES

- **Primary User Story:** "As a fan, I want to call real incidents under time pressure and learn the deciding factors, so that my refereeing opinions are earned rather than tribal."
- **Secondary User Story:** "As a grassroots referee, I want drilled decision reps between matches with Law citations, so that matchday judgment comes faster and more consistently."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The incident desk | Short real or reconstructed incident clips that freeze at the decision moment; three seconds, four call buttons, then the assessor-style ruling with Law citation. | Day 1 PoC |
| Core Mechanism: The consistency table | Your calls tracked by incident type (penalties, handball, offside, dissent) against the Laws, showing where your judgment drifts from the book. | Day 1 PoC |
| Expansion 1: The assessor's course | Themed modules (DOGSO, advantage, offside phases), angle-switch replays showing why positioning decides calls, and streak-free progress across modules. | Month 1 MVP |
| Expansion 2: The league of whistles | Weekly published incident debated with split statistics, club and referee-society packs, and a path from fan mode to the grassroots referee curriculum. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. Day one uses reconstructed incidents (animated top-down or 3D-lite recreations) rather than licensed video, with a bundled set of about twenty incidents spanning clear to genuinely split decisions, each with its ruling and reasoning text. Timed decision UI, ruling card with Law reference, and the consistency table. localStorage only; no backend, no accounts.
- **Core 24-Hour Demo Flow:** First incident: striker through, keeper comes out, contact, freeze. Three seconds - foul? You call penalty and red. The ruling card: penalty yes, but no card, because the keeper made a genuine attempt for the ball - and here is the Law that says so. The "Aha!" moment: the first time the ruling corrects you with reasoning so clean you immediately want the next incident.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** One incident takes fifteen seconds and the first ruling almost always teaches something; the format is instantly legible to any football fan.
- **Growth Vector:** Split decisions are argument fuel ("68 percent of users called this a penalty - the Law says no"), weekly incidents create appointment use, and referee societies get a real training tool worth adopting.

#### 6. RISKS & MITIGATION

- **Authority risk:** Rulings must be right or the app is miseducating referees. Mitigation: every ruling cites the current Laws of the Game, genuinely split incidents are presented as split with both reasonings, and content is reviewed against the latest IFAB wording each season.
- **Content risk:** Licensed match video is unobtainable; reconstruction quality decides credibility. Mitigation: day one is honest stylized recreation labeled as such, and community-submitted amateur footage (with consent) is the Month 3 path to real clips.
- **Tribalism risk:** Fans may use it to relitigate specific real matches. Mitigation: incidents are anonymized and teaching-focused; the app rules on situations, not on named matches or referees.
