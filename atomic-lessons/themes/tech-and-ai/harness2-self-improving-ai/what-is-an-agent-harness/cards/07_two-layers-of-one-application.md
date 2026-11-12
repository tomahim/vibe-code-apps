---
id: 19a688ca-e4d7-471d-9ac0-cc015189cb07
position: 7
title: Two layers of one application
archived: false
---


The Medium article offers a clean architectural picture: an application using Harness² has two layers. The execution layer is the agent doing real work for users: extracting document fields, investigating incidents, writing code. The improvement layer watches that work and proposes modifications to the agent's harness. The two can be decoupled: a stable harness serves production traffic while an asynchronous experimentation service tests candidate improvements elsewhere.

This separation is what makes self-improvement governable. Experiments happen in isolation; promising candidates pass regression tests, security checks and approval gates; only then does a new harness version take traffic. The research framework itself is simpler, it refines the harness on the task stream directly, but the layer split is the mental model to keep. The agent works, and separately, the system works on the agent. [Further reading: the [paper](https://arxiv.org/abs/2610.14224) defines the harness formally in section 2.1.]
