---
id: 9d0b64f6-d7c3-43cf-9573-34cf08794ae0
position: 6
title: "Feed it back in"
archived: false
---
The chosen token joins the visible sequence and the next prediction begins. Repeating this loop creates the response.

After “hills” is emitted, the next input context includes “The moon rose above the hills.” A new prediction may add a period or continue the scene. Repeat this process enough times and a paragraph appears. Efficient implementations can reuse some calculations from earlier steps, but the conceptual loop remains: process available context, score a next token, select it, and continue. The loop ends when a stopping token, length limit, or application rule says to stop. It does not itself certify the paragraph's facts.
