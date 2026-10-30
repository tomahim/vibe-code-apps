---
id: 724c984b-3187-4aa0-83bc-0b606eb42c6f
position: 5
title: What the numbers showed
image: fig-d-review-that-converges.png
image_alt: 'Bar chart comparing internal pull requests before and after the convergence changes: passing after one review
  and fix round rose from 65 to 78 percent, needing five or more rounds fell from 8.9 to 1.5 percent, and mean reviews to
  pass fell from 2.08 to 1.32.'
image_caption: Fewer review rounds per internal pull request after the convergence changes.
image_credit: Anthropic, claude.dev blog
image_license: © Anthropic
image_source_url: https://claude.dev/blog/solving-code-review-at-anthropic/
archived: false
---
The chart on this card compares internal pull requests before and after the convergence work, and the direction is unambiguous. Pull requests passing after one review and fix round rose from 65 percent to 78 percent. Pull requests needing five or more rounds fell from 8.9 percent to 1.5 percent. The mean number of reviews to pass fell from 2.08 to 1.32.

Faster convergence did not come at the guardrail's expense, because the team watches revert and incident rates on everything. Read the chart as evidence about where review effort belongs: most of the value lands in the first round or two, and the tail of endless rounds was mostly expensive noise. The fifty-round overnight pull request is the extreme of the old distribution, and the 1.5 percent tail is what the new rules did to it.
