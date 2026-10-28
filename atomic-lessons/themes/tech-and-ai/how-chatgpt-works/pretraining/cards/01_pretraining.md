---
id: 8ee582ff-f5aa-4195-abf9-e0469872ff8b
position: 1
title: "The pretraining task"
archived: false
---
A language model can learn by predicting missing next tokens in text. The text itself supplies targets for this training task.

Take the sentence “Birds build nests in trees.” A training example can hide “nests” as the next token after “Birds build” and ask the model to score it highly. Other positions in the same text provide more examples. No human must write a separate label for every prefix because the text supplies the observed next piece. The target is the token that actually followed in that source, not the only grammatically possible continuation. Across huge amounts of text, this task encourages the network to learn reusable language patterns.
