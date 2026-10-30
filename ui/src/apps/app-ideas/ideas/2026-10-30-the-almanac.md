---
name: The Almanac
tagline: First Frost, First Swim, First Ripe Tomato - Keep the Year's Firsts, Compare the Years
pitch: Log the seasonal firsts of your year in a personal almanac and build multi-year comparison tables that turn your life into phenology.
domains: [HIST, LEARN]
created: 2026-10-30T06:02:52Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Old almanacs were the household's record of the turning year: planting dates, first frosts, fairs, tides. The Almanac revives the form for one modern life. You define the markers that matter to you (first frost on the windshield, first outdoor swim, first ripe tomato, first evening light enough to walk after dinner, first day the café puts chairs outside) and log each one's arrival with a date and one line. The app keeps them in a handsome almanac page per year, and its real magic is the comparison table: the same marker across every year you have logged, dates side by side, drifting earlier or later - your personal phenology record, the same data naturalists use to read a changing climate, kept at the scale of one household.
- **Core Problem & Target User:** Seasons blur; nobody remembers whether spring came early, and the feeling that the years are shifting stays anecdotal because nobody writes the markers down. Target user: gardeners, swimmers, walkers, parents marking seasons for kids, and anyone who suspects their own life is the most interesting long dataset they will ever touch.
- **Core Value Proposition:** Ten seconds per marker, a few dozen entries a year, and after two years you own something no app can synthesize: a dated, personal, multi-year record of how your seasons actually move.

#### 2. USER STORIES

- **Primary User Story:** "As a keeper of the year, I want to log my seasonal firsts with a date and one line, so that the turning of my year is recorded instead of vaguely remembered."
- **Secondary User Story:** "As a multi-year keeper, I want each marker compared across years side by side, so that I can see my seasons drift with real dates instead of impressions."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The marker book | Define custom seasonal markers; log each one's arrival with a date and one line; the year's page fills in almanac typography as markers land. | Day 1 PoC |
| Core Mechanism: The years table | Once a second year exists, each marker shows its dates side by side with the drift in days, earlier or later. | Day 1 PoC |
| Expansion 1: The full almanac | Season divider pages, photo per marker, gentle expected-window hints ("first frost usually lands for you in late October"), and a year-in-review page each December. | Month 1 MVP |
| Expansion 2: The long record | Decade view with trend lines per marker, print-ready almanac export per year, and optional shared household markers logged by more than one person. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. Marker creation, a quick-log flow (pick marker, date defaults to today, one line), the year page in almanac styling, and the years-comparison table computed from your entries. localStorage only; no backend, no accounts, no location required. Mobile-first, since markers get logged standing outside.
- **Core 24-Hour Demo Flow:** Open to a sample almanac: two years of one household's markers. Scan the years table and see "first swim: May 28, then May 11 - seventeen days earlier." Then create your own marker ("first morning I need the coat") and log it. The "Aha!" moment: the sample comparison table - proof that ten-second entries become real data faster than you would think.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** The two-year sample shows the payoff of a habit that has not happened yet, and logging a first marker takes ten seconds.
- **Growth Vector:** The December year page is a natural share and ritual ("our year in firsts"), gardeners and swimmers recruit each other, and every passing year makes the record harder to abandon.

#### 6. RISKS & MITIGATION

- **Engagement risk:** The payoff is inherently delayed; year one has no comparisons. Mitigation: the sample almanac demonstrates the end state, the year page is handsome from the first entry, and expected-window hints give year one its own value.
- **Data risk:** Entries are sparse but precious; losing a year defeats the purpose. Mitigation: local-first with a plain-text export available from day one, so the record is never trapped.
- **Tone risk:** The app could read as quaint nostalgia. Mitigation: the framing is observational and scientific (your household's phenology), with the warmth in the typography rather than in the copy.
