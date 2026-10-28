---
id: ca4dd147-4f8f-46c5-997f-b09691823a16
position: 7
title: "3 key learnings"
archived: false
---
**1. Recognition must handle variation.** Two handwritten 4s can differ in position, width, and shape. A learned recognizer can use recurring features instead of requiring a stored pixel-for-pixel match for every way a person might write the digit.

**2. The network computes from numbers.** Pixel brightness values enter a trained function and produce digit scores. The programmer chooses the task and examples, while training adjusts the function's weights rather than writing a separate rule for every stroke.

**3. Human judgment is part of evaluation.** A heavily blurred symbol may not have one obvious label to a fresh viewer. Measure how often the model agrees with people on useful cases, and examine ambiguous failures instead of assuming every example has a perfectly clear answer.
