---
id: 5f349b41-706b-4e83-a2b5-635b7d2b274d
position: 1
title: Security is a separate pass
archived: false
---
Security review on the team is its own automated pass, distinct from the bug-hunting review. The separation is deliberate. A reviewer optimizing for correctness asks whether the code does what it should; a security reviewer asks what the code allows that it should not. Those are different questions, and one pass doing both tends to do the second badly.

The stakes of the separation show up in the merge rule: a pull request cannot merge while any finding from the bug review or the security review is still open. Both reviewers hold blocking power, so a clean bug review cannot override an open security concern. You can build the same arrangement yourself with the open-source security review GitHub Action or the /security-review command, and Anthropic documents the setup in their guide to automated security reviews in Claude Code.
