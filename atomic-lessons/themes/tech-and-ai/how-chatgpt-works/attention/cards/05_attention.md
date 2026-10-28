---
id: 340a5b58-3675-4a1d-b59c-49f117bfeb70
position: 5
title: "The transformer idea"
archived: false
---
A transformer stacks attention with other learned transformations. The architecture was introduced in the 2017 paper linked below.

A transformer block does more than look back. It combines attention with learned transformations at each position, and the model stacks many blocks so later representations can use information processed earlier. Take a sentence with a subject, a long aside, and a verb: one layer may form local relationships that later layers can combine into a broader pattern. The exact path depends on trained weights. The original paper is useful for the architecture, while Wolfram's essay uses GPT-2 as a more concrete example of a language model built from it.

Go deeper: [Attention Is All You Need](https://arxiv.org/abs/1706.03762).
