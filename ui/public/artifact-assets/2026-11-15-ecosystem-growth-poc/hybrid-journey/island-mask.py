#!/usr/bin/env python3
"""Cut the ocean interior painting into a floating island diorama silhouette.

Keeps the painted lagoon, removes the rectangular frame: irregular coastline
edge, extruded cliff skirt blended toward rock, soft contact shadow on
transparent margins. Same canvas size, so layout stays untouched.
"""
import hashlib
import math
import os

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

SRC = "ui/public/artifact-assets/2026-11-15-ecosystem-growth-poc/hybrid-journey/assets"
OUT = SRC

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
    yb = np.where(inside, ys, -1).max(axis=0)  # bottom edge per column
    valid = yb > 0
    xb = int(np.argmax(yb))                    # lowest point column
    # fade skirt where the edge turns vertical (sides of the island)
    dyb = np.gradient(smooth(yb.astype(float), 41))
    ang = np.abs(np.arctan(dyb))
    fade = np.clip(1.0 - (ang / 1.05) ** 2, 0, 1)
    bump = np.exp(-((np.arange(W) - xb) / (0.42 * RX)) ** 2)
    depth = CLIFF * bump * fade * valid
    depth = np.maximum(smooth(depth, 61) - 1.5, 0)  # smooth base curve
    return yb, depth


def build(src_name, seed, suffix):
    img = Image.open(os.path.join(SRC, src_name)).convert("RGB")
    px = np.asarray(img).astype(np.float32)
    mask = silhouette(seed)
    m = np.asarray(mask).astype(np.float32) / 255.0
    yb, depth = cliff_fields(np.asarray(mask))

    out = np.zeros((H, W, 4), dtype=np.float32)
    out[..., :3] = px
    out[..., 3] = m * 255

    # Cliff skirt: shoreline colour pulled down, blended toward rock, smooth
    # occlusion gradient plus low-frequency grain (no barcode streaks).
    xs = np.arange(W)
    tops = np.minimum(yb, H - 1).clip(min=1)
    edge_col = px[tops - 1, xs].astype(np.float32)
    for c in range(3):  # heavy horizontal smoothing -> soft rock bands
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
        if n >= 3:  # dark base rim
            out[end - 2:end, x, :3] *= 0.72

    im = Image.fromarray(out.astype(np.uint8), "RGBA")

    # Soft contact shadow under the island, drawn behind everything.
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

    tmp = os.path.join(OUT, "tmp.webp")
    base.save(tmp, "WEBP", quality=88, method=6)
    data = open(tmp, "rb").read()
    h = hashlib.sha256(data).hexdigest()[:12]
    name = f"interior-ocean-{suffix}-{h}.webp"
    os.replace(tmp, os.path.join(OUT, name))
    return name, len(data), base


if __name__ == "__main__":
    beige = Image.new("RGBA", (W, H), (243, 232, 208, 255))
    for src, seed, suffix in [
        ("interior-ocean-lush-718877d85205.webp", 20261115, "lush"),
        ("interior-ocean-sparse-e5453743f821.webp", 20261115, "sparse"),
    ]:
        name, size, buf = build(src, seed, suffix)
        print(name, size)
        if suffix == "lush":
            preview = beige.copy()
            preview.alpha_composite(buf)
            preview.convert("RGB").save("/downloads/island-preview.png")
