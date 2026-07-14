/**
 * SVG Linter
 *
 * Validates every SVG source file across all styles:
 *  - Filename uses lowercase-kebab-case
 *  - Well-formed XML
 *  - Root element is <svg> with a viewBox
 *  - No stroke attributes / styles (webfont icons must be fill-only)
 *  - Contains at least one drawable element
 *
 * Any violation increments an error counter and the script exits
 * with code 1 after processing all files.
 */

const fs = require('fs');
const path = require('path');
const { XMLParser } = require('fast-xml-parser');
const styles = require('../configs/styles.config');
const { srcDir } = require('../configs/utils/paths');

// ------------------------------------------------------------------
// 1. Constants
// ------------------------------------------------------------------

// Accepted filename pattern: lowercase letters, digits, hyphens,
// no leading/trailing hyphens, no uppercase.
const NAME_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

// XML parser in strict mode – will throw on malformed markup.
const parser = new XMLParser({
  allowBooleanAttributes: false,
  ignoreAttributes: false,
  strict: true,
});

// Accumulated error count – if > 0 the process exits with code 1.
let errorCount = 0;

// ------------------------------------------------------------------
// 2. Helpers
// ------------------------------------------------------------------

/**
 * Check whether the SVG content uses any stroke (attribute or inline style)
 * with a value other than "none". Icon fonts do not support strokes.
 *
 * @param {string} content - Raw SVG source
 * @returns {boolean} true if a stroke with a visible colour is found
 */
function hasStroke(content) {
  // Check stroke="value" attributes (exclude stroke="none")
  const strokeAttrRe = /\bstroke="([^"]*)"/g;
  let m;
  while ((m = strokeAttrRe.exec(content)) !== null) {
    if (m[1].trim().toLowerCase() !== 'none') return true;
  }

  // Check stroke: value inside style="..." attributes
  const styleAttrRe = /\bstyle="([^"]*)"/g;
  while ((m = styleAttrRe.exec(content)) !== null) {
    const decls = m[1].split(';');
    for (const decl of decls) {
      const colonIdx = decl.indexOf(':');
      if (colonIdx === -1) continue;
      const prop = decl.slice(0, colonIdx).trim().toLowerCase();
      const val = decl
        .slice(colonIdx + 1)
        .trim()
        .toLowerCase();
      if (prop === 'stroke' && val && val !== 'none') return true;
    }
  }

  return false;
}

// ------------------------------------------------------------------
// 3. Lint a single file
// ------------------------------------------------------------------

/**
 * @param {string} filePath  - Absolute path to the SVG file
 * @param {string} styleId   - Style identifier (e.g. "solid-rounded")
 */
function lintFile(filePath, styleId) {
  const basename = path.basename(filePath, '.svg');

  // (a) Filename convention
  if (!NAME_PATTERN.test(basename)) {
    console.error(
      `  ✗ [${styleId}] Invalid filename: "${basename}.svg" – must be lowercase kebab-case`
    );
    errorCount++;
    return; // no need to check further if the name is wrong
  }

  const raw = fs.readFileSync(filePath, 'utf8');

  // (b) Well-formed XML
  let parsed;
  try {
    parsed = parser.parse(raw);
  } catch (err) {
    console.error(
      `  ✗ [${styleId}] ${basename}.svg: Invalid XML – ${err.message}`
    );
    errorCount++;
    return;
  }

  // (c) Root element must be <svg>
  const svgElement = parsed.svg || parsed['svg'] || parsed.SVG;
  if (!svgElement) {
    console.error(
      `  ✗ [${styleId}] ${basename}.svg: Missing <svg> root element`
    );
    errorCount++;
    return;
  }

  // (d) viewBox attribute
  if (!svgElement['@_viewBox'] && !svgElement['@_viewbox']) {
    console.error(
      `  ✗ [${styleId}] ${basename}.svg: Missing viewBox attribute on <svg>`
    );
    errorCount++;
  }

  // (e) Stroke detection (icons must be fill-only)
  if (hasStroke(raw)) {
    console.error(
      `  ✗ [${styleId}] ${basename}.svg: Strokes detected – icons must use fills only`
    );
    errorCount++;
  }

  // (f) At least one drawable element
  const drawableElements = [
    '<path',
    '<circle',
    '<ellipse',
    '<rect',
    '<polygon',
    '<g',
  ];
  if (!drawableElements.some((el) => raw.includes(el))) {
    console.error(
      `  ✗ [${styleId}] ${basename}.svg: No drawable elements found`
    );
    errorCount++;
  }

  // If we reach this point without early returns, the file passed all checks.
  // (No success message is printed to keep output clean; only errors are shown.)
}

// ------------------------------------------------------------------
// 4. Main
// ------------------------------------------------------------------

console.log('🔍 Linting SVG icons…\n');

for (const style of styles) {
  const dir = srcDir(style.id);

  if (!fs.existsSync(dir)) {
    console.warn(`  ⚠ Style directory not found: ${dir}`);
    continue;
  }

  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.svg'));
  console.log(`  ${style.id}: ${files.length} icons`);

  for (const file of files) {
    lintFile(path.join(dir, file), style.id);
  }
}

console.log('');
if (errorCount > 0) {
  console.error(`❌ Lint failed with ${errorCount} error(s).`);
  process.exit(1);
} else {
  console.log('✅ All SVG icons passed lint checks.');
}
