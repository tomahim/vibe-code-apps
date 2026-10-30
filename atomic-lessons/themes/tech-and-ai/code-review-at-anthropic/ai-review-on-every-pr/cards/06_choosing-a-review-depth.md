---
id: 4c07bf6a-c55a-43ca-adba-f4f8b29cb216
position: 6
title: Choosing a review depth
archived: false
---
The Quick, Standard, and Deep settings acknowledge that uniform review depth wastes resources at both ends. A typo fix does not need a deep multi-agent hunt, and a change to payment code deserves more than a quick pass.

The article's rule of thumb is economic: Deep is worth it where one missed bug costs more than the extra review time. That framing generalizes beyond the product setting. The cost of a missed bug depends on what the code touches, how easily the change can be undone, and how many users it reaches on merge. Teams adopting AI review should start with a standard pass on one repository, tune the reviewer's instructions for a few weeks against real findings, and only then widen or deepen. Depth, like everything else in this system, is a dial set by blast radius rather than a fixed standard.
