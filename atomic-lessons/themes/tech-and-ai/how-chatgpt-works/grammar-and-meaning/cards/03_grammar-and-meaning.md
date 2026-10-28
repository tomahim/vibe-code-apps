---
id: eaba06c0-745d-41f1-a68d-1534297f93c2
position: 3
title: "Nested relationships"
archived: false
---
Clauses and phrases can depend on earlier parts of a sentence. A model must track more than adjacent word pairs to handle them.

In “The report that the scientist revised was published,” the main subject “report” connects to “was published” across an intervening clause. An n-gram that sees only nearby words has a limited view of this structure. A transformer can mix information across positions, giving it a way to represent longer relationships. That does not mean every nested construction will be handled perfectly. It means the architecture can use more than a short local window while learning the patterns of syntax from examples.
