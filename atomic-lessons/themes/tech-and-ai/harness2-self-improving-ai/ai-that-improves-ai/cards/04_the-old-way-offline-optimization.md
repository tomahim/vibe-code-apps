---
id: 7d6091e5-b730-4b2b-8a09-6a636cc7a9f1
position: 4
title: 'The old way: offline optimization'
archived: false
---


Before open-world methods, harness improvement mostly happened offline. A system like Meta-Harness searches over candidate harnesses against a fixed split of training tasks, with labels or validation feedback grading each attempt, and deploys the best one it finds. This is like training a pilot entirely in a flight simulator with a scoring system, then sending them up with frozen habits.

Offline optimization has two structural weaknesses in deployment. First, it needs supervision: training tasks with known answers or reliable verifiers, which real task streams do not provide. Second, its result is static: the winning harness is fixed at deployment and cannot adapt when a task unlike anything in the training split arrives. The paper's comparisons show the cost of standing still: ReasoningBank, which keeps the harness fixed and only retrieves past strategies into context, fell as much as 6.6 points below the plain base harness on coding tasks.
