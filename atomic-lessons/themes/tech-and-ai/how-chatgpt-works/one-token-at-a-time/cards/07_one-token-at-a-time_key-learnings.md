---
id: 1f655d0d-5754-4036-a0dc-cc7b23e47dc7
position: 7
title: "3 key learnings"
archived: false
---
**1. The prompt sets the scene.** If you change “finish this as a bedtime story” to “write a veterinary note,” you change the context used for every next-token prediction. The model's continuation can therefore change topic and style before a single output token appears.

**2. Generation proceeds in tokens.** A token may be a whole word, a fragment, or punctuation. After one token is chosen, the growing text becomes the input for another prediction. Ten visible words need not mean exactly ten prediction steps.

**3. A smooth answer is assembled locally.** Many dependent choices can form a coherent paragraph, like a story that starts with a cat on a sofa. That fluency shows the model has learned useful language patterns; it does not certify dates, quotations, or other factual claims.
