---
id: 4f03a215-fe4f-4473-87b1-02cd487a6c2c
position: 4
title: Gradual release to real users
archived: false
---
After internal use, the public release is staged too. The latest channel gets the build first, and the stable channel trails it. Users on latest have opted into freshness, so problems found there reach a small, tolerant slice of the world before the stable majority ever sees the change.

Staging compresses the cost curve of a bug. The same defect caught by employees costs a Slack message; caught on latest it costs a patch release; caught on stable it costs trust and a postmortem. Notice how this layer mirrors the review tiers from the last lesson: just as approval depth scales with the risk of the change, exposure scales with the evidence the change has survived. Nothing reaches everyone at once, so every stage is another chance for a problem to be found by a small audience instead of the whole one.
