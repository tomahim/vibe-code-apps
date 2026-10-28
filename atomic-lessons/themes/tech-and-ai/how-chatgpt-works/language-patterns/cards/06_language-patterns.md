---
id: 3f5ff523-4a61-413b-aae7-7c36661a2531
position: 6
title: "Why counting alone runs out"
archived: false
---
Possible word sequences multiply rapidly as their length grows. Even a huge collection of text leaves most long sequences unseen.

With a vocabulary of tens of thousands of words, the number of possible two-word pairs is already enormous. Add a third word and the space grows again by the vocabulary size. Most long combinations will never appear in any available corpus, including combinations that a person would readily understand. A pure lookup table would have no measured count for them. A learned model instead tries to share information across related contexts, so it can estimate a continuation for a phrase it has not encountered verbatim.
