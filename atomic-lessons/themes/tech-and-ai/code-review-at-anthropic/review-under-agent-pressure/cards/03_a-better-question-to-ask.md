---
id: c701170c-362d-4a92-bf30-47d1b7a20085
position: 3
title: A better question to ask
archived: false
---
The team's central move was to stop asking whether a human read the code. That question feels rigorous, but it is an imprecise proxy for what you actually care about. A person skimming a trivial one-line copy change learns nothing and catches little, while an automated check might catch a real problem instantly.

The sharper question is: what could go wrong with this change, and which check, automated or human, is the right one to catch it? A docs fix and an auto-updater change fail in completely different ways, so they deserve completely different review. Once you ask the question this way, the process redesigns itself. Routine, well-understood risks go to machines that never get tired, and human attention is reserved for changes whose failure modes are subtle, expensive, or new.
