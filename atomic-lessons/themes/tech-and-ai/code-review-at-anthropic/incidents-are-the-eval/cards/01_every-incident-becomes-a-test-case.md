---
id: a16d8144-55d4-45d8-86d2-101a3d447e63
position: 1
title: Every incident becomes a test case
image: fig-c-incidents-are-the-eval.png
image_alt: 'Flow diagram: an incident or revert becomes an expert-checked case and is added to the eval set; each change to
  the reviewer''s prompts, tools or model is scored daily against every case, kept if the score went up and dropped if not,
  looping to the next change.'
image_caption: The eval grows with every incident, and every change to the reviewer is scored against all of it.
image_credit: Anthropic, claude.dev blog
image_license: © Anthropic
image_source_url: https://claude.dev/blog/solving-code-review-at-anthropic/
archived: false
---
Most teams write a postmortem after an incident and file it away. The Claude Code team turns the incident itself into an asset. They collected past pull requests that caused incidents, together with their fix-forwards and reverts, and had engineers who know that code confirm each bug and where it lived.

The result is an eval set: a growing collection of real bugs that the review process once missed. The diagram on this card shows the loop. An incident or revert becomes an expert-checked case, and each incident adds a case to the set. The eval grows with every failure, which means the reviewer's hardest test is always its own worst history. Nothing about the bugs is synthetic or hypothetical; each one is a scar from production, verified by someone who knows the code.
