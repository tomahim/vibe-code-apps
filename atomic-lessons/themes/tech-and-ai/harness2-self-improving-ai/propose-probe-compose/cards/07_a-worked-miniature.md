---
id: 9facd0be-f69f-4918-adcb-696bb403818b
position: 7
title: A worked miniature
archived: false
---


Put it together with the Medium article's debugging assistant. Reference run: the agent patches code without ever inspecting the existing tests, and its fix breaks an edge case. Propose: the invariant candidate adds a completion rule, "run and read the relevant tests before finalizing any patch," while the domain candidate adds an error-classification script and a skill for this repository's test layout. Probe: both candidates run the same debugging task; the first now reads tests before patching, the second classifies the error correctly but still skips one test file.

Compose: the successor merges the test-inspection rule (strong contrast: the regression disappeared) with the classification script (helpful) and drops the redundant skill edit that caused the missed file. The composed harness runs once more, and its record, with all decisions and evidence, is stored. No human judged the final patch; the behavioral contrasts, observed procedurally, guided every choice. [Further reading: section 2.2 of the [paper](https://arxiv.org/abs/2610.14224) formalizes this step.]
