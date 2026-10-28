---
id: 586e6dae-c37a-4e5e-a991-265b825447ae
position: 7
title: "3 key learnings"
archived: false
---
**1. Text supplies its own prediction targets.** After “Birds build,” the observed next token in a source sentence can train the model. This makes large collections useful without a person labeling every prefix by hand.

**2. Weights learn shared patterns across examples.** Grammar, topic associations, and common phrases can all influence a prediction. The result is not a tidy filing cabinet that reliably names the source of each sentence.

**3. Fluency is not verification.** Training text contains mistakes, and the objective rewards plausible continuations. An obscure date or other consequential claim still needs checking against suitable evidence. Source quality and the evaluation task matter alongside scale.
