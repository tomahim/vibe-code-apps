---
id: 170d8791-7118-4f19-a600-9ee9ba57b9e3
position: 3
title: "Examples inside a prompt"
archived: false
---
A few examples can establish a pattern for the next response. This is often called in-context learning.

You can show “cat → animal” and “oak → plant,” then ask for “sparrow → ?” The examples suggest the desired mapping and answer format without a long instruction. This is a simple form of in-context learning: the model infers a pattern from examples included in the prompt. It may work well for familiar relationships, while brittle examples can teach the wrong pattern. If the requested transformation involves many exact steps, showing a few pairs may not be enough to make its later answers reliable. The model must infer which parts of the examples are relevant.
