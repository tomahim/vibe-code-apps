---
id: 8a585937-4305-44e9-abd0-7839cdf0c875
position: 3
title: "Use the final position"
archived: false
---
For a next-token prediction, the final position's representation is used to score possible continuations. Earlier positions helped form it.

In a causal language model, the representation at the final input position summarizes information available for predicting what follows. Earlier positions matter because their information can be mixed into that representation through the network. If we changed “moon” to “sun,” the final representation and next-token scores could change, even though the last few words stayed the same. It is not a simple average of all previous words; it is the result of many learned operations applied to the ordered context. That is why changing an early word can alter a later prediction.
