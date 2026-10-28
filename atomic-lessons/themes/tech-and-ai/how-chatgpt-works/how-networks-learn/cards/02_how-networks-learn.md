---
id: 10b4310b-8064-400c-b9cf-af534f7bc7ce
position: 2
title: "Compare prediction with target"
archived: false
---
A training step measures how different the model's result is from what was wanted. The comparison guides the next adjustment.

If the network assigns a high score to “8” for a clear image of a “3,” we need a way to say how far it missed. The target label supplies that comparison. In text prediction, the actual next token is a target, even though many other continuations might also be reasonable in a different context. This distinction matters: a training target is the observed continuation, not a universal declaration that every other token is impossible. Repeated comparisons let the model improve its probability assignments across a large collection of examples.
