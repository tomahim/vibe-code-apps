---
id: 9714d0cf-cb84-4928-a08c-0f3580d49e14
position: 1
title: "Instructions join the context"
archived: false
---
The words of a prompt become part of the input the model processes. Their wording can change the distribution of likely responses.

Compare “Describe a bicycle” with “Describe a bicycle to a six-year-old in two sentences.” The second prompt supplies an audience and length constraint, changing which responses fit the context. The model processes those instructions as input tokens along with any earlier conversation. This can steer style and content without changing the model's stored weights. Prompt wording matters because it shapes the prediction problem the model is solving, but a well-worded instruction is not a guarantee that the answer will be accurate or complete.
