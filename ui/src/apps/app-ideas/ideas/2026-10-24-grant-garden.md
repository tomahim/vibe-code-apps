---
name: Grant Garden
tagline: Every App You Ever Said Yes To, Pruned Like a Garden
pitch: An audit of your OAuth grants and connected apps across Google, GitHub and more, scored by blast radius, with a quarterly pruning ritual.
domains: [PROD, GAME]
created: 2026-10-24T02:51:29Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Over the years everyone accumulates dozens of "Sign in with..." grants, trial apps, and authorized integrations, and each one is a standing key into email, files or repos. Grant Garden renders that invisible sprawl as a garden: every connected app is a plant whose size is its blast radius (mail access is a tree, calendar-read is a shrub), and whose freshness shows when you last actually used it. Overgrown, untouched plants practically ask to be pruned. The tool groups grants by provider, scores each on what it can reach, and turns cleanup into a satisfying ritual: a quarterly "pruning day" where you walk the garden, revoke the dead wood through deep links to each provider's revocation page, and watch the garden get visibly healthier. A "what changed" diff between visits flags anything new that appeared since last time.
- **Core Problem & Target User:** OAuth grants are write-once, forget-forever; people have no inventory of who can access their accounts, and revocation pages are buried per provider. Target user: privacy-conscious professionals, developers with years of tool trials, and anyone who has clicked "Allow" on a Friday afternoon experiment.
- **Core Value Proposition:** One honest inventory of every door into your accounts, scored by what is actually at stake, with the cleanup made into a ritual you will keep.

#### 2. USER STORIES

- **Primary User Story:** "As an account holder, I want one view of every third-party grant across my providers with a plain-language risk score, so that I know exactly who can reach my data."
- **Secondary User Story:** "As a returning user, I want a diff of what changed since my last visit and a pruning checklist, so that keeping my accounts tidy takes fifteen minutes a quarter."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The garden | Import a manually exported grant list (per-provider instructions with screenshots); each app rendered as a plant sized by scope severity, with plain-language scope translations ("read and send mail as you"). | Day 1 PoC |
| Core Mechanism: The pruning ritual | A guided walk of the stalest and largest grants, deep links to each provider's revocation page, a satisfying prune animation, and a health score that rises as dead wood goes. | Day 1 PoC |
| Expansion 1: Live connection | Direct OAuth connection to providers (read-only scopes) for automatic inventory, real last-used hints where the provider exposes them, and a saved baseline so the what-changed diff is automatic. | Month 1 MVP |
| Expansion 2: Watchtower | Quarterly email reminders for pruning day, instant alert when a new grant appears, team edition for company Google workspaces, and a browser-extension audit using the same plant model. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. Users paste or upload the grant list copied from provider pages (the PoC ships with a realistic 24-app sample garden); scoring is a local rules table mapping scope strings to severity. All state in localStorage, nothing leaves the browser.
- **Core 24-Hour Demo Flow:** Open the sample garden: a huge neglected "tree" turns out to be a 2019 quiz app holding full Gmail access. Tap it, read "can read and send mail as you - last used 6 years ago", follow the revoke link, and watch the garden health score climb from 54 to 71. **Aha moment:** the scariest grant on the list is one the user completely forgot, and it takes ninety seconds to kill.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** "You have given out more keys than you think. See your garden in one minute" - with the sample garden making the point before any signup.
- **Growth Vector:** Pruning-day screenshots (before/after health score) are naturally shareable, and every provider breach headline sends people looking for exactly this inventory.

#### 6. RISKS & MITIGATION

- **Scope translation accuracy:** Plain-language risk labels must not understate what a scope allows. Mitigation: conservative scoring (when unsure, score higher), verbatim scope strings shown alongside the translation, and per-provider source links.
- **Revocation is external:** The actual revoke happens on provider pages. Mitigation: deep-link directly to the correct settings screen per provider, mark which grants must be removed elsewhere (installed apps, browser extensions), and never promise one-click cleanup the providers do not offer.
- **Sensitive inventory:** A grant list is itself a map of someone's accounts. Mitigation: local-only storage in the PoC, encrypted storage later, export and delete controls, and no analytics on provider or app names.
- **Read-only live access paradox:** Connecting via OAuth adds one more grant to the garden. Mitigation: use the minimal read-only scope set, say so plainly in the UI, and always keep the manual-import path as a first-class option.
