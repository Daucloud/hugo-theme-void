// Footnote housekeeping.
//
// Clicks on footnote references and back-references are handled by the generic
// in-page anchor handler (anchors.js), which scrolls with the fixed-header
// offset and highlights the target, so no click handlers live here.
export function initFootnotes() {
  relocateCalloutFootnotes();
  fixFootnoteIds();
}

// Goldmark renders a separate footnote list for Markdown rendered inside a
// callout shortcode. Merge those items into the page-level footnote list so
// all footnotes appear together at the bottom of the article.
function relocateCalloutFootnotes() {
  const calloutBlocks = Array.from(document.querySelectorAll(".callout .footnotes"));
  if (calloutBlocks.length === 0) return;

  let globalFootnotes = Array.from(document.querySelectorAll(".footnotes")).find(
    (el) => !el.closest(".callout")
  );
  const contentRoot =
    document.querySelector("article .article-prose") || document.querySelector("article .prose");

  if (!globalFootnotes) {
    globalFootnotes = document.createElement("div");
    globalFootnotes.className = "footnotes";
    globalFootnotes.appendChild(document.createElement("hr"));
    globalFootnotes.appendChild(document.createElement("ol"));
    (contentRoot || document.body).appendChild(globalFootnotes);
  }

  let globalList = globalFootnotes.querySelector("ol");
  if (!globalList) {
    globalList = document.createElement("ol");
    globalFootnotes.appendChild(globalList);
  }

  calloutBlocks.forEach((block) => {
    const list = block.querySelector("ol");
    if (list) {
      // Move the <li> nodes themselves so their ids (anchor targets) survive.
      Array.from(list.children).forEach((li) => globalList.appendChild(li));
    }
    block.remove();
  });
}

// Make sure every footnote's back-reference points at the <sup> that cites it.
function fixFootnoteIds() {
  document.querySelectorAll('sup[id^="fnref"]').forEach((ref) => {
    const link = ref.querySelector("a");
    const href = link && link.getAttribute("href");
    if (!href) return;
    const target = document.getElementById(href.slice(1));
    const backref = target && target.querySelector(".footnote-backref");
    if (backref) backref.setAttribute("href", "#" + ref.id);
  });
}
