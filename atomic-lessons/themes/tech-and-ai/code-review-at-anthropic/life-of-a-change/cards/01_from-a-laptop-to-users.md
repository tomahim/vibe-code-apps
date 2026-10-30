---
id: 012c0c03-ae4f-4b54-9616-800fb14a8886
position: 1
title: From a laptop to users
image: fig-a-life-of-a-change.png
image_alt: 'Diagram of a typical Claude Code change from the author''s machine to users: verification before the pull request,
  then required CI, Claude code review, security review and risk-based approval on every pull request, then a merge queue,
  and after the merge a flag-gated internal release, gradual release, and watching with fix-forward or rollback.'
image_caption: A typical Claude Code change, from the author's machine to users.
image_credit: Anthropic, claude.dev blog
image_license: © Anthropic
image_source_url: https://claude.dev/blog/solving-code-review-at-anthropic/
archived: false
---
A typical change on the Claude Code team starts on an engineer's laptop, or increasingly in a Claude session running in Slack, and passes through multiple layers of review before users see it. The path is worth learning as a single map, because each layer exists to catch what the others miss.

The diagram on this card is the map. Before a pull request even exists, the work is verified: Claude runs the tests, build and linter, and a second agent reviews the diff in a fresh context. On every pull request, four layers run: required CI, Claude code review, security review, and risk-based approval. After merging, the change travels through a merge queue, an internal release behind a flag, a gradual public release, and finally watching with fix-forward or rollback. The rest of this lesson walks through why the path is shaped this way.
