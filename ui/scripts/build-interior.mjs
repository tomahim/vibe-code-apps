import { build } from 'esbuild';
await build({
  entryPoints: ['src/apps/ecosystem-interior/nature-interior.js'],
  outfile: 'public/artifact-assets/2026-11-15-ecosystem-growth-poc/nature-interior.js',
  bundle: true,
  format: 'iife',
  minify: true,
  target: 'es2022',
  legalComments: 'eof',
  globalName: 'NatureInterior',
});
