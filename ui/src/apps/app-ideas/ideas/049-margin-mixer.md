---
name: Margin Mixer
tagline: Turn Two Saved Ideas Into One Original Thought
domains: [MEDIA, WRITE, LEARN]
created: 2026-10-20T07:51:06Z
issue: 49
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Reimagine the bookmark manager as a tiny writing mixing desk. Put two saved ideas into adjacent channels, choose a relationship such as “contradicts,” “extends,” or “applies to,” and write the missing bridge. The result becomes a short, source-linked essay rather than another unread item.
- **Core Problem & Target User:** Curious readers and occasional bloggers collect useful material but struggle to turn consumption into a point of view.
- **Core Value Proposition:** Leave a five-minute session with an original paragraph grounded in two things you read.
- **Signature Interaction:** Click “Mix” after writing a bridge sentence; the two source cards fold into a clean essay preview with numbered references.
- **Example Session:** Pair a note about urban shortcuts with one about software workarounds, choose “reveals the same pattern,” and explain what both suggest about how people adapt systems.

#### 2. USER STORIES

- **Primary User Story:** "As a reader with a growing bookmark collection, I want to connect two saved ideas through a writing prompt, so that I produce something useful from what I consume."
- **Secondary User Story:** "As an occasional blogger, I want to export my paragraph with its source links, so that I can expand it into a post without losing provenance."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Instant sample desk | Load four clearly labeled, original sample notes; let the user replace them with a title, URL, and manually entered takeaway. | Day 1 PoC |
| Two-channel selection | Select any two notes and one of four authored relationship prompts. No automatic similarity ranking is needed. | Day 1 PoC |
| Bridge editor | Write a bridge sentence plus an optional example in a compact editor with a suggested 80–180-word target. | Day 1 PoC |
| Mix and export | Render the user's text as an essay preview with two references; copy Markdown or download it, and save the session locally. | Day 1 PoC |
| Personal note pantry | Add tags, search, an “already mixed” history, and JSON import/export. Keep notes and essays in IndexedDB. | Month 1 |
| Productive collisions | Suggest unused note pairs using tag overlap and deliberate differences; add contradiction and analogy templates with transparent selection reasons. | Month 2 |
| Essay trails | Let users chain several mixes into an outline, revisit claims, and assemble a small Markdown publication collection. Add optional AI critique only if user testing identifies a concrete need. | Month 3 |

**One-day build budget:** 1 hour for fixtures and model; 2 hours for the selection desk; 2 hours for editor and preview; 1 hour for export and persistence; 2 hours for usability checks and deployment.

**Day 1 exclusions:** URL scraping, browser extensions, automatic summaries, AI text generation, accounts, publishing integrations, and a knowledge graph.

#### 4. SOLO DEVELOPER ARCHITECTURE

- **Suggested stack:** React, TypeScript, Vite, Tailwind CSS, CSS transitions, and localStorage; static deployment.
- **Core model:** SourceNote, RelationshipPrompt, MixDraft, and EssaySnapshot. A saved essay keeps a snapshot of its source notes so later edits do not silently change its evidence.
- **Content handling:** Users supply takeaways and URLs directly. The PoC does not need external APIs, scraping permissions, or an API key.
- **Export rule:** Preserve the user's wording and distinguish their interpretation from source notes. A reference establishes provenance, not automatic proof of the new claim.
- **Engagement loop:** Save a takeaway → connect it to another → write a bridge → export a finished thought.

#### 5. DAY 1 ACCEPTANCE CRITERIA

- [ ] A new visitor can mix two sample notes immediately without registration.
- [ ] The same note cannot occupy both channels.
- [ ] Users can edit their bridge and example before and after preview.
- [ ] Export includes the exact written text and both source titles and links.
- [ ] A saved essay retains its source snapshots when the original notes change.
- [ ] Refresh restores the latest draft; reset requires an explicit user action.
- [ ] All controls support keyboard use, and reduced motion removes the folding animation.

#### 6. VALIDATION & SUCCESS SIGNAL

Test with five people who save articles regularly. Target: four produce a paragraph unaided within five minutes, and three judge it worth keeping or expanding. Ask whether the relationship prompt helped them form a new thought; a high number of saved notes alone is not the success metric.

**Duplicate check:** Reviewed the open issues on 2026-10-20, including #46–#48. This concept centers on source-based writing and synthesis, distinct from household allocation, chronology puzzles, and sports forecasting.
