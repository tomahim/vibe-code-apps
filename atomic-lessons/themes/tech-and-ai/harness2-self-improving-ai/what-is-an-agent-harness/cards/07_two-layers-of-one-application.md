---
id: 19a688ca-e4d7-471d-9ac0-cc015189cb07
position: 7
title: Two layers of one application
archived: false
image: l2-two-harnesses.png
image_alt: "Two boxes: the execution harness, which does the task, and the improvement harness, which revises the execution harness. An arrow points from the improvement harness to the execution harness."
image_caption: "One harness does the work, the other decides how it should change."
image_license: original
---


The paper separates two harnesses that are easy to confuse. The execution harness is the one wrapped around the agent while it does a task: its prompt, rules, memory, skills, scripts and so on. The improvement harness is a second, separate setup that guides the editor agents responsible for revising the first. One does the work; the other decides how the work setup should change.

This separation is what makes the later lessons possible. During a task, the improvement harness stays fixed while it refines the execution harness. After the task, the improvement harness itself is updated with what the refinement taught. Keeping the two apart means you can always say which layer changed and why. The agent works, and separately, the system works on the agent. [Further reading: the [paper](https://arxiv.org/abs/2610.14224) defines both harnesses formally in section 2.1.]
