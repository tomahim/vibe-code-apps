---
id: 6c03adef-4eac-46cb-9b51-ee6337fd827a
position: 2
title: "Assign token IDs"
archived: false
---
Each token in a model's vocabulary has a numerical ID. The ID identifies the token; its magnitude does not measure meaning.

Imagine a vocabulary where “cat” has ID 417 and “dog” has ID 982. Those numbers are labels, like catalog numbers, rather than a scale on which 982 means “more dog.” To compare meanings, the model needs learned vectors associated with the IDs. Two close numerical IDs could represent unrelated pieces, and related words might have distant IDs. This distinction prevents a common misunderstanding: the model does not reason about language by comparing the raw integer labels as if their numerical order encoded semantic similarity.
