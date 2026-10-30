---
id: 6f912c35-0c1f-4c8f-b898-5f8a867370b9
position: 6
title: The pattern behind the files
archived: false
---
CLAUDE.md and REVIEW.md look like documentation chores, but together they are how a team programs its reviewers. One file orients the agent in the project; the other aims the reviewer at the failures that actually hurt. Both are versioned with the code, so review standards evolve through the same pull request process as everything else.

The deeper pattern is that agent review quality is mostly a context problem. An agent with the right instructions, the right evidence requirements, and the right checks to run performs like a careful colleague; the same agent without them performs like a confident intern. Investing in these files pays off on every future pull request, which is why the team treats repeated review comments as a signal to update the files rather than a signal to type the comment once more.
