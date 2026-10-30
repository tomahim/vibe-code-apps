---
id: 18a1d50e-5d98-4942-90a6-d89e01a44d9c
position: 6
title: Nightly hunts for old code
archived: false
---
The convergence rules raised an obvious follow-up: if re-review was accidentally auditing old code, and that audit had value, why not do it on purpose? So review agents also run nightly over existing code, helping the team catch old bugs before they show up somewhere else.

The split is tidy. Pull request review focuses on the change, converges quickly, and respects the author's time and the review rounds budget. The nightly sweep owns the backlog of history, where there is no author waiting and no merge blocked. Both feed the same improvement loop when something is found. For your own setup, the lesson is to give old-code review its own lane instead of letting it ride along on new pull requests, where it inflates rounds and frustrates authors whose only crime was touching a file with history.
