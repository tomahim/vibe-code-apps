---
name: Second Growth
tagline: The Fire Already Came - Now You Watch What Grows Back, and What the Burn Uncovered
pitch: A first-person narrative game about a lookout posted to a burned forest to chart its regrowth, slowly uncovering what the fire revealed and why nobody talks about the last lookout.
domains: [GAME, HIST]
created: 2026-10-24T03:16:41Z
rating: 1
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Firewatch ends before the fire; Second Growth starts after it. You are the regrowth surveyor posted to a fire-scarred valley for a full season, alone with a quadrant map, a camera, and a supervisor's voice on the radio. The job is meditative: hike to plot markers, identify what's sprouting, photograph the same slopes as the season turns. But fire is an archaeologist - it strips away a century of undergrowth - and your plots keep turning up what it exposed: foundation stones of a homestead on no map, a child's tin toy, a firebreak that was cut wrong on purpose. The valley's human history assembles plot by plot, and the last lookout's unfinished survey notebook, which you find page by page, turns out to be the guide to both the land and the story. The emotional engine is restoration: the forest coming back while you figure out what it costs to tell the truth about how it burned.
- **Core Problem & Target User:** Players who loved Firewatch's wilderness loneliness want new ground, not a re-skin; ecology and post-fire succession are rich, rarely used game material. Target user: narrative-game players, nature lovers, and anyone moved by landscapes that carry history.
- **Core Value Proposition:** The solitary-wilderness mystery inverted: not watching for disaster but documenting recovery, with a century of buried human history surfacing through the regrowth.

#### 2. USER STORIES

- **Primary User Story:** "As a player, I want to survey a burned valley through a season of regrowth, so that the quiet work of watching a forest heal carries the story."
- **Secondary User Story:** "As a narrative gamer, I want the valley's human past to surface through physical evidence in my survey plots, so that the mystery and the ecology are the same exploration."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The survey | First-person low-poly burned valley: hike to plot markers, identify regrowth species from a field key, photograph plots, and mark findings on a quadrant map that fills in over the season. | Day 1 PoC |
| Core Mechanism: The uncovered | Artifacts found in plots (foundation stones, objects, the wrong firebreak), the previous lookout's notebook pages, and radio conversations with your supervisor that get harder as you find more. | Day 1 PoC |
| Expansion 1: The full season | A 10-chapter arc from first green to first snow, dynamic regrowth on visited plots, a complete historical reconstruction of the valley's homesteads, and multiple resolutions for what you report. | Month 1 MVP |
| Expansion 2: The living valley | Real succession logic (species order by soil and aspect), a herbarium of pressed specimens, fire-behavior storytelling from burn scars, seasonal photo comparisons, and a quiet epilogue revisiting the valley years later. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS, Three.js. One valley area with 6 survey plots at two season states, a field-key identification minigame, an artifact viewer and notebook reader, scripted radio dialogue. All content local.
- **Core 24-Hour Demo Flow:** Survey plot 3, key out the first fireweed, and trip over a foundation stone that isn't on any map - then find the notebook page where the last lookout wrote "they told me to skip plot 3". Radio your supervisor; she pauses too long. **Aha moment:** the survey map you've been dutifully filling is also the mystery's evidence board - your job and the investigation were always the same walk.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** Open on the ridge at dawn over a blackened valley with one line of green along the creek, and the radio asking for your first plot report.
- **Growth Vector:** The recovery theme is resonant and hopeful in a way pure mystery games aren't; burn-scar photography and regrowth time-lapses are visually distinctive, and the nature-audience crossover (hikers, ecology readers) is wide.

#### 6. RISKS & MITIGATION

- **Firewatch adjacency:** A lookout in a burned forest invites direct comparison. Mitigation: invert the premise (recovery, not watch), make the survey work and ecology the actual mechanics, and never touch Firewatch's plot, characters or Wyoming setting.
- **Ecological accuracy:** Succession shown wrong will alienate exactly the nature audience. Mitigation: species and succession order drawn from standard fire-ecology knowledge, kept general (an invented mountain region), with a field key that teaches real identification logic.
- **Tone:** Fire is trauma for real communities. Mitigation: the fire is historical and the register is recovery and truth-telling, not disaster spectacle; no on-screen fire, no real-event parallels.
- **Walking-sim pacing:** Too quiet loses players. Mitigation: each plot guarantees one find (ecological or human), the notebook pages dole story on a schedule, and the season's visible transformation provides constant forward motion.
