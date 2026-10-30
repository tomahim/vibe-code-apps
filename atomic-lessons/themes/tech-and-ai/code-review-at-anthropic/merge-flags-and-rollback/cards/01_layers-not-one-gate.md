---
id: 176433af-0482-4c26-8770-7dd686ce1389
position: 1
title: Layers, not one gate
image: fig-b-layers-not-one-gate.png
image_alt: 'Diagram of six stacked layers: verification, required CI, AI review, security review, human approval, and merge
  queue plus flags, with problems entering at the top, some caught at each layer, few passing through all of them, and fast
  rollback underneath catching the rest.'
image_caption: Each layer catches some problems and misses others. Few get through all of them, and rollback handles the rest.
image_credit: Anthropic, claude.dev blog
image_license: © Anthropic
image_source_url: https://claude.dev/blog/solving-code-review-at-anthropic/
archived: false
---
The diagram on this card is the whole philosophy in one picture. Problems enter at the top and fall through six layers: verification, required CI, AI review, security review, human approval, and the merge queue with flags. Each layer has holes, drawn as gaps where problems slip through.

That honesty is the design. No single layer is expected to be perfect, so no single layer has to be slow, exhaustive, and staffed by your scarcest people. Each layer catches some problems and misses others, the holes rarely line up, and few problems survive all six. Underneath everything sits fast rollback, which handles the rest. This lesson covers the last two layers in detail, because they are what make the lighter human layer above them safe.
