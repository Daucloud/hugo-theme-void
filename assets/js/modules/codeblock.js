import { copyText } from "./clipboard.js";

const ICON_COPY =
  '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>';
const ICON_DONE =
  '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>';

// The code cell of a Chroma line-number table, in order of preference.
const CODE_SELECTORS = [
  ".code-highlight-variant code[data-lang]",
  ".code-highlight-variant td:last-child code",
  ".code-highlight-variant code:last-of-type",
];

function getCodeText(block) {
  for (const selector of CODE_SELECTORS) {
    const el = block.querySelector(selector);
    const text = el && el.textContent ? el.textContent.replace(/\n$/, "") : "";
    if (text) return text;
  }
  return "";
}

function flash(button) {
  button.setAttribute("aria-label", "Copied");
  button.setAttribute("title", "Copied");
  button.innerHTML = ICON_DONE;
  setTimeout(() => {
    button.setAttribute("aria-label", "Copy code");
    button.setAttribute("title", "Copy code");
    button.innerHTML = ICON_COPY;
  }, 1600);
}

// Copy button in every code block header (see render-codeblock.html).
export function initCodeBlocks() {
  document.querySelectorAll("[data-code-block]").forEach((block) => {
    const button = block.querySelector(".copy-button");
    if (!button) return;
    button.addEventListener("click", () => {
      const code = getCodeText(block);
      if (!code) return;
      copyText(code).then(() => flash(button)).catch(() => {});
    });
  });
}
