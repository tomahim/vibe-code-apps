---
id: ad46928b-db71-484b-aa31-0d0029cf9b2d
position: 6
title: Proof the library helps
archived: false
---


The paper tests the library from several angles. The ablation is direct: running the same pipeline without reading or writing the library costs 3.1 points on WorkBuddy-Bench and 1.8 on JobBench, so cross-task memory is worth real score. Scaling is more interesting: a library accumulated at k=1 merely restores base performance when used for direct refinement, but a k=5 library supports gains of 0.9, 4.4 and 5.1 points on Code, Web and Office, with no additional probing at all. More exploration today literally makes future improvement smarter.

Transfer is the most surprising result. A library built entirely on JobBench, professional job tasks, improved one-step refinement on the different WorkBuddy-Bench benchmark by 0.6, 0.5 and 2.9 points across its three domains. Lessons about how to improve harnesses apparently generalize across benchmarks, not just across tasks. Excluding each task's own library entry still leaves gains of 1.9 points on WorkBuddy-Bench and 1.7 on JobBench, confirming cross-task reuse rather than self-matching.
