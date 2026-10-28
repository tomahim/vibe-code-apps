---
id: 1f451503-9815-4e4c-b241-58483c7ea408
position: 2
title: "Predict the next piece"
archived: false
---
At each step, a language model estimates which text piece could come next. This is the central mechanism behind its generated response.

In the toy opening “The cat slept on the,” a candidate such as “sofa” may be more plausible than “telescope.” The model is making this kind of comparison before the sentence is complete. Once “sofa” is emitted, the relevant question changes to what might follow “The cat slept on the sofa.” This is why a response can be produced incrementally, even when the finished paragraph seems planned. The prediction is conditioned on the visible history, not on an answer independently stored in advance.
