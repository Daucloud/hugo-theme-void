// Highlights the table-of-contents entry for the heading currently at the top of
// the viewport. Works for every `.toc-nav` on the page (folded TOC and sidebar).
export function initScrollSpy() {
  const tocs = [...document.querySelectorAll(".toc-nav")];
  if (!tocs.length) return;

  const linksById = new Map();
  tocs.forEach((toc) => {
    toc.querySelectorAll('a[href^="#"]').forEach((a) => {
      let id = a.getAttribute("href").slice(1);
      try { id = decodeURIComponent(id); } catch (_) {}
      if (!linksById.has(id)) linksById.set(id, []);
      linksById.get(id).push(a);
    });
  });
  const headings = [...linksById.keys()].map((id) => document.getElementById(id)).filter(Boolean);
  if (!headings.length) return;

  let active = null;
  const setActive = (id) => {
    if (id === active) return;
    active = id;
    tocs.forEach((toc) => toc.querySelectorAll("a.toc-active").forEach((a) => a.classList.remove("toc-active")));
    (linksById.get(id) || []).forEach((a) => {
      a.classList.add("toc-active");
      const side = a.closest(".toc-sidebar");
      if (side) {
        const r = a.getBoundingClientRect();
        const sr = side.getBoundingClientRect();
        if (r.top < sr.top || r.bottom > sr.bottom) a.scrollIntoView({ block: "nearest" });
      }
    });
  };

  const offset = () => (document.querySelector("body > header")?.getBoundingClientRect().height || 0) + 24;
  const update = () => {
    const y = offset();
    let current = headings[0];
    for (const h of headings) {
      if (h.getBoundingClientRect().top - y <= 0) current = h;
      else break;
    }
    setActive(current.id);
  };

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { update(); ticking = false; });
    },
    { passive: true }
  );
  update();
}
