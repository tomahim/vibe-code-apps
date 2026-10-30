---
id: b71f170b-814c-4376-aab2-fdfd50f92edc
position: 5
title: Blocking beats advising
archived: false
---
A recurring design choice in this system is that important checks block instead of advise. Required CI blocks. Open review findings block. Open security findings block. Advisory warnings, by contrast, decay: the first few get read, the tenth gets skimmed, and the hundredth is invisible.

Blocking power is what keeps signal high in the other direction. Because a block costs the author time, the team works hard on the precision of each blocking check, from verifier voting to the nit caps in REVIEW.md. A blocking check that is often wrong gets routed around and the whole layer loses authority. The lesson for your own setup is to give blocking power sparingly, to the checks you keep precise, and let everything else report without stopping the merge.
