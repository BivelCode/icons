const svgoConfig = {
  // Run SVGO in multiple passes until the output stabilises (reduces file size further).
  multipass: true,
  plugins: [
    'removeDoctype', // Remove DOCTYPE declaration (unnecessary for webfont glyphs).
    'removeXMLProcInst', // Remove XML processing instructions.
    'removeComments', // Strip XML and HTML comment nodes.
    'removeTitle', // Remove <title> elements (unnecessary in icon fonts).
    'removeDesc', // Remove <desc> elements.
    'removeMetadata', // Remove <metadata> blocks (e.g. Adobe XMP data).
    'removeDimensions', // Remove width/height attributes; viewBox is sufficient.
    'cleanupAttrs', // Clean up malformed or redundant attributes.
    'convertShapeToPath', // Convert basic shapes (circle, rect, ellipse, etc.) to paths.
    'convertPathData', // Optimise path data: remove redundant commands, round coordinates.
    'sortAttrs', // Sort element attributes for deterministic output.
    'collapseGroups', // Remove unnecessary groups after transformations.
    'removeUselessStrokeAndFill', // Drop stroke/fill attributes that have no visual effect.
    'removeUnusedNS', // Remove unused XML namespace declarations.
    {
      // Explicitly strip all stroke-related presentation attributes.
      // Webfont glyphs must be fill-only; any residual stroke property is
      // ignored by font renderers and can produce unexpected glyph shapes.
      name: 'removeAttrs',
      params: {
        attrs: [
          'stroke',
          'stroke-width',
          'stroke-linecap',
          'stroke-linejoin',
          'stroke-dasharray',
          'stroke-dashoffset',
          'stroke-miterlimit',
          'stroke-opacity',
        ],
      },
    },
  ],
};

module.exports = svgoConfig;
