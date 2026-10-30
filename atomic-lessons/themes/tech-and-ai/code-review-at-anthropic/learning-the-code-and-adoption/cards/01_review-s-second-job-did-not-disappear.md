---
id: 014b7ec6-cd24-48a0-b9da-64591c20b38f
position: 1
title: Review's second job did not disappear
image: fig-e-learn-the-code.png
image_alt: 'Diagram titled: if machines do most of the reading, how does anyone learn the code? A grid represents the codebase
  with a few squares highlighted as the part you want to understand. Asking Claude about exactly that slice leads to two outcomes:
  Claude writes an explainer in minutes that reflects the code as it is today, or Claude builds a small artifact that visualizes
  that part of the code and teaches it the way that person likes to learn. Below: reading trivial diffs line by line teaches
  almost nothing; an explainer for the module you are about to change teaches a lot.'
image_caption: If machines do most of the reading, how does anyone learn the code?
image_credit: Anthropic, claude.dev blog
image_license: © Anthropic
image_source_url: https://claude.dev/blog/solving-code-review-at-anthropic/
archived: false
---
Code review's second job has always been to spread codebase understanding. Reading a teammate's diff is how you learn what changed and how the pieces fit. When machines do most of the reading, that learning channel closes, and pretending otherwise would leave the team slowly losing touch with its own product.

The team's answer is honest: there is no formal replacement process, and they argue one is not needed. Nobody on the team keeps a complete mental model of Claude Code in their head, and they do not think anyone needs to. The complete mental model was always partly a myth; what engineers actually need is working knowledge of the slice they are touching right now. The question becomes how to deliver that slice's knowledge on demand, and the diagram on this card shows their two answers.
