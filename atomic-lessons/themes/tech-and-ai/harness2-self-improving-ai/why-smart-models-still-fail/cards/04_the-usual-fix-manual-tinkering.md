---
id: 0b91439c-7437-4b42-a589-a24a3b1d25ec
position: 4
title: 'The usual fix: manual tinkering'
archived: false
---


Today, when an agent misbehaves, a developer opens the configuration and starts tinkering by hand. They rewrite a paragraph of the system prompt, bolt on a specialized tool, add a reusable skill, or restructure the workflow. Each fix is a small act of craftsmanship based on intuition and a few observed failures. It works, but it does not scale: every new task family needs another round of hand-tuning, and nobody writes down why a particular change worked.

This manual loop has a deeper weakness. Because fixes are guided by gut feeling, teams add instructions pile upon pile, and the harness grows into an accumulation of unverified guesses. Nobody compares two candidate fixes side by side on the same task. Nobody checks whether last month's clever instruction is now actively hurting. The Medium article frames the natural question: what if the agent's surrounding infrastructure could improve systematically, based on evidence from its own previous executions? That is exactly the question Harness² answers.
