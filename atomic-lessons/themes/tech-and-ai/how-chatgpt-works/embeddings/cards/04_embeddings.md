---
id: 472d198d-c944-4d53-a04c-4d8c961e932d
position: 4
title: "Images as an analogy"
archived: false
---
A digit network can form internal representations before choosing a final label. An embedding can use such intermediate features.

In a digit classifier, the final output may be a label such as “4.” Just before that decision, internal numbers may encode details like the shape and slant of the strokes. Taking those intermediate numbers as a representation can let us compare two images more richly than the final labels alone. Wolfram uses this as an analogy for text embeddings: a network trained for a practical prediction task develops useful internal features. We should not assume each feature has a clean human interpretation or a single fixed meaning.
