---
id: 6d3083ef-246f-4273-8557-e0439a7c3121
position: 1
title: Show the output, not the claim
archived: false
---
Most review on the team now happens before a pull request exists, and the core habit is simple: give Claude something it can run. Tests, a build, a linter, or a screenshot to compare against the design all work. Then ask Claude to show the output instead of saying it is done.

The difference matters because an agent's claim of completion is cheap and often wrong, while a passing test run or a matching screenshot is evidence. This habit, together with the fresh-context subagent review, comes straight from the team's best-practices guide. Many engineers also run a few internal skills before opening a PR: one hunts for bugs, one simplifies the diff, and one checks the behavior end to end. UI changes additionally get checked against the design guidelines, so visual regressions are caught before any person spends a minute.
