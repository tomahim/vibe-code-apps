"use strict";

const copyPromptButton = document.getElementById("copy-import-prompt");
const promptText = document.getElementById("recipe-import-prompt");
const copyPromptStatus = document.getElementById("copy-import-prompt-status");

copyPromptButton.addEventListener("click", async () => {
    // Select first so copying manually also works on HTTP admin deployments
    // and when the browser denies access to the Clipboard API.
    promptText.focus();
    promptText.select();
    try {
        await navigator.clipboard.writeText(promptText.value);
        copyPromptStatus.textContent = "Prompt copied. Paste it into your LLM with your recipe inputs.";
    } catch {
        copyPromptStatus.textContent = "Prompt selected. Press Ctrl+C or Command+C to copy it.";
    }
});
