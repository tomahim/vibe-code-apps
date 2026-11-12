---
id: a48fe4b9-c5bd-45b2-a7c6-3307cc68e2bf
position: 6
title: Match the component to the weakness
archived: false
image: l3-match-component-to-weakness.png
image_alt: "Five observed weaknesses each pointing to the lightest fix: ordinary sequencing advice to concise prose, a recurring workflow to a skill, mechanical repetition to a script, a tool error to a bounded fallback, and a rule ignored repeatedly to a defensive plugin as last resort."
image_caption: "The smallest effective change wins."
image_license: original
---


The paper's editor prompt is a practical field guide. Tool error? Distinguish bad input from timeout or missing capability, and give one bounded fallback with a stop condition, never blind repetition. Mechanical repetition of extraction or checking? A script. A narrow multi-step workflow that recurs? A skill with its trigger named in always-on text. A clear instruction being ignored again and again? Only then a defensive plugin. Ordinary sequencing advice? Concise always-on prose.

The deeper principle is that the smallest effective change wins. Each added component carries a cost: skills need correct triggering, scripts need maintenance and sandboxing, subagents add latency and tokens, plugins alter runtime behavior invisibly. Harness²'s contribution is to stop choosing by intuition: it proposes alternative component-level fixes, runs them on the same task, and lets execution evidence arbitrate which lever actually helped.
