---
id: 9fc7818e-5aa5-4e98-be34-576b00dce79f
position: 4
title: "Adjust the weights"
archived: false
---
Optimization changes weights in directions expected to reduce loss. Gradient-based methods calculate how each weight affects the result.

Picture a landscape where height represents loss and each coordinate represents a weight. Optimization tries to move toward lower ground. With millions of weights we cannot draw the real landscape, but gradients estimate which direction each weight should move for a small improvement. The update size matters: a step that is too large may overshoot; one that is too small can be slow. The essay uses a low-dimensional landscape as a teaching analogy. Actual training combines many such numerical updates across batches of examples.
