// Site entry point. Bundled by Hugo's js.Build (esbuild) and loaded with `defer`.
import { initTheme } from "./modules/theme.js";
import { initFootnotes } from "./modules/footnotes.js";
import { initShareWidgets } from "./modules/share.js";
import { initCodeBlocks } from "./modules/codeblock.js";
import { initAnchors } from "./modules/anchors.js";
import { initMenu } from "./modules/menu.js";
import { initScrollSpy } from "./modules/scrollspy.js";

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initFootnotes();
  initShareWidgets();
  initCodeBlocks();
  initAnchors();
  initMenu();
  initScrollSpy();
});
