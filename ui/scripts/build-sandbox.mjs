import { build } from 'esbuild';
await build({
  entryPoints: ['src/apps/threejs-learning-path/runtime.js'],
  outfile: 'public/threejs-runtime.js',
  bundle: true,
  format: 'iife',
  minify: true,
  target: 'es2022',
  legalComments: 'eof',
});
