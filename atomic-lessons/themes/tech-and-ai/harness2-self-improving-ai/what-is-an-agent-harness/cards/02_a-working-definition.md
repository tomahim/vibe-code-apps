---
id: 3189fd97-5cc4-482e-b458-5218098504f0
position: 2
title: A working definition
archived: false
---


The paper's definition is minimal: a harness is a set of editable components that composes with a frozen model to form an agent. "Frozen" matters. The model's weights never change during harnessing, so every improvement is a change to something the engineers can actually see, diff and roll back. "Editable" matters too: each component is a concrete artifact, not a vague notion.

Harness² adopts a file-level decomposition from earlier work and extends it to eight components: a system prompt, guardrails, memory, skills, tool guidance, scripts, subagents and a middleware plugin. Each one is mounted as a file in the agent's runtime. That choice is what makes the whole framework practical: improving the harness means editing files, and editing files is something both humans and AI systems already know how to do, review and version.
