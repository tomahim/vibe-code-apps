---
name: Heirloom Radio
tagline: One Prompted Question a Week, Recorded With a Grandparent, Bound Into a Family Podcast
pitch: Every week the app hands you one question to ask an elder; the recorded answers become a private family audio archive.
domains: [MEDIA, HIST]
created: 2026-10-23T05:03:13Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Family history dies because nobody ever presses record. The app plays producer: each week it deals one question card ("What did your mother cook on Sundays?", "What did the village do when it snowed?", "Tell me about your first wage") chosen to be answerable in two minutes of speech. You sit with a parent or grandparent, tap record, and the answer is saved with the question as its title, a photo of the person, and a transcript. Twelve weeks make a season: the app stitches the answers into a private podcast feed the whole family can subscribe to, intro music included, so the cousins hear grandma's voice in their headphones on the bus.
- **Core Problem & Target User:** Everyone means to record their elders and almost nobody does, because it feels like a project. Target user: an adult with aging parents or grandparents and a family scattered across cities, who wants the stories captured before they are gone, one coffee at a time.
- **Core Value Proposition:** A weekly ritual that turns good intentions into a finished, listenable family archive without editing skills or willpower.

#### 2. USER STORIES

- **Primary User Story:** "As an adult child, I want one good question handed to me each week, so that recording my father's memories becomes a habit instead of a project."
- **Secondary User Story:** "As a cousin living abroad, I want the season delivered as a private podcast feed, so that I hear my grandmother's voice on my commute."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The weekly card | A curated deck of memory questions in categories (childhood, work, food, love, the village), one dealt per week, a one-tap recorder with pause, saved with the question title and a photo. | Day 1 PoC |
| Core Mechanism: The archive | A timeline of recorded answers, playable in-app, with on-device transcription for search. | Day 1 PoC |
| Expansion 1: The season | Twelve answers auto-bound into a private podcast feed (RSS with a family token), intro jingle, chapter art from the photos, shareable by link to family only. | Month 1 MVP |
| Expansion 2: The family studio | Siblings get the same question for different elders, kids' questions deck, translation subtitles for mixed-language families, printed transcript book at season end. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. Question deck as JSON, recording via the MediaRecorder API, audio and photos stored locally (IndexedDB), on-device transcription via a small WASM speech model or manual title entry as fallback. No backend.
- **Core 24-Hour Demo Flow:** Deal "What did your mother cook on Sundays?", record a two-minute answer, attach a photo, play it back in the timeline with its transcript. **Aha moment:** hearing the answer titled like a podcast episode makes the archive feel real after a single recording.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** The first card appears on first open with a big record button, and the prompt text gives three follow-up nudges so the conversation never stalls.
- **Growth Vector:** Every finished episode is shared to the family chat by design, and the sibling who hears it is the next person to install and record their own branch of the family.

#### 6. RISKS & MITIGATION

- **Privacy:** Voice archives of family members are sensitive. Mitigation: local-first storage, explicit consent prompt read aloud at first recording, private-feed token revocable, no third-party upload in the PoC.
- **Follow-through:** Weekly habits die. Mitigation: the question arrives on a chosen day (Sunday lunch), streaks are gentle, and missed weeks simply deal the same card again without shame.
- **Transcription quality:** On-device speech models stumble on elderly, accented or dialect speech. Mitigation: transcripts are editable, and a wrong transcript never blocks saving the audio, which is the actual heirloom.
