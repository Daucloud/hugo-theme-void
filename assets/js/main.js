// Site entry point. Bundled by Hugo's js.Build (esbuild) and loaded with `defer`,
// so DOMContentLoaded fires after every deferred dependency (KaTeX, Alpine) ran.
import { initTheme } from "./modules/theme.js";
import { renderMath } from "./modules/math.js";
import { initFootnotes } from "./modules/footnotes.js";
import { initShareWidgets } from "./modules/share.js";
import { initCodeBlocks } from "./modules/codeblock.js";
import { initAnchors } from "./modules/anchors.js";

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  renderMath();
  initFootnotes();
  initShareWidgets();
  initCodeBlocks();
  initAnchors();
});
