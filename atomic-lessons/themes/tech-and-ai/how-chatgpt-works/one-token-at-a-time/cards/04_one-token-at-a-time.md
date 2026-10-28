---
id: 7ec24393-eb5a-4c09-bc91-368c8a4fc530
position: 4
title: "A probability for each possibility"
archived: false
---
The model gives many candidate next tokens different scores that become probabilities. It does not retrieve one fixed continuation from a stored page.

Suppose the prompt ends “She opened the door and saw a.” The candidates “dog,” “garden,” and “stranger” could all fit, though with different scores. Turning those scores into probabilities gives a distribution, not a single fact about what must come next. The model can rank a common continuation highly without copying a sentence from a source. Its probabilities reflect learned patterns and the current prompt. They also need not be perfectly calibrated estimates of how real people would continue that precise sentence.
