---
id: aad16ee4-c263-4a24-af54-eb3d82545ac6
position: 2
title: Before the pull request exists
archived: false
---
The first review now happens before anyone else knows the change exists. The author gives Claude something it can run, like a test suite, a build, or a screenshot to compare against the design, and asks it to show the output rather than say it is done. Then a subagent reviews the diff with completely fresh context.

Fresh context is the key detail. The agent that wrote the code shares the author's blind spots, because it produced the same reasoning that produced the bugs. A second agent reading the diff cold is more likely to notice what the code actually does rather than what it was supposed to do. By the time a pull request opens, the change has typically already survived one full round of automated scrutiny and repair.
