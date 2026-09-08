import { copyText } from "./clipboard.js";

// In-page navigation:
//  - any `a[href^="#"]` link (TOC, footnotes, heading anchors from other pages)
//    scrolls smoothly with a fixed-header offset and highlights the target;
//  - the anchor icon rendered next to each heading copies the section permalink;
//  - the matching TOC entry is marked active.

let currentHighlighted = null;
let scrollArmTimer = null;

function removeHandlers() {
  window.removeEventListener("scroll", clearOnce);
  window.removeEventListener("keydown", clearOnce);
  window.removeEventListener("pointerdown", clearOnce);
  window.removeEventListener("touchstart", clearOnce);
}

function clearOnce() {
  if (currentHighlighted) {
    currentHighlighted.classList.remove("anchor-highlight");
    currentHighlighted = null;
  }
  removeHandlers();
}

function headerHeight() {
  const hd = document.querySelector("body > header");
  return hd ? hd.getBoundingClientRect().height : 0;
}

function scrollToTarget(el) {
  if (!el) return;
  const offset = headerHeight() + 8;
  const top = window.pageYOffset + el.getBoundingClientRect().top - offset;
  window.scrollTo({ top, behavior: "smooth" });
}

// Pick the most precise element to highlight for a given anchor target.
function pickHighlightTarget(el) {
  if (!el) return null;
  if (el.tagName === "IMG") return el;
  if (el.classList && (el.classList.contains("katex-display") || el.classList.contains("katex"))) return el;
  if (el.tagName === "SPAN") {
    return el.querySelector("img") || el.querySelector(".katex-display, .katex") || el;
  }
  return (
    el.closest("h1,h2,h3,h4,h5,h6") ||
    el.closest(".code-block-container") ||
    el.closest(".katex-display") ||
    el.closest("pre,figure,table,blockquote,li") ||
    el
  );
}

function setTocActive(id) {
  const esc = window.CSS && CSS.escape ? CSS.escape : (s) => String(s).replace(/[^a-zA-Z0-9_\-]/g, "\\$&");
  document.querySelectorAll(".toc-nav").forEach((toc) => {
    toc.querySelectorAll("a.toc-active").forEach((a) => a.classList.remove("toc-active"));
    const link = toc.querySelector('a[href="#' + esc(id) + '"]');
    if (link) link.classList.add("toc-active");
  });
}

function highlightById(id) {
  if (!id) return;
  try {
    id = decodeURIComponent(id);
  } catch (_) {}
  const el = document.getElementById(id);
  if (!el) return;
  const target = pickHighlightTarget(el);
  if (currentHighlighted && currentHighlighted !== target) {
    currentHighlighted.classList.remove("anchor-highlight");
  }
  target.classList.add("anchor-highlight");
  currentHighlighted = target;
  setTocActive(id);
  scrollToTarget(target);

  // Clear on the next interaction; arm the scroll listener late so the smooth
  // scroll we just started does not immediately clear the highlight.
  removeHandlers();
  window.addEventListener("keydown", clearOnce, { once: true });
  window.addEventListener("pointerdown", clearOnce, { once: true });
  window.addEventListener("touchstart", clearOnce, { once: true });
  if (scrollArmTimer) clearTimeout(scrollArmTimer);
  scrollArmTimer = setTimeout(() => {
    window.addEventListener("scroll", clearOnce, { once: true });
  }, 1500);
}

function copyPermalink(anchor, id) {
  const url = location.origin + location.pathname + (id ? "#" + id : "");
  const done = () => {
    anchor.classList.add("copied");
    anchor.setAttribute("aria-label", "Copied");
    setTimeout(() => {
      anchor.classList.remove("copied");
      anchor.setAttribute("aria-label", "Copy link to this section");
    }, 1200);
  };
  copyText(url).then(done, done);
  if (id) {
    try {
      if (history.pushState) history.pushState(null, "", "#" + id);
      else location.hash = id;
    } catch (_) {}
    highlightById(id);
  }
}

export function initAnchors() {
  if (location.hash && location.hash.length > 1) {
    // Wait for the initial layout before scrolling and highlighting.
    setTimeout(() => highlightById(location.hash.slice(1)), 0);
  }
  window.addEventListener("hashchange", () => {
    if (location.hash && location.hash.length > 1) highlightById(location.hash.slice(1));
  });
  window.addEventListener("popstate", () => {
    if (location.hash && location.hash.length > 1) highlightById(location.hash.slice(1));
  });

  // Heading anchor icons copy the permalink.
  document.addEventListener(
    "click",
    (e) => {
      const btn = e.target.closest("a.heading-anchor");
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      const href = btn.getAttribute("href") || "";
      copyPermalink(btn, href.startsWith("#") ? href.slice(1) : "");
    },
    true
  );

  // Every other in-page hash link.
  document.addEventListener(
    "click",
    (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a || (a.classList && a.classList.contains("heading-anchor"))) return;
      const href = a.getAttribute("href");
      if (!href || href === "#" || href.length < 2) return;
      const id = href.slice(1);
      let decoded = id;
      try {
        decoded = decodeURIComponent(id);
      } catch (_) {}
      if (!document.getElementById(decoded)) return; // not an in-page anchor
      e.preventDefault();
      if (history.pushState) history.pushState(null, "", "#" + id);
      else location.hash = id;
      highlightById(decoded);
    },
    true
  );
}
