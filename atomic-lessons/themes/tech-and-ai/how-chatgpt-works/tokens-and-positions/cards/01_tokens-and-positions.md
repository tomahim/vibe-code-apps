---
id: f7e0cc86-271e-4863-9b95-c83dc4a219c8
position: 1
title: "Split text into tokens"
archived: false
---
Tokenization divides input text into model-sized pieces. Different tokenizers may split the same phrase differently.

A tokenizer may keep “book” as one token while splitting a rare technical term into several fragments. Spaces and punctuation can affect the split too. This makes token count different from word count: a long unfamiliar name may use several steps even though a reader sees one word. The exact rule depends on the model's vocabulary. When reading the essay's “one word at a time” account, keep the token version in mind. It is the token sequence that the network actually receives and extends. That distinction also affects how much context a request consumes.

Go deeper: [OpenAI token guide](https://help.openai.com/en/articles/4936856-understanding-and-counting-tokens).
