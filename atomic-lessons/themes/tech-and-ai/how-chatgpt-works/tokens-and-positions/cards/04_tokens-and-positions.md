---
id: 05e9b080-233e-4399-9f8b-22e7f9d37f69
position: 4
title: "Add position information"
archived: false
---
A sequence needs position information so the model can distinguish token order. The essay illustrates this with GPT-2's learned position embeddings.

“Dog bites man” and “Man bites dog” contain nearly the same words but have different meanings because the order changes. If the model only received a bag of token vectors, it could lose that distinction. Position information tells it where each token occurs in the sequence. Wolfram illustrates a learned position-embedding approach used in GPT-2, where token and position information are combined. Other model designs may encode position differently, but the underlying need is the same: sequence order matters to prediction.
