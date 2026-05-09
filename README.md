# Brochures Template

A complete template for building brand-driven multi-page A4 brochures with Claude Code. Each brochure is a folder of standalone HTML pages, rendered to PDF via Puppeteer + Ghostscript.

Brand assets (guidelines, tone of voice, design tokens, logos) are pulled in from a separate `Brand-Shared` repo as a git submodule, so brand updates only happen in one place.

---

## Getting started

**After cloning this repo, run the setup script. It walks you through everything in plain language:**

```bash
node setup.js
```

The script will:

- Pull in the `Brand-Shared` submodule (so the `brand-shared/` folder isn't empty)
- Install the renderer dependencies (Puppeteer)
- Check that Ghostscript is installed (it compresses PDFs after rendering)
- Tell you whether your brand has been filled in yet

It runs once. After it's done it skips itself on subsequent runs.

**Prerequisites:** Node.js installed. Get the LTS version from [nodejs.org](https://nodejs.org/) if you don't have it.

Once setup is complete:

1. **Fill in your brand** — populate the [Brand-Shared](https://github.com/AskerJ-pers/Brand-Shared) repo with your tokens, references, and logos. The setup script will tell you whether this still needs doing.
2. **Add your images** — drop product screenshots into `images/product/<product>/`, photography into `images/stock/`, and add entries to `images/index.json`
3. **Start creating** — open Claude Code in this repo and ask it to create your first brochure

<details>
<summary><strong>Prefer to do it manually?</strong></summary>

```bash
# Pull the brand submodule
git submodule update --init --recursive

# Install the renderer
cd server && npm install

# Install Ghostscript (one-time, system-wide)
# macOS:    brew install ghostscript
# Linux:    sudo apt install ghostscript
# Windows:  download from ghostscript.com
```
</details>

---

## Folder structure

| Path | What it is |
|---|---|
| [`brand-shared/`](./brand-shared/) | Submodule — shared brand resources |
| [`templates/`](./templates/) | Brochure page blueprints — complete, self-contained HTML |
| [`materials/`](./materials/) | Output brochures, one folder each |
| [`images/`](./images/) | Shared image library with per-image JSON metadata |
| [`server/`](./server/) | Puppeteer-based PDF renderer + static file server |
| [`CLAUDE.md`](./CLAUDE.md) | Agent-facing workflow and rules for composing brochures |

---

## Format basics

| Type | Dimensions @ 96 dpi |
|---|---|
| Single A4 page | 794 × 1123 px (210 × 297mm) |
| Double spread | 1588 × 1123 px (420 × 297mm) |

A standard brochure: cover (single) → benefits (spread) → platform (spread) → features (one or more spreads) → expert spread → back cover (single).

---

## Editing workflow

```bash
# Start the static server (handles relative image paths correctly)
node server/serve.js
# → open http://localhost:3000/materials/<brochure-name>/design-files/cover.html
```

Edit `contenteditable` text directly in the browser. Save with **Cmd+Alt+S** (Ctrl+Alt+S on Windows) — first press opens a Save As dialog, subsequent presses save silently.

For review only, open `materials/<brochure-name>/review.html` — that's a scrollable iframe-based viewer of all pages. Iframes there are non-interactive — open individual page files to edit.

---

## Scaffolding a new brochure

The fastest way to start a new brochure:

```bash
node server/scaffold.js <brochure-name>
```

This creates `materials/<brochure-name>/design-files/` seeded with three pages (cover, features, back-cover) copied from `templates/`, plus a `pages.json` listing them in order. Open the cover via `node server/serve.js`, edit in place, then ask Claude to add more pages from the templates.

---

## Rendering to PDF

```bash
node server/render-brochure.js materials/<brochure-name>/
```

The script reads `pages.json` from the brochure folder for page order. Always produces two output files:

- `<brochure-name>-print.pdf` — 300 dpi, Ghostscript `/printer` preset
- `<brochure-name>.pdf` — 150 dpi, Ghostscript `/ebook` preset

See [`CLAUDE.md`](./CLAUDE.md) for the full workflow when creating or editing brochures with Claude Code.

---

## Updating shared brand assets

The `brand-shared/` directory is a git submodule pointing to a separate `Brand-Shared` repo. To update brand assets:

```bash
# In the Brand-Shared repo:
# 1. Edit references/, tokens.css, tokens.json, brand/
# 2. Commit and push

# Back in this repo:
git submodule update --remote brand-shared
git add brand-shared
git commit -m "Update brand-shared to latest"
git push
```

---

## InDesign measurement conversion

Brochure measurements often come from Adobe InDesign. InDesign reports values in points (pt) but displays the unit label as "px". **Always convert:**

```
HTML pixels = InDesign value × 1.333
```

Apply to every position, size, spacing, and margin value. Never apply InDesign values directly to CSS without converting.

---

## Using this as a GitHub template

This repo is designed to be used as a [GitHub template repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-template-repository). When you create a new repo from it:

1. Run `git submodule update --init --recursive` to pull in the brand assets
2. Either fork `Brand-Shared` for your own brand and update `.gitmodules` to point to your fork, or populate the existing `Brand-Shared` repo
3. Add your images to `images/` and update `images/index.json`
4. Start creating brochures
