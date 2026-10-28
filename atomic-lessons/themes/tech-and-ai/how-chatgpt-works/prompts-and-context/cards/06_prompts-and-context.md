---
id: ea70af76-78e4-4bb1-bc64-4f674f5c26bf
position: 6
title: "Prompting versus weights"
archived: false
---
The context changes what the model computes for this request, while training changes model parameters. Keeping the two separate avoids a common misconception.

Training changes the weights through an optimization process across many examples. Prompting supplies tokens that influence one run of the trained model. A chat history can make the model appear to remember a preference from earlier in the conversation because that preference is still in context. This is not the same event as updating parameters. The distinction matters when correcting an assistant: saying “Use French from now on” can steer the current conversation, while a permanent change would require some separate storage or training mechanism supplied by the application.
