---
id: 1b13c44b-a4ac-4f0c-be9a-7e839e26a3ce
position: 1
title: "Recognizing handwritten digits"
archived: false
---
A digit recognizer maps image pixels to a digit label. It offers a simpler example of learning from human-produced data.

Give a recognizer a grid of grayscale values from a handwritten “2,” and ask it to output a label from 0 to 9. A person can usually do this even when the handwriting is unfamiliar. The network receives numbers rather than the human experience of seeing ink on paper, but we can compare its label with people's judgments. This example is easier to inspect than long-form writing because the inputs and expected outputs are limited. It illustrates how a learned function can support a task that would be awkward to specify with a list of hand-written rules.
