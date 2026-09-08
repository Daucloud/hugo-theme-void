// Lazy-loaded Disqus with failure handling.
//
// Loads the Disqus embed when the comment container scrolls into view or the
// visitor clicks the button. If the script fails to load or no thread iframe
// appears within TIMEOUT_MS (Disqus is blocked in mainland China), the spinner
// is replaced by a message and a retry button.
(function () {
  const container = document.getElementById("disqus_thread_container");
  if (!container) return;

  const shortname = container.dataset.shortname;
  const thread = document.getElementById("disqus_thread");
  const button = document.getElementById("load-disqus");
  const loading = document.getElementById("disqus-loading");
  const error = document.getElementById("disqus-error");
  const retry = document.getElementById("disqus-retry");
  const TIMEOUT_MS = 15000;

  let state = "idle"; // idle | loading | loaded | failed
  let timer = null;
  let observer = null;

  // Disqus reads this global when embed.js runs.
  window.disqus_config = function () {
    this.page.url = container.dataset.pageUrl;
    this.page.identifier = container.dataset.pageIdentifier;
  };

  function show(el, on) {
    if (el) el.classList.toggle("hidden", !on);
  }

  function cleanup() {
    if (timer) clearTimeout(timer);
    timer = null;
    if (observer) observer.disconnect();
    observer = null;
  }

  function fail() {
    if (state !== "loading") return;
    state = "failed";
    cleanup();
    const script = document.getElementById("disqus-embed-script");
    if (script) script.remove();
    show(loading, false);
    show(error, true);
  }

  function succeed() {
    if (state !== "loading") return;
    state = "loaded";
    cleanup();
    show(loading, false);
  }

  function load() {
    if (state === "loading" || state === "loaded" || !shortname) return;
    state = "loading";
    show(button, false);
    show(error, false);
    show(loading, true);

    // Consider the embed loaded once it injects its iframe into the thread.
    if (thread && "MutationObserver" in window) {
      observer = new MutationObserver(function () {
        if (thread.querySelector("iframe")) succeed();
      });
      observer.observe(thread, { childList: true, subtree: true });
    }
    timer = setTimeout(function () {
      if (thread && thread.querySelector("iframe")) succeed();
      else fail();
    }, TIMEOUT_MS);

    const script = document.createElement("script");
    script.id = "disqus-embed-script";
    script.src = "https://" + shortname + ".disqus.com/embed.js";
    script.setAttribute("data-timestamp", String(Date.now()));
    script.onerror = fail;
    (document.head || document.body).appendChild(script);
  }

  if (button) button.addEventListener("click", load);
  if (retry) retry.addEventListener("click", load);

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            load();
            io.disconnect();
          }
        });
      },
      { rootMargin: "0px 0px 200px 0px" }
    );
    io.observe(container);
  }
})();
