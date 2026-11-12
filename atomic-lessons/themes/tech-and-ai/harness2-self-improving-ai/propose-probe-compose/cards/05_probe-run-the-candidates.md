---
id: f2187a67-918c-4a69-aece-36487d5828f2
position: 5
title: 'Probe: run the candidates'
archived: false
---


Proposals are hypotheses; the probe stage tests them. Each candidate harness is executed on the same task under matched model and environment settings. Comparing each candidate's trajectory and deliverable against the reference execution yields what the paper calls a behavioral contrast: evidence of whether the edits mitigated the targeted deficiency, left the relevant behavior unchanged, or introduced a regression.

Two cautions are built in. First, a contrast is evidence about behavior, not a verdict about correctness; execution is stochastic and both runs share the same model's biases. Second, probes cost real compute, which is why the budget parameter k exists. In the Medium article's example, the original run fails to identify a deployment configuration error while a modified harness finds the relevant file, reads the right log segment and produces a substantiated explanation: that observable difference is exactly a contrast.
