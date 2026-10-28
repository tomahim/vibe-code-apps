---
id: 48c74420-c577-4ca5-8fb1-19db37362a9f
position: 3
title: "Sampling other possibilities"
archived: false
---
Sampling sometimes chooses a lower-ranked but plausible option. This introduces variation while still using the model's estimated probabilities.

Suppose the model gives “sofa” a high probability and “windowsill” a smaller but still reasonable one. Sampling may choose either according to the configured distribution, leading to two different stories. It is not the same as choosing a random word from the dictionary: implausible options usually receive very little weight. This helps explain why variation can coexist with grammatical prose. A sampled response can also be worse, so diversity should be judged against the task rather than treated as an automatic improvement.
