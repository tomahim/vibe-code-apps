---
id: 85ce1a66-7747-4629-942d-c5fbc1c8d933
position: 7
title: Honest limits and open questions
archived: false
---


The paper is unusually frank about what it has not shown. Cost: recursive refinement adds inference, and the experiments characterize the trade-off only over a bounded budget range, not a universally optimal allocation. Feedback: without ground truth, refinement relies on behavioral contrasts and model judgment, which help assess changes but remain sensitive to execution variability and shared biases, and cannot guarantee that an adopted change transfers to a different task.

Two open directions are named. Managing the improvement harness: as the library grows, consolidate overlapping components, revise outdated experience and refine retrieval, keeping it compact and relevant. Adaptive recursion: allocate exploration by task difficulty and relevance of prior experience, and stop when extra probes yield little new evidence. The Medium article's closing thought is the right one to end on: the goal is not agents that modify themselves without supervision, but applications whose infrastructure evolves through measurable evidence, controlled experimentation and reliable validation. [Further reading: the [paper's limitations section](https://arxiv.org/abs/2610.14224) and the [Medium article's production guidance](https://medium.com/@danushidk507/building-self-improving-ai-applications-with-harness%C2%B2-from-agent-execution-to-recursive-harness-9657306a8086).]
