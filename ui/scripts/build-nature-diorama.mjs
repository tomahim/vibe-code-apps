import{build}from'esbuild';import{readFile,writeFile,copyFile}from'node:fs/promises';
const root='public/artifact-assets/2026-11-15-ecosystem-growth-poc/',dest=root+'nature-diorama/';
const patch=await readFile(root+'hybrid-journey/patch-assets.js','utf8');const data=JSON.parse(patch.replace('window.HYBRID_PATCH_ASSETS=','').replace(/;\s*$/,''));const textures={};
for(const[key,asset]of Object.entries(data.sprites)){textures[key]='data:image/webp;base64,'+(await readFile(root+'hybrid-journey/'+asset.src)).toString('base64');}
textures.rock='data:image/webp;base64,'+(await readFile(dest+'moss-rock.webp')).toString('base64');
for(const key of['water'])textures[key]='data:image/jpeg;base64,'+(await readFile(root+'interior-lab/'+key+'.jpg')).toString('base64');
await build({entryPoints:['src/apps/nature-diorama/diorama.js'],outfile:dest+'diorama.js',bundle:true,format:'iife',minify:true,target:'es2022',legalComments:'eof',banner:{js:'window.DIORAMA_TEXTURES='+JSON.stringify(textures)+';'}});
await copyFile('src/apps/nature-diorama/index.html',dest+'index.html');
