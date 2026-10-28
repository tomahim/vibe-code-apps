---
id: b9aed34d-add7-4e51-9726-38e2591200f1
position: 7
title: "3 key learnings"
archived: false
---
**1. A prompt shapes the current answer.** “Describe a bicycle to a six-year-old in two sentences” provides audience and length cues. Those tokens influence generation without changing the model's weights.

**2. Examples can establish a temporary pattern.** Showing “cat → animal” and “oak → plant” may help the model answer “sparrow → ?” in the same format. This is in-context learning, not permanent retraining.

**3. Clear instructions still need verification.** A model may follow the format of a twelve-number addition request while making a carrying error. Use a calculator or other checkable process when the task demands exactness. Prompting sets up the task; it does not certify the result.
