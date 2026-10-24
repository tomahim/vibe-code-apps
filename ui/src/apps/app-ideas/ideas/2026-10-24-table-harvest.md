---
name: Table Harvest
tagline: Show It Two Rows, Get the Whole Table - Any Listing Page Into a Spreadsheet
pitch: A teach-by-example scraper: highlight two example rows on any listing page and it learns the pattern, then harvests the whole site into clean CSV or Sheets.
domains: [PROD, LEARN]
created: 2026-10-24T03:11:44Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Scraping is a superpower locked behind code. Table Harvest makes it teaching instead: open a listing page - apartments, job posts, conference talks, vintage cameras - and highlight two example rows, tapping the fields you want ("this is the title, this is the price"). The tool infers the repeating pattern, previews the first twenty rows it understood, and walks pagination with you ("the next button looks like this, yes?"). The magic moment is the preview table filling up from your two examples. Harvests are saved as recipes you can re-run next month, and the app is honest about what it can't read: fields it isn't sure about come flagged with confidence shading, cell by cell.
- **Core Problem & Target User:** Researchers, journalists, job hunters and small-shop owners constantly copy-paste from listing pages into spreadsheets; existing scrapers demand either code or fragile template builders. Target user: the spreadsheet person who knows exactly which columns they want and has no interest in XPath.
- **Core Value Proposition:** From page to clean table in two examples, with per-cell confidence so you always know what to double-check.

#### 2. USER STORIES

- **Primary User Story:** "As a researcher, I want to teach the tool a listing pattern by highlighting two rows, so that I get the whole table without writing code."
- **Secondary User Story:** "As a recurring user, I want to save the harvest as a re-runnable recipe with change detection between runs, so that monthly updates are one click."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: Teach by example | Load a bundled demo page; highlight two rows and name the fields; the pattern inference previews a live table with per-cell confidence shading and row count. | Day 1 PoC |
| Core Mechanism: The harvest | Export to CSV, a clean preview grid with sort and filter, field renaming and type cleanup (dates, prices), and a saved-recipe library. | Day 1 PoC |
| Expansion 1: Real pages and pagination | A polite server fetcher (robots.txt respect, rate caps), multi-page crawling via detected next links, JavaScript-rendered pages, and Google Sheets export. | Month 1 MVP |
| Expansion 2: Recipes that last | Self-healing recipes that adapt when a site's layout shifts, scheduled re-harvests with row-level diffs ("12 new listings since last run"), and a shared recipe gallery for common sites. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. The PoC ships two bundled demo sites (an apartment listing and a conference schedule) rendered locally; pattern inference is a DOM-similarity algorithm over the bundled pages; all processing client-side.
- **Core 24-Hour Demo Flow:** On the apartment page, highlight two listings, tap title and price in each, and watch a 48-row table fill with green confidence shading - except three cells flagged amber where the pattern was ambiguous. Fix one by tapping, export CSV. **Aha moment:** the preview filling from just two examples, and the honest amber cells that admit what needs a second look.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** The landing page is the demo: two highlights, one full table, thirty seconds. Anyone who has ever copy-pasted rows feels the time return.
- **Growth Vector:** Recipes are shareable ("here's the harvest for that conference site"), and every research community has a canonical painful listing page someone will want solved first.

#### 6. RISKS & MITIGATION

- **Site terms and load:** Harvesting must stay respectful. Mitigation: robots.txt honored, rate caps with long defaults, personal-research framing, no credential-gated content, and clear guidance that site terms apply.
- **Pattern brittleness:** Real sites have irregular rows (ads, featured items). Mitigation: confidence shading exposes weak cells, outlier rows are quarantined rather than dropped silently, and two-example teaching can be extended with a third corrective example.
- **Data quality overreach:** Scraped data looks cleaner than it is. Mitigation: types are shown as inferred, original text is always one click away per cell, and exports carry a harvest timestamp and source URL per run.
- **Anti-bot walls:** Some sites block fetching outright. Mitigation: be upfront that heavily protected sites are out of scope, keep the teach-by-example UI working on user-saved pages, and never offer bypass techniques.
