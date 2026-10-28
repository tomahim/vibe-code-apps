---
id: 54d36d65-4930-4a6a-b3ae-55781366477a
position: 7
title: "3 key learnings"
archived: false
---
**1. The model receives token IDs, not plain words.** A rare name can become several fragments while a common word may stay whole. The integer ID is a label; its size does not measure meaning.

**2. Vectors and positions add useful structure.** Learned embeddings turn IDs into features, and position information distinguishes “dog bites man” from “man bites dog.” Both are needed before later layers can use the sequence.

**3. Historical numbers are examples.** The GPT-2 and GPT-3 dimensions in Wolfram's 2023 essay make the mechanism concrete. They are not specifications for whatever model currently powers ChatGPT. The broad sequence of operations matters more than those old numbers.
