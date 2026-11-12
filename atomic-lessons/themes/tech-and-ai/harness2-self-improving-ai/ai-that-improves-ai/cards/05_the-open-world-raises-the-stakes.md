---
id: 635356bc-b6dd-4d5b-a5a2-5ea3a2f85f86
position: 5
title: The open world raises the stakes
archived: false
---


Real deployments are open worlds: a stream of tasks nobody fully predicted, with evolving requirements and no answer keys. A legal assistant meets a contract type it has never seen. A coding agent meets a repository with unusual layout. A data agent meets a spreadsheet with numbers stored as text. The harness that was reasonable on average is suddenly wrong in specific, fixable ways.

Open-world harness methods answer by adapting at test time. One family refines the harness for the current task; another carries a successful harness forward across task batches. Each alone has a flaw the paper identifies: refining per task throws away what the refinement taught, while inheriting a tailored harness drags task-specific noise into future tasks. Harness²'s design keeps the benefits of both: refine for the current task, but save the lessons, not the tailoring.
