---
id: 2be2dbee-bbaa-4b95-8e05-730802e82ef5
position: 4
title: Reverts and incidents as the guardrail
archived: false
---
Every saving in human review time is checked against one guardrail: revert and incident rates. If those rates rise after a process change, the verdict is automatic. The team did not save human time; they only moved it from reviewers to the people cleaning up breakage.

This guardrail shapes decisions in both directions. It stops over-eager automation, because a shortcut that raises incidents fails the test no matter how many approvals it saves. It also permits bold moves, because a change that holds the guardrail while cutting review time is a real win, not a risky one. The same thinking appears later in their incident eval: what breaks in production becomes the curriculum for improving the automated reviewer, so the guardrail gets stronger over time rather than being a fixed line.
