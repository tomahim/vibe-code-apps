---
id: 51559d22-7745-496a-bef7-dea1f987a114
position: 5
title: REVIEW.md tells the reviewer what matters
archived: false
---
REVIEW.md is written by code owners and tells the automated reviewer what matters in their part of the code. The team checks separately whether the reviewer actually follows it, because an ignored guide is decoration.

The good ones are short and concrete. They say what failure looks like in that area: for a docs repository, failure means “it lies”; for configuration, “it misroutes”. They cap the nits so the reviewer does not bury signal under style noise. They list paths to skip. They ask for a file and line as evidence instead of a guess from a name. And they ask for a summary that starts with a count and says plainly when there is nothing to fix. Each rule exists because reviewers, human or machine, default to vague confidence when nobody tells them what evidence looks like.
