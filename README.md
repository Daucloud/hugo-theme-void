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
- 🧱 Code blocks with header (language label + copy) + HLJS light/dark themes
- 🧮 KaTeX math support (inline/display) with common macros
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
languageCode = 'en-US'
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

# Main menu
[[menus.main]]
name = 'Home'
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
- Highlight.js switches themes automatically in dark/light mode.
- KaTeX supports `$…$` (inline) and `$$…$$` (display). Macros: `\E`, `\Var`, `\argmax`, `\argmin`.

### Callouts
- Shortcode: `{{< callout title="Note" type="info" >}}...{{< /callout >}}`
- Fenced syntax: 
  ```
  ```callout {.warning title="Caution"}
  Content…
  ```
  ```
- Supported `type` values: `info` (default), `tip`, `warning`, `danger`, `neutral`.
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

If you want to modify the theme, you need to install Node.js and npm. Then:

```bash
cd themes/void
npm install
npm run dev   # Development mode with auto CSS compilation
npm run build # Build once (optional)
```

This theme ships a Tailwind v4 pipeline via Hugo assets. You normally do not need to run `build` unless you want the prebuilt CSS artifact.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Hugo](https://gohugo.io/) - The world's fastest framework for building websites
