---
id: 95224091-84dc-4d26-b1ce-44767e2130ad
position: 3
title: Weaker models gain the most
archived: false
image: l9-weaker-model-overtakes.png
image_alt: "Bar chart of WorkBuddy-Bench scores: with OpenCode, base Gemini 3.5 Flash 72.4 versus improved GLM-5 75.7; with Codex, base Gemini 74.5 versus improved GLM-5 75.3. The axis starts at 0."
image_caption: "The weaker model with an improved harness wins in both setups."
image_license: original
---


The most striking pattern is who benefits. On WorkBuddy-Bench and LAB, GLM-5, the weaker executor, receives larger absolute gains than Gemini 3.5 Flash under both initial harnesses. The improved GLM-5 reaches 75.7 with OpenCode and 75.3 with Codex on WorkBuddy-Bench, overtaking the base Gemini scores of 72.4 and 74.5. A weaker model with a better workplace beat a stronger model in a worse one.

On JobBench the pattern flips: Gemini gains 4.5 and 1.4 points under OpenCode and Codex, against GLM-5's 3.6 and 1.2. So the rule is not universal. The safe takeaway is the one the paper states: harness quality and model strength are partly interchangeable, and an organization cannot buy its way out of harness engineering simply by buying the biggest model. Sometimes the cheapest capability upgrade is a better set of files around the model you already have.
