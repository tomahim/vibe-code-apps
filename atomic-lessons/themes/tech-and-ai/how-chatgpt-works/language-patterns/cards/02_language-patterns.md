---
id: 4a23e736-c517-4a69-b2bd-5c8edba5606e
position: 2
title: "Why random letters fail"
archived: false
---
Choosing each letter independently ignores how letters fit together. The resulting strings rarely resemble useful words.

If we draw letters using only their overall frequencies, we may see many e's and t's, but the result will look like noise. The choice after a letter is not independent of what came before. English words contain strong local constraints, such as common endings and uncommon combinations. A generator that ignores these relationships does not know whether a letter is beginning a word, completing a syllable, or following punctuation. Counting the correct units is only the first step; context is what makes those counts useful for language.
