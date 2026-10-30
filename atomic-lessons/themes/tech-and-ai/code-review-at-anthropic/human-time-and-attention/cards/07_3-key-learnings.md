---
id: c712b08f-ddae-412b-a550-bd5d4b930d8e
position: 7
title: 3 key learnings
archived: false
---
Human time and attention are the scarce resource in agent-era review. The Claude Code team's goal is that most pull requests merge with at most one human in the loop, who can be the author, with no increase in reverts or incidents.

Review's cost has two sides: time spent reviewing and time spent fixing what bad code breaks. Cutting the first only helps if the second does not grow, so revert and incident rates are the guardrail on every saving.

The team measures human approvals per pull request, human comments, and waiting time directly. And they reject slowing down as a strategy: it lowers errors mainly by doing less, while their bet is to get faster at noticing and fixing problems.
