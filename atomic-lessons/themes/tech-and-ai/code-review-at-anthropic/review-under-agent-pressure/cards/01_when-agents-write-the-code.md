---
id: e0da3a3c-31e1-46b4-9892-c693bf057ecb
position: 1
title: When agents write the code
archived: false
---
The Claude Code team says Claude writes about 90 percent of Claude Code's own code. That single fact changes the arithmetic of review. In Anthropic's monorepo, changes landing per day went from about 2,500 in May to more than 30,000 in September of the same year, and Claude Code's own repository feels similar pressure even though it sits outside the monorepo.

At that volume, manual line-by-line review of everything is not hard, it is impossible. A team that ships tens of thousands of changes a day cannot ask a person to read each one. The question stops being how to review faster and becomes what review should mean when machines produce most of the code. The team's answer reshaped every layer of their process, from what runs before a pull request exists to how a change is undone after it lands.
