---
id: fbb382e0-213f-4f59-9cd0-a2640de9c878
position: 3
title: "Distorted examples"
archived: false
---
A recognizer may still classify a blurred or altered digit. Its behavior eventually changes when the image becomes too ambiguous.

Start with a clear image of a “2” and progressively blur it. At first, both a person and a model may still say “2.” After enough blurring, the same image may look like another digit or no digit at all. Calling the model's later answer “wrong” depends partly on remembering the original image, information a fresh viewer would not have. This is why an evaluation should consider what humans see in the presented image, rather than assuming an unambiguous ground truth for every distorted case.
