#!/usr/bin/env python3
"""Cut the twenty approved interior paintings into floating island dioramas.

Generalises the Ocean trial's island-mask.py (PR #614) to every theme: irregular
coastline silhouette, rock-toned cliff skirt sampled from each painting's own
shoreline colours, soft contact shadow on transparent margins. Same canvas size
as the source painting, so lesson landmark coordinates stay valid. Content-hashed
WebP output plus the island-assets.js manifest.

Orientation pairs: the manifest carries explicit `landscape` / `portrait` slots
per theme and per group. Tonight only one orientation exists per scene (cut
landscape interiors, approved square group worlds); the missing slots stay null
until the approved painted pairs are generated (daily image limit reached on
2026-11-15; generation resume approved by Thomas, not yet run). The app reframes
the available orientation as a labelled interim fallback, never as a finished pair.

Run from the repo root: python3 ui/public/artifact-assets/2026-11-15-island-garden/island-pipeline.py
"""
import hashlib
import json
import math
import os
import re

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = "ui/public/artifact-assets"
HJ = ROOT + "/2026-11-15-ecosystem-growth-poc/hybrid-journey"
SRC = HJ + "/assets"
OUT = ROOT + "/2026-11-15-island-garden/assets"

W, H = 1400, 788
CX, CY = 700, 348      # island surface centre
RX, RY = 648, 318      # base radii
CLIFF = 62             # max skirt depth at the lowest point


def smooth(a, win):
    return np.convolve(a, np.ones(win) / win, mode="same")


def silhouette(seed):
    """Organic coastline: perturbed polar blob, supersampled then blurred."""
    rng = np.random.default_rng(seed)
    ph = rng.uniform(0, 2 * math.pi, 4)
    th = np.linspace(0, 2 * math.pi, 720, endpoint=False)
    r = (1.0
         + 0.045 * np.sin(3 * th + ph[0])
         + 0.030 * np.sin(5 * th + ph[1])
         + 0.018 * np.sin(9 * th + ph[2])
         + 0.012 * np.sin(17 * th + ph[3]))
    ss = 3
    xs = (CX + RX * r * np.cos(th)) * ss
    ys = (CY + RY * r * np.sin(th)) * ss
    mask = Image.new("L", (W * ss, H * ss), 0)
    ImageDraw.Draw(mask).polygon(list(zip(xs, ys)), fill=255)
    mask = mask.resize((W, H), Image.LANCZOS)
    return mask.filter(ImageFilter.GaussianBlur(1.1))


def cliff_fields(mask_arr):
    """Per-column lower edge of the silhouette and skirt depth profile."""
    inside = mask_arr > 128
    ys = np.arange(H)[:, None]
    yb = np.where(inside, ys, -1).max(axis=0)
    valid = yb > 0
    xb = int(np.argmax(yb))
    dyb = np.gradient(smooth(yb.astype(float), 41))
    ang = np.abs(np.arctan(dyb))
    fade = np.clip(1.0 - (ang / 1.05) ** 2, 0, 1)
    bump = np.exp(-((np.arange(W) - xb) / (0.42 * RX)) ** 2)
    depth = CLIFF * bump * fade * valid
    depth = np.maximum(smooth(depth, 61) - 1.5, 0)
    return yb, depth


def build(src_path, seed):
    img = Image.open(src_path)
    if img.mode in ("RGBA", "LA", "P"):
        # Already-cut island assets (the Ocean trial): flatten onto the paper
        # colour before re-cutting, or transparent pixels turn black.
        rgba = img.convert("RGBA")
        flat = Image.new("RGBA", rgba.size, (243, 232, 208, 255))
        flat.alpha_composite(rgba)
        img = flat
    img = img.convert("RGB")
    px = np.asarray(img).astype(np.float32)
    mask = silhouette(seed)
    m = np.asarray(mask).astype(np.float32) / 255.0
    yb, depth = cliff_fields(np.asarray(mask))

    out = np.zeros((H, W, 4), dtype=np.float32)
    out[..., :3] = px
    out[..., 3] = m * 255

    xs = np.arange(W)
    tops = np.minimum(yb, H - 1).clip(min=1)
    edge_col = px[tops - 1, xs].astype(np.float32)
    for c in range(3):
        edge_col[:, c] = smooth(edge_col[:, c], 121)
    rock = np.array([0x71, 0x5F, 0x47], dtype=np.float32)
    edge_col = 0.62 * edge_col * 0.55 + 0.38 * rock
    rng = np.random.default_rng(seed + 7)
    grain = smooth(rng.uniform(0.82, 1.18, W), 13)
    grain = 0.65 * grain + 0.35 * smooth(rng.uniform(0.9, 1.1, W), 61)
    for x in xs:
        d = int(round(depth[x]))
        if d <= 0:
            continue
        top = min(yb[x], H - 1)
        end = min(top + d, H)
        if end <= top:
            continue
        n = end - top
        shade = np.linspace(0.86, 0.55, n)[:, None] * grain[x]
        out[top:end, x, :3] = edge_col[x] * shade
        out[top:end, x, 3] = 255
        if n >= 3:
            out[end - 2:end, x, :3] *= 0.72

    im = Image.fromarray(out.astype(np.uint8), "RGBA")

    sh = Image.new("L", (W, H), 0)
    ymax = int(yb.max() + depth.max() + 10)
    ImageDraw.Draw(sh).ellipse(
        [CX - RX * 0.72, ymax - 30, CX + RX * 0.72, ymax + 34], fill=46)
    sh = sh.filter(ImageFilter.GaussianBlur(17))
    shadow = Image.new("RGBA", (W, H), (44, 36, 20, 0))
    shadow.putalpha(sh)
    base = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    base.alpha_composite(shadow)
    base.alpha_composite(im)
    return base


def save_hashed(img, prefix, suffix):
    tmp = os.path.join(OUT, "tmp.webp")
    img.save(tmp, "WEBP", quality=88, method=6)
    data = open(tmp, "rb").read()
    h = hashlib.sha256(data).hexdigest()[:12]
    name = f"{prefix}-{suffix}-{h}.webp"
    os.replace(tmp, os.path.join(OUT, name))
    return {"src": "assets/" + name, "bytes": len(data), "width": W, "height": H}


def main():
    os.makedirs(OUT, exist_ok=True)
    # Source manifest of the approved interior paintings.
    text = open(HJ + "/journey-assets.js").read()
    assets = json.loads(re.search(r"window\.HYBRID_JOURNEY_ASSETS=(\{.*\})\s*;?\s*$", text, re.S).group(1))

    themes = {}
    beige = Image.new("RGBA", (W, H), (243, 232, 208, 255))
    sheet_tiles = []
    for key, entry in assets["interiors"].items():
        seed = int(hashlib.sha256(("island:" + key).encode()).hexdigest()[:8], 16)
        pair = {}
        for suffix in ("lush", "sparse"):
            src_name = os.path.basename(entry[suffix]["src"])
            img = build(os.path.join(SRC, src_name), seed)
            pair[suffix] = save_hashed(img, "island-" + key, suffix)
            if suffix == "lush":
                tile = beige.copy()
                tile.alpha_composite(img)
                sheet_tiles.append((key, tile.convert("RGB")))
        themes[key] = {
            "landscape": pair,
            "sparseMethod": entry.get("sparseMethod", "dormant-foliage-preview"),
            # Distinct painted portrait composition: approved, not yet generated.
            "portrait": None,
        }
        print("cut", key)

    # Group worlds: the approved square paintings are the portrait-orientation
    # artwork. Referenced in place (content-hashed, immutable-cached there); the
    # wide landscape composition he asked for is generation follow-up.
    groups = []
    for entry in assets["groups"]:
        groups.append({
            "portrait": {
                "lush": {"src": "../2026-11-15-ecosystem-growth-poc/hybrid-journey/" + entry["lush"]["src"],
                         "bytes": entry["lush"]["bytes"], "width": 1200, "height": 1200},
                "sparse": {"src": "../2026-11-15-ecosystem-growth-poc/hybrid-journey/" + entry["sparse"]["src"],
                           "bytes": entry["sparse"]["bytes"], "width": 1200, "height": 1200},
            },
            "sparseMethod": entry.get("sparseMethod", "dormant-foliage-preview"),
            # Distinct wide landscape world: approved, not yet generated.
            "landscape": None,
        })

    manifest = ("/* Generated by island-pipeline.py. Orientation pair slots: null means the\n"
                "   distinct painted composition for that orientation is approved but not yet\n"
                "   generated (image limit 2026-11-15); the app reframes the available one as an\n"
                "   interim fallback, labelled in the UI. */\n"
                "window.ISLAND_GARDEN_ASSETS=" + json.dumps({"themes": themes, "groups": groups}) + ";\n")
    open(ROOT + "/2026-11-15-island-garden/island-assets.js", "w").write(manifest)

    # Contact sheet for visual review.
    cols = 5
    tw, th = 420, 236
    rows = math.ceil(len(sheet_tiles) / cols)
    sheet = Image.new("RGB", (cols * tw, rows * th), (243, 232, 208))
    for i, (key, tile) in enumerate(sheet_tiles):
        sheet.paste(tile.resize((tw, th), Image.LANCZOS), ((i % cols) * tw, (i // cols) * th))
    sheet.save("/downloads/island-contact-sheet.png")
    print("manifest + contact sheet done,", len(themes), "themes")


if __name__ == "__main__":
    main()
