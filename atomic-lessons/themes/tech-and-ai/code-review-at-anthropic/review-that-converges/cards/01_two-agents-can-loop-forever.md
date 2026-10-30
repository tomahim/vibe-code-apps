---
id: 37d072b5-c50e-4b06-97de-be727f8990d1
position: 1
title: Two agents can loop forever
archived: false
---
An agent author and an agent reviewer can keep each other busy indefinitely. The reviewer finds something, the author fixes it and possibly introduces something new, the reviewer finds that, and around they go. One CLI pull request on the team went through more than fifty rounds of review and fixes overnight before its author stopped it.

The fifty-round night is funny once and expensive always. Each round costs compute, delays the change, and risks new breakage from fixes chasing ever-smaller issues. Worse, the loop feels productive, because every round really does catch something. The team had gotten used to running several rounds by default for exactly that reason. On a risky change the extra passes can be worthwhile, but on every pull request the habit was burning resources long after the marginal finding stopped mattering.
