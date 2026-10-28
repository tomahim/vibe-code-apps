---
id: 0c4900e7-6f2b-4c89-8be1-352896c22f56
position: 6
title: "Why GPUs help"
archived: false
---
Neural networks perform many array calculations that GPUs can run in parallel. This makes compute capacity a practical constraint.

The dominant operations in many neural networks are large matrix and vector calculations. A GPU can carry out many parts of these calculations in parallel, speeding up both training and inference. For example, a batch of token representations can be transformed together rather than one scalar multiplication at a time. This is why compute availability affects model size, training time, and experimentation. Hardware speed does not explain the quality of a model by itself; architecture, data, objectives, and evaluation still matter.
