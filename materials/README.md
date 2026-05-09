# materials/

Each brochure lives in its own subfolder, e.g. `materials/<brochure-name>/`. Inside each folder:

```
<brochure-name>/
  <brochure-name>-print.pdf  # 300 dpi rendered output (auto-generated)
  <brochure-name>.pdf        # 150 dpi screen/distribution version (auto-generated)
  design-files/
    cover.html               # source HTML — page 1
    benefits.html            # source HTML — benefits spread
    features.html            # source HTML — features spread
    features-2.html          # source HTML — additional feature spreads (if any)
    expert.html              # source HTML — expert spread (fixed copy)
    back-cover.html          # source HTML — final page (fixed copy)
    pages.json               # array of HTML filenames in display order
    review.html              # iframe-based scrollable viewer (read-only)
```

The deliverable PDFs sit at the top of the folder so they're easy to find and share. All page HTML files, `pages.json`, and `review.html` stay tucked into `design-files/`.

Folder names are lowercase, hyphen-separated.

## Render

```bash
node server/render-brochure.js materials/<brochure-name>/
```

The renderer reads `design-files/pages.json` for page order, renders each page from `design-files/`, and writes both PDFs to the brochure folder root.
