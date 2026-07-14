/**
 * Central style registry for Bivelcode Icons.
 *
 * Each style has its own folder, CSS prefix, font name,
 * and a reserved Unicode block to guarantee no overlap
 * between styles.
 */

const path = require('path');
const { srcDir, fontsDir, cssDir } = require('./utils/paths');

/**
 * Unicode Private Use Area (Plane 15) allocation:
 *   Block 1: U+F0000 - U+F2491 (9362 codepoints) → Solid Rounded
 *   Block 2: U+F2492 - U+F4923 (9362 codepoints) → Brands
 *   Blocks 3-7: Reserved for future styles
 */
const UNICODE_START = {
  'solid-rounded': 0xf0000,
  brands: 0xf2492,
};

/**
 * List of all icon styles supported by the library.
 * Each entry must contain:
 *   - id:          kebab-case identifier (matches the folder name)
 *   - prefix:      CSS class prefix, e.g. "bi-sr" for solid-rounded
 *   - fontName:    font-family name used in the generated fonts
 *   - inputDir:    absolute path to the directory containing the SVG sources
 *   - unicodeStart:starting codepoint in the reserved Unicode block
 */
const styles = [
  {
    id: 'solid-rounded',
    prefix: 'bi-sr',
    fontName: 'bivelicons-solid-rounded',
    inputDir: srcDir('solid-rounded'),
    unicodeStart: UNICODE_START['solid-rounded'],
  },
  {
    id: 'brands',
    prefix: 'bi-br',
    fontName: 'bivelicons-brands',
    inputDir: srcDir('brands'),
    unicodeStart: UNICODE_START['brands'],
  },
];

module.exports = styles;
