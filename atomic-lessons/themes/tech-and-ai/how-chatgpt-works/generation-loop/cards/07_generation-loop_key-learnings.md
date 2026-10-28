---
id: 8b560c09-3314-4e93-8198-4dd6cbee4ed6
position: 7
title: "3 key learnings"
archived: false
---
**1. The current context enters as ordered token vectors.** A prompt such as “The moon rose above the” becomes numerical input for the trained transformer. This is inference, so its stored weights are being used rather than updated.

**2. The model scores possible next tokens.** Its final representation yields vocabulary scores and probabilities. “Hills” might outrank “hammers,” but the scores concern plausible text, not whether a real moonrise occurred.

**3. Selection feeds the next step.** A decoding rule chooses one token, adds it to the visible sequence, and repeats the calculation. Many such steps form a paragraph until a stop condition is reached.
