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

// Art-direction comparisons are lazy iframe entries, separate from earlier variants.
import { copyFile, readFile } from 'node:fs/promises';
for (const name of ['painted-pond', 'painted-study']) {
  const dir = 'public/artifact-assets/2026-11-15-ecosystem-growth-poc/interior-lab/';
  const names = name === 'painted-pond' ? ['pond-detail.webp','pond-mask.png','beaver.png','../cu-nature.webp'] : ['grass.jpg','earth.jpg','painted-rock.jpg','water.jpg','cascade-lines.png',...Array.from({length:16},(_,i)=>`atlas-${i}.png`)];
  const textures={};
  for(const file of names){const bytes=await readFile(`${dir}${file}`);const ext=file.split('.').pop();const mime=ext==='jpg'?'image/jpeg':`image/${ext}`;const key=file==='../cu-nature.webp'?'/artifact-assets/2026-11-15-ecosystem-growth-poc/cu-nature.webp':`/artifact-assets/2026-11-15-ecosystem-growth-poc/interior-lab/${file}`;textures[key]=`data:${mime};base64,${bytes.toString('base64')}`;}
  await build({ banner:{js:`window.NATURE_LAB_TEXTURES=${JSON.stringify(textures)};`}, entryPoints: [`src/apps/ecosystem-interior/${name}.js`], outfile: `${dir}${name}.js`, bundle: true, format: 'iife', minify: true, target: 'es2022', legalComments: 'eof' });
  await copyFile(`src/apps/ecosystem-interior/${name}.html`, `${dir}${name}.html`);
}
