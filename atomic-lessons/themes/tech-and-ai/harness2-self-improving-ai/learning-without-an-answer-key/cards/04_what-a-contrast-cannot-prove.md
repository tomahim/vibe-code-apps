---
id: b3a8dc06-1a33-4ba3-8aa7-ebce62ad43cd
position: 4
title: What a contrast cannot prove
archived: false
---


A behavioral comparison is not proof of correctness. A convincing but wrong result can still be selected. The paper lists the structural reasons. Execution is stochastic: re-run the same harness and you get a somewhat different trajectory, so a lucky run can flatter a bad edit. And the candidate and reference share the same model's biases, so a systematic blind spot stays invisible in the contrast.

The practical conclusion is not to abandon contrast, since it is the only signal available, but to hold it at the right confidence. The paper ties every composition decision to a concrete observation rather than a presumed score gain. Anyone applying the idea in a setting where mistakes are costly would also bring in outside checks such as tests, independent validators and human review. Treat the contrast as a strong hint about procedure, never as a verdict about truth.
