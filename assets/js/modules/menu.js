// Mobile navigation: the hamburger toggles `.menu-open` on the header.
// Closes on Escape, on a click outside, and after following a link.
export function initMenu() {
  const header = document.querySelector("body > header");
  const button = document.getElementById("menu-toggle");
  const nav = document.getElementById("site-nav");
  if (!header || !button || !nav) return;

  const setOpen = (open) => {
    header.classList.toggle("menu-open", open);
    button.setAttribute("aria-expanded", open ? "true" : "false");
  };

  button.addEventListener("click", () => setOpen(!header.classList.contains("menu-open")));
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) setOpen(false);
  });
  document.addEventListener("click", (e) => {
    if (header.classList.contains("menu-open") && !header.contains(e.target)) setOpen(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && header.classList.contains("menu-open")) {
      setOpen(false);
      button.focus();
    }
  });
}
