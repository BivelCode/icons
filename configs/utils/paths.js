/**
 * Centralized paths for the Bivelcode Icons project.
 *
 * All paths are resolved relative to the project root.
 * This ensures consistency across all scripts and avoids
 * hardcoding directory structures.
 */

const path = require('path');

// Project root (two levels up from configs/utils/)
const ROOT = path.resolve(__dirname, '../../');

/**
 * Directory containing the original SVG icons, grouped by style.
 * @param {string} styleId - kebab-case style identifier (e.g. 'solid-rounded')
 */
function srcDir(styleId) {
  return path.join(ROOT, 'src', 'icons', styleId);
}

/**
 * Directory for optimized SVG files (intermediate build output).
 * @param {string} styleId
 */
function optimizedDir(styleId) {
  return path.join(ROOT, 'dist', 'optimized', styleId);
}

// Output paths for generated files
const fontsDir = path.join(ROOT, 'dist', 'bivelcode-icons', 'fonts');
const cssDir = path.join(ROOT, 'dist', 'bivelcode-icons', 'css');
const distPackageDir = path.join(ROOT, 'dist', 'bivelcode-icons');
const distMetadataDir = path.join(ROOT, 'dist', 'bivelcode-icons', 'metadata');

// Metadata and configuration paths
const unicodeRegistryPath = path.join(
  ROOT,
  'metadata',
  'unicode-registry.json'
);
const stylesConfigPath = path.join(ROOT, 'configs', 'styles.config.js');

module.exports = {
  ROOT,
  srcDir,
  optimizedDir,
  fontsDir,
  cssDir,
  distPackageDir,
  distMetadataDir,
  unicodeRegistryPath,
  stylesConfigPath,
};
