---
id: 74332be0-94d5-4c60-b52c-a77efb2ba418
position: 5
title: "Repeat across examples"
archived: false
---
Many updates across many examples gradually shape the network. One example alone rarely gives a useful general rule.

If a model sees only one handwritten 2, it might adapt to that exact stroke pattern and fail on another person's handwriting. Repeated examples expose variation in size, angle, and style. Likewise, a text model needs many contexts to learn that “bank” can concern money or a river. Training revisits examples while parameters change, so the same example can influence the model differently at different stages. More examples do not guarantee quality, but a narrow set makes generalization harder to judge and achieve.
