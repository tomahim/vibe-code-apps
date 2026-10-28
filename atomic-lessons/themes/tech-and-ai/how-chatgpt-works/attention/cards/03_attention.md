---
id: 2f4ac5dc-4247-43c3-b2c2-e41fc770fc54
position: 3
title: "Weighted connections"
archived: false
---
Attention gives different previous positions different weights for the current calculation. The weights depend on the current input.

For a current token, attention assigns numerical weights to earlier token representations and combines them. A large weight can make one earlier position contribute more to that calculation, though the meaning of the weight depends on the surrounding transformations. For example, a pronoun's representation might draw on a noun earlier in the sentence. These weights are computed from the current input, so the pattern can change when the sentence changes. They are different from the fixed learned parameters that help compute the attention pattern itself.
