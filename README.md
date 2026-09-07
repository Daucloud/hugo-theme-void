# Void - A Clean Modern Hugo Blog Theme

Void is a clean, modern Hugo blog theme built with [Tailwind CSS](https://tailwindcss.com/). It's designed for personal blogs with a focus on content presentation and reading experience.

<!-- Screenshot will be added in the future -->
<!-- ![Void Theme Preview](./static/images/screenshot.png) -->
## Example Site
[Daucloud's Blog](https://www.daucloud.com/)

## Features

- 🎨 Tailwind CSS design · fully responsive
- 🌗 Dark/Light mode with animated icon toggle (no flash on load)
- 🧭 Table of Contents: folded <details> in the article, or a sticky sidebar in the right gutter on wide screens (>= 1472px), with scroll-spy highlighting
- 🔗 In‑page anchor highlight and copy‑permalink by clicking headings
- 🧱 Code blocks with header (language label + copy button), class-based Chroma light/dark palettes
- 🧮 KaTeX math rendered at build time (no client-side JavaScript), CSS/fonts self-hosted
- 🔤 Self-hosted fonts (STIX Two Text, Noto Serif SC, JetBrains Mono), nothing from Google Fonts
- 📐 TeX-flavoured article typography: justified text, indented paragraphs, numbered sections (`numbered = false` to opt out)
- 🖼️ Responsive WebP images with srcset and intrinsic sizes via a render-image hook
- 🌐 Per-post `language` front matter for a correct `<html lang>` on mixed-language blogs
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
languageCode = 'zh-CN'          # default <html lang>; per-page override via `language` front matter
defaultContentLanguage = 'en'   # UI language: picks i18n/en.toml
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

# Required for the theme's code blocks (class-based Chroma output)
[markup.highlight]
  noClasses = false
  lineNos = true
  lineNumbersInTable = true

# Math: KaTeX is rendered at build time from these passthrough delimiters
[markup.goldmark.extensions.passthrough]
  enable = true
  [markup.goldmark.extensions.passthrough.delimiters]
    block = [['$$', '$$'], ['\\[', '\\]']]
    inline = [['$', '$'], ['\\(', '\\)']]

# Image processing defaults used by the render-image hook / figure shortcode
[imaging]
  quality = 85
  resampleFilter = 'Lanczos'

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
- Chroma highlighting switches themes automatically in dark/light mode (`markup.highlight.noClasses = false` required, see below).
- KaTeX supports `$…$` (inline) and `$$…$$` (display), rendered at build time by `transform.ToMath`; append `{#some-id}` on the line after a display block to make it linkable.

### Mixed-language content
- UI strings follow the site language: `defaultContentLanguage` picks `i18n/<lang>.toml`.
- `languageCode` is the default `<html lang>`. Any page may override it with `language = "en"` (or `"zh-CN"`, …) in front matter, so a mostly-Chinese blog can keep `languageCode = 'zh-CN'` and tag its English posts. Hugo reserves the key `lang`, hence `language`.

### Fonts (self-hosted)
- Body: STIX Two Text (Latin) + Noto Serif SC (CJK); code: JetBrains Mono; math: KaTeX's own fonts. Nothing is fetched from Google Fonts at runtime.
- Files live in `static/fonts/`, `@font-face` rules in `assets/css/fonts/`. The CJK declaration is loaded as a
  separate non-blocking stylesheet because its ~200 unicode-range slices are large; a page only downloads the
  slices it needs, and `local()` sources skip the download for visitors who have the font installed.
- Mirror a Google Fonts family with `tools/fetch-google-font.py`. See `static/fonts/README.md` for licenses.

### Article typography (TeX flavour)
- Paragraphs are justified with automatic hyphenation (driven by the page `lang`), indented two ems and set
  without a gap between them. Chinese posts indent every paragraph; English posts skip the indent after a heading.
- Headings use book-like proportions (1.5em / 1.25em / 1.1em) and are numbered 1, 1.1, 1.1.1 via CSS counters,
  starting at the highest level the post uses (h1 or h2). Numbers also appear in the table of contents.
  Set `numbered = false` in front matter to turn numbering off for a post.

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

### Colors and dark mode
- All colors go through semantic tokens defined at the top of `assets/css/main.css` (`--canvas`, `--surface`, `--fg`, `--fg-muted`, `--line`, `--accent`, …). `:root` holds the light values, `.dark` the dark ones, and `@theme inline` exposes them as Tailwind utilities (`bg-surface`, `text-fg-muted`, `border-line`, `hover:bg-hover`, `text-accent`).
- Use those utilities in templates instead of raw palette classes; there is no `dark:` variant to maintain and no override block.

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
