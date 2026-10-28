---
id: af48a3d3-11ee-4be3-ae31-6c345907d38e
position: 5
title: "Select the next token"
archived: false
---
A decoding rule selects one token from that distribution. The selection may be deterministic or involve sampling.

If decoding takes the highest-ranked token, the next piece is chosen deterministically under those conditions. If it samples, another plausible token may appear. The choice is an application-level step applied to the model's output distribution, which is why temperature and related settings can change wording without retraining the network. Once “hills” is chosen, it becomes part of the visible text. The model can then consider a comma, a period, or more description. Selection is only one point in a continuing loop. The choice also affects every subsequent step.
