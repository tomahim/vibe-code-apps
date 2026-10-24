---
name: Sample Safari
tagline: A Scavenger Hunt That Turns the Sounds Around You Into Instruments
pitch: Daily safari cards send you hunting for real-world sounds - a door creak, rain on glass, a kettle - and each recording comes back auto-chopped into a playable sampler instrument for your collection.
domains: [MEDIA, GAME, LEARN]
created: 2026-10-24T03:02:03Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Sample packs are passive consumption: you download a thousand kicks made by someone else. Sample Safari flips it into a game of attention. Each day deals a few safari cards - "something metal that rings", "a sound your kitchen makes", "a rhythm, not a tone" - and you go record them with your phone. Each catch is auto-trimmed, normalized and mapped across a small keyboard so it is instantly playable: the door creak becomes an eerie lead, the kettle a kick drum. Your catches live in a collection album (rare cards for hard finds), and the weekly challenge is a beat made only from your own captured kit.
- **Core Problem & Target User:** Beat-making has a high setup cost and most beginners never build a sound palette that feels theirs. Meanwhile phones make everyone a field recordist with nowhere to put the recordings. Target user: a walker, commuter or parent who likes collecting things and wants a creative reason to pay attention to their environment.
- **Core Value Proposition:** A daily collecting game where every trophy is a genuinely playable instrument, so your sound library - and your beats - are literally made of your own life.

#### 2. USER STORIES

- **Primary User Story:** "As a casual creator, I want daily prompts to record sounds around me, so that building a sample library feels like a scavenger hunt instead of a chore."
- **Secondary User Story:** "As a returning player, I want my catches mapped to a playable keyboard and a weekly beat challenge, so that my collection turns into music."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The hunt | A deck of recording prompts in categories (metal, wood, water, rhythm, voice), a one-tap recorder with waveform preview, and catch confirmation ("Nice catch - a Ringing Spoon!"). | Day 1 PoC |
| Core Mechanism: The instrument | Each catch auto-trimmed (silence detection), normalized, pitch-mapped across two octaves on a touch keyboard with simple playback (WebAudio sampler). | Day 1 PoC |
| Expansion 1: The album | Collection view with card art per catch, rarity tiers for hard prompts, streaks, and tagging catches as drum/melody/texture for kit-building. | Month 1 MVP |
| Expansion 2: The weekly beat | A 4-track mini sequencer restricted to your own catches, a weekly shared challenge prompt, and audio export to share your beat. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. MediaRecorder for capture, WebAudio for trim/normalize/pitch-mapped playback, IndexedDB for the local collection. Prompt deck as JSON. No backend.
- **Core 24-Hour Demo Flow:** Deal three cards, record a spoon against a glass for "something that rings", watch it get trimmed and named, then play a melody on it across two octaves. **Aha moment:** the kitchen sound you recorded ten seconds ago is now an instrument you can play a tune on.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** First card is deliberately easy ("clap your hands") so the catch-to-instrument loop completes within one minute of install.
- **Growth Vector:** Weekly beat challenges produce shareable audio with a story ("this beat is my kettle, my keys and a bus door"), which is a natural flex in group chats.

#### 6. RISKS & MITIGATION

- **Recording quality:** Phone mics and noisy environments produce muddy samples. Mitigation: auto-gain and a gentle noise gate, re-record nudge when the level is unusable, and a lo-fi aesthetic that forgives imperfection.
- **Prompt fatigue:** Daily cards die if prompts repeat or feel impossible. Mitigation: a large categorized deck with rarity weighting and prompts that adapt to time of day (kitchen prompts at breakfast hours).
- **Storage creep:** Audio collections grow. Mitigation: cap recordings at 10 seconds, compress to a compact codec, and show collection size with a prune flow.
