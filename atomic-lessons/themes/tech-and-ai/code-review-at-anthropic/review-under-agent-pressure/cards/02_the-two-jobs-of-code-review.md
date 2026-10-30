---
id: 2a67a101-ac01-4f9c-95a6-3d77ecbd9486
position: 2
title: The two jobs of code review
archived: false
---
Code review does two jobs, and they are easy to confuse. The first job is to find and fix issues before they ship. The second is to build shared context: reading a teammate's diff is how people learn what changed and how the pieces of a codebase fit together.

The Anthropic article focuses mainly on the first job, because that is where the volume crisis bites. When most code is written by agents, the second job does not disappear, but it needs new tools, and the team returns to it near the end of the post. Their solution there is not more reading but better questions: engineers ask Claude for an explainer of exactly the slice of code they are about to change. Keeping the two jobs separate matters, because a process optimized for catching bugs can quietly starve the learning that review used to provide.
