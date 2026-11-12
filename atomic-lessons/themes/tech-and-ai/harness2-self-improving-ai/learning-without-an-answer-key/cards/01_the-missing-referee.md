---
id: 01725bc4-e59b-4608-ac18-50df7503019e
position: 1
title: The missing referee
archived: false
---


Most machine learning leans on supervision: a label, a test suite, a reward score that says how well the system did. Open-world tasks have none of these. When an agent reconciles a company's production files or drafts a legal memo, there is no answer key waiting at the end. Earlier harness methods quietly depended on such referees: Meta-Harness searched against labeled training tasks, and other approaches assumed answers or asked a model to judge output pairs.

Harness²'s setting forbids all of that. Its improvement prompts state explicitly that no rubric, score or grader exists in the context. A guard in the released code even refuses to hand the editor any working directory containing a grader, so nobody can peek. The system must therefore squeeze guidance out of the only thing it has: the observable behavior of executions. Everything in this lesson follows from that constraint.
