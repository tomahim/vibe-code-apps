---
id: b36b0342-74bd-4b9f-9b6b-d5484af3429c
position: 2
title: The merge queue protects main
archived: false
---
Approvals and green checks apply to a pull request as tested, but the pull request was tested against a main that no longer exists by the time it merges. The merge queue closes that gap: it re-runs every check against the latest main with the change applied.

The classic failure this prevents is the semantic collision. One pull request renames a function and passes; another adds a new caller of the old name and passes; either alone is fine, and together they break the build. Testing the combination before it lands keeps main green, which matters far more than it sounds at this scale. When tens of thousands of changes land daily, a broken main is not an inconvenience; it is a fire alarm for the entire organization, and the queue is the sprinkler system.
