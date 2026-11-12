---
id: a72fb043-76d9-444e-b6af-3321c65de352
position: 2
title: What can be improved
archived: false
image: l4-what-can-be-improved.png
image_alt: "Three columns for what a system can improve: model weights (self-rewarding language models), agent code (STOP and the Darwin Gödel Machine), and the harness, which is what Harness² edits."
image_caption: "Harness² targets the harness, not the weights or the code."
image_license: original
---


RSI is a family of ideas, differing in what object gets improved. Some systems improve model weights: self-rewarding language models generate their own training signals and update themselves. STOP, a 2024 system, recursively rewrote a code-improvement program, improving the improver. The Darwin Gödel Machine evolves the agent's own code, benchmark-testing variant after variant.

Harness² chooses a different object: the agent harness, the scaffolding around a frozen model. None of the model's weights change, no agent code is rewritten from scratch, and the improvement procedure itself stays fixed during a task. What evolves is the editable file tree of prompts, guardrails, memory, skills, tool guidance, scripts, subagents and plugins. It is a deliberately modest target, and that modesty is what makes it deployable on real task streams today.
