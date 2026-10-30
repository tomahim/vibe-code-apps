---
id: e7317d7a-b3e2-4fa3-b5ef-b312a3ff4326
position: 4
title: Adopting this before the pull request
archived: false
---
The article's adoption advice starts before any pull request. Give your agent checks it can run, listed in a short CLAUDE.md, plus hooks that run formatters and linters. Run /code-review and /security-review locally, or have a fresh-context subagent review the diff. Add a REVIEW.md, and move repeated review comments into it.

Notice that none of this requires new infrastructure. CLAUDE.md, hooks, local review commands, and a REVIEW.md are all files and settings a team can adopt in a week. The pattern is the one from the earlier lesson on verification: put the checking where the code is born, and encode what you learn from review back into the instructions. Teams that start here often find their pull requests arrive pre-cleaned, which makes every later stage cheaper before they have changed anything else.
