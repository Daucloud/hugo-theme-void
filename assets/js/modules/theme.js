// Dark / light theme toggle. The <head> inline script already applied the
// initial class before first paint; this module wires up the button and keeps
// following the system preference while the visitor has no explicit choice.
const STORAGE_KEY = "theme";

function readStored() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch (_) {
    return null;
  }
}

function writeStored(value) {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch (_) {}
}

function systemPrefersDark() {
  return !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
}

function currentPref() {
  const v = readStored();
  if (v === "dark" || v === "light") return v;
  return systemPrefersDark() ? "dark" : "light";
}

export function initTheme() {
  const root = document.documentElement;
  const btn = document.getElementById("theme-toggle");

  const apply = (theme) => {
    root.classList.toggle("dark", theme === "dark");
    if (btn) {
      btn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
      btn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    }
  };

  let theme = currentPref();
  apply(theme);

  if (btn) {
    btn.addEventListener("mousedown", (e) => e.preventDefault());
    btn.addEventListener("click", () => {
      theme = theme === "dark" ? "light" : "dark";
      writeStored(theme);
      apply(theme);
      btn.blur();
    });
  }

  try {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (!readStored()) {
        theme = currentPref();
        apply(theme);
      }
    };
    if (media.addEventListener) media.addEventListener("change", handler);
    else if (media.addListener) media.addListener(handler);
  } catch (_) {}
}
