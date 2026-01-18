const esbuild = require('esbuild')

const buildOptions = {
  entryPoints: ['widget-src/code.tsx'],
  bundle: true,
  outfile: 'dist/code.js',
  target: 'es6',
  loader: {
    '.svg': 'text',  // Load SVG files as text strings
  },
  logLevel: 'info',
}

// Watch mode using context API (esbuild 0.17+)
async function watch() {
  const ctx = await esbuild.context(buildOptions)
  await ctx.watch()
  console.log('watching...')
}

watch().catch(() => process.exit(1))
