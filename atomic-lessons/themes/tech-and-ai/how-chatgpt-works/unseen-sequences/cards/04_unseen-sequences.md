---
id: 359c6198-80dc-4b1e-aaac-41500b210cb4
position: 4
title: "What a language model predicts"
archived: false
---
A language model maps the current context to a distribution over possible next tokens. The same mechanism can be applied repeatedly.

Given “Please describe the room: A lamp stood beside the,” a language model returns scores for possible next tokens such as “bed,” “desk,” or “door.” It does not directly return a verified description of a real room. After one token is chosen, the same model can be applied again to the enlarged context. This repeated conditional prediction is what allows arbitrary-length output. The learned probabilities are about plausible text continuations; a separate source of evidence is needed when the prompt asks about an actual place.
