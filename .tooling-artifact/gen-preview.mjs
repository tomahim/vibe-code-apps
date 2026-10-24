import * as B from './bikeparts.mjs';
import { ISO_CSS } from './engine.mjs';
const crank = -35 * Math.PI / 180, chain = 120, wheel = -0.9;
const body = [
  B.groundSvg(),
  B.frameSvg(),
  B.wheelStaticSvg(B.RH), B.wheelStaticSvg(B.FH),
  B.spokesSvg(B.RH, wheel), B.spokesSvg(B.FH, wheel),
  `<path class="iso-line chain" d="${B.chainPathD()}"/>`,
  B.chainPinsSvg(chain),
  B.cogSvg(chain / B.R2),
  B.pawlSvg(wheel, 1),
  B.ringSvg(crank),
  B.crankSvg(crank, 0.8),
  B.ghostSvg(),
  B.labelsSvg(),
  B.meshDotsSvg(),
].join('');
const css = ISO_CSS + `
.iso-line.tube{stroke-width:7;stroke-linecap:round}
.iso-line.stay{stroke-width:4;stroke-linecap:round}
.iso-line.spoke{stroke-width:1}
.iso-line.crank{stroke-width:8;stroke-linecap:round}
.iso-line.spider{stroke-width:5;stroke-linecap:round}
.iso-line.chain{stroke-width:2.6}
.iso-line.arrow-force{stroke:var(--anatomy-green);stroke-width:3}
.iso-solid.tire>.iso-fill{fill:var(--anatomy-shade-1)}
.iso-solid.hub>.iso-fill{fill:var(--anatomy-face)}
.iso-solid.hubcap>.iso-fill{fill:var(--anatomy-paper)}
.iso-solid.chainring>.iso-fill{fill:var(--anatomy-face)}
.iso-solid.cog>.iso-fill{fill:var(--anatomy-face)}
.iso-solid.pedal>.iso-fill{fill:var(--anatomy-shade-3)}
.iso-solid.pawl>.iso-fill{fill:var(--anatomy-lit-top)}
.iso-solid.saddle>.iso-fill{fill:var(--anatomy-shade-1)}
`;
const html = `<!doctype html><html><head><meta charset="utf-8"><style>${css}
body{margin:0;background:var(--anatomy-page)}.wrap{width:min(650px,100%);margin:30px auto;padding:20px;background:var(--anatomy-card);box-shadow:0 0 0 1px var(--anatomy-mid)}</style></head>
<body class="iso" data-theme="light"><div class="wrap"><svg xmlns="http://www.w3.org/2000/svg" class="iso-svg" viewBox="0 0 ${B.VIEW_W} ${B.VIEW_H}">${body}</svg></div></body></html>`;
import { writeFileSync } from 'fs';
writeFileSync('/tmp/bike/preview.html', html);
console.log('written', html.length);
