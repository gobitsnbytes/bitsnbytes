"""bits&bytes™ partnership prospectus (Print Riot edition).

python scripts/build_prospectus.py           -> output/pdf/bitsnbytes-partnership-prospectus-2026.pdf
python scripts/build_prospectus.py --check   -> also renders tmp/prospectus-pages/pNN.png + contact.png
                                                and fails if any text crosses the margins or overlaps.
"""

from __future__ import annotations

import io
import os
import re
import sys
from pathlib import Path
from xml.sax.saxutils import escape

from PIL import Image, ImageEnhance, ImageOps
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.pdfgen.canvas import FILL_EVEN_ODD
from reportlab.platypus import Paragraph
from svglib.utils import normalise_svg_path


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "output" / "pdf"
OUT = OUT_DIR / "bitsnbytes-partnership-prospectus-2026.pdf"
PREVIEW_DIR = ROOT / "tmp" / "prospectus-pages"

PAGE_W, PAGE_H = A4
M = 48  # side margin (text never closer than 36pt to the trim)
W = PAGE_W - 2 * M
FLOOR = 66  # content stops here; the footer lives below

# app/globals.css tokens
PAPER = HexColor("#FAF8F5")
PAPER_2 = HexColor("#EAE8E4")
CREAM = HexColor("#FEE9CF")
INK = HexColor("#120F0A")
BURGUNDY = HexColor("#97192C")
BURGUNDY_DK = HexColor("#791423")
ORANGE = HexColor("#FC920D")
WARM = HexColor("#C94218")
MARKER = HexColor("#DF8E74")
MUTED = HexColor("#716F6C")
MID = HexColor("#413F3B")
FOG = HexColor("#D0CFCE")

# burgundy -> orange campaign surface, top to bottom. Paper text above y~340, ink text below y~235.
HEAT = [(0.0, BURGUNDY_DK), (0.3, BURGUNDY), (0.62, WARM), (0.85, ORANGE), (1.0, ORANGE)]
# per surface: text, secondary text, display accent, eyebrow
TONES = {
    "paper": (INK, MUTED, BURGUNDY, BURGUNDY),
    "ink": (PAPER, FOG, ORANGE, ORANGE),
    "burgundy": (PAPER, CREAM, ORANGE, CREAM),
    "heat": (PAPER, CREAM, ORANGE, CREAM),
}
BRAND = "bits&bytes™"
ART = ("#120F0A", "#97192C", "#FEE9CF")  # ink -> burgundy -> cream photo tritone


FONT_DIRS = [ROOT / "scripts" / "fonts", Path("C:/Windows/Fonts")]
if os.environ.get("BITSNBYTES_FONT_DIR"):
    FONT_DIRS.insert(0, Path(os.environ["BITSNBYTES_FONT_DIR"]))
FONTS = {
    "Display": ["Anton-Regular.ttf"],
    "Heavy": ["ArchivoBlack-Regular.ttf"],
    "Serif": ["GeorgiaPro-Regular.ttf", "GeorgiaPro.ttf", "georgia.ttf"],
    "Serif-Bold": ["GeorgiaPro-Bold.ttf", "georgiab.ttf"],
    "Serif-Italic": ["GeorgiaPro-Italic.ttf", "georgiai.ttf"],
    "Mono": ["SpaceMono-Regular.ttf"],
    "Mono-Bold": ["SpaceMono-Bold.ttf"],
    "Script": ["Yellowtail-Regular.ttf"],
}
CAP: dict[str, float] = {}


def register_fonts() -> None:
    """Register every brand role or stop: a silent fallback is how the old build shipped Impact and Arial."""
    missing = []
    for role, names in FONTS.items():
        path = next((d / n for d in FONT_DIRS for n in names if (d / n).exists()), None)
        if path is None:
            missing.append(f"{role} ({' / '.join(names)})")
            continue
        font = TTFont(role, str(path))
        if ord("™") not in font.face.charToGlyph:
            raise SystemExit(f"{path.name} has no ™ glyph; pick another font for the {role} role")
        pdfmetrics.registerFont(font)
        CAP[role] = font.face.capHeight / 1000
    if missing:
        raise SystemExit(
            "missing fonts: " + ", ".join(missing) + f"\nlooked in: {', '.join(map(str, FONT_DIRS))}"
            " (set BITSNBYTES_FONT_DIR to add a folder)"
        )


register_fonts()


# ---------------------------------------------------------------- text

def caps(text: str) -> str:
    """Uppercase for display and labels, keeping the brand spelling intact."""
    return BRAND.join(part.upper() for part in text.split(BRAND))


def draw(c, text, x, y, font, size, color, max_w=None, align="l", track=0.0) -> float:
    """drawString that shrinks to max_w instead of running off the page. Returns the drawn width."""
    unit = pdfmetrics.stringWidth(text, font, 1) + track * (len(text) - 1)
    if max_w and unit * size > max_w:
        size = max_w / unit
    w = unit * size
    x -= {"l": 0, "c": w / 2, "r": w}[align]
    c.setFont(font, size)
    c.setFillColor(color)
    c.drawString(x, y, text, charSpace=track * size)
    return w


def label(c, text, x, y, color, size=7.0, max_w=None, align="l", bold=True) -> float:
    return draw(c, caps(text), x, y, "Mono-Bold" if bold else "Mono", size, color, max_w or W, align, track=0.14)


def eyebrow(c, n: int, text: str, x: float, y: float, color) -> None:
    """§04 — LABEL with the site's orange square."""
    c.setFillColor(ORANGE)
    c.rect(x, y, 5, 5, fill=1, stroke=0)
    label(c, f"§{n:02d} — {text}", x + 11, y, color, 7.4)


def display(c, lines, x, y_top, max_w, size, fills, *, lead=0.96, align="l", font="Display", marks=None, upper=True) -> float:
    """Stacked display lines at one shared size that fits max_w. Returns the last baseline."""
    lines = [caps(line) if upper else line for line in lines]
    size = display_size(lines, max_w, size, font)
    y = y_top - CAP[font] * size
    for i, line in enumerate(lines):
        if marks and marks[i]:
            w = pdfmetrics.stringWidth(line, font, size)
            left = x - {"l": 0, "c": w / 2, "r": w}[align]
            c.setFillColor(marks[i])
            c.rect(left - 0.1 * size, y - 0.06 * size, w + 0.2 * size, (CAP[font] + 0.12) * size, fill=1, stroke=0)
        draw(c, line, x, y, font, size, fills[i % len(fills)], align=align)
        if i < len(lines) - 1:
            # commas and descenders hang below the baseline: open the gap so they never touch the next line
            y -= (lead + (0.1 if re.search(r"[,;gjpqyQJ]", line) else 0)) * size
            # a marked (highlight-band) line needs clear air above it, or its band shaves the line before
            if marks and marks[i + 1]:
                y -= 0.12 * size
    return y


def display_size(lines, max_w, size, font="Display") -> float:
    return min([size] + [max_w / pdfmetrics.stringWidth(line, font, 1) for line in lines])


def para(c, text, x, y_top, w, style, h_limit=None) -> float:
    p = Paragraph(escape(text).replace("\n", "<br/>"), style)
    _, h = p.wrap(w, PAGE_H)
    if h_limit is not None and h > h_limit + 0.5:
        raise ValueError(f"Paragraph overflow: {text[:70]!r} -> {h:.1f} > {h_limit:.1f}")
    p.drawOn(c, x, y_top - h)
    return h


def para_h(text, w, style) -> float:
    return Paragraph(escape(text), style).wrap(w, PAGE_H)[1]


def st(base: ParagraphStyle, **kw) -> ParagraphStyle:
    return ParagraphStyle(base.name + "+", parent=base, **kw)


BODY = ParagraphStyle("body", fontName="Serif", fontSize=10.5, leading=15, textColor=INK)
LEDE = st(BODY, fontSize=11.2, leading=16, textColor=MID)
SMALL = st(BODY, fontSize=8.7, leading=12, textColor=MID)
STRONG = st(BODY, fontName="Serif-Bold", fontSize=11, leading=15.5)
QUOTE = st(BODY, fontName="Serif-Italic", fontSize=14, leading=18)
HEAD = ParagraphStyle("head", fontName="Heavy", fontSize=9.4, leading=11.6, textColor=INK)


def need(y: float) -> float:
    if y < FLOOR:
        raise ValueError(f"layout runs into the footer (y={y:.0f} < {FLOOR})")
    return y


# ---------------------------------------------------------------- shapes

def rule(c, x, y, w, color=INK, thickness=3.0) -> None:
    c.setStrokeColor(color)
    c.setLineWidth(thickness)
    c.line(x, y, x + w, y)


def panel(c, x, top, w, h, fill, shadow=6, edge=INK, shade=INK) -> None:
    """Square panel: 3pt border and a hard offset shadow (never blurred)."""
    if shadow:
        c.setFillColor(shade)
        c.rect(x + shadow, top - h - shadow, w, h, fill=1, stroke=0)
    c.setFillColor(fill)
    c.setStrokeColor(edge)
    c.setLineWidth(3)
    c.rect(x, top - h, w, h, fill=1, stroke=1)


def gradient(c, x, y, w, h, stops) -> None:
    c.saveState()
    p = c.beginPath()
    p.rect(x, y, w, h)
    c.clipPath(p, stroke=0, fill=0)
    c.linearGradient(x, y + h, x, y, [s[1] for s in stops], [s[0] for s in stops], extend=False)
    c.restoreState()


def halftone(c, x, y, w, h, color, alpha=0.18, step=7.0, rmax=2.4, grow_down=True) -> None:
    """Riso-style dot screen fading across the box."""
    c.saveState()
    c.setFillColor(color)
    c.setFillAlpha(alpha)
    p = c.beginPath()
    row, yy = 0, y + step / 2
    while yy < y + h:
        t = (y + h - yy) / h if grow_down else (yy - y) / h
        if rmax * t > 0.3:
            xx = x + (step / 2 if row % 2 else 0)
            while xx <= x + w:
                p.circle(xx, yy, rmax * t)
                xx += step
        yy += step
        row += 1
    c.drawPath(p, fill=1, stroke=0)
    c.restoreState()


def surface(c, kind: str) -> None:
    if kind == "heat":
        gradient(c, 0, 0, PAGE_W, PAGE_H, HEAT)
        return
    c.setFillColor({"paper": PAPER, "ink": INK, "burgundy": BURGUNDY}[kind])
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)


def _logo_subpaths() -> list[list[tuple]]:
    """public/logo.svg as absolute segments: the cube plus its four cut-outs (the mask's paths)."""
    svg = (ROOT / "public" / "logo.svg").read_text(encoding="utf-8")
    shapes = []
    for d in re.findall(r'\sd="([^"]+)"', svg)[:5]:  # the 6th path repeats the cube
        ops = normalise_svg_path(d)
        segs, x, y, sx, sy = [], 0.0, 0.0, 0.0, 0.0
        for op, a in zip(ops[::2], ops[1::2]):
            rel, o = op.islower(), op.upper()
            if o == "Z":
                segs.append(("Z",))
                x, y = sx, sy
                continue
            if o == "C":
                pts = [v + ((x, y)[i % 2] if rel else 0) for i, v in enumerate(a)]
                segs.append(("C", *pts))
                x, y = pts[4], pts[5]
                continue
            if o in "ML":
                nx, ny = (a[0] + x, a[1] + y) if rel else (a[0], a[1])
            elif o == "H":
                nx, ny = a[0] + (x if rel else 0), y
            elif o == "V":
                nx, ny = x, a[0] + (y if rel else 0)
            else:
                raise ValueError(f"unsupported path op {op} in logo.svg")
            segs.append(("M" if o == "M" else "L", nx, ny))
            x, y = nx, ny
            if o == "M":
                sx, sy = x, y
        shapes.append(segs)
    return shapes


LOGO = _logo_subpaths()


def mark(c, x, y, size, color) -> None:
    """The cube mark as vector, cut-outs knocked out (even-odd), so it can sit on any ground."""
    k = size / 146  # viewBox 28 54 146 146
    X = lambda v: x + (v - 28) * k  # noqa: E731
    Y = lambda v: y + size - (v - 54) * k  # noqa: E731
    p = c.beginPath()
    for segs in LOGO:
        for s in segs:
            if s[0] == "M":
                p.moveTo(X(s[1]), Y(s[2]))
            elif s[0] == "L":
                p.lineTo(X(s[1]), Y(s[2]))
            elif s[0] == "C":
                p.curveTo(X(s[1]), Y(s[2]), X(s[3]), Y(s[4]), X(s[5]), Y(s[6]))
            else:
                p.close()
    c.setFillColor(color)
    c.drawPath(p, fill=1, stroke=0, fillMode=FILL_EVEN_ODD)


def wordmark_size(fit: float, size: float) -> float:
    unit = (pdfmetrics.stringWidth("bits", "Heavy", 1) - 0.12 - 0.12
            + pdfmetrics.stringWidth("&bytes", "Script", 0.86) - 0.06 + pdfmetrics.stringWidth("™", "Heavy", 0.13))
    return min(size, fit / unit)


def wordmark(c, x, base, size, color) -> None:
    """components/chrome/wordmark.tsx: wide "bits", script "&bytes" tucked .12em in and .16em down, small ™."""
    track = -0.04 * size
    c.setFillColor(color)
    c.setFont("Heavy", size)
    c.drawString(x, base, "bits", charSpace=track)
    sx = x + pdfmetrics.stringWidth("bits", "Heavy", size) + 3 * track - 0.12 * size
    c.setFont("Script", 0.86 * size)
    c.drawString(sx, base - 0.16 * size, "&bytes")
    tx = sx + pdfmetrics.stringWidth("&bytes", "Script", 0.86 * size) - 0.06 * size  # Yellowtail's "s" advance runs long
    ts = max(0.13 * size, 5)
    c.setFont("Heavy", ts)
    c.drawString(tx, base + CAP["Heavy"] * (size - ts), "™")


def photo(c, path: str, x, top, w, h, frame=True, focus=0.5) -> None:
    """Tritone photo; focus is the vertical crop centre (0 top, 1 bottom)."""
    img = Image.open(ROOT / path).convert("RGB")
    img = ImageOps.fit(img, (int(w * 2.4), int(h * 2.4)), method=Image.Resampling.LANCZOS, centering=(0.5, focus))
    img = ImageOps.colorize(ImageEnhance.Contrast(ImageOps.grayscale(img)).enhance(1.12), black=ART[0], mid=ART[1], white=ART[2])
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=90, optimize=True)
    if frame:
        panel(c, x, top, w, h, INK, shadow=6)
    c.drawImage(ImageReader(buf), x, top - h, width=w, height=h)
    if frame:
        c.setStrokeColor(INK)
        c.setLineWidth(3)
        c.rect(x, top - h, w, h, fill=0, stroke=1)


def tag(c, text, x, y, fill=ORANGE, fg=INK) -> float:
    """Mono tag with a 2pt ink border (y = bottom)."""
    tw = pdfmetrics.stringWidth(caps(text), "Mono-Bold", 7) + 0.14 * 7 * (len(text) - 1)
    c.setFillColor(fill)
    c.setStrokeColor(INK)
    c.setLineWidth(2)
    c.rect(x, y, tw + 14, 17, fill=1, stroke=1)
    label(c, text, x + 7, y + 5.6, fg)
    return tw + 14


def bookmark(c, title: str) -> None:
    safe = re.sub(r"[^A-Za-z0-9]+", "-", title).strip("-")
    c.bookmarkPage(safe)
    c.addOutlineEntry(title, safe, level=0, closed=False)


def head(c, page, kicker, title, sub=None, kind="paper", size=54, fills=None, sub_w=420) -> float:
    """Chapter head: §0N eyebrow + cube, Anton title, serif lede, 3pt rule. Returns the next free y."""
    fg, dim, accent, brow = TONES[kind]
    eyebrow(c, page, kicker, M, PAGE_H - 52, brow)
    mark(c, PAGE_W - M - 22, PAGE_H - 60, 24, fg)
    y = display(c, title.split("\n"), M, PAGE_H - 76, W, size, fills or [fg, accent])
    if sub:
        y -= 14
        y -= para(c, sub, M, y, sub_w, st(LEDE, textColor=dim if kind != "paper" else MID))
    y -= 16
    rule(c, M, y, W, fg, 3)
    return y - 22


def footer(c, page: int, section: str, kind="paper") -> None:
    fg = {"paper": INK, "heat": INK, "ink": FOG, "burgundy": CREAM}[kind]
    dim = MUTED if kind == "paper" else fg
    rule(c, M, 54, W, fg, 1)
    draw(c, "bits&bytes™  /  gobitsnbytes.org", M, 41, "Mono", 7, dim)
    label(c, section, PAGE_W / 2, 41, fg, 7, align="c")
    draw(c, f"{page:02d} / {len(PAGES)}", PAGE_W - M, 41, "Mono-Bold", 7, fg, align="r")
    label(c, "© 2026 GOBITSNBYTES FOUNDATION. ALL RIGHTS RESERVED.", PAGE_W - M, 30, dim, 6, align="r", bold=False)


def num(fn) -> int:
    return PAGES.index(fn) + 1


# ---------------------------------------------------------------- pages

def page_cover(c, page):
    surface(c, "heat")
    halftone(c, 0, 0, PAGE_W, 330, INK, alpha=0.16)
    mark(c, M - 8, PAGE_H - 108, 72, PAPER)
    label(c, "partnership & sponsorship prospectus", PAGE_W - M, PAGE_H - 62, PAPER, 7.4, align="r")
    label(c, "pan-india  /  2026", PAGE_W - M, PAGE_H - 77, CREAM, 7.4, align="r")
    y = display(c, ["the next", "generation", "will not be", "handed to us."], M, PAGE_H - 150, W, 112,
                [PAPER, PAPER, PAPER, INK], marks=[None, None, None, CREAM])
    draw(c, "So we're building somewhere for them to begin.", M, y - 52, "Serif-Italic", 21, PAPER, max_w=W)
    photo(c, "public/event_pictures/bd1.jpg", PAGE_W - M - 176, y - 90, 176, 150)
    wordmark(c, M, 128, wordmark_size(W - 176 - 40, 72), INK)
    label(c, "an independent, teen-led builder network across India, under GOBITSNBYTES FOUNDATION", M, 62, INK, 6.6)
    label(c, "© 2026 GOBITSNBYTES FOUNDATION", M, 40, INK, 6.6)


def page_founder_letter(c, page):
    surface(c, "paper")
    bookmark(c, "A letter from the founders")
    y = head(c, page, "preface", "a letter from\nthe founders", fills=[INK, BURGUNDY])
    quote = ["The gap we care about is short and stubborn:", "the distance between a teenager with an idea", "and a thing that actually exists."]
    c.setFillColor(BURGUNDY)
    c.rect(M, y - 3 * 26 + 8, 4, 3 * 26 - 4, fill=1, stroke=0)
    for i, line in enumerate(quote):
        draw(c, line, M + 18, y - 18 - i * 26, "Serif-Italic", 19, INK, max_w=W - 18)
    y -= 3 * 26 + 26
    col = (W - 28) / 2
    letter = st(BODY, fontSize=11, leading=16.4)
    h1 = para(c, "In July 2025 we were organising a regional student hackathon under an external partner. By mid-August the partner had cancelled it. The easy move was to wait for someone else to hand us a new date. We were teenagers with a problem, and we still had a group of people who wanted to build.", M, y, col, letter)
    h2 = para(c, "So we started bits&bytes™ in November 2025, at first to make one independent hackathon happen. Then the shape of the work got clearer. Young people don't need more reasons to consume technology. They need a place to use it, break it and ship it, next to other people doing the same.", M + col + 28, y, col, letter)
    y -= max(h1, h2) + 16
    y -= para(c, "The network is still young, and that's part of the point. We're building the systems, standards and partnerships that let a teen-led organisation move fast without asking young people to carry adult legal or financial risk.", M, y, W, letter) + 34
    belief = "School can teach the map. Real projects teach you where the ground gives way."
    pull = st(STRONG, fontSize=16, leading=21, textColor=BURGUNDY)
    ph = para_h(belief, W - 60, pull)
    panel(c, M, y, W - 6, ph + 62, CREAM)
    label(c, "our working belief", M + 22, y - 28, BURGUNDY)
    para(c, belief, M + 22, y - 40, W - 60, pull)
    need(y - ph - 62 - 90)
    # signatures sit at the foot of the letter
    draw(c, "Yash Singh  /  Aadrika Maurya  /  Akshat Kushwaha", M, FLOOR + 30, "Script", 24, INK, max_w=W)
    label(c, "co-founders, bits&bytes™", M, FLOOR + 8, MUTED)
    footer(c, page, "founder letter")


def page_contents(c, page):
    surface(c, "ink")
    bookmark(c, "Contents")
    halftone(c, 400, 64, PAGE_W - 400, 150, ORANGE, alpha=0.22)
    y = head(c, page, "contents", "the shape of\nthe work", kind="ink", size=64)
    items = [
        (page_what, "What is bits&bytes™", "Who we are and what the network is for"),
        (page_problem, "Why this needs to exist", "The gap between school and capability"),
        (page_thesis, "How we work", "Our mission, the method and the model we run"),
        (page_timeline, "The record so far", "From a cancelled event to a pan-India network"),
        (page_fork, "Forks", "Local chapters that run their own rooms"),
        (page_events, "Events and the next room", "What we've run, and the Regional Hackathon Series"),
        (page_collabs, "Collaborations", "Community partnerships and the names beside us"),
        (page_legal, "Trust is part of the product", "Legal structure, safeguarding and stewardship"),
        (page_why_partner, "Why partner", "University, corporate and institutional pathways"),
        (page_vision, "The next three years", "Forks, schools, the maker track and alumni"),
        (page_next_steps, "Next steps", "One conversation, then one thing built"),
    ]
    note = "This is a working prospectus. We'd rather shape a partnership together, with the teenagers who'll live inside it and the adults who'll help keep it safe."
    ns = st(SMALL, textColor=FOG, fontSize=9.4, leading=13.4)
    y += 8
    pitch = min((y - FLOOR - 26 - para_h(note, 330, ns)) / len(items), 47)
    assert pitch >= 40, f"contents rows too tight ({pitch:.0f})"
    for fn, heading, desc in items:
        draw(c, f"{num(fn):02d}", M, y - 31, "Display", 28, ORANGE)
        draw(c, heading, M + 62, y - 18, "Heavy", 12, PAPER, max_w=W - 62)
        draw(c, desc, M + 62, y - 33, "Serif", 9.4, FOG, max_w=W - 62)
        y -= pitch
        rule(c, M, y, W, MID, 1)
    need(y - 26 - para(c, note, M, y - 26, 330, ns))
    footer(c, page, "contents", "ink")


def page_what(c, page):
    surface(c, "paper")
    bookmark(c, "What is bits&bytes™")
    y = head(c, page, "identity", "what is bits&bytes™", "A teen-led, builder-first network for technology education, run for teenagers across India who want to move from interest to evidence.")
    s = display_size(caps("we create the missing\nconditions to build.").split("\n"), W - 50, 50)
    ph = 26 + (CAP["Display"] + 0.96) * s + 26
    panel(c, M, y, W - 6, ph, BURGUNDY)
    display(c, ["we create the missing", "conditions to build."], M + 22, y - 26, W - 50, s, [PAPER, ORANGE])
    y -= ph + 30
    y -= para(c, "bits&bytes™ is the infrastructure around the work: the people, programmes, tools, spaces and standards that help a young person finish something real, plus the public moment where they show it. A group chat or an events calendar can't do that on its own.", M, y, 440, BODY) + 26
    cards = [
        ("builder network", "Teenagers, mentors, organisers, designers, engineers and alumni, working in public."),
        ("operating layer", "Events, cohorts, squads, forks and the systems that turn intent into a shipped artefact."),
        ("public-benefit foundation", "A Section 8 structure that keeps money, IP, safeguarding and mission under stewardship."),
    ]
    cw = (W - 2 * 20 - 4) / 3
    small = st(SMALL, textColor=INK, fontSize=8.4, leading=11.4)
    ch = max(para_h(caps(h), cw - 28, HEAD) + para_h(b, cw - 28, small) for h, b in cards) + 70
    for i, (h, b) in enumerate(cards):
        x = M + i * (cw + 20)
        panel(c, x, y, cw, ch, ORANGE if i == 1 else CREAM, shadow=4)
        draw(c, f"0{i + 1}", x + 14, y - 36, "Display", 24, INK if i == 1 else BURGUNDY)
        hh = para(c, caps(h), x + 14, y - 46, cw - 28, HEAD)
        para(c, b, x + 14, y - 52 - hh, cw - 28, small)
    y -= ch + 40
    para(c, "The community is free to join. The bar isn't low. We ask people to show up, work with others and release something that holds up outside the room where it was made.", M, y, 230, st(STRONG, fontSize=12, leading=17))
    last = display(c, ["ship", "something", "useful."], PAGE_W - M, y, 216, 60, [INK, BURGUNDY, INK], align="r", marks=[ORANGE, None, None])
    need(last)
    footer(c, page, "identity")


def page_problem(c, page):
    surface(c, "heat")
    bookmark(c, "Why this needs to exist")
    y = head(c, page, "the problem", "grades are not\nportfolios.", "A syllabus can describe knowledge without building the muscle to use it.", kind="heat")
    y = display(c, ["the gap is not", "motivation."], M, y - 2, W, 70, [ORANGE, PAPER]) - 24
    y -= para(c, "The gap is opportunity. A teenager can be curious, online and surrounded by information, and still have nowhere to practise building with other people. That's where capability stays theoretical.", M, y, 360, st(BODY, textColor=PAPER)) + 24
    data = [
        ("86.8%", "of 14–18-year-olds in ASER's rural sample were enrolled in education"),
        ("5.6%", "reported taking vocational training or related courses"),
        ("43.3%", "could solve a basic three-digit by one-digit division problem"),
    ]
    note = "These numbers aren't a verdict on young people. They're a reminder that enrolment isn't readiness, and that access to content isn't access to practice."
    small = st(SMALL, textColor=FOG)
    ph = 24 + 3 * 44 + 14 + para_h(note, W - 50, small) + 22
    panel(c, M, y, W - 6, ph, INK, shade=BURGUNDY_DK)
    yy = y - 24
    for n, text in data:
        draw(c, n, M + 22, yy - 28, "Display", 30, ORANGE)
        para(c, text, M + 130, yy - 8, W - 160, st(SMALL, textColor=PAPER, fontSize=9.4, leading=12.5))
        yy -= 44
        rule(c, M + 22, yy + 4, W - 50, MID, 1)
    para(c, note, M + 22, yy - 10, W - 50, small)
    need(y - ph - 40)
    para(c, "[1] ASER 2023: main findings. Rural 14–18 sample, 34,745 youth across 28 districts in 26 states.", M, FLOOR + 10, W, st(SMALL, fontName="Mono", fontSize=6.8, leading=9, textColor=INK))
    footer(c, page, "the problem", "heat")


def page_research(c, page):
    surface(c, "paper")
    bookmark(c, "The world is changing faster than the timetable")
    y = head(c, page, "context", "the world is changing\nfaster than the timetable.", "Useful education doesn't stop at explaining a concept. It gives a learner a reason to care, a constraint to work within, someone to work with and an audience that can tell whether the result holds up.", fills=[INK, BURGUNDY], sub_w=440)
    wef = "The World Economic Forum's 2025 employer survey expects 39% of workers' core skills to change by 2030. AI and big data sit on that list next to analytical and creative thinking, resilience, collaboration and leadership. You build those through repeated contact with real constraints."
    small = st(SMALL, textColor=INK, fontSize=9.6, leading=13.6)
    lines = ["the skill stack is moving", "from recall to judgment."]
    s = display_size([caps(line) for line in lines], W - 50, 42)
    ph = 26 + (CAP["Display"] + 1.06) * s + 16 + para_h(wef, W - 50, small) + 24
    panel(c, M, y, W - 6, ph, CREAM)
    b = display(c, lines, M + 22, y - 26, W - 50, s, [INK, BURGUNDY])
    para(c, wef, M + 22, b - 16, W - 50, small)
    y -= ph + 34
    cw = (W - 26) / 2
    nep = "Policy already points this way. NEP 2020 asks for hands-on vocational exposure, internships and learning that crosses subject lines. Building is part of the stated direction."
    pbl = "A 2023 meta-analysis of 66 experimental and quasi-experimental studies found project-based learning had a positive effect on achievement, thinking skills and student attitudes. Practice is a learning method in its own right."
    s2 = st(SMALL, fontSize=10, leading=14.2)
    ch = max(para_h(nep, cw - 40, s2), para_h(pbl, cw - 40, s2)) + 44
    panel(c, M, y, cw, ch, BURGUNDY, shadow=4)
    para(c, nep, M + 20, y - 22, cw - 40, st(s2, textColor=PAPER))
    panel(c, M + cw + 20, y, cw, ch, MARKER, shadow=4)
    para(c, pbl, M + cw + 40, y - 22, cw - 40, st(s2, textColor=INK))
    y -= ch + 38
    y -= para(c, "bits&bytes™ is the layer between what a teenager has been told and what they can show. That layer needs mentors, deadlines, peers, tools, feedback and a safe way to publish the result.", M, y, 460, st(STRONG, fontSize=12, leading=17))
    notes = st(SMALL, fontName="Mono", fontSize=6.8, leading=9.6, textColor=MUTED)
    need(y - 40)
    para(c, "[2] WEF, Future of Jobs Report 2025  /  [3] Government of India, NEP 2020\n[4] Tao et al., Frontiers in Psychology, 2023, DOI: 10.3389/fpsyg.2023.1202728", M, FLOOR + 20, W, notes)
    footer(c, page, "context")


def page_thesis(c, page):
    """Mission, the four-step method, and the whole-loop model (was two pages: thesis + differentiation)."""
    surface(c, "burgundy")
    bookmark(c, "How we work")
    y = head(c, page, "the thesis", "build the missing\nlayer.", "Our mission is simple enough to remember and hard enough to keep us honest: to enable young builders, contributors, organisers, mentors and communities to learn, build, collaborate and contribute through locally adaptive technology, education, open-source, community and public-benefit initiatives.", kind="burgundy", size=60, sub_w=470)
    steps = [
        ("find a real problem", "Start with a person, place or system that needs something to work better."),
        ("make the first version", "Teach only what the next decision needs, then let the work show the next gap."),
        ("work in public", "Let peers, mentors and partners test the work while it can still change."),
        ("release the result", "A project becomes evidence when someone outside the room can use it."),
    ]
    cw = (W - 18 - 4) / 2
    body = st(SMALL, textColor=INK, fontSize=9.6, leading=13)
    ch = max(para_h(b, cw - 32, body) for _, b in steps) + 66
    for i, (h, b) in enumerate(steps):
        x, top = M + (i % 2) * (cw + 18), y - (i // 2) * (ch + 16)
        panel(c, x, top, cw, ch, ORANGE if i in (1, 2) else CREAM, shadow=4)
        draw(c, f"0{i + 1}", x + 16, top - 16 - CAP["Display"] * 22, "Display", 22, BURGUNDY)
        draw(c, caps(h), x + 52, top - 16 - CAP["Display"] * 22, "Heavy", 9.4, INK, max_w=cw - 68)
        para(c, b, x + 16, top - 44, cw - 32, body)
    y -= 2 * ch + 16 + 26
    # the usual event model against ours, row for row
    rows = [("Announce an event", "Spot the builder"), ("Collect registrations", "Shape the problem"),
            ("Run a room", "Staff the programme"), ("Post the recap", "Ship the product"), ("Move on", "Keep the relationship")]
    rx, pitch = M + W / 2 + 6, 25
    label(c, "the usual model", M, y - 8, FOG)
    label(c, "the bits&bytes™ model", rx + 18, y - 8, CREAM)
    y -= 18
    panel(c, rx, y, W / 2 - 12, len(rows) * pitch + 12, CREAM, shade=BURGUNDY_DK)
    for i, (left, right) in enumerate(rows):
        yy = y - 22 - i * pitch
        draw(c, left, M, yy, "Serif", 11.5, FOG)
        rule(c, M, yy - 9, W / 2 - 30, BURGUNDY_DK, 1)
        c.setFillColor(ORANGE if i % 2 else CREAM)
        c.rect(rx - 30, yy + 3, 18, 4, fill=1, stroke=0)
        draw(c, right, rx + 18, yy, "Serif-Bold", 11.5, INK)
    y -= len(rows) * pitch + 12 + 20
    bet = "The bet: a shipped artefact changes what a teenager believes is possible."
    q = st(QUOTE, fontSize=15.5, leading=20, textColor=PAPER)
    qh = para_h(bet, W, q)
    rule(c, M, FLOOR + 12 + qh + 16, W, PAPER, 3)
    para(c, bet, M, FLOOR + 12 + qh, W, q)
    assert y >= FLOOR + 12 + qh + 16, f"thesis: the model runs into the closing line ({y:.0f} < {FLOOR + 12 + qh + 16:.0f})"
    footer(c, page, "how we work", "burgundy")


def page_timeline(c, page):
    surface(c, "paper")
    bookmark(c, "The record so far")
    y = head(c, page, "the record", "a network born from\na cancelled event", "The timeline is short. The ambition behind it isn't.")
    events = [
        ("JUL 2025", "the break", "We're organising a regional student hackathon under an external partner. By mid-August the partner has cancelled it."),
        ("NOV 2025", "the decision", "We start bits&bytes™ as an independent, teen-led builder network."),
        ("MAR 2026", "the test", "Execron 1.0 at IIT Kanpur brings hands-on AI, web, app, cybersecurity and cloud work to Classes 9–12."),
        ("MAR 2026", "the scale", "As Official Executive Partner for India Innovates 2026, the team works inside a national civic-tech platform."),
        ("APR 2026", "the proof", "Hack4Good v0 turns agentic AI into a 24-hour build sprint in Lucknow."),
        ("JUN 2026", "the structure", "GOBITSNBYTES FOUNDATION is incorporated as a Section 8 non-profit, a permanent legal home for the network."),
        ("2026", "the circuit", "We sign on as community partner for three global online hackathons: NexusHacks 2026, Infinity Hacks 2026 and DoraHacks 2.0."),
        ("DEC 2026", "the next room", "The Regional Hackathon Series: city qualifiers across India, then the finale at IIT Bombay on Dec 17–18."),
    ]
    lx, hx, bx = M + 86, M + 108, M + 236
    body = st(BODY, fontSize=10.8, leading=15)
    y -= 10
    hs = [max(para_h(b, PAGE_W - M - bx, body), 20) for _, _, b in events]
    pitch = (y - FLOOR - 10 - hs[-1]) / (len(events) - 1)  # spread the rows over the page
    assert pitch >= max(hs[:-1]) + 12, f"timeline rows collide ({pitch:.0f} < {max(hs[:-1]) + 12:.0f})"
    last = len(events) - 1
    c.setStrokeColor(INK)
    c.setLineWidth(3)
    c.line(lx, y - 8, lx, y - last * pitch - 8)
    for i, (date, h, b) in enumerate(events):
        tw = pdfmetrics.stringWidth(date, "Mono-Bold", 7) + 0.98 * (len(date) - 1) + 14
        tag(c, date, lx - 16 - tw, y - 17, fill=INK if i != last else ORANGE, fg=PAPER if i != last else INK)
        c.setFillColor(ORANGE if i in (1, 4, 6) else BURGUNDY)
        c.setStrokeColor(INK)
        c.setLineWidth(2)
        c.rect(lx - 7, y - 15, 14, 14, fill=1, stroke=1)
        draw(c, caps(h), hx, y - 13, "Heavy", 12.5, INK, max_w=bx - hx - 12)
        para(c, b, bx, y - 1, PAGE_W - M - bx, body)
        y -= pitch
    need(y + pitch - hs[-1])
    footer(c, page, "the record")


def grid(c, items, y, first=1, cols=2, gap=26) -> float:
    """Numbered items in a hairline grid (2pt ink rule on each cell). Returns the bottom y."""
    cw = (W - gap * (cols - 1)) / cols
    s = st(SMALL, textColor=MID, fontSize=9.6, leading=13.4)
    for r in range(0, len(items), cols):
        row = items[r:r + cols]
        rh = max(para_h(b, cw - 52, s) for _, b in row) + 50
        for j, (h, b) in enumerate(row):
            x, k = M + j * (cw + gap), first + r + j
            rule(c, x, y, cw, INK, 2)
            chip = k % 3 == 1  # every third number sits on an orange marker (orange type fails contrast on paper)
            display(c, [f"{k:02d}"], x + 3, y - 12, 60, 28, [INK if chip else BURGUNDY], marks=[ORANGE if chip else None])
            draw(c, caps(h), x + 52, y - 23, "Heavy", 10, INK, max_w=cw - 52)
            para(c, b, x + 52, y - 31, cw - 52, s)
        y -= rh
    return y


def band(c, path, top, bottom) -> None:
    """Fill the leftover height with a framed duotone photo, if there is room for one."""
    if top - bottom >= 90:
        photo(c, path, M, top, W - 6, top - bottom - 6)


def page_programs(c, page):
    surface(c, "paper")
    bookmark(c, "Programmes")
    y = head(c, page, "programmes", "different doors in.\none standard out.", "We build programmes around the stage a young person is actually at, without squeezing the network into one curriculum.")
    programs = [
        ("hackathons", "Problem-led sprints under real time pressure, where teams go from a blank repo to a public demo."),
        ("workshops", "Hands-on sessions that run inside our hackathons, on the tools people use now: AI, cloud, hardware, design and developer workflows."),
        ("cohorts", "Small groups with a shared pace, a clear output, peer accountability and mentors who've built the thing."),
        ("design and dev squads", "Cross-functional teams that keep shipping after the event and shape the work around real users."),
        ("hacker houses and residencies", "Focused spaces for deep work and the kind of iteration that needs more than an evening."),
        ("open-source and public goods", "Projects, playbooks and tools that stay open when the programme ends."),
        ("hardware and maker track", "The next layer: fund, mentor and show deeptech prototypes in electronics and hardware."),
    ]
    y = grid(c, programs[:6], y)
    bottom = grid(c, programs[6:], y, first=7, cols=2)
    cw = (W - 26) / 2
    q = st(QUOTE, fontSize=14, leading=19)
    line = "The output always matters more than the format that got you there."
    qh = para_h(line, cw - 46, q) + 38
    panel(c, M + cw + 26, y - 6, cw - 6, qh, CREAM)
    para(c, line, M + cw + 46, y - 25, cw - 46, q)
    band(c, "public/event_pictures/bd5.jpg", min(bottom, y - 6 - qh) - 24, FLOOR + 6)
    need(min(bottom, y - 6 - qh))
    footer(c, page, "programmes")


def page_fork(c, page):
    surface(c, "heat")
    bookmark(c, "Forks")
    y = head(c, page, "forks", "a fork is a local\nplace to begin.", "On GitHub, a fork is your own copy of an upstream repo. You change it, run it your way, and it stays linked to the original so work flows back. A bits&bytes™ fork is the same thing for a city or school: a local chapter that takes the playbook and brand from upstream, runs its own room and ships back.", kind="heat", size=60, sub_w=470)
    # bottom-up: the italic line and the ink panel sit on the orange end, where ink text holds contrast
    quote_y = FLOOR + 26
    fork = "Forks aren't franchises, subsidiaries or separate legal entities. A fork is permission to run locally, with a real operating system behind it. No fork can sign contracts, collect sponsorship money or bind GOBITSNBYTES FOUNDATION without written authority."
    s = st(SMALL, textColor=PAPER, fontSize=10, leading=14)
    ph = 26 + 34 + 16 + para_h(fork, W - 50, s) + 26
    top = quote_y + 40 + ph
    # a git graph: the upstream rail across the top, two branches dropping to the forks
    cities = ["bangalore", "kolkata", "chennai", "bhubaneswar", "nagpur", "mumbai",
              "delhi", "noida", "lucknow", "hyderabad", "your city"]
    rail = y - 14
    label(c, "upstream: bits&bytes™", M, rail + 9, CREAM, 7)
    label(c, "gobitsnbytes.org/fork", PAGE_W - M, rail + 9, PAPER, 7, align="r")
    c.linkURL("https://gobitsnbytes.org/fork", (PAGE_W - M - 130, rail + 4, PAGE_W - M, rail + 20), relative=0, thickness=0)
    c.setStrokeColor(PAPER)
    c.setLineWidth(3)
    c.line(M, rail, PAGE_W - M, rail)
    first, rows = rail - 30, 6
    pitch = min((first - top - 46) / (rows - 1), 40)
    assert pitch >= 30, f"fork page: the fork graph does not fit ({pitch:.0f})"
    for col in range(2):
        nx = M + 12 + col * (W / 2)
        names = cities[col * rows:(col + 1) * rows]
        c.setStrokeColor(PAPER)
        c.setLineWidth(3)
        c.line(nx, rail, nx, first - (len(names) - 1) * pitch)
        for i, name in enumerate(names):
            ny = first - i * pitch
            new = name == "your city"
            c.setFillColor(ORANGE if new else CREAM)
            c.setStrokeColor(INK)
            c.setLineWidth(2)
            c.rect(nx - 10, ny - 10, 20, 20, fill=1, stroke=1)
            display(c, [name], nx + 24, ny + CAP["Display"] * 11, W / 2 - 48, 22, [PAPER])
            if new:
                label(c, "start one at gobitsnbytes.org/fork", nx + 24, ny - 22, CREAM, 6.6)
                c.linkURL("https://gobitsnbytes.org/fork", (nx - 10, ny - 28, nx + 220, ny + 12), relative=0, thickness=0)
    panel(c, M, top, W - 6, ph, INK, shade=BURGUNDY_DK)
    b = display(c, ["local autonomy, upstream trust"], M + 22, top - 26, W - 50, 34, [ORANGE])
    para(c, fork, M + 22, b - 16, W - 50, s)
    draw(c, "We want local ownership without asking teenagers to carry adult liability.", M, quote_y, "Serif-Italic", 16, INK, max_w=W)
    footer(c, page, "forks", "heat")


def page_india_innovates(c, page):
    surface(c, "paper")
    bookmark(c, "India Innovates 2026")
    y = head(c, page, "event highlight", "when the room is national\nthe standard has to rise.", fills=[INK, BURGUNDY])
    photo(c, "public/event_pictures/HEe93oOakAAi2Mi.jpg", M, y, W - 6, 188)
    tag(c, "OFFICIAL EXECUTIVE PARTNER", M + 14, y - 188 + 14)
    y -= 188 + 30
    lw = W - 200
    lh = para(c, "India Innovates 2026 was a national civic-tech platform held at Bharat Mandapam, New Delhi. The funnel went from 1.26 crore+ applicants to 28,000+, then 5,000+, and finally 15 teams. bits&bytes™ was the Official Executive Partner, working at a scale where coordination, participant experience and public trust mattered as much as the stage.", M, y, lw, st(BODY, fontSize=11.6, leading=17.6))
    px, pw = M + lw + 24, W - lw - 30
    note = "A young team can carry serious responsibility when the system around the work is serious too."
    ns = st(SMALL, textColor=PAPER)
    ph = 124 + para_h(note, pw - 36, ns) + 18
    panel(c, px, y, pw, ph, BURGUNDY)
    draw(c, "15", px + 18, y - 72, "Display", 62, PAPER)
    c.setFillColor(ORANGE)
    c.rect(px + 18, y - 86, 30, 4, fill=1, stroke=0)
    para(c, caps("teams at the final stage"), px + 18, y - 96, pw - 36, st(HEAD, fontName="Mono-Bold", fontSize=7, leading=9, textColor=CREAM))
    para(c, note, px + 18, y - 124, pw - 36, ns)
    y -= max(lh, ph) + 30
    rule(c, M, y, W, INK, 3)
    y -= 22
    for i, item in enumerate(["01  open civic problem", "02  national funnel", "03  finalist teams", "04  ministry-level presentation stage"]):
        label(c, item, M, y - 8 - i * 22, INK, 7.2, max_w=178, bold=False)
    sh = para(c, "A partnership with bits&bytes™ can start in one city and still be designed with national ambition. We know what it takes to make a programme clear to participants, institutions and public stakeholders at the same time.", M + 204, y, W - 204, st(STRONG, fontSize=11.6, leading=16.4))
    need(y - max(sh, 74))
    footer(c, page, "event highlight")


def page_events(c, page):
    surface(c, "paper")
    bookmark(c, "Events and the next room")
    y = head(c, page, "event sequence", "from the first build\nto the next room", "The events look different. The move underneath stays the same: give young people a real problem and enough structure to finish something.")
    # the next room: the Regional Hackathon Series (facts from lib/events-data.ts regionalSeriesEvent only)
    fw = 132  # photo column
    tx, tw = M + 22, W - 6 - 22 - fw - 38
    series = "We're launching a regional hackathon series for high schoolers across India. Win your city's qualifier and you're headed to the finale at IIT Bombay on Dec 17–18."
    ss = st(SMALL, textColor=PAPER, fontSize=9.6, leading=13.2)
    ts = display_size([caps("regional hackathon series")], tw, 30)
    rp = 38 + 14 + CAP["Display"] * ts + 20 + 12 + para_h(series, tw, ss) + 20 + 18
    panel(c, M, y, W - 6, rp, BURGUNDY)
    label(c, "the next room", tx + tag(c, "upcoming", tx, y - 38) + 12, y - 32.4, CREAM, 7)
    b = display(c, ["regional hackathon series"], tx, y - 52, tw, ts, [PAPER])
    label(c, "city qualifiers across India  /  finale at IIT Bombay, Dec 17–18", tx, b - 20, CREAM, 6.8, max_w=tw)
    h = para(c, series, tx, b - 32, tw, ss)
    draw(c, "\"So who's carrying your city?\"", tx, b - 32 - h - 18, "Serif-Italic", 13, CREAM, max_w=tw - 110)
    label(c, "from the trailer", tx + tw, b - 32 - h - 17, CREAM, 6.4, align="r", bold=False)
    photo(c, "public/event_pictures/h4g/h4g0.jpg", M + W - 6 - 16 - fw, y - 16, fw, rp - 32, frame=False, focus=0.72)
    c.setStrokeColor(INK)
    c.setLineWidth(3)
    c.rect(M + W - 6 - 16 - fw, y - rp + 16, fw, rp - 32, fill=0, stroke=1)
    y -= rp + 28
    events = [
        ("Hack4Good v0", "24-hour agentic AI hackathon", "Lucknow / 425 registrations / 110 on-ground"),
        ("Execron 1.0", "AI workshop + hackathon", "IIT Kanpur / Classes 9–12 / 4h workshop + 24h sprint"),
        ("GitHub Copilot Dev Days", "responsible AI for developers", "Lucknow / Copilot workflows and responsible AI"),
        ("Lucknow Build Guild", "hardware workshop + meetup", "A free hardware workshop and meetup in Lucknow"),
        ("Regional Space Apps Hackathon", "regional builder sprint", "300+ participants / space, data and public problems"),
        ("India Innovates 2026", "national civic-tech platform", "Official Executive Partner / Bharat Mandapam, New Delhi"),
    ]
    cw = (W - 24) / 2
    ch = (y - FLOOR - 10 - 2 * 20) / 3  # three rows fill the rest of the page
    assert ch >= 80, f"event cards too short ({ch:.0f}, series panel {rp:.0f})"
    for i, (h, sub, body) in enumerate(events):
        x = M + (i % 2) * (cw + 20)
        top = y - (i // 2) * (ch + 20)
        fill, fg = (ORANGE, INK) if i == 0 else (BURGUNDY, PAPER) if i == 5 else (CREAM, INK)
        panel(c, x, top, cw, ch, fill, shadow=4)
        draw(c, h, x + 16, top - 26, "Heavy", 11.5, fg, max_w=cw - 32)
        label(c, sub, x + 16, top - 42, BURGUNDY if fill is CREAM else fg, 7, max_w=cw - 32)
        para(c, body, x + 16, top - 50, cw - 32, st(SMALL, fontSize=9.2, leading=12.4, textColor=fg), h_limit=26)
    need(y - 3 * ch - 2 * 20)
    footer(c, page, "events")


def page_collabs(c, page):
    surface(c, "ink")
    bookmark(c, "Collaborations")
    y = head(c, page, "collaborations", "names, not logos.\nroles, not fog.", "Institutions bring context. Companies bring tools, practitioners and hard questions. This is the public record, with the relationship named beside each organisation.", kind="ink", size=50, sub_w=470)
    # community partnerships: other people's events that we backed as community partner (text only, no logos)
    partners = [
        ("Infinity Hacks 2026", "HackerRank Campus Crew", "Aug 15–16, 2026 / global, online / 24 hours",
         "AI-first tracks such as road safety, women safety, climate and wildlife protection. Teams of 3–5.",
         "hrcc-infinityhacks.vercel.app", "https://hrcc-infinityhacks.vercel.app/"),
        ("NexusHacks 2026", "Phaser", "Jul 21–23, 2026 / global, online / 48 hours",
         "AI × Robotics, with Agentic AI and Embedded AI categories. ₹20,000 prize pool.",
         "phaser.in/nexushacks", "https://phaser.in/nexushacks"),
        ("DoraHacks 2.0", "Dora DAO", "2026 / global, online / 72 hours",
         "A vibecoding sprint: build an AI product, then launch it on Product Hunt and Peerlist. Builders from 15+ countries.",
         "dorahacks.io", "https://dorahacks.io/"),
    ]
    label(c, "community partner", M, y - 6, ORANGE, 7)
    y -= 20
    pw = (W - 2 * 14 - 5) / 3
    fs = st(SMALL, fontSize=8.4, leading=11, textColor=MID)
    bs = st(SMALL, fontSize=8.8, leading=12, textColor=INK)
    ph = max(para_h(f, pw - 28, fs) + para_h(b, pw - 28, bs) for _, _, f, b, _, _ in partners) + 96
    for i, (name, host, facts, body, shown, url) in enumerate(partners):
        x = M + i * (pw + 14)
        fill = ORANGE if i == 1 else CREAM
        panel(c, x, y, pw, ph, fill, shadow=5, edge=CREAM, shade=BURGUNDY if i == 1 else ORANGE)
        draw(c, name, x + 14, y - 26, "Heavy", 10.5, INK, max_w=pw - 28)
        label(c, f"by {host}", x + 14, y - 41, INK if i == 1 else BURGUNDY, 6.4, max_w=pw - 28)
        fh = para(c, facts, x + 14, y - 50, pw - 28, st(fs, textColor=INK) if i == 1 else fs)
        para(c, body, x + 14, y - 58 - fh, pw - 28, bs)
        draw(c, shown, x + 14, y - ph + 14, "Mono-Bold", 7, INK if i == 1 else BURGUNDY, max_w=pw - 28)
        c.linkURL(url, (x, y - ph, x + pw, y), relative=0, thickness=0)
    y -= ph + 30
    collabs = [
        ("GitHub + GitHub Copilot", "GitHub Copilot Dev Days, Lucknow"),
        ("Notion", "Hack4Good v0 and Dev Days community support"),
        ("Coding Connoisseurs", "Community partner / Faculty of Engineering and Technology, University of Lucknow"),
        ("India Innovates 2026", "Official Executive Partner / organised by HN Group + Municipal Corporation of Delhi"),
        ("Byte Forge", "Presenting partner / Execron 1.0"),
        ("Indian Institute of Technology Kanpur", "Institutional setting / TechKriti '26"),
        ("Lucknow Build Guild", "Hardware workshop and meetup support"),
        ("Regional Space Apps Hackathon", "Regional space, data and public-problem sprint"),
        ("Pure Buttons", "Hack4Good v0 event partner"),
        ("Notion Lucknow", "Local community partner"),
        ("Z.ai", "AI partner"),
        ("GitLab", "Sponsor"),
    ]
    cw = (W - 26) / 2
    role_s = st(SMALL, fontSize=9, leading=11.8, textColor=FOG)
    # each row is as tall as its longer role; leftover height is shared out so the list reaches the footer
    rhs = [max(para_h(role, cw - 30, role_s) for _, role in collabs[r:r + 2]) + 35 for r in range(0, len(collabs), 2)]
    extra = (y - FLOOR - 4 - sum(rhs)) / len(rhs)
    assert extra >= 0, f"collaborations list overflows by {-extra * len(rhs):.0f}pt"
    rhs = [h + min(extra, 10) for h in rhs]
    for i, (name, role) in enumerate(collabs):
        x = M + (i % 2) * (cw + 26)
        top = y - sum(rhs[:i // 2])
        rule(c, x, top, cw, MID, 1)
        draw(c, f"{i + 1:02d}", x, top - 20, "Mono-Bold", 8, ORANGE)
        draw(c, name, x + 30, top - 20, "Heavy", 10, CREAM, max_w=cw - 30)
        para(c, role, x + 30, top - 27, cw - 30, role_s, h_limit=24)
        if "TechKriti" in role:
            c.linkURL("https://techkriti.org/", (x, top - rhs[i // 2], x + cw, top), relative=0, thickness=0)
    need(y - sum(rhs))
    footer(c, page, "collaborations", "ink")


def page_legal(c, page):
    surface(c, "paper")
    bookmark(c, "Trust is part of the product")
    y = head(c, page, "trust", "young leadership needs\nstronger guardrails", "Our legal and safeguarding system is what lets a teen-led network take real responsibility for minors in the room and for other people's money.")
    steward = "bits&bytes™ is the public network and brand. The Foundation is the upstream legal steward. The Board holds ultimate fiduciary, constitutional, financial, IP and safeguarding authority."
    s = st(SMALL, textColor=PAPER, fontSize=10, leading=14)
    fs = display_size(["GOBITSNBYTES FOUNDATION"], W - 50, 38)
    ph = 26 + CAP["Display"] * fs + 40 + para_h(steward, W - 50, s) + 24
    panel(c, M, y, W - 6, ph, BURGUNDY)
    b = display(c, ["GOBITSNBYTES FOUNDATION"], M + 22, y - 26, W - 50, fs, [PAPER], upper=False)
    label(c, "SECTION 8 NON-PROFIT COMPANY  /  INCORPORATED 2 JUNE 2026", M + 22, b - 22, CREAM, max_w=W - 50)
    para(c, steward, M + 22, b - 34, W - 50, s)
    y -= ph + 32
    blocks = [
        ("written authority", "Titles describe operational responsibility. Contracts, sponsorships, funds and formal commitments move through written Board delegation."),
        ("safeguarding first", "Consent, supervision, reporting, moderation, confidentiality and escalation apply to every fork, event, cohort and digital space."),
        ("money stays in the system", "Sponsorships, donations, event fees and grants flow through Foundation-approved financial channels. No personal UPI collections."),
        ("one Foundation", "Forks have local creative autonomy, but they aren't franchises, subsidiaries or separate legal entities. The brand stays stewarded."),
    ]
    cw = (W - 24) / 2
    bs = st(SMALL, textColor=INK, fontSize=9.4, leading=13)
    bh = max(para_h(b, cw - 36, bs) for _, b in blocks) + 52
    for i, (h, b) in enumerate(blocks):
        x = M + (i % 2) * (cw + 20)
        top = y - (i // 2) * (bh + 20)
        panel(c, x, top, cw, bh, CREAM if i in (0, 3) else PAPER, shadow=4)
        draw(c, caps(h), x + 18, top - 26, "Heavy", 10, BURGUNDY, max_w=cw - 36)
        para(c, b, x + 18, top - 38, cw - 36, bs)
    y -= 2 * bh + 20 + 30
    rule(c, M, y, W, INK, 3)
    need(y - 20 - para(c, "We're youth-led, and that doesn't mean ungoverned. Teenagers get real operational ownership, and adult legal responsibility stays where it belongs.", M, y - 20, W, st(STRONG, fontSize=12, leading=17)))
    footer(c, page, "trust")


def page_why_partner(c, page):
    surface(c, "heat")
    bookmark(c, "Why partner")
    y = head(c, page, "partnership", "partner before\nthe shortlist exists.", "The best time to meet a young builder is before they've settled into a job title. Partnering with bits&bytes™ puts you in the room while people are still trying things, picking what to care about and learning what good work feels like.", kind="heat", size=60, sub_w=450)
    rows = [
        ("purpose with proof", "Fund work that ends in a public result you can point to, beyond a logo placement."),
        ("early talent signal", "Meet builders through the quality of their decisions, before you ever see a CV."),
        ("technical relevance", "Put real tools and real problem statements in front of the people who'll use them."),
        ("institutional reach", "Work with a network that moves between schools, universities, cities and online spaces."),
        ("brand memory", "Be remembered as the organisation that made the work possible."),
    ]
    s = st(SMALL, textColor=INK, fontSize=10, leading=13.4)
    q = st(QUOTE, fontSize=17, leading=22, textColor=INK)
    quote = "If you want a relationship with the builders of the next decade, start by helping one of them ship this month."
    qh = para_h(quote, W - 30, q)
    rh = 52
    gap = min((y - FLOOR - 16 - qh - 30 - 5 * rh) / 4, 22)
    for i, (h, b) in enumerate(rows):
        panel(c, M, y, W - 6, rh, ORANGE if i == 0 else CREAM, shadow=4)
        draw(c, caps(h), M + 18, y - rh / 2 - 3.5, "Heavy", 10, BURGUNDY if i else INK, max_w=160)
        para(c, b, M + 196, y - (rh - para_h(b, W - 226, s)) / 2, W - 226, s, h_limit=28)
        y -= rh + gap
    assert gap >= 8, "why-partner rows do not fit"
    # the closing line sits on the orange end, where ink holds contrast
    para(c, quote, M, FLOOR + 16 + qh, W - 30, q)
    footer(c, page, "partnership", "heat")


def page_pathways(c, page):
    surface(c, "paper")
    bookmark(c, "Partnership pathways")
    y = head(c, page, "pathways", "a partnership can be\nsmall, then compound", "We'd rather design one sharp programme that works than sell a menu nobody can run.", sub_w=470)
    pathways = [
        ("university partnership", ["A campus fork or city chapter", "Co-designed pre-incubation for school builders", "Challenge labs, faculty mentors and maker-space access", "Showcases that show student work beyond a certificate"]),
        ("corporate partnership", ["Sponsor a problem track or a build sprint", "Developer tools, cloud credits, devices or expert mentors", "Technical review and responsible-AI guidance", "An early relationship with builders, before they reach the job market"]),
        ("school and institution partnership", ["Hackathons for Classes 8–12, with hands-on workshops built in", "Support for teachers and coordinators", "Safe, parent-aware event operations", "A repeatable path from interest to portfolio"]),
    ]
    ph = min((y - FLOOR - 50 - 2 * 22) / 3, 150)
    assert ph >= 132, f"pathway panels too short ({ph:.0f})"
    for i, (h, bullets) in enumerate(pathways):
        fill, fg, dot = [(CREAM, BURGUNDY, BURGUNDY), (BURGUNDY, PAPER, ORANGE), (MARKER, INK, INK)][i]
        panel(c, M, y, W - 6, ph, fill)
        display(c, [h], M + 22, y - 20, W - 50, 26, [fg])
        for j, item in enumerate(bullets):
            by = y - 62 - j * 17.5
            c.setFillColor(dot)
            c.rect(M + 22, by + 1, 5, 5, fill=1, stroke=0)
            draw(c, item, M + 36, by, "Serif", 10.4, INK if i != 1 else PAPER, max_w=W - 70)
        y -= ph + 22
    draw(c, "We judge a partnership by the loop it keeps running after the launch post.", M, FLOOR + 16, "Serif-Italic", 16, INK, max_w=W)
    footer(c, page, "pathways")


def page_benefits(c, page):
    surface(c, "paper")
    bookmark(c, "Benefits and visibility")
    y = head(c, page, "benefits", "make the work visible\nwithout making it shallow", "Every partnership should leave a useful trace for the young people in the programme and a clear record for the organisation paying for it.")
    benefits = [
        ("naming", "Co-branded programme identity, challenge tracks or an event series, where approved."),
        ("presence", "Stage, venue, digital and community surfaces across WhatsApp, Instagram, Discord, LinkedIn and the web."),
        ("participation", "Mentors, judges, reviewers, speakers and technical office hours."),
        ("proof", "Public demos, project write-ups, impact notes and a clean post-programme report."),
        ("access", "Early conversations with builders, fork leads, educators and future collaborators."),
        ("continuity", "A path from one event to a cohort, a fork, a research track or the alumni network."),
    ]
    y = grid(c, benefits, y)
    pull = "We don't want to decorate a weak programme with a strong brand. We want the brand next to work that a participant, a partner and a sceptical reader can all inspect."
    s = st(SMALL, textColor=INK, fontSize=10, leading=14)
    ph = 26 + 30 + 16 + para_h(pull, W - 50, s) + 24
    top = FLOOR + 12 + ph  # the pull panel closes the page; a photo takes the space above it
    assert y - 10 >= top, "benefits grid runs into the pull panel"
    band(c, "public/event_pictures/byteforge2.webp", y - 10, top + 24)
    panel(c, M, top, W - 6, ph, ORANGE)
    b = display(c, ["visibility is the by-product of useful work"], M + 22, top - 26, W - 50, 34, [INK])
    para(c, pull, M + 22, b - 16, W - 50, s)
    footer(c, page, "benefits")


def page_vision(c, page):
    """The horizon: where the network goes next, and the alumni layer that keeps it going (was two pages)."""
    surface(c, "ink")
    bookmark(c, "The next three years")
    y = head(c, page, "the horizon", "the next three years\nare a systems problem.", "We want a network that feels local when you walk in and national when you need it: more places to start, more people who can help and a reliable path from a first prototype to a longer body of work. The community can grow without lowering the builder-first bar.", kind="ink", size=54, sub_w=480)
    directions = [
        ("forks", "Established forks in more cities across India"),
        ("schools", "Partner schools and educational institutes"),
        ("hardware", "A planned track for hardware, maker and deeptech work"),
        ("always", "An event, cohort, squad or build cycle in motion"),
    ]
    tw = (W - 3 * 12 - 5) / 4
    cap_s = st(HEAD, fontName="Mono-Bold", fontSize=7, leading=9.6)
    ds = display_size([caps(d) for d, _ in directions], tw - 28, 30)
    th = 18 + CAP["Display"] * ds + 14 + max(para_h(caps(t), tw - 28, cap_s) for _, t in directions) + 16
    for i, (word, text) in enumerate(directions):
        x = M + i * (tw + 12)
        fill, fg = (BURGUNDY, PAPER) if i in (0, 3) else (ORANGE, INK)
        panel(c, x, y, tw, th, fill, shadow=5, edge=CREAM, shade=CREAM)
        b = display(c, [word], x + 14, y - 18, tw - 28, ds, [fg])
        para(c, caps(text), x + 14, b - 12, tw - 28, st(cap_s, textColor=fg))
    y -= th + 5 + 22
    layer = "Alumni come back as mentors, reviewers, collaborators, funders, founders, researchers and hosts. It keeps the network from confusing age with authority: someone who has shipped more can make the first step less lonely for someone who hasn't."
    s = st(SMALL, textColor=PAPER, fontSize=10, leading=14)
    lines = ["alumni are distribution", "for the next builder."]
    al = display_size([caps(line) for line in lines], W - 50, 40)
    ph = 26 + (CAP["Display"] + 0.96) * al + 16 + para_h(layer, W - 50, s) + 22
    panel(c, M, y, W - 6, ph, BURGUNDY, shadow=5, edge=CREAM, shade=ORANGE)
    b = display(c, lines, M + 22, y - 26, W - 50, al, [PAPER, ORANGE])
    para(c, layer, M + 22, b - 16, W - 50, s)
    y -= ph + 5 + 20
    cards = [
        ("the alumni network", "Mentorship, peer review, research collaborations, founder sessions and a way back into the rooms where people first started."),
        ("the alumni fund", "A planned pool that recycles later success into first hardware parts, cloud credits, travel, prototypes and small grants for the next builders."),
    ]
    cw = (W - 24) / 2
    cs = st(SMALL, textColor=INK, fontSize=9.6, leading=13.4)
    ch = max(para_h(b, cw - 36, cs) for _, b in cards) + 52
    for i, (h, b) in enumerate(cards):
        x = M + i * (cw + 20)
        panel(c, x, y, cw, ch, CREAM if i == 0 else MARKER, shadow=4, edge=CREAM, shade=ORANGE)
        draw(c, caps(h), x + 18, y - 26, "Heavy", 10.5, BURGUNDY if i == 0 else INK, max_w=cw - 36)
        para(c, b, x + 18, y - 38, cw - 36, cs)
    close = "The long-term case for partnering is simple. You're helping build a system that sends value and capital back to the people who come after."
    cl = st(STRONG, fontSize=12, leading=17, textColor=PAPER)
    assert y - ch - 5 - 18 >= FLOOR + 6 + para_h(close, W, cl), "horizon: the closing line runs into the alumni cards"
    para(c, close, M, FLOOR + 6 + para_h(close, W, cl), W, cl)
    footer(c, page, "the horizon", "ink")


def page_next_steps(c, page):
    surface(c, "burgundy")
    bookmark(c, "Next steps")
    y = head(c, page, "next steps", "bring us a problem\nworth giving to teenagers.", "Start with something your organisation already knows is hard: a technology people aren't learning fast enough, a public problem that needs a new lens, students with more ability than evidence, or the hardware idea that keeps getting pushed back.", kind="burgundy", size=60, sub_w=450)
    ph = 130
    panel(c, M, y, W - 6, ph, CREAM)
    display(c, ["the first conversation"], M + 22, y - 22, W - 50, 26, [BURGUNDY])
    for i, line in enumerate(["1. Tell us what you want to make possible.", "2. Tell us what can't be compromised.", "3. We'll sketch the smallest partnership that works."]):
        draw(c, line, M + 22, y - 70 - i * 21, "Serif", 12, INK, max_w=W - 50)
    y -= ph + 36
    email_base = display(c, ["hello@gobitsnbytes.org"], M, y, W, 50, [PAPER], upper=False)
    c.linkURL("mailto:hello@gobitsnbytes.org", (M, email_base - 4, M + W, y), relative=0, thickness=0)
    y = email_base - 24
    draw(c, "gobitsnbytes.org  /  gobitsnbytes.org/contact", M, y, "Heavy", 11.5, PAPER, max_w=W)
    c.linkURL("https://gobitsnbytes.org/contact", (M, y - 4, M + W, y + 12), relative=0, thickness=0)
    links = ["gobitsnbytes.org/fork", "linkedin.com/company/gobitsbytes", "github.com/gobitsnbytes", "instagram.com/gobitsnbytes"]
    for i, link in enumerate(links):
        draw(c, link, M, y - 24 - i * 15, "Mono", 8.6, CREAM)
    c.linkURL("https://gobitsnbytes.org/fork", (M, y - 28, M + 130, y - 14), relative=0, thickness=0)
    links_bottom = y - 24 - (len(links) - 1) * 15
    sources = "Research sources for the problem and context pages: ASER Centre (2023); ILO, India Employment Report 2024; World Economic Forum, Future of Jobs Report 2025; Government of India, National Education Policy 2020; Tao et al., 2023 project-based learning meta-analysis; UNESCO Global Education Monitoring Report 2023."
    s = st(SMALL, textColor=INK, fontSize=8.6, leading=12)
    sh = para_h(sources, W - 44, s) + 32
    top = FLOOR + 12 + sh  # sources close the page; a dot screen fills the gap beside the links
    assert links_bottom - 20 >= top, "next steps: contacts run into the sources"
    halftone(c, 300, top + 18, PAGE_W - 300, y - 12 - top - 18, ORANGE, alpha=0.22)
    panel(c, M, top, W - 6, sh, PAPER, shadow=4)
    para(c, sources, M + 18, top - 16, W - 44, s)
    footer(c, page, "next steps", "burgundy")


def page_closing(c, page):
    surface(c, "ink")
    bookmark(c, "Closing")
    mark(c, PAGE_W - M - 24, PAGE_H - 62, 26, PAPER)
    y = display(c, ["somewhere in india", "a teenager is trying", "to become useful."], M, PAGE_H - 96, W, 66, [PAPER, PAPER, ORANGE])
    y -= 30
    y -= para(c, "They don't need a prophecy. They need a room, a problem, a few people who'll stay and a reason to put the first version out into the world.", M, y, 420, st(BODY, textColor=FOG, fontSize=12, leading=17)) + 44
    draw(c, "We're building that room.", M, y, "Serif-Italic", 26, CREAM, max_w=W)
    y -= 40
    rule(c, M, y, W, PAPER, 3)
    label(c, "a teen-led builder network from india, for india, with the world watching", M, y - 22, PAPER, max_w=W)
    c.setFillColor(ORANGE)
    c.rect(M, y - 44, 170, 4, fill=1, stroke=0)
    draw(c, "gobitsnbytes.org", M, y - 66, "Mono", 8.6, CREAM)
    draw(c, "hello@gobitsnbytes.org", M + 150, y - 66, "Mono", 8.6, CREAM)
    c.linkURL("mailto:hello@gobitsnbytes.org", (M + 150, y - 70, M + 280, y - 56), relative=0, thickness=0)
    # the giant wordmark signs off; its script tail stays above the footer
    size = wordmark_size(W, 200)
    base = FLOOR + 0.44 * size
    assert y - 66 - 20 > base + CAP["Heavy"] * size, "closing: wordmark collides with the contacts"
    wordmark(c, M, base, size, ORANGE)
    footer(c, page, "closing", "ink")


PAGES = [
    page_cover,
    page_founder_letter,
    page_contents,
    page_what,
    page_problem,
    page_research,
    page_thesis,
    page_timeline,
    page_programs,
    page_fork,
    page_india_innovates,
    page_events,
    page_collabs,
    page_legal,
    page_why_partner,
    page_pathways,
    page_benefits,
    page_vision,
    page_next_steps,
    page_closing,
]
assert len(PAGES) == 20, f"the prospectus is exactly 20 pages ({len(PAGES)})"


def build() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUT), pagesize=A4, pageCompression=1)
    c.setTitle("bits&bytes™ Partnership & Sponsorship Prospectus")
    c.setAuthor("GOBITSNBYTES FOUNDATION")
    c.setSubject("Partnership and sponsorship prospectus")
    for page_num, fn in enumerate(PAGES, start=1):
        fn(c, page_num)
        c.showPage()
    c.save()
    print(f"built {OUT} ({len(PAGES)} pages)")


def check() -> None:
    """Render every page for review and fail on text past the margins or text on text."""
    import fitz  # PyMuPDF

    PREVIEW_DIR.mkdir(parents=True, exist_ok=True)
    problems, thumbs = [], []
    for n, page in enumerate(fitz.open(OUT), start=1):
        page.get_pixmap(dpi=110).save(PREVIEW_DIR / f"p{n:02d}.png")
        thumbs.append(Image.open(io.BytesIO(page.get_pixmap(dpi=40).tobytes("png"))).convert("RGB"))
        boxes = []
        for block in page.get_text("dict")["blocks"]:
            for li, line in enumerate(block.get("lines", [])):
                for span in line["spans"]:
                    if not span["text"].strip():
                        continue
                    x0, y0, x1, y1 = span["bbox"]
                    if x0 < 36 - 0.5 or x1 > PAGE_W - 36 + 0.5 or y1 > PAGE_H - 26 or y0 < 20:
                        problems.append(f"p{n:02d} off-margin {span['text'][:40]!r} {span['bbox']}")
                    if "Script" not in span["font"] and "Yellowtail" not in span["font"]:
                        # glyph body only: baseline up to ~70% of the size (ascender boxes overlap by design)
                        oy = span["origin"][1]
                        boxes.append((x0 - 2, oy - span["size"] * 0.7, x1 + 2, oy, span["text"], id(line)))  # 2pt: touching counts
        for i, a in enumerate(boxes):
            for b in boxes[i + 1:]:
                if a[5] != b[5] and a[0] < b[2] and b[0] < a[2] and a[1] < b[3] and b[1] < a[3]:
                    problems.append(f"p{n:02d} overlap {a[4][:30]!r} / {b[4][:30]!r}")
    w, h = thumbs[0].size
    cols = 6
    sheet = Image.new("RGB", (cols * (w + 12) + 12, -(-len(thumbs) // cols) * (h + 12) + 12), "#413F3B")
    for i, im in enumerate(thumbs):
        sheet.paste(im, (12 + (i % cols) * (w + 12), 12 + (i // cols) * (h + 12)))
    sheet.save(PREVIEW_DIR / "contact.png")
    print(f"previews in {PREVIEW_DIR}")
    if problems:
        raise SystemExit("\n".join(problems))


if __name__ == "__main__":
    build()
    if "--check" in sys.argv:
        check()
