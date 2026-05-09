# Brochures — Agent Instructions

This repo contains multi-page A4 brochure documents built from a shared template system. Brand assets (guidelines, tone of voice, design tokens, logos) are pulled in from a separate submodule at `brand-shared/`.

> **Setup required:** If this is a freshly-cloned repo, run `node setup.js` once before creating any materials. The script pulls in the Brand-Shared submodule, installs the renderer, and checks your environment. It writes a `.setup-complete` marker when done and self-skips on subsequent runs. See [`README.md`](./README.md) for details.

---

## First-time setup check

Before starting any work in this repo, check that initial setup has been completed:

1. Check whether `.setup-complete` exists at the repo root.
2. **If it does NOT exist**, this is a freshly-cloned repo that hasn't been set up yet. Stop, tell the user, and run setup before proceeding:

   > "This repo hasn't been set up yet. I'll run `node setup.js` — it walks through pulling in the Brand-Shared resources, installing the renderer, and checking your environment. This only happens once."

   Then run `node setup.js` for them. Surface any errors (Node missing, Ghostscript missing, network access denied, etc.) as they happen so the user can resolve them. The script is interactive and will pause for an Enter keypress at the start — let the user respond, don't try to bypass it.
3. **If `.setup-complete` exists**, proceed with the work the user has asked for.

If setup is interrupted partway through (e.g. Ghostscript missing), the script exits without writing the marker. Re-running picks up where it left off.

---

## Scaffolding a new brochure

To create a new brochure folder seeded from the page templates:

```bash
node server/scaffold.js <brochure-name>
```

This creates `materials/<brochure-name>/design-files/` with three pages copied from `templates/`:
- `cover.html` (from `templates/cover.html`)
- `features.html` (from `templates/features-spread.html`)
- `back-cover.html` (from `templates/back-cover.html`)

It also generates `design-files/pages.json` with all three listed.

After running scaffold:
1. Open `http://localhost:3000/materials/<brochure-name>/design-files/cover.html` in your browser via `node server/serve.js`
2. Edit the placeholder text in place
3. Ask Claude to add more pages (benefits, platform, additional feature spreads, expert spread)
4. Render with `node server/render-brochure.js materials/<brochure-name>/`

Use scaffold when you want a minimal working brochure as a starting point. For a full standard structure (cover + benefits + platform + features + expert + back-cover), follow the [mandatory workflow](#mandatory-workflow) instead.

---

## Folder structure

```
brand-shared/                 # Submodule — shared brand resources (do NOT edit here; edit in the Brand-Shared repo)
  references/
    brand-guidelines.md
    tone-of-voice.md
  tokens.css
  tokens.json
  brand/                      # Logo SVGs
templates/                    # Brochure page blueprints — do NOT edit these directly
  cover.html                  # A4 single page — always the first page
  benefits-spread.html        # Double spread — benefits grid with icon cells
  platform-spread.html        # Double spread — platform/product overview + screenshot
  features-spread.html        # Double spread — feature rows (ALWAYS first features page)
  feature-double-spread.html  # Double spread — continuation feature rows (features-2, features-3, etc.)
  features-spread-alt.html    # Alternative features layout
  expert-spread.html          # Double spread — fixed "about the company" copy (never customise)
  back-cover.html             # A4 single page — fixed copy (never customise)
server/                       # Render tooling (Puppeteer + Ghostscript)
  render-brochure.js          # Renders a brochure folder to PDF
  serve.js                    # Static file server for local viewing
images/                       # Shared image library with metadata
  index.json                  # Master catalog of all images
  stock/                      # Stock/hero photos (covers, filler pages)
  product/                    # Product screenshots (UI, dashboards, features)
  other/                      # Miscellaneous illustrations
materials/                    # All output brochures live here
  <brochure-name>/
    <brochure-name>-print.pdf # 300 dpi rendered output (auto-generated)
    <brochure-name>.pdf       # 150 dpi screen/distribution version (auto-generated)
    design-files/
      cover.html              # source HTML — page 1
      benefits.html           # source HTML — benefits spread
      features.html           # source HTML — features spread
      ...
      review.html             # iframe-based scrollable viewer (read-only)
      pages.json              # page order + type — read by render-brochure.js
```

All output brochures **must** live inside `materials/<brochure-name>/`. Never create brochure folders at the project root.

**Why the `design-files/` subfolder?** It keeps the deliverable PDFs at the top of the brochure folder so they're easy to find, share, and link to. The page HTML files, `pages.json`, and `review.html` stay tucked away one level deeper, out of the way of anyone who only wants the finished PDF.

---

## Format basics

Brochures are **multi-file A4 PDF documents** — not slide decks. Each page or spread is its own HTML file inside the brochure's folder.

| Type | Dimensions (px @ 96 dpi) |
|---|---|
| Single A4 page | 794 × 1123 (portrait, 210 × 297mm) |
| Double spread | 1588 × 1123 (two pages side by side, 420 × 297mm) |

Cover and back cover are always single pages. Most internal content is on double spreads.

### Feature section templates — mandatory rule

Every feature section in a brochure spans multiple spreads. The two feature templates serve distinct roles and must always be used in this order:

| Template | Role |
|---|---|
| `features-spread.html` | **Always the first spread of any feature section.** Includes section headline and pointer text to open the chapter. |
| `feature-double-spread.html` | Continuation spreads — used for all subsequent feature spreads within the same section. |

**Never open a feature section with `feature-double-spread.html`.** The header in `features-spread.html` is what marks the start of the feature chapter for the reader.

### Expert spread — fixed copy, never customise

The "Built by experts" spread (`expert-spread.html`) uses fixed company-level copy that should be identical across every brochure, regardless of product. **Never rewrite, adapt, or tailor this copy for the product context.** The only element that changes per brochure is the footer label (e.g. "Risk Solutions", "Compliance Solutions").

### Back cover — fixed copy, never customise

The back cover (`back-cover.html`) uses fixed company-level copy. **Never rewrite, adapt, or tailor this copy for the product context.**

---

## Mandatory workflow

**Every step is mandatory. Do not skip any step. Do not write any HTML until steps 1–4 are complete.**

### Step 1 — Read the tone of voice file
Read `brand-shared/references/tone-of-voice.md` in full. Apply every rule without exception.

### Step 2 — Read the brand guidelines
Read `brand-shared/references/brand-guidelines.md` to confirm colour, typography, and component usage.

### Step 3 — Identify the product/topic
Confirm the brochure subject with the user. Ask:
- What product, module, or topic is this brochure about?
- How many feature spreads are needed?
- Is there an existing folder name preference, or should the folder match the product/topic name (lowercase, hyphenated)?

### Step 4 — Plan the page order

A standard brochure follows this structure:

| File | Template | Notes |
|---|---|---|
| `cover.html` | `cover.html` | Product/topic name, tagline, badge or hero image |
| `benefits.html` | `benefits-spread.html` | Key benefits grid |
| `platform.html` | `platform-spread.html` | Product/platform overview |
| `features.html` | `features-spread.html` | First feature spread — always uses this template |
| `features-2.html` | `feature-double-spread.html` | Second feature spread — uses continuation template |
| `features-3.html` | `feature-double-spread.html` | Third feature spread if needed |
| `expert.html` | `expert-spread.html` | Fixed copy — never customise |
| `back-cover.html` | `back-cover.html` | Fixed copy — never customise |

Additional feature spreads follow the same `features-N.html` naming pattern. Confirm the page count with the user before building.

### Step 5 — Check the image library

Product screenshot images live in `images/product/<product>/` (organize per product to keep things tidy). Check `images/index.json` for what's available. If images are missing, note the gaps and leave drop zones in place — the user will provide them.

**Image naming convention** — use this pattern consistently across all brochures:

| Slot type | Filename pattern | Example |
|---|---|---|
| Benefits hero screenshot | `{product}-benefits-hero.png` | `myproduct-benefits-hero.png` |
| Feature row screenshot | `{product}-features-row-{N}.png` | `myproduct-features-row-1.png` |
| Platform hero screenshot | `{product}-platform-hero.png` | `myproduct-platform-hero.png` |

Row numbers (`row-1`, `row-2`, etc.) are **continuous across all feature spreads** — if `features.html` uses rows 1–4 and `features-2.html` uses rows 5–6, they are `row-5` and `row-6`, not restarting at `row-1`.

Stock images (covers, filler pages, photography) live in `images/stock/`.

### Step 6 — Build each page file

Build one HTML file per page/spread. Read the relevant template from `templates/` before writing each one. Apply all brand rules. Each file must:

- Include `contenteditable="true"` on all editable text elements
- Include the Cmd+Alt+S save handler with the correct `suggestedName` (e.g. `cover.html`)
- Include responsive scaling JS (`scaleSpread()` or `scalePage()`)
- Use the exact CSS positions from the template — do not invent layout values
- Use the logo double-clone guard (see below)

### Step 7 — Create the review file

Create `review.html` in the brochure folder — a scrollable single-page viewer that shows all pages in order using iframes. Base it on an existing brochure's `review.html` as a structural reference. Iframes in the review file are non-interactive (`pointer-events: none`) — users open individual page files to edit copy.

### Step 8 — Create pages.json

Create `pages.json` in the brochure folder defining the page order and type for the renderer:

```json
[
  { "file": "cover.html",      "type": "single" },
  { "file": "benefits.html",   "type": "spread" },
  { "file": "platform.html",   "type": "spread" },
  { "file": "features.html",   "type": "spread" },
  { "file": "features-2.html", "type": "spread" },
  { "file": "expert.html",     "type": "spread" },
  { "file": "back-cover.html", "type": "single" }
]
```

`single` = one A4 page (210 × 297mm). `spread` = two A4 pages side by side (420 × 297mm).

### Step 9 — Render the PDF

```
node server/render-brochure.js materials/<brochure-name>/
```

This always produces **two PDF files**:
- `<brochure-name>-print.pdf` — 300 dpi, Ghostscript `/printer` preset
- `<brochure-name>.pdf` — 150 dpi, Ghostscript `/ebook` preset (for screen/distribution)

Both files are committed to the repo alongside the HTML source files.

---

## Design system

All brochure pages MUST use the brand design system. Values come from `brand-shared/tokens.css`. The same CSS variables and typography rules apply as in any other use case.

### CSS variables

```css
:root {
  --blue:          #2563EB; /* TODO: replace with your primary brand colour */
  --blue-dark:     #1E3A5F; /* TODO: replace with your dark brand colour */
  --purple:        #7C3AED; /* TODO: replace with your secondary accent colour */
  --black:         #000000;
  --bg-grey:       #ecedf0; /* TODO: adjust to match your brand if needed */
  --bg-light-blue: #EFF6FF; /* TODO: replace with a soft tint of your primary colour */
  --white:         #ffffff;
  --text-grey:     #7f7f7f;
  --border:        #d4d6dc;
}
```

> **TODO:** These are placeholder values. Populate your brand colours in `brand-shared/tokens.css` by running `node setup.js` in the Brand-Shared repo, or by editing the values directly. All templates embed these variable names inline — only the values need to change.

**Permitted raw hex exceptions — these two values only:**
- `#808080` — subtitle and secondary headline colour
- `#000000` — where explicit black is required

**Never use raw hex values for any other colour. Never use greens, oranges, or reds for any purpose.**

### Typography

- Font: `'Inter'` via Google Fonts (weights 300, 400, 500, 600, 700)
- Always import: `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap`

**Typography rules — non-negotiable:**
- Headlines and titles use sentence case only — first word and proper nouns capitalised, nothing else
- Stat numbers are weight 300 in `--blue` — never bold
- Never bold text mid-sentence
- Body text is `--text-grey`, never black
- Numbers are never zero-padded — use "1", "2", "3", not "01", "02", "03"
- All text elements must have `contenteditable="true"` so users can edit content directly in the browser

---

## Brochure-specific patterns

### Cover page

The cover page is split into two sections:

| Section | Proportion | Height (px) |
|---|---|---|
| White top section | 47.5% | 533px |
| Coloured bottom section | 52.5% | 590px |

The coloured bottom section is always larger than the white top section. The bottom section colour is set via a `--cover-bg` CSS variable in the page's `:root` — typically a pale tint of the product/topic category colour.

### Logo clone guard — required on every brochure page

Every brochure page file that clones a logo SVG from a `<template>` element must use the double-clone guard. When a file is saved via `outerHTML` (either by Cmd+Alt+S or by the renderer), the already-cloned SVG is baked into the HTML. Without the guard, the clone script runs again on next open and appends a second copy.

**Wrong:**
```javascript
document.querySelector('.logo').appendChild(
  document.getElementById('logo-svg').content.cloneNode(true)
);
```

**Right:**
```javascript
const logo = document.querySelector('.logo');
if (!logo.querySelector('svg')) {
  logo.appendChild(document.getElementById('logo-svg').content.cloneNode(true));
}
```

Apply the same pattern to any other logo container (`.logo-left`, `.df-logo`, etc.) — always check `if (!el.querySelector('svg'))` before cloning.

### Image zones

Image zones in brochure templates use either `object-fit: cover` (fills the zone, may crop) or `object-fit: contain` with `padding: 10%` (fits within the zone with breathing room — used for product screenshots that should not be cropped).

Choose `contain` + padding when the image is a discrete asset (e.g. a tablet mockup, a screenshot) where cropping would lose meaning. Choose `cover` for atmospheric photography (e.g. cover hero, filler pages) where cropping is expected.

### Cmd+Alt+S save handler — required on every page

Every brochure page file must include this save handler:

```javascript
let _fileHandle = null;
document.addEventListener('keydown', async e => {
  if (!(e.code === 'KeyS' && e.altKey && (e.metaKey || e.ctrlKey))) return;
  e.preventDefault();
  try {
    if (!_fileHandle) {
      _fileHandle = await window.showSaveFilePicker({
        suggestedName: decodeURIComponent(window.location.pathname.split("/").pop()) || "index.html", // ← match the actual filename
        types: [{ description: 'HTML file', accept: { 'text/html': ['.html'] } }]
      });
    }
    const writable = await _fileHandle.createWritable();
    await writable.write(document.documentElement.outerHTML);
    await writable.close();
  } catch (err) {
    if (err.name !== 'AbortError') console.error('Save failed:', err);
  }
});
```

Use the actual filename of the page as `suggestedName` — `cover.html`, `features.html`, `back-cover.html`, etc.

### Contenteditable styles

All editable text must have hover/focus indicators:

```css
[contenteditable]:hover {
  outline: 1px dashed var(--border);
  border-radius: 2px;
  cursor: text;
}
[contenteditable]:focus {
  outline: 1px dashed var(--blue);
  border-radius: 2px;
}
```

---

## InDesign measurement conversion

Brochure measurements often come from Adobe InDesign. InDesign reports values in points (pt) but displays the unit label as "px". **Always convert InDesign measurements before applying them to HTML:**

```
HTML pixels = InDesign value × 1.333
```

This applies to every position, size, spacing, and margin value taken from InDesign. Never apply InDesign values directly to CSS without converting.

| InDesign (pt) | HTML (px) |
|---|---|
| 56.693 | 75.59 |
| 72 | 95.98 |
| 184.252 | 245.67 |

---

## Images

The `images/` directory is a shared image library. Every image has a companion `.json` metadata file with the same base name.

### Directory layout

```
images/
  index.json                      # Master catalog (array of all images)
  stock/                          # Stock/hero photos
    _example.json                 # Schema reference
  product/                        # Product screenshots
    _example.json
    <product-name>/               # Per-product subfolders for organization
  other/                          # Miscellaneous illustrations
```

### Metadata schema (per-image JSON)

```json
{
  "title": "Dashboard overview",
  "description": "Product dashboard with summary cards and charts",
  "category": "product",
  "tags": ["dashboard", "ui", "summary"],
  "background": "light",
  "orientation": "landscape",
  "addedDate": "2026-01-01"
}
```

### Adding a new image

1. Place the image file in the appropriate subdirectory (`stock/`, `product/<product>/`, or `other/`)
2. Create a companion `.json` file with the same base name
3. Add an entry to `images/index.json`

**Subdirectory guide:**
- `stock/` — photography: covers, filler pages, atmospheric shots
- `product/` — product UI screenshots, organize per-product into subfolders
- `other/` — illustrations, decorative assets, awards, badges

### Using images in materials

When building a page that has an image slot:
1. Check `images/index.json` or browse the metadata files to find a suitable image
2. Ask the user to provide the image file before finishing the page — do not silently leave drop zones empty
3. Reference images using relative paths from the brochure folder: `../../images/product/<product>/<file>.png`

---

## Generating PDFs

### Setup (one-time)

```
cd server
npm install
```

You also need Ghostscript installed for PDF compression:
- macOS: `brew install ghostscript`
- Linux: `apt install ghostscript`
- Windows: download from [ghostscript.com](https://www.ghostscript.com/)

### Static file server — serve.js

Brochure pages reference images via relative paths (`../../images/...`). Opening individual page files via `file://` causes CORS errors for those assets. Use the static server instead:

```
node server/serve.js
```

Then open `http://localhost:3000/materials/<brochure-name>/design-files/cover.html` in your browser. The server serves the entire repo root so all relative paths resolve correctly.

### Render to PDF — render-brochure.js

```
node server/render-brochure.js materials/<brochure-name>/
```

The script reads `pages.json` from the brochure folder for the page order. It always produces two output files:
- `<brochure-name>-print.pdf` — 300 dpi, Ghostscript `/printer` preset
- `<brochure-name>.pdf` — 150 dpi, Ghostscript `/ebook` preset (for screen/distribution)

### When the user asks to "generate a PDF"

1. Confirm `pages.json` exists in the brochure folder (create it if missing)
2. Run: `node server/render-brochure.js materials/<brochure-name>/`
3. Both PDFs are produced automatically
4. Report the final output paths to the user

---

## Editing workflow

The brochure editing workflow is straightforward: edit individual page files in the browser, save with Cmd+Alt+S, render to PDF.

1. Start the static server: `node server/serve.js`
2. Open `http://localhost:3000/materials/<brochure-name>/design-files/<page>.html` in your browser
3. Edit any `contenteditable` text directly in place
4. Save with Cmd+Alt+S (Ctrl+Alt+S on Windows) — first press opens a Save As dialog, subsequent presses save silently
5. When done, render: `node server/render-brochure.js materials/<brochure-name>/`

**For review only:** open `materials/<brochure-name>/review.html` to see all pages stacked vertically. Iframes there are non-interactive — open the individual page files to edit.

---

## Quality checklist

Run through every item before outputting. Do not skip this step.

**Brand and colour**
- [ ] All colours use CSS variables — no raw hex values except `#808080` and `#000000`
- [ ] No green, orange, or red used anywhere

**Typography**
- [ ] All headlines and titles use sentence case — only first word and proper nouns capitalised
- [ ] No headline is bold — all headlines are weight 300
- [ ] No text is bolded mid-sentence
- [ ] Body text is `--text-grey`, not black
- [ ] Numbers are never zero-padded — use "1", "2", "3", not "01", "02", "03"

**Tone of voice**
- [ ] No em dashes (—) anywhere — restructure or use a comma
- [ ] No exclamation marks anywhere
- [ ] All numbers written as numerals, not words
- [ ] All statistics attributed to a named source

**Layout**
- [ ] All InDesign measurements converted via × 1.333
- [ ] Image zones use the right `object-fit` (cover for photography, contain + padding for product shots)

**Interactivity**
- [ ] All text elements have `contenteditable="true"`
- [ ] Contenteditable hover/focus styles present
- [ ] Cmd+Alt+S save handler included, with `suggestedName` matching the actual filename
- [ ] Logo clone guard present (`if (!el.querySelector('svg'))`)

**Files**
- [ ] `pages.json` created and reflects the actual page order
- [ ] `review.html` created
- [ ] All pages saved before running the renderer

---

## Common errors to avoid

| Wrong | Right |
|---|---|
| Writing HTML from memory without reading the template file | Always read the template file first |
| Opening a feature section with `feature-double-spread.html` | Always use `features-spread.html` for the first spread of any feature section |
| Customising the expert spread or back cover copy | Both are fixed company-level copy — never rewrite |
| Applying InDesign values directly to CSS | Always convert: HTML pixels = InDesign value × 1.333 |
| Logo cloning JS without double-clone guard | Always check `if (!el.querySelector('svg'))` before cloning — saves bake the SVG into HTML, so unguarded clones double up |
| Lucide CDN script in `<head>` | Lucide CDN script immediately before `</body>`, above inline script |
| CSS targeting `i` for Lucide icon stroke colour | CSS targeting `svg` — `createIcons()` replaces `<i>` with `<svg>` |
| Bold headline | Weight 300 headline |
| `color: #0658fa` inline | `color: var(--blue)` |
| Em dash — mid sentence | Comma or restructured sentence |
| Opening `review.html` to edit copy | Open the individual page file (`cover.html`, `features.html`, etc.) — iframes in review.html are non-interactive |
| Forgetting `pages.json` before rendering | Renderer needs `pages.json` to know the page order and type |
| Editing files in `brand-shared/` directly | Edit them in the Brand-Shared repo, then update the submodule pointer |
| Forgetting to run `git submodule update --init` after cloning | Always init submodules first — otherwise `brand-shared/` is empty |

---

## Rules summary

- **Never modify template files** — they are read-only blueprints
- **Never modify files in `brand-shared/`** — edit them in the Brand-Shared repo, then run `git submodule update --remote brand-shared` and commit the updated pointer
- **Self-contained pages** — each page is its own standalone HTML file; no JS dependencies between pages
- **Stick to the palette** — only use the CSS variables defined in `brand-shared/tokens.css`
- **Stick to Inter** — no other fonts
- **Preserve interactivity** — contenteditable fields, image upload zones, save handler
- **File naming** — brochure folders are lowercase, hyphen-separated. Page files match the order in `pages.json`
