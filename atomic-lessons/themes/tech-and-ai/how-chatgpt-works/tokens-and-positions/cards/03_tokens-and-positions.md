---
id: 48e616a3-7f81-4d47-9384-7fb5245a1216
position: 3
title: "Turn IDs into vectors"
archived: false
---
An embedding table maps token IDs to learned vectors. These vectors provide numerical features for later layers.

An embedding table can be pictured as one learned row of numbers per token ID. Looking up ID 417 returns a vector used as input to later layers. The row is adjusted during training, along with the rest of the model, so it becomes useful for the prediction task. The vector may reflect multiple relationships at once, rather than a tidy definition. This is why the first numerical step is more than replacing a word with an arbitrary integer: it gives the network a trainable representation it can combine with other context.
