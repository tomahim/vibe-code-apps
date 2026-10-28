---
id: c27fa295-138e-4d4c-9a78-06f413027285
position: 7
title: "3 key learnings"
archived: false
---
**1. Architecture and data shape what is learnable.** An image recognizer trained only on tidy printed digits may fail on messy notes. Both the network's design and the examples it sees affect the result.

**2. Training is an experimental process.** Builders choose batches, learning rates, repeated epochs, and sometimes useful variations of examples. A loss curve can show progress or a plateau, but it does not settle every quality question.

**3. Compute supports the process.** GPUs speed up the large array calculations used by neural networks. More hardware can enable larger experiments, yet model quality still depends on suitable objectives, data, architecture, and independent evaluation.
