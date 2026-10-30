---
id: 1e61411a-7eff-434e-9243-490e248208b5
position: 7
title: 3 key learnings
archived: false
---
Security review is a separate automated pass, and it blocks. A pull request cannot merge while any finding from the bug review or the security review is open. You clear a finding by fixing it or closing the thread with a short reason, and a later fixing commit clears it automatically.

CI is the deterministic floor: lint, types, tests on every platform, and a build, often dozens of checks per pull request, with red blocking the merge. The PR template asks how the change was tested and how to undo it; Claude can fill it in, but the requesting person signs off.

Important checks block rather than advise, and that power is rationed to checks the team keeps precise. Each layer trusts the ones below, which is what makes the whole stack affordable on every change.
