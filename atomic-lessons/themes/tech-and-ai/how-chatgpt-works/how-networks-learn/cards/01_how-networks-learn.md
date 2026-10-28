---
id: ba882af3-33b6-4a98-b60a-27c5b4ff716c
position: 1
title: "Learn from examples"
archived: false
---
Training presents inputs together with a target outcome or other learning signal. The network's current output is compared with that target.

For a digit model, an example can pair an image with the label “3.” For next-token training, an example can pair preceding text with the token that actually followed it. In both cases the network first produces its current output, which may be wrong. Training is not a person typing the right answer into every weight. Instead, a learning procedure uses the example to calculate how the network should change. Many examples are needed so the updates reflect recurring patterns rather than one peculiar image or sentence.
