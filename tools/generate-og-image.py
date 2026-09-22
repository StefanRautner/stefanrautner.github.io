#!/usr/bin/env python3
"""
Build og-image.png — the 1200x630 preview card shown when the site is shared
on LinkedIn, WhatsApp, Slack, etc.

Uses the site's own self-hosted fonts and dark-theme palette, so the preview
matches the page it links to. Re-run after changing the tagline or colours:

    python tools/generate-og-image.py
"""

import io
import pathlib

from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw

ROOT = pathlib.Path(__file__).resolve().parent.parent
FONTS = ROOT / "fonts"
OUT = ROOT / "og-image.png"

W, H = 1200, 630

# Matches the dark theme tokens in style.css.
BG = (8, 8, 16)
BG_GLOW = (14, 30, 42)
CYAN = (77, 208, 225)
PURPLE = (167, 139, 250)
TEXT_STRONG = (237, 242, 248)
TEXT = (200, 212, 224)
TEXT_MUTED = (125, 135, 152)

NAME = "Stefan Rautner"
TAGLINE = "From Code to Reality —\nSmart, Secure, Automated."
EYEBROW = "// portfolio"
FOOTER = "stefanrautner.github.io"
CHIPS = ["Smart Home", "Cyber Security", "Automation", "Networking"]


def load(stem: str, size: int, weight: int):
    """WOFF2 -> in-memory TTF at a fixed weight, so PIL can render it."""
    f = TTFont(FONTS / stem, fontNumber=0)
    if "fvar" in f:                     # variable font: pin the weight axis
        from fontTools.varLib.instancer import instantiateVariableFont
        f = instantiateVariableFont(f, {"wght": weight}, inplace=False)
    buf = io.BytesIO()
    f.save(buf)
    buf.seek(0)
    from PIL import ImageFont
    return ImageFont.truetype(buf, size)


def main() -> None:
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)

    # Soft diagonal glow, echoing the hero's particle field.
    glow = Image.new("RGB", (W, H), BG)
    gd = ImageDraw.Draw(glow)
    for i in range(28):
        t = i / 27
        x = int(W * 0.52 + t * W * 0.6)
        r = int(150 + t * 420)
        c = tuple(int(BG[k] + (BG_GLOW[k] - BG[k]) * (1 - t) * 0.55) for k in range(3))
        gd.ellipse([x - r, int(H * 0.1) - r, x + r, int(H * 0.1) + r], fill=c)
    img = Image.blend(img, glow, 0.85)
    d = ImageDraw.Draw(img)

    # Accent bar, like the section titles on the page.
    d.rectangle([80, 150, 86, 292], fill=CYAN)

    f_eyebrow = load("jetbrains-mono-latin.woff2", 26, 400)
    f_name = load("space-grotesk-latin.woff2", 40, 500)
    f_title = load("space-grotesk-latin.woff2", 64, 700)
    f_chip = load("jetbrains-mono-latin.woff2", 22, 400)
    f_foot = load("jetbrains-mono-latin.woff2", 24, 400)

    d.text((80, 96), EYEBROW, font=f_eyebrow, fill=CYAN)
    d.text((112, 142), TAGLINE, font=f_title, fill=TEXT_STRONG, spacing=16)
    d.text((112, 300), NAME, font=f_name, fill=TEXT)

    # Capability chips
    x, y = 112, 392
    for label in CHIPS:
        w = int(d.textlength(label, font=f_chip))
        d.rounded_rectangle([x, y, x + w + 36, y + 46], radius=23,
                            outline=(38, 62, 76), width=2)
        d.ellipse([x + 15, y + 19, x + 23, y + 27], fill=PURPLE)
        d.text((x + 31, y + 11), label, font=f_chip, fill=TEXT_MUTED)
        x += w + 52

    d.line([80, 520, W - 80, 520], fill=(28, 34, 48), width=2)
    d.text((80, 548), FOOTER, font=f_foot, fill=TEXT_MUTED)

    img.save(OUT, "PNG", optimize=True)
    print(f"wrote {OUT.name} ({OUT.stat().st_size:,} bytes, {W}x{H})")


if __name__ == "__main__":
    main()
