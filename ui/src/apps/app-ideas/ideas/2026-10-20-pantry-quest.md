---
name: Pantry Quest
tagline: Plan Dinners From What You Already Own and Learn One Technique a Week
pitch: Tick what is in your fridge and get three dinner routes for the week, each ending in a technique badge.
domains: [PROD, LEARN]
created: 2026-10-20T17:35:18Z
rating: 1
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Meal planning as a quest map instead of a recipe feed. You tick what is in your fridge and pantry, and the app lays out three dinner "routes" for the week, each ending in a small technique badge (deglaze, emulsify, quick-pickle). Cooking a route unlocks the badge and a one-line explanation of why it works, so dinners double as atomic culinary learning.
- **Core Problem & Target User:** Families with tight evenings waste food and mental load deciding what to cook. Recipe apps assume you shop first. Target user: a busy household that wants fewer decisions and slow, painless skill growth.
- **Core Value Proposition:** Open the fridge, get tonight's plan in 20 seconds, and get a bit better at cooking each week.

#### 2. USER STORIES

- **Primary User Story:** "As a busy parent, I want dinner routes based on what I already have, so that I waste less food and decide faster."
- **Secondary User Story:** "As a casual cook, I want one technique per week explained simply, so that I improve without taking a course."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: Fridge to routes | Checklist of about 60 common ingredients, 25 authored recipe routes with technique badges, a matcher that ranks by owned ingredients, and a three-route quest view. | Day 1 PoC |
| Expansion 1: Week plan and shopping gap | Seven-day plan board, auto list of missing items, expiry nudges, family tastes (who dislikes what), badge shelf, local storage. | Month 1 MVP |
| Expansion 2: Household sync | Shared household link by static JSON export, import of own recipes from markdown, seasonal produce, leftover remix routes, printable week card. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. Recipes and ingredients as JSON. Pure matching function (overlap score with a bonus for expiring items). localStorage for pantry and badges. No backend or accounts.
- **Core 24-Hour Demo Flow:** Tick six ingredients, see three dinner routes ranked, tap one, and get the steps with a technique badge. **Aha moment:** under 30 seconds you have a dinner that needs zero shopping.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** A "common staples" preset ticks the usual items in one tap.
- **Growth Vector:** Printable or shareable weekly route cards for the household and friends.

#### 6. RISKS & MITIGATION

- **Scope Creep:** Nutrition and grocery integrations are a trap. Mitigation: no nutrition and no store APIs in the PoC.
- **Technical:** Ingredient naming mismatches. Mitigation: a fixed ingredient list with synonyms.
- **Retention/Engagement:** Pantry upkeep is chore-like. Mitigation: quick check-in after shopping only and routes that work with few items.
