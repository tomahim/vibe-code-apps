---
id: 3e99a43c-2db1-4fcc-b401-24d25c40d53f
position: 7
title: Picking a budget in practice
archived: false
---


For a working team, the practical question is when refinement is worth its compute. The economics favor recurring task families: if the improved harness and its lessons will serve hundreds of similar tasks, the refinement cost is amortized across all of them. They disfavor one-off tasks, where a k=1 step, or even the plain base harness, is usually enough. The paper's own framing supports this: libraries accumulated at larger k helped later tasks even without additional probing, so exploration spend is partly an investment in the future.

Set explicit limits: maximum recursion budget, token expenditure, execution time and parallel probe count, and decouple the experimentation workload from serving traffic so a big refinement queue never slows users down. The future direction the paper names, stopping when additional probes yield little new evidence, would automate much of this judgment. [Further reading: the [paper's analysis section](https://arxiv.org/abs/2610.14224) charts both the gains and the token costs.]
