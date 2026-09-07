# Void - A Clean Modern Hugo Blog Theme

Void is a clean, modern Hugo blog theme built with [Tailwind CSS](https://tailwindcss.com/). It's designed for personal blogs with a focus on content presentation and reading experience.

<!-- Screenshot will be added in the future -->
<!-- ![Void Theme Preview](./static/images/screenshot.png) -->
## Example Site
[Daucloud's Blog](https://www.daucloud.com/)

## Features

- 🎨 Tailwind CSS design · fully responsive
- 🌗 Dark/Light mode with animated icon toggle (no flash on load)
- 🧭 Collapsible Table of Contents with active item highlight
- 🔗 In‑page anchor highlight and copy‑permalink by clicking headings
- 🧱 Code blocks with header (language label + copy button), Chroma light/dark highlighting
- 🧮 KaTeX math support (inline/display)
- 🌐 Single-language site with per-post `language` switch for `<html lang>` and UI strings
- 📰 Full-content RSS feed, 404 page, lazy-loaded Disqus with offline fallback
- ✍️ Readability tweaks: paragraph/list spacing, footnotes, tag chips, cards
- 🏷️ Tags & categories, reading time, social links

## Installation

### Method 1: As a Git Submodule (Recommended)

```bash
cd yourHugoSite
git submodule add https://github.com/Daucloud/hugo-theme-void themes/void
```

### Method 2: Direct Download

1. Download the [latest release](https://github.com/Daucloud/hugo-theme-void/releases)
2. Extract to the `themes/void` directory
3. Set the theme in your Hugo configuration file: `theme = "void"`

## Quick Start

Create a new site and apply the Void theme:

```bash
hugo new site mysite
cd mysite
git init
git submodule add https://github.com/Daucloud/hugo-theme-void themes/void
echo 'theme = "void"' >> hugo.toml
hugo server -D
```

## Configuration

Add the following configuration options to your `hugo.toml` (or `config.toml`):

```toml
baseURL = 'https://example.org/'
languageCode = 'zh-CN'          # or 'en-US'; picks i18n/<lang>.toml for the site chrome
defaultContentLanguage = 'zh'   # must match the i18n file name
hasCJKLanguage = true           # correct word counts / summaries for Chinese content
enableRobotsTXT = true
title = 'Your Site Title'
theme = "void"

# Social media links
[params]
  [params.social]
    github = "https://github.com/yourusername"
    twitter = "https://twitter.com/yourusername"
    email = "your.email@example.com"
  [params.avatar]
    url = "https://example.com/your-avatar.jpg"

# Main menu. `identifier` matches an i18n key (nav_home, nav_posts, ...) so the
# label follows the site language; drop it to show `name` verbatim.
[[menus.main]]
name = 'Home'
identifier = 'nav_home'
pageRef = '/'
weight = 10

[[menus.main]]
name = 'Posts'
pageRef = '/posts'
weight = 20

[[menus.main]]
name = 'Tags'
pageRef = '/tags'
weight = 30

[[menus.main]]
name = 'About'
pageRef = '/about'
weight = 40

# Table of Contents (recommended)
[markup]
  [markup.tableOfContents]
    startLevel = 1
    endLevel = 6
    ordered = false

# Allow raw HTML within Markdown (for KaTeX, etc.)
  [markup.goldmark]
    [markup.goldmark.renderer]
      unsafe = true
```

### TOC & Anchors
- A collapsible TOC appears near the top of articles when headings exist.
- The current item in the TOC is highlighted when navigating via TOC/hash links.
- Targets are highlighted and scrolled with a fixed‑header offset to remain visible.

### Code & Math
- Use fenced code blocks with a language hint (```go, ```python, …).
- Each block is wrapped with a small header showing the language and a copy button.
- Chroma highlighting switches themes automatically in dark/light mode.
- KaTeX supports `$…$` (inline) and `$$…$$` (display).

### Mixed-language content
- The site has one language (`languageCode`), but any page may set `language = "en"` (or `"zh"`) in front matter.
- The theme then emits `<html lang="en">` for that page and switches the article-page UI strings (reading time, TOC, prev/next, comments) using `data/ui.toml`.
- Site-wide chrome (header, footer, list pages) always follows the site language via `i18n/`.

### Feeds, 404, comments
- `index.xml` is a full-content RSS feed (`content:encoded`) limited to the `posts` section; the head carries the autodiscovery link.
- `layouts/404.html` is served by GitHub Pages / Netlify automatically.
- Disqus (`[services.disqus] shortname`) loads lazily when the comment box scrolls into view; if the embed is blocked or times out, a message with a retry button replaces the spinner.

### Callouts
- Shortcode: `{{< callout title="Note" type="info" >}}...{{< /callout >}}`
- Fenced syntax: 
  ```
  ```callout {.warning title="Caution"}
  Content…
  ```
  ```
- Supported `type` values: `info` (default), `tip`, `warning`, `danger`, `neutral`.
- `title` supports inline Markdown and inline math, for example `title="Definition: $V^{\\pi}(s)$"`.
- If the title contains TeX braces such as `\mathbf{...}`, put it on the first line of the block body instead of the fence attributes:
  ```
  ```callout {.neutral collapsible="true"}
  title: Proof: Invertibility for $\mathbf{I}-\gamma\mathbf{P}_{\pi}$

  Content…
  ```
  ```
- Works with regular Markdown and KaTeX math. Background/accent adapts to dark mode automatically.
- Example:

  ```markdown
  {{< callout title="Definition" type="neutral" >}}
  State–action value:  
  $$ v_\pi(s_t, a_t) = \mathbb{E}_\pi\left[ \sum_{i=t}^T \gamma^{i-t} r_i \right] $$
  {{< /callout >}}
  ```

### Dark/Light Toggle
- The toggle is a plain icon button in the header; state persists in `localStorage` and respects system preference when unset.
- No white‑flash on initial load: the theme is applied as early as possible.

### Adjust the toggle icon size
- File: `themes/void/layouts/partials/header.html:9`
- Change the button size classes (example):

  - Current: `h-6 w-6`
  - Smaller: `h-5 w-5`
  - Larger: `h-7 w-7`

- The two SVGs inside use `h-full w-full`, so they follow the button size.

## Development

CSS is compiled by Hugo itself through `css.TailwindCSS` (Tailwind v4, CSS-first
config in `assets/css/main.css`). The Tailwind CLI has to be resolvable from the
**site** root, not the theme:

```bash
cd yourHugoSite
npm install -D tailwindcss @tailwindcss/cli
hugo server
```

JavaScript lives in `assets/js/` as ES modules and is bundled by Hugo's `js.Build`
(esbuild); `assets/js/main.js` is the entry point. No separate build step is needed.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Hugo](https://gohugo.io/) - The world's fastest framework for building websites
