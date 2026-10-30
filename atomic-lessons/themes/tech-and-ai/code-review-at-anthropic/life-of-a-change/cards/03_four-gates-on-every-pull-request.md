---
id: 234391d9-ca2e-49dc-bc2d-13a3af76a9ec
position: 3
title: Four gates on every pull request
archived: false
---
Once a pull request opens, four checks stand between it and merging. Required CI runs lint, types, tests across platforms, and the build and packaging; anything red blocks the merge outright. Claude code review sends agents hunting for bugs in parallel, with verifier agents voting on each finding and survivors ranked by severity.

Security review is a separate pass, because a bug hunter and a security reviewer look for different things. Open findings from either review block the merge until they are fixed or explicitly resolved. Finally, risk-based approval decides how many humans must sign off: a classifier sets the tier, zero, one, or two people, and some paths always need a person. The later lessons in this path take each of these four gates apart.
