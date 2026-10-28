---
id: 1633ea78-5e0f-4a00-839f-d105147e1676
position: 5
title: "Add a token and repeat"
archived: false
---
After selecting a token, the model includes it in the context for the next prediction. Every new piece changes what can plausibly follow.

Imagine the model selects “small” after “She saw a.” The next prediction is made for “She saw a small,” where nouns such as “bird” or “box” may now be more likely. If it had selected “strange” instead, the later wording could diverge. This feedback happens through the growing text: the model's parameters stay fixed during an ordinary answer, while the context changes every step. A single early choice can influence the rest of the paragraph, which is why generation is a sequence of dependent decisions.
