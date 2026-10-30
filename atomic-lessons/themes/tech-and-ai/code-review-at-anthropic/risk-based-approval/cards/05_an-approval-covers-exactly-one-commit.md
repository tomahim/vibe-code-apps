---
id: 618fb23f-8c9e-4cde-aa11-d1693a933947
position: 5
title: An approval covers exactly one commit
archived: false
---
Approvals on the team are scoped tightly: an approval covers one specific commit. If new commits land that the system cannot vouch for, the approval has to be given again.

Two cases are named explicitly. An agent's push after approval resets it, because the approver never saw that code. A merge conflict someone resolved by hand also resets it, because conflict resolution is exactly where subtle, unreviewed changes sneak in. This rule frustrates people used to approval as a durable state, but it matches reality: the thing being approved is a precise diff, and a different diff is a different thing. For teams adopting the pattern, branch protection can enforce it mechanically by dismissing stale approvals on new commits.
