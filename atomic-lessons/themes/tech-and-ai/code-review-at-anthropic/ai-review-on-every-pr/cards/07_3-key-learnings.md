---
id: f6bad2da-006d-4620-8d36-e97c4efc0288
position: 7
title: 3 key learnings
archived: false
---
Every pull request gets a Claude review before a person looks. The reviewer reads the diff against the whole repository and the stated intent, asking whether the change solves its problem, fits the system, and breaks something else. On bug fixes it hunts the root cause.

Findings are filtered for signal. Parallel agents hunt for bugs, verifier agents vote on each finding, and style-only comments are dropped, with filters A/B tested before adoption. When the reviewer launched, substantive review comments on internal pull requests rose from 16 to 54 percent.

Surviving findings arrive sorted by severity and tagged Important, Nit, or Pre-existing so old code is not blamed on the author. Every finding must be fixed or resolved with a reason, and review depth (Quick, Standard, Deep) is set by what a missed bug would cost.
