---
name: What It Cost
tagline: A Chicken in 1350, a Radio in 1930 - What Things Actually Cost in the Money of Their Time
pitch: Explore historical prices and wages translated into what they meant - hours of work, shares of income - so the past's economy becomes feelable.
domains: [HIST, LEARN]
created: 2026-10-26T06:02:49Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** "A loaf cost a penny" tells you nothing; "a loaf cost two hours of a laborer's day" tells you everything. What It Cost is an explorer of historical prices and wages that translates every number into human units: hours of work at the local wage, days of a household budget, comparisons to other goods of the era. Browse by era and place (medieval England, Edo Japan, 1930s America, Belle Epoque France) or ask the reverse question: "I earn X - what could my wages buy in 1700?" Each entry is sourced from scholarship and price records, shown with its honest uncertainty (prices varied by region, season and decade), and collections tell stories: the cost of a university education across six centuries, what a dowry meant, why spices were worth guarding, how the price of light collapsed from candles to LEDs. The signature view is the Work Clock: for any item, a clock face showing how long an ordinary person of that era labored to afford it, beside your own.
- **Core Problem & Target User:** Historical numbers float free of meaning: a shilling, a livre, a guilder - readers of history and historical fiction constantly hit prices and wages they cannot feel. Target user: history readers, fiction writers needing period-economic texture, teachers, and everyone who has wondered "but was that a lot?"
- **Core Value Proposition:** Purchasing power made visceral: every historical price translated into work and life, sourced and honest about uncertainty, so the economy of the past stops being trivia and starts being felt.

#### 2. USER STORIES

- **Primary User Story:** "As a history reader, I want any historical price translated into hours of contemporary wages and budget context, so that I can feel what it actually meant."
- **Secondary User Story:** "As a writer, I want era-accurate economic texture - prices, wages, what a gift or debt implied - with sources, so that my period details ring true."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The explorer | A browsable collection of sourced prices and wages for two eras (medieval England and 1930s America), every entry translated into work-hours and budget share with its uncertainty range and citation. | Day 1 PoC |
| Core Mechanism: The Work Clock | For any item, a clock visualization of labor-time-to-afford for that era's ordinary worker beside a modern equivalent, plus reverse mode ("your salary in 1700"). | Day 1 PoC |
| Expansion 1: More economies | Edo Japan, Belle Epoque France, the early modern Ottoman world, Roman antiquity; themed collections (education, dowries, light, spice, books); unit converters for period currencies with clear methodology notes. | Month 1 MVP |
| Expansion 2: Deep context | Price time-series across centuries where records allow, region and season variance sliders, classroom worksheets, a writer's workspace for building a period budget sheet, and community-submitted sources under editorial review. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. A curated dataset (60-80 entries across two eras) as typed content with per-entry source, uncertainty and methodology; the explorer, Work Clock and reverse mode all client-side.
- **Core 24-Hour Demo Flow:** Look up a university education in 1350: the Work Clock shows years of a craftsman's labor beside your modern equivalent in months - then the collection reveals books cost more than the tuition. **Aha moment:** the candle-to-LED collection: the price of one hour of light across six centuries collapses before your eyes, and "the past was dark" stops being a metaphor.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** "Was a chicken expensive in 1350?" - one question answered in work-hours on the landing page, with the Work Clock doing the persuading.
- **Growth Vector:** Every historical novel, period drama and history podcast generates the "but was that a lot?" question at scale; the comparisons are screenshot-native, and teachers get ready-made hooks for economic history.

#### 6. RISKS & MITIGATION

- **False precision:** Historical prices are slippery (region, season, quality, source bias). Mitigation: every entry carries an uncertainty range, a source and a methodology note, conversions are shown as ranges not points, and the app teaches the caveat as part of the fun.
- **Cherry-picked comparisons:** Modern equivalents can mislead (a 1930 radio is not a 2025 radio). Mitigation: comparisons come in multiple frames (work-hours, budget share, capability-equivalent) and the app shows its reasoning rather than one magic number.
- **Source licensing:** Price datasets come from scholarship. Mitigation: entries cite published sources, data is curated at fact level with attribution, no wholesale copying of any single dataset, and links point readers to the underlying books and papers.
- **Scope explosion:** Every era begs inclusion. Mitigation: eras ship only when a defensible source base exists (60+ entries minimum), and the collection format lets depth beat breadth.
