---
id: 9f3aa3d6-09eb-4032-9e1e-4cfa4ebce247
position: 3
title: "Reuse and vary examples"
archived: false
---
Training may revisit examples over multiple epochs and use altered versions where appropriate. Repetition and variation can improve learning.

An epoch means showing the training set again, not because the network forgot every example but because its weights have changed since the previous pass. With images, a small rotation or crop can create a variation that teaches the model not to depend on one exact pixel arrangement. Such augmentation only helps when the transformed example should keep the same label; rotating a “6” into a “9” without care would be misleading. Repetition and variation are practical techniques for improving generalization, not substitutes for evaluating on fresh data.
