---
id: 97ddb0c0-2057-4850-b5be-c9ab219bcc22
position: 2
title: "Embeddings move through blocks"
archived: false
---
Successive blocks transform and combine information across positions. The resulting representation reflects the context processed so far.

Each transformer block changes the token representations using attention and other learned operations. A later block receives the results of earlier blocks, so it can combine local and more distant information. For “The moon rose above the,” the representation near the end can carry cues about the scene and grammar. It is tempting to imagine a single layer assigned to “meaning” and another to “style,” but the real computation is distributed. The important sequence is input vectors, repeated transformations, then output scores for the next token.
