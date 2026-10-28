---
id: 69f0120e-0f48-4d65-87d9-ffae087881de
position: 3
title: "Why activation matters"
archived: false
---
An activation function adds nonlinearity after the weighted sum. Without nonlinear steps, stacked layers would have much less expressive power.

If every layer only performed a weighted sum, stacking layers would still amount to one larger linear transformation. An activation such as ReLU changes the shape of the function: it can keep positive values and turn negative ones to zero. Combinations of these bends let the network form more intricate decision boundaries. In a digit task, that can help separate curved and straight strokes in different combinations. The exact activation choice is an engineering decision, but the need for nonlinearity explains why layers can do more than a single straight-line fit.
