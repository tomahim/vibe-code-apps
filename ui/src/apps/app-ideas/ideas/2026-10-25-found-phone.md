---
name: Found Phone
tagline: A Story Told Through Someone Else's Phone - Read the Thread, Find the Truth
pitch: Short fiction experienced inside a found phone: scroll messages, photos and notes left by a stranger, and piece together what happened from what they typed and what they didn't.
domains: [WRITE, MEDIA]
created: 2026-10-25T06:04:13Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Epistolary novels worked with letters; the modern equivalent is the phone. Each Found Phone story drops you into a stranger's device: a thread with an argument frozen mid-sentence, a photo roll with a gap where a weekend should be, a notes app with one entry edited forty times, drafts never sent. There is no narrator. The story is entirely in artifacts - and crucially in absences, because people reveal themselves in what they deleted, reworded, and left on read. You scroll, tap and infer; the app tracks nothing and grades nothing, but each story ends with a quiet question ("what happened to Mara?") and the option to read the author's own reading - which is presented as one interpretation, never the answer. Stories are short (twenty minutes), written by strong writers, and formatted as a phone that feels real enough to make scrolling someone else's messages feel slightly transgressive.
- **Core Problem & Target User:** Short fiction struggles on screens because it imitates print; meanwhile the genuinely native form - the story told in messages, photos and app traces - has no curated home. Target user: readers who love literary podcasts and short story collections, fans of narrative games who want story without mechanics, and writers curious about the form.
- **Core Value Proposition:** Reading as archaeology: twenty-minute stories excavated from a phone's artifacts, where your own inference is the plot and ambiguity is the point.

#### 2. USER STORIES

- **Primary User Story:** "As a reader, I want to explore a stranger's phone - messages, photos, notes - and piece together the story myself, so that reading feels like discovery."
- **Secondary User Story:** "As a writer, I want to read author annotations on how a story was built from artifacts, so that I learn the craft of this form."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The phone | A convincing phone interface (messages, photo roll, notes, drafts) presenting one complete short story as explorable artifacts, with realistic timestamps and read states. | Day 1 PoC |
| Core Mechanism: The ending | A closing question, space to sit with your own interpretation, then the author's reading clearly framed as one take - plus a craft annotation showing how key artifacts were designed. | Day 1 PoC |
| Expansion 1: A shelf | 6-10 stories across tones (a breakup, a disappearance, a reconciliation, a small kindness), a bookmark that saves your scroll position per app, and story recommendations by mood. | Month 1 MVP |
| Expansion 2: The form opens | A submission program with editorial standards, a writer's toolkit (artifact templates, timeline checker), audio mode where messages are voiced, and classroom editions with discussion guides. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. One complete story ("The Apartment") as authored content: a messages thread tree, 12 photos, 5 notes, 2 drafts; the phone chrome and app screens styled with obsessive fidelity to feel real, clearly framed as fiction on entry. No backend.
- **Core 24-Hour Demo Flow:** Open the phone, read the last visible thread - an argument about the deposit that stops mid-sentence on March 3. The photo roll shows the apartment emptied March 2. The notes app has a draft message rewritten over two weeks, never sent. **Aha moment:** the unsent draft - you realize the argument's last word was never delivered, and the whole story inverts without a single line of narration.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** "This phone was found on a train. Read it." - one line, the lock screen, and you're already scrolling.
- **Growth Vector:** The form is built for sharing ("you have to read this phone"), each story is a complete evening-sized experience, and the writer angle (craft annotations, submissions) recruits the people who make the content.

#### 6. RISKS & MITIGATION

- **The transgressive frame:** Reading a "found phone" must never mimic real violation. Mitigation: every story is explicitly fiction on entry, no real people's data is ever shown or mimicked from life, and the interface is stylized enough to read as a story object, not a hacked device.
- **Ambiguity as frustration:** Some readers want answers. Mitigation: stories are constructed so the artifacts genuinely support the main readings, the author's take is offered as one interpretation (clearly labeled), and the shelf includes tighter mysteries alongside open ones.
- **Content quality is everything:** The form dies on weak writing. Mitigation: a small shelf of excellent stories over a large thin one, editorial review for every piece, and no generated stories - this is a writers' form.
- **Interface imitation risk:** Copying a specific phone OS too closely raises trademark and platform issues. Mitigation: the interface is an original, generic phone design inspired by the category, not a clone of any manufacturer's UI.
