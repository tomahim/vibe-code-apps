---
id: 30f0ad96-86b6-4f0d-a87f-b51ab9b692cf
position: 2
title: The change sets the tier, not the author
archived: false
---
The first rule of the tier system is that the change sets the tier, not the author. A classifier reads the change itself and picks its risk tier. A senior engineer's docs fix is still low risk; a junior engineer's auto-updater change is still medium. Seniority buys trust elsewhere in the system, but it does not relabel what a change can break.

A second classifier asks a different question: does this particular change need another person even when its tier says it does not? That second pass catches the deceptive cases, like a small diff in a config file that reroutes production traffic. Some paths bypass the tiers entirely and always need a person: anything owners have listed as sensitive, and any CI workflow file, because a compromised workflow can poison every future build.
