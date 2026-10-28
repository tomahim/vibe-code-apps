---
id: 7d678f7f-c27f-4e5e-98be-9c1c17129034
position: 6
title: "When a model misses"
archived: false
---
A model can fit known examples yet fail on new ones. Testing beyond its training examples is necessary to judge usefulness.

Picture a curve that passes exactly through five measured points but swings wildly between them. Its training fit is perfect while its predictions are poor. This is a familiar warning against judging a model only by the examples used to tune it. We need held-out cases and an understanding of the situations where the model will be used. For a language assistant, that includes checking reasoning, factual accuracy, and instruction following, not only whether its text sounds natural. A new prompt can expose a weakness hidden by familiar examples.
