---
id: ac88d186-c559-46da-ae6a-180d843dbde1
position: 7
title: 3 key learnings
archived: false
---
A change travels a defined path: verification before the pull request, four gates on the pull request itself (required CI, Claude code review, security review, risk-based approval), then a merge queue, a flag-gated internal release, a gradual public release, and finally watching with fix-forward or rollback.

Most review has moved earlier and later than the classic gate. Much of it now happens before a pull request exists, and much of the safety comes from what happens after the merge, through flags, staged channels, and fast rollback.

The design principle is layers, not one gate. Each layer catches some problems and misses others; few get through all of them, and rollback handles the rest. That depth is what makes light human review on low-risk changes safe enough to run.
