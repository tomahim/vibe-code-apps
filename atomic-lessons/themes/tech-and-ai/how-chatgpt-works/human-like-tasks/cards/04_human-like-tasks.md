---
id: 4a865e41-52df-4604-8f0a-0261fe4c615c
position: 4
title: "A function from pixels to labels"
archived: false
---
The network computes an output from numerical pixel values. Training determines the parameters of that function.

In a simplified recognizer, each pixel's brightness becomes an input number. A trained network transforms the collection of numbers through many weighted operations and produces scores for digit labels. The programmer does not have to write “if there is a curved line at these coordinates, output 2.” The price is that the learned function is harder to summarize in ordinary language. The same broad idea applies to text: numbers enter a network, learned weights transform them, and the output is a prediction rather than an explicit hand-coded rule.
