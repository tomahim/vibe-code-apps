---
id: f2187a67-918c-4a69-aece-36487d5828f2
position: 5
title: 'Probe: run the candidates'
archived: false
---


Proposals are hypotheses; the probe stage tests them. Each candidate harness is executed on the same task under matched model and environment settings. Comparing each candidate's trajectory and deliverable against the reference execution yields what the paper calls a behavioral contrast: evidence of whether the edits mitigated the targeted deficiency, left the relevant behavior unchanged, or introduced a regression.

Two cautions are built in. First, a contrast is evidence about behavior, not a verdict about correctness; execution is stochastic and both runs share the same model's biases. Second, probes cost real compute, which is why the budget parameter k exists. A simple contrast: the reference run never opened the settings file, while a candidate opens it, reads the relevant section and cites it in its answer. That observable difference in procedure is exactly what a probe is looking for.
