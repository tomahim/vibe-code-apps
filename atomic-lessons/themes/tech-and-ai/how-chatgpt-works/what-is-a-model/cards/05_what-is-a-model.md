---
id: 6d19600b-6eee-4169-9ce7-6cd6bac2f959
position: 5
title: "Choosing a useful structure"
archived: false
---
Training adjusts parameters inside a structure selected beforehand. A poor structure can limit what the model learns.

Before fitting a line, someone decided to use a line rather than a circle or a polynomial. That decision is part of the model's structure. Similarly, a transformer specifies broad operations such as attention and layered transformations before its weights are trained. Training can tune the parts within that design but cannot make every architecture equally suitable. If a model consistently misses a pattern, one possibility is insufficient or unsuitable structure, alongside poor data or training settings. The architecture therefore shapes which patterns training can make available to the model.
