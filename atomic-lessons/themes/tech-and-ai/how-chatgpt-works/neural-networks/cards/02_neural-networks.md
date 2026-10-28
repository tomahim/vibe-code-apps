---
id: e523f5c2-2bf7-4b9c-ac5f-581e3e4ae0b3
position: 2
title: "Inputs, weights, and bias"
archived: false
---
Weights control how strongly inputs contribute, and a bias shifts the result. Training changes these numbers.

Consider a neuron with inputs x and y. A positive weight on x makes larger x values push the result up; a negative weight on y pushes it down. The bias changes the threshold at which the neuron responds. Training changes these values to make the network's outputs better match examples. None of those numbers by itself has to mean “cat” or “verb.” Meaningful behavior comes from the combined effect of many weighted connections. That is why listing the parameters is not the same as explaining the network's decisions.
