---
id: 7e46cfd2-66bb-4e19-bffb-8a9f77b8a388
position: 1
title: "Tokens enter the transformer"
archived: false
---
The current context is turned into token representations. These form the input to a pass through the network.

Suppose the prompt is “The moon rose above the.” The tokenizer supplies a sequence of IDs, and the embedding stage turns them into numerical vectors with order information. Those vectors enter the transformer for a pass through its layers. The pass is performed for the current context, not for an answer that has already been completed. At the end, the model is ready to score possible next tokens such as “hills” or “harbor.” This is the inference phase: using trained weights to produce an output, rather than updating those weights.
