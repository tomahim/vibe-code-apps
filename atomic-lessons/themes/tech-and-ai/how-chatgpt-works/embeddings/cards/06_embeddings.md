---
id: ecd1e139-26da-48ce-86e0-e77eed9db5f8
position: 6
title: "Beyond isolated words"
archived: false
---
Models can represent a token in the context of a whole sequence. Those changing representations help predict what comes next.

The model can represent “apple” differently in “apple pie” and “Apple released a device” because the surrounding tokens change the computation. As text passes through layers, representations combine information from several positions. This richer context helps the network choose the next token in a way that fits the sentence. It also means there is no single static point that perfectly captures every meaning of a phrase. Visual plots are projections of a much larger numerical space and should be read as illustrations, not literal maps of thought.

Go deeper: [Wolfram's embedding examples](https://writings.stephenwolfram.com/2023/02/what-is-chatgpt-doing-and-why-does-it-work/).
