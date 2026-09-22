import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    // Deprecated v1 compat path: `require('formatted-response/config')`
    config: 'src/config-entry.ts',
    // Public types, kept off the default-only main entry so cjsDefault can fire — see src/index.ts.
    types: 'src/types.ts'
  },
  format: ['esm', 'cjs'],
  platform: 'neutral',
  target: 'node20.19',
  outDir: 'dist',
  dts: true,
  clean: true,
  sourcemap: true,
  treeshake: true,
  // `module.exports = <default>` in CJS, `export =` in .d.cts. Default-on; explicit for intent.
  cjsDefault: true,
  // Do NOT let tsdown rewrite package.json — the exports map is hand-maintained and reviewed.
  exports: false,
  // publint/attw run as standalone npm scripts instead, to avoid tsdown peer-dep coupling.
  publint: false,
  attw: false
})
