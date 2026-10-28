---
name: Dead Reckoning
tagline: Sail the Beagle Day by Day With Only a Log, a Compass and Yesterday's Guess
pitch: Navigate a real historical voyage one day at a time using era instruments and the expedition's own weather, then compare your estimated position with what the log actually recorded.
domains: [HIST, LEARN]
created: 2026-10-28T06:04:17Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Before GPS, position was a daily act of reasoning: speed by log line, heading by compass, drift by judgment, and a noon sun if the sky allowed. Dead Reckoning puts you at the chart table of a real voyage (the Beagle's first surveying season, an 1840s packet crossing, a whaler's circuit). Each day of the app unlocks one day of the actual expedition: the wind and weather the log recorded, the sail plan ordered, any celestial observation taken. You plot your estimated position on the chart - and only then the app shows where the ship truly was, and what the real navigator wrote that night. Error accumulates honestly: your whole next day starts from your guess, not from the truth.
- **Core Problem & Target User:** Historical navigation is the invisible technology behind every age-of-sail story, yet it stays abstract: nobody feels what "uncertain by forty miles" means until their own coastline refuses to appear. Target user: history readers, sailing romantics, geography nerds, and anyone who likes systems that reward careful reasoning over reflexes.
- **Core Value Proposition:** History learned from the chart table rather than the armchair: real logs, real weather, real consequences, and a daily habit-sized dose of one of humanity's great reasoning crafts.

#### 2. USER STORIES

- **Primary User Story:** "As a history lover, I want to navigate a real voyage day by day with period instruments, so that I understand dead reckoning by doing it, with the actual log as my answer key."
- **Secondary User Story:** "As a returning player, I want my position error to carry forward day to day, so that I feel how navigators managed uncertainty over weeks, not just single fixes."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The chart table | A ten-day excerpt of one real voyage: daily briefing (logged weather, course, sail plan), instruments (log line, compass, noon sight on clear days), and a chart where you prick your estimated position before the true one is revealed with the navigator's own log quote. | Day 1 PoC |
| Core Mechanism: Carried error | Your estimated position, not the truth, seeds the next day's reckoning; the app tracks your accumulated error across the passage. | Day 1 PoC |
| Expansion 1: The full passage | The complete multi-week voyage, weather-locked days (no sights, pure reckoning), landfall scoring, and a replay mode trying different interpretations of the same log. | Month 1 MVP |
| Expansion 2: The library of voyages | Additional expeditions with different characters (polar ice, monsoon routes, coastal surveying), a methods appendix teaching each instrument, and a hard mode with compass deviation and chronometer drift. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. A stylized chart canvas of one real coastline with a plotting interaction (drag to prick your position), an instruments panel (log speed, compass course, optional noon latitude), and a day-by-day script of one real ten-day passage written from the actual expedition's published log. All content bundled; no backend, no accounts. localStorage keeps progress and error history.
- **Core 24-Hour Demo Flow:** Day 1 briefs you: fresh westerly, course southwest by west, eight knots by the log. You plot your fix. The chart reveals the true position - twenty miles apart, and the real log's line: "Soundings none at 30 fathoms." Day 2 starts from your guess. By day 5, overcast, no noon sight, and your track is genuinely uncertain. The "Aha!" moment: the day the true coastline appears forty miles from where your own reasoning swore it would be.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** One day takes two minutes and ends with a reveal; the sample passage hooks immediately because the answer key is history itself.
- **Growth Vector:** Error-leaderboards against the same historical day (shared as "I was 12 miles off the Beagle on day 6") are natural bragging artifacts, and famous voyages provide a deep content library with built-in audiences.

#### 6. RISKS & MITIGATION

- **Accuracy risk:** Reconstructed positions and weather must stay honest to the historical record. Mitigation: every daily card cites the log it is drawn from, the app distinguishes log-recorded facts from reconstructed interpolation, and uncertain source days say so rather than inventing precision.
- **Complexity risk:** Real navigation math can intimidate. Mitigation: the PoC keeps arithmetic gentle and explains each instrument in one card; hard mode with deviation and drift is opt-in at Month 3.
- **Engagement risk:** Daily-unlock pacing could frustrate binge learners. Mitigation: a passage can be sailed in one sitting if the user prefers; the day-by-day rhythm is a framing, not a lock.
