---
id: d33c9c4a-74aa-4ae0-8ecd-2f900d404d79
position: 2
title: The two sides of review's cost
archived: false
---
Human time pays for review twice. The first cost is obvious: the hours people spend reading and commenting on changes. The second cost hides downstream: the time people spend fixing what bad code breaks after it ships.

Cutting the first cost does not help if the time simply reappears as the second. A process that saves twenty minutes of review per change but lets one extra incident a week through has not saved anything; it has moved the bill to whoever is on call. This is why the team refuses to measure review effort alone. Any claim that a change to the process saves human time has to be checked against the revert and incident rates, which is where the hidden second cost would surface.
