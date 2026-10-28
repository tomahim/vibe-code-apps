---
id: c3402e84-e759-4db7-a129-cb51a4332c33
position: 1
title: "Choosing from probabilities"
archived: false
---
Several next tokens can be plausible at once. A decoding rule decides which of those candidates becomes the next visible token.

After “The weather tomorrow will be,” both “sunny” and “rainy” are linguistically possible, even if one has a much higher score in a given context. The model supplies a distribution over candidates; the application chooses how to turn it into a token. This distinction matters because the same learned model can produce more predictable or more varied text under different decoding settings. A probability is a weight for selection, not a claim that the selected word is a verified forecast.
