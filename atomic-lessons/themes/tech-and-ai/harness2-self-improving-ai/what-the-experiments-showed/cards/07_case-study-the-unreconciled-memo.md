---
id: 7f3aea32-23e8-442a-8815-7f12b032f576
position: 7
title: 'Case study: the unreconciled memo'
archived: false
---


The paper's detailed case study follows one JobBench task: reconcile schedule, roster and budget files into interconnected production deliverables. Gemini 3.5 Flash with the base OpenCode harness scored 43.1. Reading its trajectory revealed two procedural failures, not knowledge gaps: figures were never reconciled across the source files, and outputs were never reopened for verification after being written.

Two interventions were composed into the improved harness. The invariant edit added guardrails: inventory all supplied files, reconcile every figure to its authoritative source, and verify every produced file with a script, because confirming a file exists is not confirming it is correct. The domain edit added a reconciliation skill (source hierarchy when files disagree, committed versus conditional spend, hour caps, completeness checks) plus tool guidance about numbers stored as text and retrying web search once, not endlessly. The composed re-run scored 77.8: +34.7 points from four targeted file edits. [Further reading: the [paper's Figure 9](https://arxiv.org/abs/2610.14224) shows the full before-and-after harness.]
