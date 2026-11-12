---
id: 0334a248-005b-4506-a0a8-4bbd7c6e97b1
position: 2
title: 'Propose: two kinds of candidates'
archived: false
image: l5-propose-probe-compose.png
image_alt: "Five steps in a row: watch the current harness run, propose an invariant and a domain candidate, probe both on the same task, compose what the evidence supports, then run the successor."
image_caption: "One improvement step, with no answer key required."
image_license: original
---


Given the task, the current harness, the reference execution and any accumulated library experience, a harness editor drafts two candidate harnesses with deliberately different scopes. The invariant candidate targets agentic deficiencies that recur across domains: planning, tool use, context management, delegation, completion checking. The domain candidate targets the knowledge, procedures and constraints of the current domain or environment.

Why two scopes? Because mixing them muddles both diagnosis and reuse. A fix for "always verify a produced file before finishing" is valuable on every future task; a fix encoding "in this workspace, roles in file A map to positions in file B" is gold for this task and meaningless elsewhere. The paper's ablation shows scoping matters: replacing the two scoped editors with two generic ones cost 2.9 points on WorkBuddy-Bench and 3.7 on JobBench. Each candidate is an executable harness: real edited files, not a description of edits.
