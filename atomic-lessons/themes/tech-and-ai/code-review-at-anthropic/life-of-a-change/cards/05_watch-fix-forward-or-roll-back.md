---
id: d0aab82f-3574-485b-a13c-0d68bbfaa804
position: 5
title: Watch, fix forward, or roll back
archived: false
---
The final layer assumes some mistakes will still get through everything above. After release, the author and the on-call engineer watch the change, supported by revert and incident dashboards. Flags turn a bad behavior off quickly without a deploy, and broken builds get reverted.

This layer is what makes the lighter upstream scrutiny rational. When recovery takes minutes, a missed bug in a low-risk change is a small event instead of a crisis. The team is honest that this layer is not finished: they do not yet have circuit breakers that automatically tighten approval requirements when revert numbers move, and engineers want those before more code moves to zero-human merges. Automation earns trust incrementally, and the recovery layer is where that trust is enforced.
