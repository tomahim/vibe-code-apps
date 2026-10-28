---
id: 10df90a7-05bf-4873-a5e7-3ced174eaaea
position: 4
title: "Parameters as adjustable knobs"
archived: false
---
Parameters are numerical values chosen to fit the model to data. A neural network can have a very large number of such weights.

In the simple line y = a + bx, the numbers a and b are parameters. Changing b tilts the line; changing a moves it up or down. A neural network has many more parameters, commonly called weights and biases, that affect its output in less intuitive ways. Training searches for values that reduce error on examples. The parameters are not usually hand-written facts, one per topic. They jointly determine how inputs are transformed, which is why reading a single weight rarely reveals a clear piece of knowledge.
