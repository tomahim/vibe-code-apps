---
id: fc44f007-aabd-4e5e-b2e0-f8b6af5764ee
position: 7
title: "3 key learnings"
archived: false
---
**1. Decoding turns probabilities into text.** The model may consider both “sofa” and “windowsill” after the same opening. A decoding rule decides which candidate appears; the model's probability distribution is not itself the final sentence.

**2. Temperature changes variation.** Lower settings emphasize leading candidates, while higher settings allow more alternatives. That can help a creative story sound less repetitive, but it cannot supply missing knowledge or verify an arithmetic result.

**3. Different outputs do not mean new learning.** Two runs can diverge because an early sampled word changes later context. The model's stored weights generally stay fixed during ordinary requests, so compare answers for quality rather than assuming a changed answer reflects a trained update.
