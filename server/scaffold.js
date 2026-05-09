#!/usr/bin/env node
//
// scaffold.js — Create a new brochure folder seeded from the page templates
//
// Usage:
//   node server/scaffold.js <brochure-name>
//
// Creates:
//   materials/<brochure-name>/
//     design-files/
//       cover.html         ← copied from templates/cover.html
//       features.html      ← copied from templates/features-spread.html
//       back-cover.html    ← copied from templates/back-cover.html
//       pages.json         ← lists the three pages in order

const fs = require("fs");
const path = require("path");

const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
};
const supportsColour = process.stdout.isTTY;
const paint = (col, msg) => (supportsColour ? col + msg + c.reset : msg);
const log = (msg) => process.stdout.write(msg + "\n");
const ok = (msg) => log("  " + paint(c.green, "✓ ") + msg);
const fail = (msg) => {
  log("  " + paint(c.red, "✗ ") + msg);
  process.exit(1);
};

function validateName(name) {
  if (!name) {
    fail(
      "Need a brochure name as the first argument.\n  e.g.  node server/scaffold.js my-product"
    );
  }
  if (!/^[a-z0-9][a-z0-9-]*$/.test(name)) {
    fail(
      `"${name}" is not a valid name. Use lowercase letters, numbers, and hyphens only (e.g. my-product).`
    );
  }
  return name;
}

function main() {
  const name = validateName(process.argv[2]);
  const repoRoot = path.resolve(__dirname, "..");
  const templatesDir = path.join(repoRoot, "templates");
  const folderPath = path.join(repoRoot, "materials", name);
  const designFilesDir = path.join(folderPath, "design-files");

  if (fs.existsSync(folderPath)) {
    fail(
      `materials/${name}/ already exists. Use a different name, or delete the folder first.`
    );
  }

  // Map of source template → destination filename
  const pages = [
    { src: "cover.html", dest: "cover.html" },
    { src: "features-spread.html", dest: "features.html" },
    { src: "back-cover.html", dest: "back-cover.html" },
  ];

  // Verify all source templates exist
  for (const p of pages) {
    const srcPath = path.join(templatesDir, p.src);
    if (!fs.existsSync(srcPath)) {
      fail(`Template not found: templates/${p.src}`);
    }
  }

  log("");
  log(paint(c.bold, `Scaffolding new brochure: ${name}`));
  log("");

  fs.mkdirSync(designFilesDir, { recursive: true });
  ok(`Created materials/${name}/design-files/`);

  for (const p of pages) {
    const srcPath = path.join(templatesDir, p.src);
    const destPath = path.join(designFilesDir, p.dest);
    fs.copyFileSync(srcPath, destPath);
    ok(`Copied templates/${p.src} → design-files/${p.dest}`);
  }

  // Generate pages.json
  const pagesJson = JSON.stringify(
    pages.map((p) => p.dest),
    null,
    2
  ) + "\n";
  fs.writeFileSync(path.join(designFilesDir, "pages.json"), pagesJson);
  ok(`Created design-files/pages.json`);

  log("");
  log(paint(c.bold, "Next steps:"));
  log("");
  log("  • Start the static server (in another terminal):");
  log(paint(c.dim, `      $ node server/serve.js`));
  log("  • Open the cover in your browser to edit:");
  log(
    paint(
      c.dim,
      `      http://localhost:3000/materials/${name}/design-files/cover.html`
    )
  );
  log("  • Press Cmd+Alt+S (Ctrl+Alt+S on Windows) to save your edits.");
  log(
    "  • Ask Claude to add more pages (benefits, platform, additional feature spreads, expert spread)."
  );
  log("  • Render to PDF when ready:");
  log(paint(c.dim, `      $ node server/render-brochure.js materials/${name}/`));
  log("");
  log(
    paint(
      c.dim,
      "  Note: this is a 3-page starter (cover + features + back-cover). A typical full"
    )
  );
  log(
    paint(
      c.dim,
      "  brochure adds benefits, platform, additional feature spreads, and the expert spread."
    )
  );
  log("");
}

main();
