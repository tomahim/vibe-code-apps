---
id: 8d4ab084-2bc7-44da-bfc7-9c6dd4d040ba
position: 4
title: "Batches and settings"
archived: false
---
A batch is a group of examples used for an update. Batch size and other training settings influence speed and behavior.

Rather than update the network after one example or the entire dataset, training often uses a batch containing several examples. The batch provides an estimate of how weights should change. A large batch can make efficient use of hardware but needs memory; a small one produces noisier updates. Other settings, such as learning rate, control the size of each adjustment. These are called hyperparameters because they guide the learning process rather than being the model weights learned from examples. Builders tune them experimentally.
