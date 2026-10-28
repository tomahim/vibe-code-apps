---
id: 1d36eee0-39cf-47e1-a2ec-7f6e63a8e272
position: 3
title: "Words versus tokens"
archived: false
---
A token can be a whole word, part of a word, punctuation, or another text piece. Calling the process “next-word prediction” is a helpful simplification.

For example, a tokenizer might split an uncommon name into several pieces while keeping a common word as one piece. Punctuation and leading spaces can also be represented separately or together, depending on the tokenizer. If a response displays ten words, it may have required more or fewer than ten token selections. This matters when discussing output length, context limits, and the model's step-by-step work. The exact split is model-dependent, so count tokens with the model's own tokenizer rather than treating a word count as an exact substitute.

Go deeper: [Understanding tokens](https://help.openai.com/en/articles/4936856-understanding-and-counting-tokens).
