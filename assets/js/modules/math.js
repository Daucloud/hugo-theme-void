// Client-side KaTeX auto-render. KaTeX and its auto-render extension are loaded
// from a CDN with `defer` in head/js.html, so by DOMContentLoaded
// `renderMathInElement` is defined. To be replaced by build-time rendering.
export function renderMath() {
  if (typeof window.renderMathInElement !== "function") return;
  window.renderMathInElement(document.body, {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "$", right: "$", display: false },
    ],
    throwOnError: false,
  });
}
