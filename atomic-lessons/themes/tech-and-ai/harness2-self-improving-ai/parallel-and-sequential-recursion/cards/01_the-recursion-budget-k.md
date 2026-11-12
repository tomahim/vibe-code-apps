---
id: 04b86ab1-c95f-4b06-b7f1-d35ef267a687
position: 1
title: The recursion budget k
archived: false
---


A positive integer k controls how much refinement effort Harness² spends on a task. In parallel mode, k is the number of reference executions, the number of candidates per scope, and the number of independent composition sessions. In sequential mode, k is the number of chained improvement steps. Either way, k is the dial between cheap-and-good and expensive-and-better.

The released implementation accounts for 4k execution rollouts and 3k improvement stages per mode, reference executions included, so k=2 means eight rollouts and six stages. The code keeps an explicit ledger that checks these counts. The point of the accounting is not bureaucracy: raising k multiplies model execution cost and delay, so the system must know exactly what was spent on each task.
