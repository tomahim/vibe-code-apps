---
id: b929135c-a17d-4759-b3fc-ddf8ba14dcad
position: 7
title: 3 key learnings
archived: false
---
The design is layers, not one gate. Six layers, from verification to the merge queue and flags, each catch some problems and miss others; few get through all of them, and fast rollback handles the rest.

The merge queue re-tests each change against the latest main so two individually green pull requests cannot combine into a broken build. Flags separate deploying code from releasing behavior, employees run new behavior first, and public release goes to the latest channel before stable.

Detection and recovery complete the system: the author and on-call watch every change, flags turn off in seconds, and broken builds get reverted. The team is honest that automatic circuit breakers tying approval strictness to revert rates do not exist yet, and they want them before zero-human merges expand.
