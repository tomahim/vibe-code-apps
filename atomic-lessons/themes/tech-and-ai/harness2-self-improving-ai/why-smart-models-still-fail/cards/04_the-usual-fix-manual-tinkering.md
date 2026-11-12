---
id: 0b91439c-7437-4b42-a589-a24a3b1d25ec
position: 4
title: 'The usual fix: manual tinkering'
archived: false
---


Today, when an agent misbehaves, a developer opens its configuration and starts tinkering by hand. They rewrite a paragraph of the system prompt, bolt on a specialized tool, add a reusable skill, or restructure the workflow. Each fix is a small act of craftsmanship based on intuition and a few observed failures. It works, but it does not scale: every new kind of task needs another round of hand-tuning, and nobody records why a particular change helped.

This manual loop has a deeper weakness. Because fixes follow gut feeling, instructions pile up and the harness becomes a heap of unverified guesses. Nobody compares two candidate fixes side by side on the same task. Nobody checks whether last month's clever rule is now hurting. The question that motivates Harness² is therefore simple: could the agent's surroundings be improved systematically, using evidence from the agent's own earlier runs instead of intuition?
