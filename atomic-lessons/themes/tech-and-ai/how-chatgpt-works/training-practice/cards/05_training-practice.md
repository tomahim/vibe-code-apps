---
id: dbf97682-39cc-486d-91f2-d5f4e9717dcd
position: 5
title: "Watch the learning curve"
archived: false
---
Loss commonly falls and then levels off during training. A stalled or high loss can point to problems with data, settings, or architecture.

Plot loss against training steps. It may fall quickly, then flatten as progress slows. A high plateau can indicate that the network is too limited, the data is unsuitable, or the optimization settings are poor. A very low training loss paired with weak performance on held-out examples suggests overfitting instead. The curve is a diagnostic, not a certificate. For a language model, we also need evaluations of the finished behavior, because a good token-prediction score alone does not guarantee truthful or helpful answers.
