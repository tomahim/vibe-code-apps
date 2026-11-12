---
id: 6eec67ef-4508-4b65-8488-1260584e7090
position: 6
title: Two hard challenges
archived: false
---


Challenge one: no referee. In the open world there is usually no ground-truth answer and no reliable verifier for a task. Existing methods leaned on proxy signals, assumed answers, or asking a model to judge pairs of outputs, all imperfect. Safely using imperfect execution evidence to guide harness changes is genuinely hard: a convincing-looking improvement can be a convincing-looking mistake.

Challenge two: improvements do not travel. An edit that fixes today's task is often so tailored that it misleads tomorrow's, and directly inheriting a heavily tailored harness makes improvement noisy as task distributions shift. Yet the refinement process itself produces highly reusable experience: how a weakness was diagnosed, which changes were tested, and what their execution revealed. The paper's insight is that this process is a source of learning in its own right. The system should recursively upgrade not just the harness, but its own way of improving harnesses.
