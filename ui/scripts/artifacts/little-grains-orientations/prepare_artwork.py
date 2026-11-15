#!/usr/bin/env python3
"""Encode generated RGBA art and compute color-only dormant endpoints.

Usage: uv run --with pillow python scripts/artifacts/little-grains-orientations/prepare_artwork.py SOURCE_DIRECTORY
The four sources must be named {ocean,nature}-{portrait,landscape}-alpha.png.
No resizing, cropping, generated composition, or background removal is done here.
"""
import colorsys
import hashlib
import json
import sys
from pathlib import Path
from PIL import Image

UI = Path(__file__).resolve().parents[3]
OUT = UI / 'public/artifact-assets/2026-11-15-little-grains-orientations'
SOURCE = Path(sys.argv[1])
ANCHORS = {
    'ocean': {'portrait': [[32,63],[75,48],[53,27]], 'landscape': [[25,59],[76,47],[52,32]]},
    'nature': {'portrait': [[45,27],[68,49],[30,68]], 'landscape': [[28,35],[54,55],[77,62]]},
}

def dormant(image):
    pixels = []
    changed = 0
    for r, g, b, a in image.getdata():
        h, s, v = colorsys.rgb_to_hsv(r/255, g/255, b/255)
        # Vegetation's yellow-green hues only; leave water, stone, coral and alpha fixed.
        if a and 0.12 < h < 0.46 and s > 0.35 and v > 0.16:
            strength = min(1, (s-0.35)/0.15) * min(1, (h-0.12)/0.025, (0.46-h)/0.035)
            target = colorsys.hsv_to_rgb(0.085, min(0.30,s*0.42), v*0.65)
            r,g,b = [round(old*(1-strength)+new*255*strength) for old,new in zip((r,g,b),target)]
            changed += 1
        pixels.append((r,g,b,a))
    result = Image.new('RGBA',image.size); result.putdata(pixels)
    return result, changed

def encode(image, stem):
    import io
    buf = io.BytesIO(); image.save(buf,'WEBP',lossless=True,method=6)
    raw = buf.getvalue(); name = f'{stem}-{hashlib.sha256(raw).hexdigest()[:12]}.webp'
    (OUT/'assets'/name).write_bytes(raw)
    return dict(src='assets/'+name,width=image.width,height=image.height,bytes=len(raw))

manifest = {'themes':{}, 'note': 'Four independently composed lush paintings, with locally computed dormant endpoints. Transparent artwork sits over exact #f3e8d0 paper. Native generator dimensions are preserved; these benchmark images are below the requested 1200px short side, with no upscaling presented as new detail.'}
for key in ['ocean','nature']:
    manifest['themes'][key] = {}
    for orientation in ['portrait','landscape']:
        image = Image.open(SOURCE/f'{key}-{orientation}-alpha.png').convert('RGBA')
        assert image.getextrema()[3][0] == 0, 'Expected true transparent margins'
        sparse, changed = dormant(image)
        manifest['themes'][key][orientation] = dict(
            lush=encode(image,f'{key}-{orientation}-lush'),
            dormant=encode(sparse,f'{key}-{orientation}-dormant'),
            anchors=ANCHORS[key][orientation],
            nativeShortSide=min(image.size), vegetationPixels=changed,
            growthMethod='computed-dormant-colors',
        )
(OUT/'artwork.js').write_text('window.GARDEN_ARTWORK='+json.dumps(manifest,separators=(',',':'))+';\n')
(OUT/'artwork-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print(json.dumps({k:{o:(v['lush']['width'],v['lush']['height'],v['vegetationPixels']) for o,v in entries.items()} for k,entries in manifest['themes'].items()},indent=2))
