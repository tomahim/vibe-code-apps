---
id: 85ce1a66-7747-4629-942d-c5fbc1c8d933
position: 7
title: Honest limits and open questions
archived: false
---


The paper is unusually frank about what it has not shown. Cost: recursive refinement adds inference, and the experiments characterize the trade-off only over a bounded budget range, not a universally optimal allocation. Feedback: without ground truth, refinement relies on behavioral contrasts and model judgment, which help assess changes but remain sensitive to execution variability and shared biases, and cannot guarantee that an adopted change transfers to a different task.

Two open directions are named. Managing the improvement harness: as the library grows, consolidate overlapping components, revise outdated experience and refine retrieval, keeping it compact and relevant. Adaptive recursion: allocate exploration by task difficulty and relevance of prior experience, and stop when extra probes yield little new evidence. A fair summary is that the aim is not agents that change themselves unsupervised, but systems that improve through measured evidence. [Further reading: the limitations and future-directions appendices of the [paper](https://arxiv.org/abs/2610.14224).]
