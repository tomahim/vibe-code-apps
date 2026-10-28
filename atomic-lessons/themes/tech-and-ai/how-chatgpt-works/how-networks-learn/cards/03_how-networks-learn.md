---
id: af8e9727-20d2-4222-98c2-f45a311fab3c
position: 3
title: "Turn error into a loss"
archived: false
---
A loss function turns mismatch into a number to reduce. Different tasks can use different loss functions.

A loss function converts model error into a number that optimization can work to reduce. In a simple numerical task, we might square the difference between a predicted value and the true value. For token prediction, a different loss measures how much probability the model assigned to the observed next token. Low loss on training data is encouraging but incomplete. A network could memorize common examples or exploit accidental quirks. We therefore test it on separate cases that were not used to tune the parameters.
