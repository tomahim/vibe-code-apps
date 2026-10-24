---
name: Alert Fatigue
tagline: You Are the Night-Shift SOC - Five Hundred Alerts, Three Are Real
pitch: A triage arcade where security alerts stream in all night; decide fast what to ignore, investigate or escalate before the real breach slips through your queue.
domains: [GAME, LEARN, PROD]
created: 2026-10-24T03:13:31Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Security operations is a sorting problem under pressure, and that's a game. You're the solo analyst on the night shift: alerts stream into your queue - failed logins, odd processes, DNS weirdness, a USB device at 3am - each with a log excerpt you can expand. For every alert you pick: close, investigate (costs time, reveals a deeper log line), or escalate. Your attention is the economy: investigating everything means the queue floods; closing everything means the real attack chain - three alerts that together tell one story - slips past. Between waves, the game shows the attacker's comic-strip view of what they were actually doing, mapped against the alerts you saw, which is where the learning lands. Difficulty is honest: benign noise is patterned on real enterprise chatter, and the attack chains follow real-world playbooks simplified for readability.
- **Core Problem & Target User:** Security awareness training teaches policy, not judgment; meanwhile SOC triage is exactly the kind of skill that only exists after reps. Target user: developers and IT-curious players who want to understand how breaches actually look from the inside, and security-curious gamers who like Papers-Please-style pressure sorting.
- **Core Value Proposition:** The tension of incident triage as an arcade loop - and you walk away genuinely better at reading the signals that matter.

#### 2. USER STORIES

- **Primary User Story:** "As a player, I want to triage a flooding alert queue with limited attention, so that I feel the real tradeoffs of a night-shift analyst."
- **Secondary User Story:** "As a learner, I want the post-wave reveal to show the attacker's actual moves against the alerts I saw, so that I learn what a real attack chain looks like in logs."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The queue | A streaming alert inbox over a simulated night: alert cards with expandable log lines, close/investigate/escalate actions, attention timer, queue overflow pressure, end-of-night scoring. | Day 1 PoC |
| Core Mechanism: The reveal | After each wave, the attacker's storyboard: their moves laid over the alert timeline, marking what you caught, what you closed, and the moment the chain completed or died. | Day 1 PoC |
| Expansion 1: Real craft | A campaign of nights with escalating attacker sophistication, alert types modeled on real log formats (auth, process, network), streaks, precision/recall scoring, and analyst loadout choices (which detections to enable). | Month 1 MVP |
| Expansion 2: The team floor | Cooperative mode (two analysts splitting a queue), a scenario editor for custom attack chains, a "teach your team" pack for engineering leads, and leaderboards on precision versus speed. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. One night of three waves as typed content (alert texts, log lines, attack-chain ground truth); the queue engine is a local state machine with timers; all client-side.
- **Core 24-Hour Demo Flow:** Wave two: you close a noisy "multiple failed logins" after three legit-looking ones - then the storyboard shows the attacker password-spraying under that exact noise, and the one log line you didn't expand. **Aha moment:** the reveal's gut punch - "the alert you closed at 03:12 was the intrusion" - makes players demand a rematch.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** The game opens mid-shift with the queue already flooding - no menu, no tutorial, just the first alert and a ticking timer.
- **Growth Vector:** Precision/recall scores are brag-shaped ("98% precision, night 4"), and the attack-reveal comics are built to be screenshotted; engineering teams are a natural office-hours audience.

#### 6. RISKS & MITIGATION

- **Realism versus readability:** Real logs are unreadable to newcomers. Mitigation: logs are simplified but structurally faithful, every alert type carries a "what is this" explainer, and difficulty ramps on noise volume rather than obscurity.
- **Teaching attacker tradecraft:** The reveal describes attacker moves. Mitigation: everything shown is public, standard playbook material framed for defenders - what detection caught it and why, never operational how-to detail.
- **Anxiety without agency:** A flooding queue can feel unfair. Mitigation: the game grades precision and recall honestly but frames misses as the night's story, and the storyboard always shows the winning line so every loss teaches.
- **Replayability:** Known chains lose tension. Mitigation: the campaign varies which alerts are load-bearing, noise is generated around seeds, and Expansion 2's scenario editor keeps content fresh.
