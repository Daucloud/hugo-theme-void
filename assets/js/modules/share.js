import { copyText } from "./clipboard.js";

// "Share" button in the article header: copies "title\nsummary\nurl".
export function initShareWidgets() {
  document.querySelectorAll("[data-share-widget]").forEach((widget) => {
    const button = widget.querySelector("[data-share-copy-summary]");
    const label = widget.querySelector("[data-share-label]");
    if (!button || !label) return;

    const summary = [
      widget.dataset.shareTitle || document.title,
      widget.dataset.shareText || "",
      widget.dataset.shareUrl || window.location.href,
    ]
      .filter(Boolean)
      .join("\n");

    const messages = {
      defaultLabel: widget.dataset.shareLabelDefault || "Share",
      successLabel: widget.dataset.shareLabelSuccess || "Copied",
      copyFailed: widget.dataset.shareCopyFailed || "Copy failed.",
    };

    let feedbackTimer = null;
    const setState = (message, isError) => {
      label.textContent = message;
      button.classList.toggle("is-error", !!isError);
      button.classList.toggle("is-success", !isError && message === messages.successLabel);
      if (feedbackTimer) window.clearTimeout(feedbackTimer);
      feedbackTimer = window.setTimeout(() => {
        label.textContent = messages.defaultLabel;
        button.classList.remove("is-error", "is-success");
      }, 1600);
    };

    button.addEventListener("click", async () => {
      try {
        await copyText(summary);
        setState(messages.successLabel, false);
        button.blur();
      } catch (_) {
        setState(messages.copyFailed, true);
      }
    });
  });
}
