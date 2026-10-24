---
name: Lightkeeper
tagline: One Winter, One Lighthouse, One Voice on the Radio - and Something Wrong With the Log
pitch: A first-person narrative game about a relief lighthouse keeper alone for the winter, where the mystery unfolds through the logbook, the radio, and the sea.
domains: [GAME, MEDIA, HIST]
created: 2026-10-24T03:16:22Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** The Firewatch formula - a solitary job in a beautiful place, a voice on the radio, a slow-burn mystery - transplanted to a decommissioned-era lighthouse in the off-season. You are the relief keeper through the winter, keeping the light, the log and the weather readings while the regular keeper's voice guides you by radio from the mainland. The days are a ritual: wind the mechanism at dusk, record the barometer, fix what the ice breaks. Then small things stop adding up: a prior log entry in a different hand, a supply cache nobody mentioned, a light on the water that answers yours. The mystery is told entirely through what you can touch - the logbook's decades of entries, the radio, objects found in the tower - and the emotional spine is the keeper on the radio, whose reasons for leaving get harder to ask about the closer you get.
- **Core Problem & Target User:** Narrative exploration games are rare and expensive to build; players who loved Firewatch's loneliness-and-voices formula have few places to go. Target user: story-first players who want atmosphere, melancholy and a mystery that trusts them, playable in a few evenings.
- **Core Value Proposition:** The solitary-job mystery done with lighthouse texture: ritual, weather, radio intimacy, and a story assembled from artifacts rather than cutscenes.

#### 2. USER STORIES

- **Primary User Story:** "As a player, I want to live the keeper's winter ritual while a mystery surfaces through the logbook and radio, so that solitude itself becomes the storytelling."
- **Secondary User Story:** "As a narrative gamer, I want the mystery solved through evidence I physically find and choose to pursue, so that the ending feels earned rather than watched."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The ritual | A first-person low-poly lighthouse and headland: dusk light-winding, barometer readings, weather that matters, a logbook you actually write entries in by choosing what to record. | Day 1 PoC |
| Core Mechanism: The voices | Radio conversations with the mainland keeper - warm, funny, withholding - with dialogue choices that shape how much he trusts you; the historical logbook as a readable in-world document. | Day 1 PoC |
| Expansion 1: The full winter | A 12-chapter season arc with escalating mystery, day/night and storm cycles, multiple endings shaped by what you chose to record and ask, and a photo mode for the headland. | Month 1 MVP |
| Expansion 2: Deeper artifact play | Handwritten log pages spanning 80 years to cross-reference, physical puzzle objects (sextant, chart cabinet, the cache), an oral-history mode where finishing unlocks the keeper's own recorded account, and seasonal epilogues. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS, Three.js. One compact explorable scene (tower interior plus headland at three light conditions), a scripted radio dialogue tree, and a logbook interface with authored entries across decades. All content local, no backend.
- **Core 24-Hour Demo Flow:** Wind the light at dusk while the keeper talks you through it on the radio, then find the previous keeper's last log entry - dated three days after he says he left. Call him on it, and the radio goes quiet for a long moment. **Aha moment:** realizing the logbook you've been maintaining is the mystery's main evidence, and re-reading the entries you wrote yourself.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** Open on the lamp room at sunset with the radio crackling "you're late for first light" - the ritual starts before any menu.
- **Growth Vector:** Lighthouse-and-winter atmosphere is inherently screenshot-able, the found-logbook mechanic invites theory discussion, and Firewatch fans are a defined, reachable audience explicitly looking for this feeling.

#### 6. RISKS & MITIGATION

- **Derivative risk:** The formula invites comparison to Firewatch. Mitigation: lean into what the lighthouse uniquely offers - ritual machinery, the sea, the logbook as gameplay - and never copy forest, towers or plot beats; the inspiration is acknowledged in framing, not in assets or story.
- **Pacing collapse:** Solitude games die if nothing pulls forward. Mitigation: the mystery surfaces on a strict chapter rhythm, every ritual day ends with one unsettling detail, and radio warmth gives emotional momentum between clues.
- **Scope of a 3D world:** Even a small headland is heavy for a PoC. Mitigation: one compact location, three lighting states, low-poly painterly style, and all narrative depth carried by text and voice script rather than level count.
- **Historical texture without claims:** Decades of logbook entries imply research. Mitigation: invented island, invented keepers, period texture drawn from general lighthouse-keeping knowledge, no claims to any real station or event.
