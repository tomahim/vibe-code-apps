---
id: a144695b-175e-45c1-973a-aa666ffaeb2f
position: 4
title: "Scores become probabilities"
archived: false
---
The model produces scores over its token vocabulary. A conversion turns those scores into a distribution used by decoding.

The final representation is mapped to one score for each token in the model's vocabulary. A mathematical conversion makes the scores comparable as probabilities that sum to one. For example, “hills” might receive more weight than “hammers” after “rose above the.” These values are predictions about text continuations under the model, not direct probabilities that a described event occurred in the world. Decoding uses them to choose a token. A different prompt or earlier sampled token changes the scores at the next step.
