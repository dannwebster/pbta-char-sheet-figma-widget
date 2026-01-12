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

// Watch mode
esbuild.build({
  ...buildOptions,
  watch: {
    onRebuild(error, result) {
      if (error) console.error('watch build failed:', error)
      else console.log('watch build succeeded:', result)
    },
  },
}).then(result => {
  console.log('watching...')
})
