---
id: e9813ddd-3245-4e44-b621-b6e6f61f65a2
position: 3
title: Why the harness is an attractive target
archived: false
---


Improving the harness has practical advantages over improving weights or code. Retraining a model is expensive, slow and risky; editing a file is cheap, instant and reversible. Evolving agent code can produce systems nobody understands; a harness edit is a readable diff a human can review. And because the model is frozen, a bad change cannot damage the expensive asset: you simply restore the previous harness version.

There is also a scientific reason. The paper observes that even a strong model performs substantially differently under different harnesses, so the harness is a high-leverage surface where real gains live. The results back this: one contrastive improvement step lifted scores by up to 11.5 points on a professional-work benchmark, and a weaker model with an improved harness overtook a stronger model with its original harness. The scaffolding is not an afterthought; it is half the product.
