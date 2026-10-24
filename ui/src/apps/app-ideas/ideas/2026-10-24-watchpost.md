---
name: Watchpost
tagline: Point at Any Corner of the Web, Get Told the Moment It Moves
pitch: A visual change monitor: mark the exact region of any page you care about, and keep a browsable timeline gallery of every change it ever spots.
domains: [PROD, MEDIA]
created: 2026-10-24T03:11:26Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Change detection tools email you noisy diffs; Watchpost treats watching as curation. You point at the exact thing that matters - the price block on a product page, the lineup grid of a festival, the "back in stock" badge, a rival's changelog - by clicking a region on a snapshot, never by writing a selector. Each watch becomes a card on a calm dashboard, and every detected change is stored as a framed before/after pair in a personal "museum of changes" you can scrub through. The gallery framing makes the history the product: not just "it changed", but the full story of how it evolved over months. Watches have lifecycles: arm, snooze, retire with a final summary ("watched 4 months, caught 11 changes").
- **Core Problem & Target User:** People re-check pages manually - restocks, prices, concert dates, permit portals, competitor pages - because alerts are either nonexistent or too noisy to trust. Target user: deal hunters, fans waiting on announcements, freelancers watching client or competitor sites, and anyone burned by a sold-out drop.
- **Core Value Proposition:** Precise, quiet watching: only the region you marked, only real changes, with a beautiful browsable history of everything it caught.

#### 2. USER STORIES

- **Primary User Story:** "As a watcher, I want to mark the exact region of a page and be alerted only when that region changes, so that I can stop refreshing."
- **Secondary User Story:** "As a longtime user, I want a timeline gallery of every change my watches caught, so that I can see how a page evolved, not just its current state."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The watch | Create a watch from a pasted URL plus a picked region (PoC: choose from pre-rendered page segments); visual diff detection with an ignore-jitter threshold; armed/snoozed/retired lifecycle states. | Day 1 PoC |
| Core Mechanism: The museum | Every detected change stored as a before/after pair with timestamp; scrub-able timeline per watch, highlight the changed pixels, one-tap share image of a catch. | Day 1 PoC |
| Expansion 1: Real fetching | A scheduled server fetcher with per-site politeness (robots.txt respect, long default intervals), headless rendering for JS pages, text-mode and image-mode diffing, email and push alerts. | Month 1 MVP |
| Expansion 2: Smarter watching | Semantic summaries of what changed ("price dropped 15%"), condition alerts ("only tell me if below 80"), watch templates (restock, price, lineup, changelog), and shared watch collections. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. PoC simulates the fetcher with a bundled set of page snapshots across fake dates (a festival lineup evolving, a price dropping), so the full watch-and-museum loop is demoable offline; diffing runs client-side on the bundled images.
- **Core 24-Hour Demo Flow:** Create a watch on the festival lineup grid, scrub the museum timeline to March, and watch a headliner name flip from "TBA" to the real act with the changed pixels glowing. **Aha moment:** the museum timeline - seeing six months of a page's life as a filmstrip makes the history feel like the point, not the alert.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** "Paste a URL, click the thing you keep checking" - the first watch takes thirty seconds, and the demo museum shows what it would have caught already.
- **Growth Vector:** Catch screenshots are inherently shareable ("it finally dropped"), and every drop culture, fan community and deal forum is a pocket of people manually refreshing right now.

#### 6. RISKS & MITIGATION

- **Site terms and politeness:** Automated fetching must respect sites. Mitigation: robots.txt honored, long default intervals with per-site rate caps, a clear user-agent with contact info, personal-use framing, and a blocklist process for sites that object.
- **False alarms:** A/B tests, ads and timestamps create noise. Mitigation: region-scoped watching, jitter threshold tuned per watch, "ignore this kind of change" feedback, and semantic filters in Expansion 2.
- **Fragile region matching:** Pages reflow, so a pixel region can drift. Mitigation: anchor regions to stable structural landmarks, show the user what the watch currently sees, and flag watches whose anchor has drifted for one-tap re-aiming.
- **Content rights in the museum:** Stored snapshots are others' content. Mitigation: snapshots kept private to the watch owner, short retention by default, and no public republishing of captured pages.
