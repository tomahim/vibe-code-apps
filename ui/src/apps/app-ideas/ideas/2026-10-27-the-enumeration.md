---
name: The Enumeration
tagline: A Census of One Household, Kept in a Ledger That Ages Like 1901
pitch: Answer one census-style question about your life each day and watch the answers fill a beautifully aged enumeration ledger you can compare across the years.
domains: [HIST, PROD]
created: 2026-10-27T06:02:47Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Historical censuses are how we know anything about ordinary life a century ago: one enumerator, one ledger, one line per household. The Enumeration makes you the enumerator of your own household. Each day it asks a single census-style question (occupation, rooms occupied, languages spoken at home, distance traveled to work, books in the house), and your answer is inscribed into a ledger page rendered as an aging enumeration form: ruled lines, ink handwriting, a stamped district mark. Return next year and the same schedule of questions is asked again, with your previous answers shown beside the new ones, the way historians compare census years.
- **Core Problem & Target User:** Journaling fails because the blank page asks too much, and quantified-self apps count everything except the texture of a life. Nobody records the ordinary facts (rent, commute, who lives here) that are exactly what makes old records fascinating. Target user: people who love historical documents and family archives and suspect their own ordinary Tuesday would be riveting in fifty years.
- **Core Value Proposition:** One question a day, zero blank-page dread, and the answers accrue into a document with real archival gravity: your household's census, taken by you, comparable across your own decades.

#### 2. USER STORIES

- **Primary User Story:** "As a keeper of my own record, I want one small census question a day inscribed into a period ledger, so that the ordinary facts of my life are preserved without the effort of journaling."
- **Secondary User Story:** "As a returning enumerator, I want to re-answer last year's schedule beside my old answers, so that I can see what changed in my household the way a historian compares census years."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The daily schedule | One census-style question per day from a rotating schedule; the answer is inscribed onto the current ledger page with period typography, ink styling and a district stamp. | Day 1 PoC |
| Core Mechanism: The bound volume | Completed ledger pages file into a browsable volume; every page looks and ages like a scanned enumeration form. | Day 1 PoC |
| Expansion 1: The re-enumeration | Annual re-asking of the same schedule with old answers beside new, a "changes since last census" summary page, and household profiles (who lived here, in which years). | Month 1 MVP |
| Expansion 2: The archive | Export the volume as a print-ready PDF in scanned-document style, custom questions added to the schedule, and a century view that projects your answers onto a timeline. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. A ledger-page component (ruled lines, hand-style font, ink color, stamp graphic) and a schedule of about thirty built-in questions, one dealt per day. A form for today's answer plus the volume browser. localStorage only; no backend, no accounts. Mobile-friendly for the daily question.
- **Core 24-Hour Demo Flow:** Open the app and the enumerator's card asks today's single question: "How many rooms does your household occupy?" Answer, and watch the ink write itself onto the ledger line. Flip back through the preloaded sample volume (a week of one household's answers, aged to look a century old) and feel the document's weight. The "Aha!" moment: realizing this trivial answer just became a historical record.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** One question, one line, thirty seconds a day - the lightest possible journaling commitment, with a sample volume showing the payoff immediately.
- **Growth Vector:** The annual re-enumeration is a built-in retention loop with genuine emotional pull ("see what changed"), and the aged-ledger export is the kind of artifact people print and keep.

#### 6. RISKS & MITIGATION

- **Privacy risk:** Household facts (address, occupants, income-adjacent details) are sensitive. Mitigation: local-only storage in the PoC, no account or sync until deliberately designed, and export stays user-initiated.
- **Engagement risk:** Even one question a day can fade. Mitigation: the schedule rotates through varied themes so no two consecutive days feel alike, and missing a day simply leaves a blank line, which ledgers have always had.
- **Tone risk:** Larping history could tip into kitsch. Mitigation: the period styling stays restrained and documentary, and the questions stay genuinely informative rather than whimsical.
