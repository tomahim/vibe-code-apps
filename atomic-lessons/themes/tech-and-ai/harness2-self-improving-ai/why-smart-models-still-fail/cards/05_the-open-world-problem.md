---
id: 9a7f227f-dac4-4633-9c78-6ef3ef91ae4d
position: 5
title: The open world problem
archived: false
---


Why not simply optimize the harness once, before deployment? Earlier methods did exactly that: they searched for a good configuration against a fixed set of training tasks, with unit tests or validation scores to grade each attempt, then shipped the winner. This works when tomorrow's tasks look like today's training tasks. The paper calls the real world something less forgiving: an open world, where agents continually meet new tasks with diverse and evolving requirements.

In the open world, a harness chosen in advance often fails to generalize. Worse, the old grading signals disappear. A coding benchmark has unit tests; a real user request has no answer key. So an open-world system faces two coupled challenges. First, it must improve the harness without any ground-truth verdict to tell it which change helped. Second, improvements found for one task tend to be so task-specific that they mislead the next task. Keep these two challenges in mind: the whole design of Harness² is built around them.
