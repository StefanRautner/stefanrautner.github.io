#!/usr/bin/env python3
"""
Build the three GitHub stat cards as local SVGs in stats/.

Runs at build time (locally or in CI) — never in the visitor's browser — so the
site itself contacts no third party. See .github/workflows/refresh-stats.yml.

  profile-details.svg  fetched from github-profile-summary-cards
  streak.svg           fetched from streak-stats
  top-langs.svg        generated here from the GitHub REST API, because the
                       upstream github-readme-stats instance is offline
                       (HTTP 503 DEPLOYMENT_PAUSED)

Existing files are kept if a source is unreachable, so a flaky upstream can
never blank a card that is already on the site.
"""

import json
import os
import re
import pathlib
import sys
import urllib.error
import urllib.request

USER = "StefanRautner"
ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "stats"

# React theme, matched to the two upstream cards so all three look like a set.
BG = "#20232a"
ACCENT = "#61dafb"
TEXT = "#ffffff"
FONT = "'Segoe UI', Ubuntu, \"Helvetica Neue\", Sans-Serif"

UA = "portfolio-stats-builder"

# Repos to leave out of the language tally — vendored or generated code skews
# the byte counts badly. Add names here as needed.
# MBotController holds ~2.0 MB of vendored JavaScript, which alone produced
# 74% "JavaScript" on the card and drowned out everything actually written
# by hand. Remove the entry to count it again.
EXCLUDE_REPOS: set[str] = {"MBotController"}

# github/linguist colours for the languages that actually show up.
LANG_COLORS = {
    "JavaScript": "#f1e05a", "TypeScript": "#3178c6", "Python": "#3572A5",
    "Java": "#b07219", "C#": "#178600", "C++": "#f34b7d", "C": "#555555",
    "CSS": "#663399", "HTML": "#e34c26", "Dart": "#00B4AB", "PHP": "#4F5D95",
    "Shell": "#89e051", "Kotlin": "#A97BFF", "Swift": "#F05138", "Go": "#00ADD8",
    "Ruby": "#701516", "Rust": "#dea584", "PostScript": "#da291c",
}
FALLBACK_COLOR = "#858585"

REMOTE_CARDS = {
    "profile-details.svg":
        "https://github-profile-summary-cards.vercel.app/api/cards/"
        f"profile-details?username={USER}&theme=react",
    "streak.svg":
        f"https://streak-stats.demolab.com?user={USER}&theme=react",
}


def fetch(url: str, as_json: bool = False):
    headers = {"User-Agent": UA}
    if as_json:
        headers["Accept"] = "application/vnd.github+json"
        token = os.environ.get("GITHUB_TOKEN")
        if token:
            headers["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=30) as r:
        raw = r.read()
    return json.loads(raw) if as_json else raw


def esc(s: str) -> str:
    return (s.replace("&", "&amp;").replace("<", "&lt;")
             .replace(">", "&gt;").replace('"', "&quot;"))


def flatten_animations(svg: bytes) -> bytes:
    """Bake CSS entrance animations into their finished state.

    The streak card draws every element at opacity:0 and fades it in. Chrome
    does not reliably start CSS animations inside an <img>-embedded SVG that
    was lazy-loaded, so the card can stay permanently blank. An entrance
    animation on a cached snapshot buys nothing, so drop it and keep the end
    state — every keyframe set here ends at opacity:1, and the one element
    that animates font-size already carries its final size as an attribute.
    """
    s = svg.decode("utf-8")
    s = re.sub(r"@keyframes\s+\w+\s*\{(?:[^{}]|\{[^{}]*\})*\}", "", s)
    s = re.sub(r"\s*animation:[^;'\"}]*;?", "", s)
    s = re.sub(r"opacity:\s*0(?![.\d])", "opacity: 1", s)
    return s.encode("utf-8")


def language_totals() -> list[tuple[str, int]]:
    repos = fetch(f"https://api.github.com/users/{USER}/repos"
                  "?per_page=100&type=owner", as_json=True)
    totals: dict[str, int] = {}
    for repo in repos:
        if repo["fork"] or repo["name"] in EXCLUDE_REPOS:
            continue
        for lang, count in fetch(repo["languages_url"], as_json=True).items():
            totals[lang] = totals.get(lang, 0) + count
    return sorted(totals.items(), key=lambda kv: -kv[1])


def build_top_langs(langs: list[tuple[str, int]], limit: int = 6) -> str:
    # 495x195 matches the streak card, so the two sit level in the grid row.
    W, H = 495, 195
    langs = langs[:limit]
    total = sum(c for _, c in langs) or 1
    pcts = [(name, 100 * count / total) for name, count in langs]

    bar_x, bar_y, bar_w, bar_h = 25, 58, W - 50, 10
    parts, x = [], float(bar_x)
    for name, pct in pcts:
        seg = bar_w * pct / 100
        parts.append(
            f'<rect x="{x:.2f}" y="{bar_y}" width="{seg:.2f}" height="{bar_h}" '
            f'fill="{LANG_COLORS.get(name, FALLBACK_COLOR)}"/>'
        )
        x += seg

    rows = []
    for i, (name, pct) in enumerate(pcts):
        col, row = i % 2, i // 2
        cx = 30 + col * 235
        cy = 100 + row * 28
        rows.append(
            f'<circle cx="{cx}" cy="{cy - 4}" r="5" '
            f'fill="{LANG_COLORS.get(name, FALLBACK_COLOR)}"/>'
            f'<text x="{cx + 14}" y="{cy}" font-size="13" fill="{TEXT}">'
            f'{esc(name)} {pct:.2f}%</text>'
        )

    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" '
        f'viewBox="0 0 {W} {H}" role="img" '
        f'aria-label="Most used languages on GitHub">'
        f'<style>text {{ font-family: {FONT} }}</style>'
        f'<rect x="0.5" y="0.5" rx="5" ry="5" width="{W - 1}" height="{H - 1}" '
        f'fill="{BG}"/>'
        f'<text x="25" y="38" font-size="18" fill="{ACCENT}">'
        f'Most Used Languages</text>'
        f'<g clip-path="url(#r)">{"".join(parts)}</g>'
        f'<defs><clipPath id="r"><rect x="{bar_x}" y="{bar_y}" '
        f'width="{bar_w}" height="{bar_h}" rx="5"/></clipPath></defs>'
        f'{"".join(rows)}</svg>'
    )


def write(name: str, data: bytes) -> None:
    (OUT / name).write_bytes(data)
    print(f"  wrote stats/{name} ({len(data)} bytes)")


def main() -> int:
    OUT.mkdir(exist_ok=True)
    failures = 0

    for name, url in REMOTE_CARDS.items():
        try:
            body = fetch(url)
            if not body.lstrip().startswith(b"<svg"):
                raise ValueError(f"not an SVG: {body[:60]!r}")
            write(name, flatten_animations(body))
        except (urllib.error.URLError, ValueError, OSError) as e:
            failures += 1
            kept = "kept existing file" if (OUT / name).exists() else "NO FILE"
            print(f"  !! {name}: {e} — {kept}", file=sys.stderr)

    try:
        write("top-langs.svg", build_top_langs(language_totals()).encode())
    except (urllib.error.URLError, ValueError, OSError, KeyError) as e:
        failures += 1
        kept = "kept existing file" if (OUT / "top-langs.svg").exists() else "NO FILE"
        print(f"  !! top-langs.svg: {e} — {kept}", file=sys.stderr)

    return 1 if failures == len(REMOTE_CARDS) + 1 else 0


if __name__ == "__main__":
    raise SystemExit(main())
