---
id: 43ebcd2e-280f-4617-be6c-0a707bb5d2db
position: 4
title: Keep a record and keep an exit
archived: false
---


If harnesses change over time, you need to know which version was running when something happened. A good record of each refinement cycle keeps the task, the model version, the starting and candidate harnesses, the key tool calls, the reasons for choosing one, the cost and who approved it. The paper's per-domain library and stored harness trees point the same way: every adopted harness is a concrete snapshot you can look up.

Pair the record with an exit. Roll a new version out gradually: check it, try it on a small share of work, then widen. If quality drops, rule violations rise or delays grow, return to the previous snapshot. The question the record must answer during an incident is simple: which change made the behavior different? This is ordinary release discipline applied to a harness, and it keeps a self-improving agent from turning into a system nobody can explain.
