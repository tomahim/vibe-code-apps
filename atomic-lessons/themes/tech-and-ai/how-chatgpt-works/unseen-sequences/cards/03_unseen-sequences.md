---
id: 4f708995-c186-47da-b0fb-e23cea4b55fb
position: 3
title: "Estimate instead of memorize"
archived: false
---
A model estimates probabilities for sequences it has never seen exactly. It does this by learning patterns that apply across examples.

Suppose the model has seen many sentences about bicycles and many about purple moons, but never their exact combination. Shared representations and learned weights can still assign probabilities to words following “the bicycle under the purple moon.” This is an estimate produced by the model's structure, not a measured count for that full phrase. The estimate may be useful when it reflects genuine regularities in language. It can also go wrong when a novel context requires a distinction that the learned patterns do not capture.
