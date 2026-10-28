---
id: 8a971579-63df-4377-8ed8-2ce3425253d9
position: 7
title: "3 key learnings"
archived: false
---
**1. Training uses a target or learning signal.** A digit image can be paired with “3,” and a text prefix with the token that followed it. Comparing the network's current output with that target reveals what should improve.

**2. Loss guides weight updates.** An optimization method uses the loss and gradients to adjust many parameters, usually across batches and repeated examples. The result is a learned function, not a database entry for each teaching example.

**3. Generalization needs separate checks.** A model that performs well on familiar handwriting may still fail on a new person's style. Held-out examples test the behavior we care about more directly than training loss alone.
