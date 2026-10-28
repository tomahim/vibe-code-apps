---
id: 6a8f16ac-6f59-4e31-85d5-c9c9d3dd2180
position: 4
title: "What attention can capture"
archived: false
---
Attention can connect a later position with earlier context. This helps a transformer represent relationships across a sentence.

When the model reaches “was published” in the report sentence, it can draw on earlier representations of “report” and the intervening phrase. Attention supplies weighted routes for this information to influence the current position. Those routes are useful for grammar and reference, but they are not a hand-coded parse tree. The model's success comes from trained parameters throughout the network. A single attention map may show one link while omitting many other contributions to the eventual token choice. Exact agreement should still be tested on new sentences.
