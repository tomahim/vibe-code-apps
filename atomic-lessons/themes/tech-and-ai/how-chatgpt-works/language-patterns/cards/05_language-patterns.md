---
id: 294900e2-4285-428f-8c1f-81c4da2315d1
position: 5
title: "Longer patterns look better"
archived: false
---
Using longer n-grams can make generated strings look more natural. It also demands observations of many more possible combinations.

Imagine generating a word one letter at a time. A model that uses the last three letters can avoid many impossible spellings that a single-letter model produces. If it uses the last ten letters, its samples may look better where that exact context was observed. Yet ten-letter contexts are much less common than three-letter ones. The model gains specificity but loses coverage. The same tradeoff appears for word sequences: longer histories can be informative, but exact counts become unreliable as combinations proliferate.
