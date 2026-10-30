---
id: dfe5b008-e855-4b93-9bad-926e431edc94
position: 2
title: Two ways to clear a finding
archived: false
---
An open finding blocks the merge, but blocking does not mean the reviewer is always right. There are two ways forward. You fix the issue, or you close the thread with a short reason, which is how a false positive gets cleared.

The short reason is doing quiet but essential work. It keeps the merge record honest, because anyone auditing later can see that a human looked at the finding and judged it wrong, and why. It also generates the false-positive data that lets the reviewer improve. There is a third path too, and it is fully automatic: if a later commit fixes the issue, the finding clears on its own. That detail matters for agent-authored work, where an overnight fix round can resolve findings without a person touching each thread.
