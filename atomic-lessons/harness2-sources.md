# Sources and editorial notes

Reviewed 12 November 2026. This is an introductory learning path about a research framework, not an implementation manual. Only publicly accessible material was used. No subscription was purchased.

## Core reading

| Source | Scope used | Notes |
| --- | --- | --- |
| [Xu et al., "Harness²: Recursive Agent Harnessing for an Open World", arXiv:2610.14224, 9 October 2026](https://arxiv.org/abs/2610.14224) | All technical claims: the two recursion levels, Propose-Probe-Compose, parallel/sequential recursion, the experience library, benchmarks, numbers, ablations, case study, limitations | Primary and only technical source. Reported scores are the paper's own results on three benchmarks (WorkBuddy-Bench, JobBench, LAB) and are not independently verified. |
| [Harness² project site](https://harness2.github.io) and [code release](https://github.com/google-research/harness2) | Implementation surface: file-tree components, ledger accounting, stage prompts | Linked as further reading only. |

## Claims and confidence

- All benchmark numbers (11.5 / 4.5 / 11.8 headline gains, ablation costs, scaling and transfer results, the 43.1 to 77.8 case study) come from the paper itself; the lessons attribute them to the paper rather than presenting them as independent findings.
- Model and product names (GLM-5, Gemini 3.5 Flash, Claude Opus 4.8, OpenCode, Codex) are used as the paper uses them.
- Lesson 10 mixes the paper's own limitations with general engineering habits (isolation, versioning, staged rollout, human approval). The cards label the second kind as general practice, not as results of the paper.

## Original examples

- The trip-planning assistant, the budget-workbook library entry, the contract-review, survey-cleaning and repository-chores cases, and the two-cooks comparison were written for this path as illustrations. They are not experiments from the paper.

## Simplifications used deliberately

- The paper's formal notation (executors, harness tuples, update equations) is replaced with plain-language descriptions of the same mechanisms.
- The statistical caveats (stochasticity, shared model bias) are kept.
- No card reproduces the paper's prompts, tables or figures; mechanisms and numbers are described in prose.
