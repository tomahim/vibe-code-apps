---
id: 6c83b27b-1ba2-4b77-afe6-e78015dea306
position: 2
title: From 16 percent to 54 percent
archived: false
---
When the team launched the research preview of their reviewer, the share of internal pull requests getting substantive review comments went from 16 percent to 54 percent. That jump is the cleanest evidence that human-only review was missing real issues at scale.

The distribution of findings is instructive. Most pull requests over 1,000 lines get findings, which makes sense: bigger diffs carry more risk and more places for agents to err. Most small ones come back clean, which matters just as much, because a reviewer that cries wolf on every typo trains people to ignore it. Admins can set each repository to Quick, Standard, or Deep review depth. Deep costs more review time, so it is worth it exactly where one missed bug costs more than that extra time.
