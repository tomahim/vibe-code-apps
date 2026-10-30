---
id: 0b6df129-ecc3-4b5c-bdc0-119081c68495
position: 1
title: A Claude review before any person
archived: false
---
Every pull request on the team gets a Claude review before a person looks at it. The reviewer reads the diff against the whole repository and the pull request's stated intent, then asks three questions: does the change solve its problem, does it fit the system, and does it break something else?

On a bug fix, it goes further and looks for the root cause rather than the nearest symptom. Reading against the whole repo is what separates this from a diff-only linter: a change can be locally correct and still break a caller three directories away. The public version of this reviewer, Code Review for Claude Code, is generally available on Team and Enterprise plans, and the /code-review command runs a lighter version locally before you even push.
