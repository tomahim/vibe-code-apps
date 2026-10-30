---
id: dd6b9b93-f06e-40a7-846c-b5aded0f6154
position: 5
title: Owning the outcome
archived: false
---
The fifth job underlies the rest: a person is accountable for every change that ships, whoever typed it. On the team this lives as a norm called “you land it, you own it.” If you land a small or medium change and something goes wrong, you usually fix it.

Several things keep that norm from going badly. Changes are small, so they are easy to review, debug, and revert. Everything is reversible: flags, reverts, and staged releases undo most mistakes in minutes. Blast radius sets the bar, so expensive code gets more people and more checks. Regressions surface fast through telemetry and internal use. And it is not blame: owning a fix means you have the most context, and incident reviews look at the system, not the person. Ownership is also shared, with much of the team working in open channels where anyone can pick up a thread.
