---
id: 4102efc4-50e2-4afc-affb-4ae8e562cc19
position: 4
title: "Multiple attention heads"
archived: false
---
Several heads can form different weighted combinations in parallel. Their exact internal roles are often hard to label.

Imagine several heads processing the same sentence in parallel. One may emphasize a nearby phrase while another emphasizes a more distant noun; their outputs are then combined with other network operations. This picture helps explain why multiple heads are useful, but it is not a claim that every head has a clean grammatical job. Real heads can be redundant or difficult to interpret. The 2017 transformer architecture made this kind of attention central to sequence processing, and later language models built on that general approach.
