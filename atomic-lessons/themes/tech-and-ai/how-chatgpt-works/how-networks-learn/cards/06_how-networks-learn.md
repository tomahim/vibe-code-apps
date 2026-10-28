---
id: 2f653148-6afa-4251-8135-9af3a94b5a00
position: 6
title: "Test whether it generalizes"
archived: false
---
A separate evaluation checks performance on examples not used for training. Lower training loss is not the whole goal.

After training, show the digit model images it did not use for weight updates. If it succeeds on varied new handwriting, that is stronger evidence of learning than success on the examples it studied. A language assistant needs similarly independent checks: can it follow a new instruction, handle a novel topic combination, or avoid a confidently wrong answer? The key is to test the behavior we actually care about. A decreasing training loss is a useful progress signal, not the final measure of whether a model is reliable.
