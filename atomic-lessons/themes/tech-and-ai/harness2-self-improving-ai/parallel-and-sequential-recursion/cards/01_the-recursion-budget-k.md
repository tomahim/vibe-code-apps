---
id: 04b86ab1-c95f-4b06-b7f1-d35ef267a687
position: 1
title: The recursion budget k
archived: false
---


A positive integer k controls how much refinement effort Harness² spends on a task. In parallel mode, k is the number of reference executions, the number of candidates per scope, and the number of independent composition sessions. In sequential mode, k is the number of chained improvement steps. Either way, k is the dial between cheap-and-good and expensive-and-better.

Count what parallel mode does at k=2: two reference runs, four candidate harnesses probed (two invariant, two domain), and two composition sessions, each producing a harness that is executed. That is roughly eight task executions and six editor sessions, and the numbers grow in step with k. The accounting matters because raising k multiplies model cost and delay, so a team should know what each task's refinement spent. (The counts here are tallied from the paper's description of the parallel procedure.)
