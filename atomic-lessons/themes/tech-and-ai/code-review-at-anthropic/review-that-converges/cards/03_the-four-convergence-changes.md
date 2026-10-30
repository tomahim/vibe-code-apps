---
id: 2270e5f4-8b34-4658-93e9-c8209b07a619
position: 3
title: The four convergence changes
archived: false
---
The team changed re-review with four rules. First, a round cap: after three rounds, the reviewer asks the author to step back and reconsider the approach, because a change that needs a fourth round often needs a different design, not another patch.

Second, diff-only re-review: after the first few passes, the reviewer looks only at what changed since the last round, not the whole pull request again. Third, flag the class of bug, so the author fixes every instance of a pattern rather than one line, which prevents whack-a-mole rounds. Fourth, no repeats of findings already posted. Together the rules attack the loop from both sides: they shrink each round's scope, and they force escalation to a human decision when the loop shows the change itself may be the problem.
