---
id: 48c8367a-10a7-4f78-9023-4099024fccf4
position: 4
title: "Learn from preferences"
archived: false
---
A separate preference model can learn from ranked answers. Its signal can then help tune the assistant's responses.

Suppose reviewers rank several candidate answers to the same prompt. A separate model can learn to predict which answer they would prefer, providing a reusable training signal. The assistant can then be tuned toward outputs with higher predicted preference. This introduces a new failure mode as well as a benefit: optimizing a proxy for human judgment can favor responses that look good to the proxy without being fully correct. Independent testing and clear task criteria are needed alongside preference-based tuning. A polished answer is not necessarily a correct one.
