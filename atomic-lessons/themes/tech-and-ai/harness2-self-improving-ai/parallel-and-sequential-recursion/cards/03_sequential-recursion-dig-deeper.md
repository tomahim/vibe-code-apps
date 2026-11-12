---
id: 4d80fe4e-e914-49a5-816a-b854e2e621ae
position: 3
title: 'Sequential recursion: dig deeper'
archived: false
---


Sequential recursion bets on depth. It chains k contrastive steps, and each step starts from the harness and the accumulated execution history of the previous step. Step one fixes the earliest, most visible failure. Step two sees the refined harness's new reference executions and can retain, revise or correct step one's changes using both current and previous evidence.

This is iterative self-refinement applied to the harness itself, and it suits a different shape of problem: when fixing one issue reveals a second issue hiding behind it. The rule of thumb is that parallel recursion is for several independent hypotheses, and sequential recursion is for when an initial improvement exposes the next problem. In the paper's scaling study, sequential recursion was actually ahead on the Code domain at k=2, though parallel recursion finished higher at k=5.
