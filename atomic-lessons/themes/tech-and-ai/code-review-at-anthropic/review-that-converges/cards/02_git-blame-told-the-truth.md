---
id: f1741cbb-a10b-4f3e-9d47-4f4b7d5b1264
position: 2
title: Git blame told the truth
archived: false
---
To see what the endless rounds were actually catching, the team ran git blame on the code the reviewer kept flagging. About 59 percent of it had been there since the reviewer's first pass.

That number reframed the problem. The reviewer was rarely finding new bugs introduced by the author's latest fix; it was finding a few more old ones each round, chewing through pre-existing code one pass at a time. Endless re-review was not a deepening inspection of the change, it was a slow audit of the whole neighborhood, billed to this pull request. An audit of old code has value, but the pull request is the wrong venue for it. That is why the team also runs review agents nightly over existing code, catching old bugs directly instead of finding them by accident during someone else's review.
