---
id: 3c39f66a-aec0-4796-bb07-34da2526fa49
position: 2
title: Why expert checking matters
archived: false
---
The cases are not scraped automatically from revert commits. Engineers who know the code confirm each bug and where it lived, and that human verification is what makes the eval trustworthy.

Without expert checking, an eval set drifts into noise: some reverts are rollbacks of perfectly good code caught in someone else's breakage, and some incident fixes address symptoms rather than the bug a reviewer should have caught. An expert label saying “this specific logic error, on this line, is what a good reviewer should have flagged” turns a messy production event into a clean test. The cost of that labeling is real, which is why it is reserved for genuine incidents and reverts. Those are exactly the failures expensive enough to deserve a permanent place in the reviewer's curriculum.
