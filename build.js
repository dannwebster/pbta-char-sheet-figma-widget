const esbuild = require('esbuild')

const buildOptions = {
  entryPoints: ['widget-src/code.tsx'],
  bundle: true,
  outfile: 'dist/code.js',
  target: 'es6',
  loader: {
    '.svg': 'text',  // Load SVG files as text strings
  },
}

// Build once
esbuild.build(buildOptions).catch(() => process.exit(1))
