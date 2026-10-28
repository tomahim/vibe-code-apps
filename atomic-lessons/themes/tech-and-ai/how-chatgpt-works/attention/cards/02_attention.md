---
id: 5ee04d63-b136-4446-b021-f452e039d447
position: 2
title: "Attention to previous tokens"
archived: false
---
Attention lets a position combine information from earlier positions. For next-token generation, the model must not look ahead at text it has yet to produce.

Picture the model processing the word “it” in the scientist sentence. Attention can build a new representation for that position using information from earlier words such as “report.” During next-token generation, a causal model can only use tokens already present, not a future word it has yet to write. That restriction preserves the prediction task. Attention is a learned pattern of information mixing, not a human spotlight consciously choosing one important word. Several earlier positions can contribute at once, each with a different weight.
