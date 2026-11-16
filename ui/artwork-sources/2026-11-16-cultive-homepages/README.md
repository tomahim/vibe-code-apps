# Cultive homepage motion studies

Ten alternative homepage directions are in `src/artifacts/2026-11-16-cultive-living-homepages.html`.
They share the same six-step product story while changing composition, typography,
framing and transition treatment. The Nerdsip homepage was a structural reference,
not a source of product claims, ratings, pricing or testimonials.

The four local WebPs are presentation copies of supplied Biology and Art paintings,
in dormant/lush pairs. Warm, edge-connected paper was removed from their backdrops;
clouds and terrain were retained. Both stage pairs keep their source dimensions.
Other islands reuse existing transparent gallery assets rather than duplicating them.
Only active-concept artwork is inserted into the page. There is no external runtime
library, remote font, analytics, backend, data model or new infrastructure.

## Demo boundaries

- Every email field is a local preview. No email address is sent or saved.
- The five navigation destinations are explicit placeholder pages, including Pricing.
- Courses, cards and badges are illustrative design content, not current UI screenshots.
- The example oxygen lesson/quiz follows NASA Astrobiology's 2018 article:
  https://astrobiology.nasa.gov/news/revisiting-earths-oxygenation-24-billion-years-ago/
- A scroll-driven progression tells the complete story, with six direct stage controls
  for keyboard users and for reduced-motion settings.

## Verification

`npx playwright test tests/browser/cultive-homepage-motion.spec.js`

Covers the real sandboxed gallery iframe, all ten first-screen email fields at five
viewport sizes, all fifty placeholder routes, sixty manual scene checks, sixty real
scroll positions, reduced motion, keyboard concept navigation, the local signup
feedback and the playable quiz. Pixel review includes each hero and every workflow
stage on phone, plus desktop/landscape checks. `npm test` and `npm run build` also apply.
