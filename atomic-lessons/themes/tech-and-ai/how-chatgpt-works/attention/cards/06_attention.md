---
id: 7080a04e-0303-4e3f-9b86-e281e0232483
position: 6
title: "What attention does not explain"
archived: false
---
An attention pattern is a clue about information flow, not a complete explanation of a model's answer. Other layers and learned weights also matter.

An attention diagram may show that a token strongly weights a previous noun. That is evidence about one part of information flow, but it does not show the whole calculation. Other heads, transformations, and output layers also affect the final token probabilities. A high attention weight is not automatically a causal explanation, and a low visible weight does not prove a word had no influence through earlier layers. Treat attention plots as diagnostic views to investigate, then test any explanatory claim with careful interventions or comparisons.
