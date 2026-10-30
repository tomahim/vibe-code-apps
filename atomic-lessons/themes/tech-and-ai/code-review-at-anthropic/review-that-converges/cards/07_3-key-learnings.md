---
id: 11c89449-c394-43d0-b372-c8051bbafc7a
position: 7
title: 3 key learnings
archived: false
---
Agent review must be designed to converge. An agent author and reviewer can loop indefinitely, and one pull request went through more than fifty rounds overnight before its author stopped it.

The diagnosis came from git blame: about 59 percent of what the reviewer kept flagging had been there since its first pass, so endless rounds were a slow audit of old code. The fix was a round cap with escalation after three rounds, diff-only re-review, flagging bug classes instead of single lines, and no repeated findings, with rounds-to-pass tracked next to recall.

The results: pull requests passing after one round rose from 65 to 78 percent, five-or-more-round pull requests fell from 8.9 to 1.5 percent, and mean reviews to pass fell from 2.08 to 1.32. Nightly review sweeps now own the old-code hunt.
