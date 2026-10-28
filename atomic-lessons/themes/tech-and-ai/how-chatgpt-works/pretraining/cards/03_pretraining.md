---
id: aa4c5f37-7ff8-4634-8fc2-bed3281ac0ba
position: 3
title: "Predict, compare, update"
archived: false
---
During training, predicted token probabilities are compared with the actual next token. Optimization updates weights to improve future predictions.

Suppose the observed next token is “nests,” but the model assigned most probability to “homes.” Training computes a loss based on that mismatch and adjusts weights so similar examples are better predicted in future. One update is tiny relative to the full training process. The model sees many batches and repeated contexts, gradually shaping both its token representations and later transformations. The objective rewards predicting text; it does not directly ask whether an answer is helpful, safe, or supported by evidence. Those are separate concerns for evaluation and later training.
