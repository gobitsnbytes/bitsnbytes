from __future__ import annotations

import io
import os
import re
from pathlib import Path

from PIL import Image, ImageEnhance, ImageOps
from reportlab.lib import colors
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph
from reportlab.lib.utils import ImageReader
from xml.sax.saxutils import escape


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "output" / "pdf"
TMP_DIR = ROOT / "tmp" / "pdfs"
OUT = OUT_DIR / "bitsnbytes-partnership-prospectus-2026.pdf"

PAGE_W, PAGE_H = A4

INK = HexColor("#120F0A")
BURGUNDY = HexColor("#97192C")
PLUM = HexColor("#5B0F1A")
DEEP = HexColor("#1E0509")
ORANGE = HexColor("#FC920D")
PEACH = HexColor("#FEE9CF")
WARM = HexColor("#F4D9D1")
PAPER = HexColor("#FAF8F5")
MUTED = HexColor("#716F6C")
MID = HexColor("#413F3B")
LINE = HexColor("#D9D2CA")
WHITE = PAPER


def register_fonts() -> None:
    """Register the brand roles, preferring supplied licensed fonts.

    Exact brand font files can be placed in public/fonts or supplied through
    BITSNBYTES_FONT_DIR. The role names stay stable so the layout does not
    need to change when the licensed typefaces are available.
    """
    search_dirs = [ROOT / "public" / "fonts", Path("C:/Windows/Fonts")]
    custom_dir = os.environ.get("BITSNBYTES_FONT_DIR")
    if custom_dir:
        search_dirs.insert(0, Path(custom_dir))

    font_candidates = {
        # Primary: Helvetica Now. Accent sans: Anton.
        "Sans": ["HelveticaNowText-Regular.ttf", "HelveticaNow-Regular.ttf", "arial.ttf"],
        "Sans-Bold": ["HelveticaNowText-Bold.ttf", "HelveticaNow-Bold.ttf", "arialbd.ttf"],
        "Sans-Italic": ["HelveticaNowText-Italic.ttf", "HelveticaNow-Italic.ttf", "ariali.ttf"],
        "Display": ["Anton-Regular.ttf", "Anton.ttf", "impact.ttf"],
        # Secondary: Georgia Pro. Decorative accent: Palm Club.
        "Serif": ["GeorgiaPro-Regular.ttf", "GeorgiaPro.ttf", "georgia.ttf"],
        "Serif-Bold": ["GeorgiaPro-Bold.ttf", "georgiab.ttf"],
        "Serif-Italic": ["GeorgiaPro-Italic.ttf", "georgiai.ttf"],
        "Script": ["PalmClub.ttf", "Palm-Club.ttf", "segoesc.ttf"],
        "Mono": ["consola.ttf"],
        "Mono-Bold": ["consolab.ttf"],
    }
    for role, candidates in font_candidates.items():
        path = next(
            (
                directory / filename
                for directory in search_dirs
                for filename in candidates
                if (directory / filename).exists()
            ),
            None,
        )
        if path:
            pdfmetrics.registerFont(TTFont(role, str(path)))


register_fonts()


def hex_color(value: str):
    return HexColor(value)


def plain(text: str) -> str:
    """Escape a string for ReportLab Paragraph, with tiny markdown support."""
    text = escape(text)
    text = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", text)
    text = text.replace("\n", "<br/>")
    return text


BODY = ParagraphStyle(
    "body",
    fontName="Serif",
    fontSize=10.7,
    leading=15.2,
    textColor=INK,
    spaceAfter=0,
)
BODY_SMALL = ParagraphStyle(
    "body-small",
    parent=BODY,
    fontSize=8.5,
    leading=11.4,
    textColor=MID,
)
BODY_LIGHT = ParagraphStyle(
    "body-light",
    parent=BODY,
    textColor=WHITE,
)
BODY_LIGHT_SMALL = ParagraphStyle(
    "body-light-small",
    parent=BODY_SMALL,
    textColor=HexColor("#F1EAE4"),
)
BODY_CENTER = ParagraphStyle(
    "body-center",
    parent=BODY,
    alignment=TA_CENTER,
)
BODY_BOLD = ParagraphStyle(
    "body-bold",
    parent=BODY,
    fontName="Serif-Bold",
)
CARD_BODY = ParagraphStyle(
    "card-body",
    parent=BODY_SMALL,
    fontSize=8.2,
    leading=10.2,
)
BENEFIT_BODY = ParagraphStyle(
    "benefit-body",
    parent=BODY_SMALL,
    fontSize=7.9,
    leading=9.8,
)
BENEFIT_BODY_LIGHT = ParagraphStyle(
    "benefit-body-light",
    parent=BENEFIT_BODY,
    textColor=WHITE,
)
METRIC_LABEL = ParagraphStyle(
    "metric-label",
    parent=BODY_SMALL,
    fontName="Mono-Bold",
    fontSize=6.5,
    leading=7.8,
    textColor=WHITE,
)
VISION_LABEL = ParagraphStyle(
    "vision-label",
    fontName="Mono-Bold",
    fontSize=7.0,
    leading=8.5,
    textColor=WHITE,
)
CARD_HEAD = ParagraphStyle(
    "card-head",
    fontName="Sans-Bold",
    fontSize=10.1,
    leading=11.5,
    textColor=INK,
)
CARD_HEAD_BURGUNDY = ParagraphStyle(
    "card-head-burgundy",
    parent=CARD_HEAD,
    textColor=BURGUNDY,
)
MONO_LABEL = ParagraphStyle(
    "mono-label",
    fontName="Mono-Bold",
    fontSize=7.2,
    leading=8.8,
    textColor=WHITE,
)
SERIF_QUOTE = ParagraphStyle(
    "serif-quote",
    fontName="Serif-Italic",
    fontSize=14.5,
    leading=17.5,
    textColor=WHITE,
)
CAPTION = ParagraphStyle(
    "caption",
    fontName="Mono",
    fontSize=7.2,
    leading=9.2,
    textColor=MUTED,
)
CAPTION_LIGHT = ParagraphStyle(
    "caption-light",
    parent=CAPTION,
    textColor=HexColor("#F3D8C7"),
)


def para(c: canvas.Canvas, text: str, x: float, y_top: float, w: float, style=BODY, h_limit: float | None = None) -> float:
    p = Paragraph(plain(text), style)
    _, h = p.wrap(w, h_limit or PAGE_H)
    if h_limit is not None and h > h_limit + 0.5:
        raise ValueError(f"Paragraph overflow: {text[:70]!r} -> {h:.1f} > {h_limit:.1f}")
    p.drawOn(c, x, y_top - h)
    return h


def label(c: canvas.Canvas, text: str, x: float, y: float, dark: bool = False, color=None) -> None:
    c.setFont("Mono-Bold", 7.6)
    c.setFillColor(color or (PEACH if dark else BURGUNDY))
    c.drawString(x, y, text.upper())


def rule(c: canvas.Canvas, x: float, y: float, w: float, color=LINE, thickness=0.7) -> None:
    c.setStrokeColor(color)
    c.setLineWidth(thickness)
    c.line(x, y, x + w, y)


def dot_grid(c: canvas.Canvas, x: float, y: float, w: float, h: float, color=BURGUNDY, alpha=0.14, step=10) -> None:
    c.saveState()
    c.setFillColor(colors.Color(color.red, color.green, color.blue, alpha=alpha))
    for xx in range(int(x), int(x + w) + 1, step):
        for yy in range(int(y), int(y + h) + 1, step):
            c.circle(xx, yy, 0.55, fill=1, stroke=0)
    c.restoreState()


def star(c: canvas.Canvas, cx: float, cy: float, r: float, fill=ORANGE, points=4) -> None:
    from math import cos, pi, sin

    path = c.beginPath()
    for i in range(points * 2):
        rr = r if i % 2 == 0 else r * 0.3
        a = pi / 2 + i * pi / points
        xx = cx + cos(a) * rr
        yy = cy + sin(a) * rr
        if i == 0:
            path.moveTo(xx, yy)
        else:
            path.lineTo(xx, yy)
    path.close()
    c.setFillColor(fill)
    c.drawPath(path, fill=1, stroke=0)


def cube(c: canvas.Canvas, x: float, y: float, size: float, fill=WHITE, stroke=None, line_width=1.5) -> None:
    c.saveState()
    c.setStrokeColor(stroke or fill)
    c.setFillColor(fill)
    c.setLineWidth(line_width)
    top = [(x + size * 0.5, y + size), (x + size, y + size * 0.72), (x + size * 0.5, y + size * 0.45), (x, y + size * 0.72)]
    left = [(x, y + size * 0.72), (x + size * 0.5, y + size * 0.45), (x + size * 0.5, y), (x, y + size * 0.27)]
    right = [(x + size, y + size * 0.72), (x + size * 0.5, y + size * 0.45), (x + size * 0.5, y), (x + size, y + size * 0.27)]
    for pts in (top, left, right):
        p = c.beginPath()
        p.moveTo(*pts[0])
        for pt in pts[1:]:
            p.lineTo(*pt)
        p.close()
        c.drawPath(p, fill=0, stroke=1)
    star(c, x + size * 0.5, y + size * 0.75, size * 0.13, fill=fill, points=4)
    c.restoreState()


def draw_logo(c: canvas.Canvas, x: float, y: float, size: float) -> None:
    """Place the supplied brand mark without recoloring or redrawing it."""
    logo = ROOT / "public" / "logo.png"
    c.drawImage(
        ImageReader(str(logo)),
        x,
        y,
        width=size,
        height=size,
        preserveAspectRatio=True,
        anchor="c",
        mask="auto",
    )


def footer(c: canvas.Canvas, page: int, dark: bool = False, section: str = "partnership prospectus") -> None:
    color = HexColor("#EADFD6") if dark else LINE
    text_color = HexColor("#D6C5B9") if dark else MUTED
    rule(c, 48, 31, PAGE_W - 96, color, 0.6)
    c.setFillColor(text_color)
    c.setFont("Mono", 7.2)
    c.drawString(48, 20, "bits&bytes™  /  gobitsnbytes.org")
    c.drawCentredString(PAGE_W / 2, 20, section)
    c.drawRightString(PAGE_W - 48, 20, f"{page:02d}")
    c.setFont("Mono", 6.2)
    c.drawRightString(PAGE_W - 48, 10, "© 2026 GOBITSNBYTES FOUNDATION. ALL RIGHTS RESERVED.")


def page_title(c: canvas.Canvas, kicker: str, title: str, subtitle: str | None = None, dark: bool = False) -> float:
    fg = WHITE if dark else INK
    label(c, kicker, 48, PAGE_H - 55, dark=dark)
    c.setFillColor(fg)
    c.setFont("Sans-Bold", 32)
    lines = title.split("\n")
    y = PAGE_H - 106
    for line in lines:
        c.drawString(48, y, line)
        y -= 35
    if subtitle:
        para(c, subtitle, 48, y - 2, 415, BODY_LIGHT_SMALL if dark else BODY_SMALL)
    return y - (10 if subtitle else 0)


def photo_bytes(path: Path, w: int, h: int, grayscale: bool = True, duotone: tuple[str, str] | None = None, contrast: float = 1.0) -> bytes:
    img = Image.open(path).convert("RGB")
    img = ImageOps.fit(img, (max(1, int(w)), max(1, int(h))), method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))
    if grayscale:
        img = ImageOps.grayscale(img)
        if duotone:
            img = ImageOps.colorize(img, black=duotone[0], white=duotone[1])
        else:
            img = img.convert("RGB")
    if contrast != 1.0:
        img = ImageEnhance.Contrast(img).enhance(contrast)
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=92, optimize=True)
    return buf.getvalue()


def photo(c: canvas.Canvas, path: str, x: float, y: float, w: float, h: float, grayscale: bool = True, duotone: tuple[str, str] | None = None, tint: tuple[float, float, float, float] | None = None) -> None:
    p = ROOT / path
    data = photo_bytes(p, int(w * 2), int(h * 2), grayscale=grayscale, duotone=duotone, contrast=1.08)
    c.drawImage(ImageReader(io.BytesIO(data)), x, y, width=w, height=h, preserveAspectRatio=False, mask="auto")
    if tint:
        c.saveState()
        c.setFillColor(colors.Color(*tint))
        c.rect(x, y, w, h, fill=1, stroke=0)
        c.restoreState()


def bookmark(c: canvas.Canvas, title: str) -> None:
    safe = re.sub(r"[^A-Za-z0-9]+", "-", title).strip("-")
    c.bookmarkPage(safe)
    c.addOutlineEntry(title, safe, level=0, closed=False)


def draw_number(c: canvas.Canvas, number: str, label_text: str, x: float, y: float, color=INK, accent=ORANGE, size=60, label_width: float = 210) -> None:
    c.setFillColor(color)
    c.setFont("Display", size)
    c.drawString(x, y, number)
    c.setFillColor(accent)
    c.rect(x, y - 8, 30, 4, fill=1, stroke=0)
    para(c, label_text.upper(), x, y - 25, min(label_width, 195), ParagraphStyle(
        "number-label",
        parent=METRIC_LABEL,
        textColor=color,
    ), h_limit=25)


def draw_tag(c: canvas.Canvas, text: str, x: float, y: float, fill=PEACH, fg=INK, width: float | None = None) -> float:
    c.setFont("Mono-Bold", 7.2)
    pad = 7
    w = width or (pdfmetrics.stringWidth(text.upper(), "Mono-Bold", 7.2) + pad * 2)
    c.setFillColor(fill)
    c.rect(x, y, w, 17, fill=1, stroke=0)
    c.setFillColor(fg)
    c.drawString(x + pad, y + 5.2, text.upper())
    return w


def title_block(c: canvas.Canvas, title: str, x: float, y: float, w: float, color=INK, size=26, leading=27) -> float:
    c.setFillColor(color)
    c.setFont("Display", size)
    cursor = y
    for line in title.split("\n"):
        c.drawString(x, cursor, line)
        cursor -= leading
    return cursor


def page_cover(c: canvas.Canvas, page: int) -> None:
    c.setFillColor(DEEP)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    dot_grid(c, 0, 0, PAGE_W, PAGE_H, color=ORANGE, alpha=0.08, step=14)
    c.setFillColor(BURGUNDY)
    c.rect(PAGE_W * 0.64, 0, PAGE_W * 0.36, PAGE_H, fill=1, stroke=0)
    photo(c, "public/event_pictures/bd1.jpg", PAGE_W * 0.66, 0, PAGE_W * 0.34, PAGE_H * 0.6, grayscale=True, duotone=("#1E0509", "#F4D9D1"), tint=(0.12, 0.02, 0.04, 0.35))
    c.saveState()
    c.setStrokeColor(ORANGE)
    c.setLineWidth(1.2)
    c.line(PAGE_W * 0.64, 55, PAGE_W * 0.64, PAGE_H - 55)
    c.restoreState()
    draw_logo(c, 48, PAGE_H - 145, 64)
    c.setFillColor(WHITE)
    c.setFont("Sans-Bold", 10)
    c.drawString(48, PAGE_H - 165, "bits&bytes™")
    c.setFillColor(ORANGE)
    c.setFont("Display", 57)
    c.drawString(48, PAGE_H - 265, "the next")
    c.drawString(48, PAGE_H - 322, "generation")
    c.setFillColor(WHITE)
    c.drawString(48, PAGE_H - 379, "will not be")
    c.setFillColor(ORANGE)
    c.drawString(48, PAGE_H - 436, "handed to us.")
    para(c, "we have to give them somewhere to begin.", 48, PAGE_H - 475, 275, BODY_LIGHT)
    c.setFillColor(PEACH)
    c.setFont("Mono", 8)
    c.drawString(48, 95, "partnership & sponsorship prospectus")
    c.drawString(48, 80, "lucknow, india  /  2026")
    c.setFont("Mono", 6.8)
    c.drawString(48, 57, "an independent, teen-led builder network under GOBITSNBYTES FOUNDATION")
    c.setFillColor(PEACH)
    c.setFont("Mono-Bold", 7)
    c.drawRightString(PAGE_W - 46, 20, "© 2026 GOBITSNBYTES FOUNDATION")


def page_founder_letter(c: canvas.Canvas, page: int) -> None:
    c.setFillColor(PAPER)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    bookmark(c, "a letter from the founders")
    label(c, "01 / preface", 48, PAGE_H - 55)
    c.setFillColor(BURGUNDY)
    c.setFont("Display", 33)
    c.drawString(48, PAGE_H - 106, "a letter from")
    c.drawString(48, PAGE_H - 142, "the founders")
    c.setFillColor(ORANGE)
    c.rect(48, PAGE_H - 177, 78, 5, fill=1, stroke=0)
    quote = "we did not set out to build a community.\nwe set out to remove the distance between\na teenager with an idea and a thing that exists."
    c.setFillColor(INK)
    c.setFont("Serif-Italic", 19)
    y = PAGE_H - 245
    for line in quote.split("\n"):
        c.drawString(48, y, line)
        y -= 25
    para(c, "in july 2025, an event we were helping organise was cancelled by the organisation it sat under. the easy response would have been to wait for another permission, another calendar, another adult room. we were teenagers with a problem and a group of people who still wanted to build.", 48, PAGE_H - 350, 235, BODY)
    para(c, "so we started bits&bytes™ in november 2025. it began as a way to make one independent hackathon happen. then the shape of the work became clear: young people do not need more reasons to consume technology. they need a place where they can use it, break it, explain it, ship it, and meet others who are doing the same.", 310, PAGE_H - 350, 235, BODY)
    para(c, "the network is still young. that is part of the point. we are building the systems, standards, partnerships, and trust that let a teen-led organisation move with urgency without making young people carry adult legal or financial risk.", 48, PAGE_H - 485, 507, BODY)
    c.setFillColor(WARM)
    c.rect(48, 105, 507, 92, fill=1, stroke=0)
    c.setFillColor(BURGUNDY)
    c.setFont("Mono-Bold", 8)
    c.drawString(66, 174, "our working belief")
    para(c, "school can teach the map. real projects teach you where the ground gives way.", 66, 157, 420, ParagraphStyle("pull", parent=BODY_BOLD, fontSize=14, leading=19, textColor=BURGUNDY))
    c.setFillColor(MUTED)
    c.setFont("Mono", 7.5)
    c.drawString(48, 74, "yash singh  /  aadrika maurya  /  akshat kushwaha")
    c.drawString(48, 61, "co-founders, bits&bytes™")
    footer(c, page, section="founder letter")


def page_contents(c: canvas.Canvas, page: int) -> None:
    c.setFillColor(INK)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    bookmark(c, "contents")
    dot_grid(c, 0, 0, PAGE_W, PAGE_H, color=ORANGE, alpha=0.08, step=12)
    draw_logo(c, PAGE_W - 135, PAGE_H - 145, 70)
    label(c, "02 / contents", 48, PAGE_H - 55, dark=True)
    c.setFillColor(WHITE)
    c.setFont("Display", 47)
    c.drawString(48, PAGE_H - 125, "the shape of")
    c.setFillColor(ORANGE)
    c.drawString(48, PAGE_H - 175, "the work")
    items = [
        ("03", "what is bits&bytes™", "identity, people, and purpose"),
        ("04", "why this needs to exist", "the gap between school and capability"),
        ("05", "the missing layer", "mission, differentiation, and the operating thesis"),
        ("06", "the journey so far", "from a cancelled event to a national network"),
        ("07", "the proof", "programmes, forks, events, and collaborations"),
        ("08", "trust is part of the product", "legal structure, safeguarding, and stewardship"),
        ("09", "why partner", "university, corporate, and institutional pathways"),
        ("10", "the next three years", "forks, schools, maker tracks, and the alumni fund"),
        ("11", "next steps", "one conversation, then one thing built"),
    ]
    y = PAGE_H - 255
    for num, heading, desc in items:
        rule(c, 48, y + 15, 507, HexColor("#4E2E31"), 0.7)
        c.setFillColor(ORANGE)
        c.setFont("Mono-Bold", 8)
        c.drawString(48, y - 1, num)
        c.setFillColor(WHITE)
        c.setFont("Sans-Bold", 12)
        c.drawString(88, y - 1, heading)
        c.setFillColor(HexColor("#DCCBC2"))
        c.setFont("Serif", 9)
        c.drawString(88, y - 17, desc)
        y -= 48
    para(c, "this is a working prospectus. the exact shape of a partnership should be made together, with the teenagers who will live inside it and the adults who will help make it safe.", 48, 94, 400, BODY_LIGHT_SMALL)
    footer(c, page, dark=True, section="contents")


def page_what(c: canvas.Canvas, page: int) -> None:
    c.setFillColor(PAPER)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    bookmark(c, "what is bits&bytes")
    y = page_title(c, "03 / identity", "what is bits&bytes™", "a youth-led, builder-first technology education foundation. built for teenagers who want to move from interest to evidence.")
    c.setFillColor(BURGUNDY)
    c.rect(48, 495, 507, 100, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont("Display", 29)
    c.drawString(68, 552, "we create the missing")
    c.setFillColor(ORANGE)
    c.drawString(68, 521, "conditions to build.")
    para(c, "not a marketing agency. not a whatsapp crowd. not a list of events. bits&bytes™ is the infrastructure around the work: the people, programmes, tools, spaces, standards, and public moments that help a young person finish something real.", 48, 464, 430, BODY, h_limit=48)
    labels = [
        ("builder network", "teenagers, mentors, organisers, designers, engineers, and alumni working in public"),
        ("operating layer", "events, cohorts, squads, forks, and systems that turn intent into a shipped artifact"),
        ("public-benefit foundation", "a Section 8 structure that keeps money, IP, safeguarding, and mission under stewardship"),
    ]
    y = 292
    for i, (head, body) in enumerate(labels):
        x = 48 + i * 169
        c.setFillColor(ORANGE if i == 1 else PEACH)
        c.rect(x, y, 145, 112, fill=1, stroke=0)
        c.setFillColor(BURGUNDY if i == 1 else INK)
        c.setFont("Mono-Bold", 8)
        c.drawString(x + 13, y + 90, f"0{i+1}")
        para(c, head, x + 13, y + 76, 118, CARD_HEAD_BURGUNDY if i == 1 else CARD_HEAD, h_limit=26)
        para(c, body, x + 13, y + 43, 118, CARD_BODY, h_limit=40)
    rule(c, 48, 250, 507, LINE, 0.8)
    para(c, "the community is free to join. the bar is not low. we ask people to show up, collaborate, and release work that can survive outside the room where it was made.", 48, 226, 330, BODY_BOLD, h_limit=52)
    c.setFillColor(ORANGE)
    c.setFont("Display", 42)
    c.drawRightString(555, 174, "ship")
    c.setFillColor(BURGUNDY)
    c.drawRightString(555, 126, "something")
    c.setFillColor(INK)
    c.drawRightString(555, 78, "useful.")
    footer(c, page, section="identity")


def page_problem(c: canvas.Canvas, page: int) -> None:
    c.setFillColor(DEEP)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    bookmark(c, "why this needs to exist")
    dot_grid(c, 0, 0, PAGE_W, PAGE_H, color=ORANGE, alpha=0.06, step=12)
    y = page_title(c, "04 / the problem", "grades are not\nportfolios.", "and a syllabus can describe knowledge without creating the muscle to use it.", dark=True)
    c.setFillColor(ORANGE)
    c.setFont("Display", 74)
    c.drawString(48, 498, "the gap is not")
    c.setFillColor(WHITE)
    c.drawString(48, 425, "motivation.")
    para(c, "the gap is opportunity. a teenager can be curious, online, and surrounded by information, then still have no clear place to practise building with other people. this is where capability stays theoretical.", 48, 353, 320, BODY_LIGHT)
    data = [
        ("86.8%", "of 14-18-year-olds in ASER's rural sample were enrolled in education"),
        ("5.6%", "reported taking vocational training or related courses"),
        ("43.3%", "could solve a basic three-digit by one-digit division problem"),
    ]
    y = 250
    for n, text in data:
        c.setFillColor(ORANGE)
        c.setFont("Display", 31)
        c.drawString(48, y, n)
        para(c, text, 170, y + 18, 300, BODY_LIGHT_SMALL)
        rule(c, 48, y - 16, 507, HexColor("#4E2E31"), 0.7)
        y -= 67
    para(c, "these are not a verdict on young people. they are a reminder that enrolment is not the same thing as readiness, and that access to content is not the same thing as access to practice.", 48, 90, 400, BODY_LIGHT_SMALL)
    c.setFillColor(HexColor("#C7A89B"))
    c.setFont("Mono", 6.7)
    c.drawString(48, 54, "[1] ASER 2023: main findings. rural 14-18 sample, 34,745 youth across 28 districts in 26 states.")
    footer(c, page, dark=True, section="the problem")


def page_research(c: canvas.Canvas, page: int) -> None:
    c.setFillColor(PAPER)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    bookmark(c, "the missing layer")
    label(c, "05 / context", 48, PAGE_H - 55)
    c.setFillColor(BURGUNDY)
    c.setFont("Display", 35)
    c.drawString(48, PAGE_H - 106, "the world is changing")
    c.drawString(48, PAGE_H - 143, "faster than the timetable.")
    para(c, "the most useful education does not stop at explaining a concept. it gives a learner a reason to care, a constraint to work within, a person to work with, and an audience that can say whether the result holds up.", 48, PAGE_H - 189, 430, BODY)
    c.setFillColor(PEACH)
    c.rect(48, 447, 507, 143, fill=1, stroke=0)
    c.setFillColor(INK)
    c.setFont("Display", 29)
    c.drawString(68, 554, "the skill stack is moving")
    c.setFillColor(BURGUNDY)
    c.drawString(68, 521, "from recall to judgment.")
    para(c, "the World Economic Forum's 2025 employer survey expects 39% of workers' core skills to change by 2030. AI and big data sit beside analytical and creative thinking, resilience, collaboration, and leadership. the answer is repeated contact with real constraints.", 68, 493, 435, BODY_SMALL, h_limit=48)
    c.setFillColor(BURGUNDY)
    c.rect(48, 295, 242, 133, fill=1, stroke=0)
    para(c, "policy is already pointing here. NEP 2020 calls for hands-on vocational exposure, internships, and learning that crosses subject boundaries. building is already part of the direction.", 68, 405, 202, BODY_LIGHT_SMALL, h_limit=90)
    c.setFillColor(WARM)
    c.rect(313, 295, 242, 133, fill=1, stroke=0)
    para(c, "a 2023 meta-analysis of 66 experimental and quasi-experimental studies found project-based learning contributed positively to achievement, thinking skills, and student attitudes. practice is not decoration. it is a learning method.", 333, 405, 202, BODY_SMALL, h_limit=100)
    rule(c, 48, 260, 507, LINE, 0.8)
    para(c, "bits&bytes™ is the layer between what a teenager has been told and what they can show. that layer needs mentors, deadlines, peers, tools, feedback, and a safe way to publish the result.", 48, 236, 420, BODY_BOLD, h_limit=52)
    c.setFillColor(MUTED)
    c.setFont("Mono", 6.6)
    c.drawString(48, 61, "[2] WEF Future of Jobs Report 2025  /  [3] Government of India, NEP 2020")
    c.drawString(48, 50, "[4] Tao et al., Frontiers in Psychology, 2023, DOI: 10.3389/fpsyg.2023.1202728")
    footer(c, page, section="context")


def page_mission(c: canvas.Canvas, page: int) -> None:
    c.setFillColor(BURGUNDY)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    bookmark(c, "mission and operating thesis")
    dot_grid(c, 0, 0, PAGE_W, PAGE_H, color=ORANGE, alpha=0.06, step=13)
    label(c, "06 / the thesis", 48, PAGE_H - 55, dark=True)
    c.setFillColor(WHITE)
    c.setFont("Display", 42)
    c.drawString(48, PAGE_H - 121, "build the missing")
    c.setFillColor(ORANGE)
    c.drawString(48, PAGE_H - 165, "layer.")
    para(c, "our mission is simple enough to remember and difficult enough to keep us honest: enable young builders, contributors, organisers, mentors, and communities to learn, build, collaborate, and contribute through locally adaptive technology, education, open-source, community, and public-benefit initiatives.", 48, PAGE_H - 217, 455, BODY_LIGHT)
    steps = [
        ("01", "find a real problem", "start with a person, place, or system that needs something to work better"),
        ("02", "make the first version", "teach only what the next decision requires, then let the work expose the next gap"),
        ("03", "work in public", "use peers, mentors, and partners as a feedback loop, not as an audience"),
        ("04", "release the result", "a project becomes evidence when someone outside the room can use it"),
    ]
    y = 419
    for num, head, body in steps:
        c.setFillColor(ORANGE if num in ("02", "04") else PEACH)
        c.rect(48, y, 110, 88, fill=1, stroke=0)
        c.setFillColor(BURGUNDY)
        c.setFont("Mono-Bold", 8)
        c.drawString(63, y + 66, num)
        para(c, head, 63, y + 52, 82, ParagraphStyle(
            "step-head",
            fontName="Sans-Bold",
            fontSize=9.4,
            leading=11.2,
            textColor=BURGUNDY,
        ), h_limit=27)
        para(c, body, 180, y + 76, 330, BODY_LIGHT_SMALL, h_limit=36)
        rule(c, 180, y + 15, 330, HexColor("#B65C48"), 0.7)
        y -= 103
    c.setFillColor(WHITE)
    para(c, "the bet is that a shipped artifact changes what a young person believes is possible.", 48, 100, 500, SERIF_QUOTE, h_limit=38)
    footer(c, page, dark=True, section="mission")


def page_difference(c: canvas.Canvas, page: int) -> None:
    c.setFillColor(PAPER)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    bookmark(c, "what makes bitsandbytes different")
    y = page_title(c, "07 / differentiation", "we are vertically\nintegrated", "the event is only one surface. the work continues before the room, inside the room, and after the applause.")
    c.setFillColor(INK)
    c.setFont("Mono-Bold", 8)
    c.drawString(48, 505, "THE COMMON MODEL")
    c.drawString(330, 505, "THE bits&bytes™ MODEL")
    rule(c, 48, 492, 507, LINE, 0.8)
    left = ["announce an event", "collect registrations", "run a room", "post the recap", "move on"]
    right = ["spot the builder", "shape the problem", "staff the programme", "ship the product", "keep the relationship"]
    y = 461
    for i in range(5):
        c.setFillColor(MUTED)
        c.setFont("Serif", 11)
        c.drawString(48, y, left[i])
        c.setFillColor(BURGUNDY if i % 2 == 0 else ORANGE)
        c.rect(298, y - 4, 16, 3, fill=1, stroke=0)
        c.setFillColor(INK)
        c.setFont("Serif-Bold", 11)
        c.drawString(330, y, right[i])
        y -= 48
    c.setFillColor(WARM)
    c.rect(48, 146, 507, 108, fill=1, stroke=0)
    c.setFillColor(BURGUNDY)
    c.setFont("Display", 26)
    c.drawString(68, 230, "we build the whole loop")
    c.setFillColor(INK)
    c.setFont("Mono-Bold", 8)
    c.drawString(68, 204, "people  /  programmes  /  product  /  place  /  proof")
    para(c, "a partner does not have to choose between reach and depth. we can put a technical challenge in front of young builders, give them a place to work, bring in practitioners, help them ship, and turn the result into a public artefact that stays useful after the event.", 68, 184, 438, BODY_SMALL, h_limit=36)
    c.setFillColor(BURGUNDY)
    c.setFont("Display", 38)
    c.drawRightString(555, 110, "the work")
    c.setFillColor(ORANGE)
    c.setFont("Display", 36)
    c.drawRightString(555, 70, "keeps going.")
    footer(c, page, section="differentiation")


def page_timeline(c: canvas.Canvas, page: int) -> None:
    c.setFillColor(PAPER)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    bookmark(c, "the journey so far")
    y = page_title(c, "08 / the journey", "a network born from\na cancelled event", "the timeline is short. the operating ambition is not.")
    c.setStrokeColor(BURGUNDY)
    c.setLineWidth(2)
    c.line(90, 158, 90, 542)
    events = [
        ("JUL 2025", "the break", "a regional student hackathon under an external partner is cancelled. the plan loses its home."),
        ("NOV 2025", "the decision", "bits&bytes™ is founded as an independent, teen-led builder network."),
        ("MAR 2026", "the test", "Execron 1.0 at IIT Kanpur brings hands-on AI, web, app, cybersecurity, and cloud work to Classes 9-12."),
        ("MAR 2026", "the scale", "as Official Executive Partner for India Innovates 2026, the team operates inside a national civic-tech platform."),
        ("APR 2026", "the proof", "Hack4Good v0 turns agentic AI into a 24-hour build sprint in Lucknow."),
        ("NOW", "the system", "forks, cohorts, squads, partnerships, and a legal foundation are being built to make the work repeatable."),
    ]
    y = 535
    for i, (date, head, body) in enumerate(events):
        c.setFillColor(ORANGE if i in (1, 4) else BURGUNDY)
        c.circle(90, y - 3, 6, fill=1, stroke=0)
        label(c, date, 123, y + 4, color=BURGUNDY)
        c.setFillColor(INK)
        c.setFont("Sans-Bold", 12)
        c.drawString(123, y - 16, head)
        para(c, body, 235, y + 5, 285, BODY_SMALL)
        y -= 71
    footer(c, page, section="journey")


def page_numbers(c: canvas.Canvas, page: int) -> None:
    c.setFillColor(INK)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    bookmark(c, "the proof in numbers")
    dot_grid(c, 0, 0, PAGE_W, PAGE_H, color=ORANGE, alpha=0.06, step=14)
    label(c, "09 / the proof", 48, PAGE_H - 55, dark=True)
    c.setFillColor(WHITE)
    c.setFont("Display", 36)
    c.drawString(48, PAGE_H - 108, "the proof is not a pitch deck.")
    c.setFillColor(ORANGE)
    c.drawString(48, PAGE_H - 145, "it is a trail of work.")
    para(c, "numbers matter here because they are traces of people doing the work: joining, reviewing, hosting, building, and returning for the next room.", 48, PAGE_H - 190, 430, BODY_LIGHT_SMALL, h_limit=32)

    # One dominant figure and one supporting figure give the page a clear
    # reading order without turning evidence into a repeated metric-card grid.
    c.setFillColor(ORANGE)
    c.setFont("Display", 68)
    c.drawString(48, 476, "2,700+")
    c.setFillColor(WHITE)
    c.setFont("Sans-Bold", 13)
    c.drawString(48, 444, "projects reviewed")
    c.setFillColor(HexColor("#DCCBC2"))
    c.setFont("Mono", 7.4)
    c.drawString(48, 428, "three-day evaluation sprints")

    c.setFillColor(WHITE)
    c.setFont("Display", 45)
    c.drawString(318, 476, "1,400+")
    c.setFont("Sans-Bold", 13)
    c.drawString(318, 444, "active members")
    c.setFillColor(HexColor("#DCCBC2"))
    c.setFont("Mono", 7.4)
    c.drawString(318, 428, "free, teen-led network")
    rule(c, 48, 401, 507, HexColor("#4E2E31"), 0.8)

    facts = [
        ("2,000+", "people reached across WhatsApp, Instagram, Discord, and LinkedIn"),
        ("6+", "events across hackathons, workshops, and build communities"),
        ("5", "recognized Forks with their own builders and programmes"),
        ("13-19", "the age range the network is built around"),
    ]
    positions = [(48, 347), (318, 347), (48, 257), (318, 257)]
    for i, ((n, lab), (x, y)) in enumerate(zip(facts, positions)):
        c.setFillColor(ORANGE if i % 2 == 0 else PEACH)
        c.setFont("Display", 27)
        c.drawString(x, y, n)
        para(c, lab, x + 88, y + 15, 155, ParagraphStyle(
            f"proof-fact-{i}",
            parent=BODY_LIGHT_SMALL,
            fontName="Sans",
            fontSize=7.6,
            leading=9.4,
            textColor=HexColor("#E5CFC4"),
        ), h_limit=25)
        rule(c, x, y - 17, 220, HexColor("#4E2E31"), 0.7)
    c.setFillColor(WARM)
    c.rect(48, 98, 507, 82, fill=1, stroke=0)
    c.setFillColor(INK)
    c.setFont("Sans-Bold", 11)
    c.drawString(68, 153, "the useful reading")
    para(c, "the network is not measured by audience alone. the stronger signal is repeat participation: people come back to make, review, host, mentor, and carry context forward.", 68, 137, 435, ParagraphStyle(
        "proof-reading",
        parent=BODY_SMALL,
        fontName="Serif",
        fontSize=8.6,
        leading=11.2,
        textColor=INK,
    ), h_limit=30)
    footer(c, page, dark=True, section="the proof")


def page_programs(c: canvas.Canvas, page: int) -> None:
    c.setFillColor(PAPER)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    bookmark(c, "programmes")
    y = page_title(c, "10 / programmes", "different doors in.\none standard out.", "we build programmes around the stage a young person is actually in, without turning the network into a single curriculum.")
    programs = [
        ("hackathons", "high-pressure, problem-led sprints where teams go from a blank repo to a public demo."),
        ("workshops", "short, hands-on sessions with the tools people are using now: AI, cloud, hardware, design, and developer workflows."),
        ("cohorts", "small groups with a shared pace, a clear output, peer accountability, and mentors who have built the thing."),
        ("design and dev squads", "cross-functional teams that keep shipping after the event and make the work legible to real users."),
        ("hacker houses and residencies", "focused spaces for deep work, collaboration, and the kind of iteration that needs more than an evening."),
        ("open-source and public goods", "projects, playbooks, and tools that stay open when the programme ends."),
        ("hardware and maker track", "the next layer: fund, mentor, and showcase deeptech prototypes in electronics and hardware."),
    ]
    positions = [(48, 502), (313, 502), (48, 392), (313, 392), (48, 282), (313, 282), (48, 152)]
    for i, ((head, body), (x, yy)) in enumerate(zip(programs, positions)):
        c.setFillColor(ORANGE if i in (0, 3, 6) else BURGUNDY)
        c.setFont("Display", 26)
        c.drawString(x, yy, f"{i + 1:02d}")
        rule(c, x + 38, yy + 7, 204 if i != 6 else 459, LINE, 0.7)
        c.setFillColor(INK)
        c.setFont("Sans-Bold", 10.5)
        c.drawString(x + 50, yy + 1, head)
        para(c, body, x + 50, yy - 13, 190 if i != 6 else 435, BODY_SMALL, h_limit=40)
    c.setFillColor(INK)
    c.setFont("Serif-Italic", 13)
    c.drawString(313, 185, "the output is always more important")
    c.drawString(313, 167, "than the format that got you there.")
    footer(c, page, section="programmes")


def page_fork(c: canvas.Canvas, page: int) -> None:
    c.setFillColor(DEEP)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    bookmark(c, "the Fork model")
    dot_grid(c, 0, 0, PAGE_W, PAGE_H, color=ORANGE, alpha=0.06, step=13)
    label(c, "11 / the network model", 48, PAGE_H - 55, dark=True)
    c.setFillColor(WHITE)
    c.setFont("Display", 54)
    c.drawString(48, PAGE_H - 128, "a Fork is a local")
    c.setFillColor(ORANGE)
    c.drawString(48, PAGE_H - 183, "place to begin.")
    para(c, "a Fork is an official city-level, institutional, digital, or thematic operating unit of the bits&bytes™ network. it can adapt its events, culture, and projects to the place it lives in. it still stays inside one Foundation, one brand, one safeguarding standard, and one financial control system.", 48, PAGE_H - 240, 430, BODY_LIGHT)
    c.setStrokeColor(ORANGE)
    c.setLineWidth(1.2)
    c.line(110, 418, 485, 418)
    nodes = [(110, "lucknow"), (235, "jaipur"), (360, "hyderabad"), (485, "the next city")]
    for x, name in nodes:
        c.setFillColor(ORANGE if name == "the next city" else PEACH)
        c.circle(x, 418, 9, fill=1, stroke=0)
        c.setFillColor(WHITE)
        c.setFont("Mono-Bold", 7.2)
        c.drawCentredString(x, 389, name.upper())
    c.setFillColor(BURGUNDY)
    c.rect(48, 175, 507, 142, fill=1, stroke=0)
    c.setFillColor(ORANGE)
    c.setFont("Display", 27)
    c.drawString(68, 281, "local autonomy, upstream trust")
    para(c, "Forks are not franchises, subsidiaries, or separate legal entities. they are a permission to operate locally with a real operating system behind them. no Fork can sign contracts, collect sponsorship money, or bind GOBITSNBYTES FOUNDATION without written authority.", 68, 254, 430, BODY_LIGHT_SMALL)
    c.setFillColor(WHITE)
    c.setFont("Serif-Italic", 14)
    c.drawString(48, 110, "we want local ownership without asking teenagers to carry adult liability.")
    footer(c, page, dark=True, section="the Fork model")


def page_india_innovates(c: canvas.Canvas, page: int) -> None:
    c.setFillColor(PAPER)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    bookmark(c, "India Innovates 2026")
    label(c, "12 / event highlight", 48, PAGE_H - 55)
    c.setFillColor(BURGUNDY)
    c.setFont("Display", 38)
    c.drawString(48, PAGE_H - 106, "when the room is national")
    c.drawString(48, PAGE_H - 146, "the standard has to rise.")
    photo(c, "public/event_pictures/HEe93oOakAAi2Mi.jpg", 48, 403, 507, 182, grayscale=True, duotone=("#1E0509", "#FEE9CF"), tint=(0.15, 0.03, 0.04, 0.25))
    c.setFillColor(ORANGE)
    c.rect(48, 403, 142, 25, fill=1, stroke=0)
    c.setFillColor(INK)
    c.setFont("Mono-Bold", 7.5)
    c.drawString(60, 412, "OFFICIAL EXECUTIVE PARTNER")
    para(c, "India Innovates 2026 was a national civic-tech platform held at Bharat Mandapam, New Delhi. the funnel moved from 1.26 crore+ applicants to 28,000+, then 5,000+, and finally 15 teams. bits&bytes™ served as the Official Executive Partner, operating at a scale where coordination, participant experience, and public trust mattered as much as the stage.", 48, 368, 320, BODY)
    c.setFillColor(BURGUNDY)
    c.rect(390, 300, 165, 167, fill=1, stroke=0)
    draw_number(c, "15", "teams at the final stage", 412, 399, color=WHITE, accent=ORANGE, size=57)
    para(c, "a young team can hold serious responsibility when the system around the work is serious too.", 412, 340, 125, BODY_LIGHT_SMALL)
    c.setFillColor(INK)
    c.setFont("Mono", 7.2)
    c.drawString(48, 270, "01  open civic problem")
    c.drawString(48, 250, "02  national funnel")
    c.drawString(48, 230, "03  finalist teams")
    c.drawString(48, 210, "04  ministry-level presentation stage")
    rule(c, 220, 263, 300, LINE, 0.7)
    para(c, "a partnership with bits&bytes™ can begin in a city and still be designed with national ambition. we know what it means to make a programme legible to participants, institutions, and public stakeholders at the same time.", 220, 258, 325, BODY_BOLD)
    footer(c, page, section="event highlight")


def page_events(c: canvas.Canvas, page: int) -> None:
    c.setFillColor(PAPER)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    bookmark(c, "event sequence")
    y = page_title(c, "13 / event sequence", "from the first build\nto the next room", "the events look different. the underlying move stays the same: give young people a real problem and enough structure to finish something.")
    photos = [
        ("public/event_pictures/devday.jpeg", 48, 469, 160, 116),
        ("public/event_pictures/byteforge1.webp", 218, 469, 160, 116),
        ("public/event_pictures/bd1.jpg", 388, 469, 167, 116),
    ]
    for path, x, yy, w, h in photos:
        photo(c, path, x, yy, w, h, grayscale=True, duotone=("#120F0A", "#FEE9CF"))
    events = [
        ("Hack4Good v0", "24-hour agentic AI hackathon", "Lucknow / 425 registrations / 110 on-ground"),
        ("Execron 1.0", "AI workshop + hackathon", "IIT Kanpur / Classes 9-12 / 4h workshop + 24h sprint"),
        ("GitHub Copilot Dev Days", "responsible AI for developers", "Lucknow / Copilot workflows + responsible AI"),
        ("Lucknow Build Guild", "hardware workshop + meetup", "free hardware workshop + meetup in Lucknow"),
        ("Regional Space Apps Hackathon", "regional builder sprint", "300+ participants / space, data, public problems"),
        ("India Innovates 2026", "national civic-tech platform", "Official Executive Partner / Bharat Mandapam, New Delhi"),
    ]
    y = 428
    for i, (head, sub, body) in enumerate(events):
        x = 48 if i % 2 == 0 else 313
        yy = y - (i // 2) * 67
        c.setFillColor(ORANGE if i == 0 else BURGUNDY if i == 5 else PEACH)
        c.rect(x, yy, 242, 52, fill=1, stroke=0)
        c.setFillColor(WHITE if i in (0, 5) else INK)
        c.setFont("Sans-Bold", 9.5)
        c.drawString(x + 12, yy + 32, head)
        c.setFont("Mono-Bold", 6.7)
        c.drawString(x + 12, yy + 20, sub.upper())
        para(c, body, x + 12, yy + 16, 218, ParagraphStyle("event-body", parent=BODY_SMALL, fontSize=7.7, leading=9.3, textColor=WHITE if i in (0, 5) else INK))
    footer(c, page, section="events")


def page_collabs(c: canvas.Canvas, page: int) -> None:
    c.setFillColor(DEEP)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    bookmark(c, "collaborations")
    dot_grid(c, 0, 0, PAGE_W, PAGE_H, color=ORANGE, alpha=0.06, step=12)
    label(c, "14 / collaborations", 48, PAGE_H - 55, dark=True)
    c.setFillColor(WHITE)
    c.setFont("Display", 43)
    c.drawString(48, PAGE_H - 115, "names, not logos.")
    c.setFillColor(ORANGE)
    c.drawString(48, PAGE_H - 160, "roles, not fog.")
    para(c, "institutions bring context. companies bring tools, practitioners, and hard questions. this is a working record of the organisations and event systems we can point to in public, with the kind of relationship named beside each one.", 48, PAGE_H - 206, 420, BODY_LIGHT, h_limit=46)
    collabs = [
        ("HackerRank", "community partner / Infinity Hacks 2026"),
        ("GitHub + GitHub Copilot", "GitHub Copilot Dev Days, Lucknow"),
        ("Notion", "Hack4Good v0 and Dev Days community support"),
        ("Coding Connoisseurs", "community partner / Faculty of Engineering and Technology, University of Lucknow"),
        ("India Innovates 2026", "Official Executive Partner / Bharat Mandapam, New Delhi"),
        ("HN Group + Municipal Corporation of Delhi", "organisers of India Innovates 2026"),
        ("Byte Forge", "presenting partner / Execron 1.0"),
        ("Indian Institute of Technology Kanpur", "institutional setting / TechKriti '26"),
        ("Lucknow Build Guild", "hardware workshop and meetup support"),
        ("Regional Space Apps Hackathon", "regional space, data, and public-problem sprint"),
        ("Pure Buttons", "Hack4Good v0 event partner"),
        ("Notion Lucknow", "local community partner"),
        ("Z.ai", "AI partner"),
        ("GitLab", "sponsor"),
    ]
    name_style = ParagraphStyle("collab-name", fontName="Sans-Bold", fontSize=8.6, leading=9.6, textColor=PEACH)
    role_style = ParagraphStyle("collab-role", fontName="Serif", fontSize=7.5, leading=9.2, textColor=HexColor("#E5CFC4"))
    y = 438
    for i, (name, role) in enumerate(collabs):
        x = 48 if i % 2 == 0 else 313
        yy = y - (i // 2) * 56
        c.setFillColor(ORANGE if i in (0, 4, 7) else HexColor("#8D4A4C"))
        c.setFont("Mono-Bold", 7)
        c.drawString(x, yy + 21, f"{i + 1:02d}")
        para(c, name, x + 28, yy + 34, 212, name_style, h_limit=20)
        para(c, role, x + 28, yy + 17, 212, role_style, h_limit=22)
        rule(c, x, yy + 5, 242, HexColor("#4E2E31"), 0.7)
        if "TechKriti" in role:
            c.linkURL(
                "https://techkriti.org/",
                (x + 28, yy + 5, x + 242, yy + 38),
                relative=0,
                thickness=0,
            )
    footer(c, page, dark=True, section="collaborations")


def page_legal(c: canvas.Canvas, page: int) -> None:
    c.setFillColor(PAPER)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    bookmark(c, "trust is part of the product")
    y = page_title(c, "15 / trust", "young leadership needs\nstronger guardrails", "the legal and safeguarding system is not decoration around the work. it is what makes the work possible.")
    c.setFillColor(BURGUNDY)
    c.rect(48, 480, 507, 145, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont("Display", 27)
    c.drawString(68, 568, "GOBITSNBYTES FOUNDATION")
    c.setFont("Mono-Bold", 8)
    c.setFillColor(ORANGE)
    c.drawString(68, 540, "SECTION 8 NON-PROFIT COMPANY  /  INCORPORATED 2 JUNE 2026")
    para(c, "bits&bytes™ is the public network and brand. the Foundation is the upstream legal steward. the Board holds ultimate fiduciary, constitutional, financial, IP, and safeguarding authority.", 68, 517, 440, BODY_LIGHT_SMALL, h_limit=38)
    blocks = [
        ("written authority", "titles describe operational responsibility. contracts, sponsorships, funds, and formal commitments move through written Board delegation."),
        ("safeguarding first", "consent, supervision, reporting, moderation, confidentiality, and escalation apply to every Fork, event, cohort, and digital space."),
        ("money stays in the system", "sponsorships, donations, event fees, and grants flow through Foundation-approved financial channels. no personal UPI collections."),
        ("one Foundation", "Forks have local creative autonomy, but they are not franchises, subsidiaries, or separate legal entities. the brand stays stewarded."),
    ]
    y = 390
    for i, (head, body) in enumerate(blocks):
        x = 48 if i % 2 == 0 else 313
        yy = y - (i // 2) * 107
        c.setFillColor(PEACH if i % 2 == 0 else WARM)
        c.rect(x, yy, 242, 84, fill=1, stroke=0)
        c.setFillColor(BURGUNDY)
        c.setFont("Sans-Bold", 11)
        c.drawString(x + 14, yy + 60, head)
        para(c, body, x + 14, yy + 48, 212, BODY_SMALL, h_limit=48)
    rule(c, 48, 181, 507, LINE, 0.8)
    para(c, "we are youth-led without pretending that youth-led means ungoverned. the network gives teenagers real operational ownership and keeps adult legal responsibility where it belongs.", 48, 158, 430, BODY_BOLD)
    footer(c, page, section="trust")


def page_why_partner(c: canvas.Canvas, page: int) -> None:
    c.setFillColor(BURGUNDY)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    bookmark(c, "why partner")
    dot_grid(c, 0, 0, PAGE_W, PAGE_H, color=ORANGE, alpha=0.06, step=12)
    label(c, "16 / partnership", 48, PAGE_H - 55, dark=True)
    c.setFillColor(WHITE)
    c.setFont("Display", 50)
    c.drawString(48, PAGE_H - 123, "partner before")
    c.setFillColor(ORANGE)
    c.drawString(48, PAGE_H - 173, "the shortlist exists.")
    para(c, "the best time to meet a young builder is before their identity has hardened into a job title. a partnership with bits&bytes™ lets you show up while people are still trying things, choosing what to care about, and learning what good work feels like.", 48, PAGE_H - 226, 430, BODY_LIGHT)
    rows = [
        ("purpose with proof", "fund work that produces a public result, not only a logo placement"),
        ("early talent signal", "meet builders through the quality of their decisions, not only a CV"),
        ("technical relevance", "put real tools and real problem statements in front of the people who will use them"),
        ("institutional reach", "enter a network that can move between schools, universities, cities, and online spaces"),
        ("brand memory", "be remembered as the organisation that made the work possible"),
    ]
    y = 444
    for i, (head, body) in enumerate(rows):
        c.setFillColor(ORANGE if i == 0 else PEACH)
        c.rect(48, y, 507, 48, fill=1, stroke=0)
        c.setFillColor(BURGUNDY if i == 0 else INK)
        c.setFont("Sans-Bold", 10.5)
        c.drawString(68, y + 29, head)
        para(c, body, 213, y + 37, 315, BODY_LIGHT_SMALL if i == 0 else BODY_SMALL)
        y -= 61
    para(c, "if you want a relationship with the builders of the next decade, start by helping one of them ship this month.", 48, 103, 485, ParagraphStyle(
        "why-partner-quote",
        fontName="Serif-Italic",
        fontSize=12.2,
        leading=15,
        textColor=WHITE,
    ), h_limit=34)
    footer(c, page, dark=True, section="partnership")


def page_pathways(c: canvas.Canvas, page: int) -> None:
    c.setFillColor(PAPER)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    bookmark(c, "partnership pathways")
    y = page_title(c, "17 / pathways", "a partnership can be\nsmall, then compound", "we would rather design one sharp programme that works than sell a menu nobody can operate.")
    pathways = [
        ("university partnership", ["campus Fork or city node", "co-designed pre-incubation for school builders", "challenge labs, faculty mentors, and maker space access", "showcases that make student work legible beyond a certificate"]),
        ("corporate partnership", ["sponsor a problem track or build sprint", "developer tools, cloud credits, devices, or expert mentors", "technical review and responsible AI guidance", "early relationship with builders before they enter the job market"]),
        ("school and institution partnership", ["hands-on workshops for Classes 8-12", "teacher and coordinator enablement", "safe, parent-aware event operations", "a repeatable pathway from interest to portfolio"]),
    ]
    y = 500
    for i, (head, bullets) in enumerate(pathways):
        c.setFillColor(BURGUNDY if i == 1 else (PEACH if i == 0 else WARM))
        c.rect(48, y, 507, 123, fill=1, stroke=0)
        c.setFillColor(WHITE if i == 1 else BURGUNDY)
        c.setFont("Display", 23)
        c.drawString(68, y + 88, head)
        c.setFont("Mono", 7.2)
        for j, item in enumerate(bullets):
            c.setFillColor(ORANGE if i == 1 else BURGUNDY)
            c.rect(69, y + 61 - j * 17, 5, 5, fill=1, stroke=0)
            c.setFillColor(WHITE if i == 1 else INK)
            c.setFont("Serif", 9.1)
            c.drawString(83, y + 60 - j * 17, item)
        y -= 145
    c.setFillColor(INK)
    c.setFont("Serif-Italic", 13)
    c.drawString(48, 86, "the unit of partnership is not a campaign. it is a working loop.")
    footer(c, page, section="pathways")


def page_benefits(c: canvas.Canvas, page: int) -> None:
    c.setFillColor(PAPER)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    bookmark(c, "benefits and visibility")
    y = page_title(c, "18 / benefits", "make the work visible\nwithout making it shallow", "every partnership should leave a useful trace for the young people in the programme and a clear record for the organisation funding it.")
    benefits = [
        ("naming", "co-branded programme identity, challenge tracks, or event series where approved"),
        ("presence", "stage, venue, digital, and community surfaces across WhatsApp, Instagram, Discord, LinkedIn, and web"),
        ("participation", "mentors, judges, reviewers, speakers, and technical office hours"),
        ("proof", "public demos, project write-ups, impact notes, and a clean post-programme report"),
        ("access", "early conversations with builders, Fork Leads, educators, and future collaborators"),
        ("continuity", "a pathway from one event to a cohort, a Fork, a research track, or the alumni network"),
    ]
    positions = [(48, 492), (313, 492), (48, 396), (313, 396), (48, 300), (313, 300)]
    for i, ((head, body), (x, yy)) in enumerate(zip(benefits, positions)):
        c.setFillColor(ORANGE if i in (1, 4) else BURGUNDY)
        c.setFont("Display", 25)
        c.drawString(x, yy, f"{i + 1:02d}")
        rule(c, x + 38, yy + 7, 204, LINE, 0.7)
        c.setFillColor(INK)
        c.setFont("Sans-Bold", 10.5)
        c.drawString(x + 50, yy + 1, head)
        para(c, body, x + 50, yy - 13, 190, BODY_SMALL, h_limit=34)
    c.setFillColor(ORANGE)
    c.rect(48, 125, 507, 95, fill=1, stroke=0)
    c.setFillColor(INK)
    c.setFont("Display", 22)
    c.drawString(68, 189, "visibility is the by-product of useful work")
    para(c, "we do not want to decorate a weak programme with a strong brand. we want the brand to sit next to work that a participant, a partner, and a skeptical reader can all inspect.", 68, 164, 437, ParagraphStyle("benefit-pull", parent=BODY_SMALL, textColor=INK), h_limit=30)
    footer(c, page, section="benefits")


def page_vision(c: canvas.Canvas, page: int) -> None:
    c.setFillColor(DEEP)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    bookmark(c, "the next three years")
    dot_grid(c, 0, 0, PAGE_W, PAGE_H, color=ORANGE, alpha=0.06, step=12)
    label(c, "19 / the horizon", 48, PAGE_H - 55, dark=True)
    c.setFillColor(WHITE)
    c.setFont("Display", 42)
    c.drawString(48, PAGE_H - 112, "the next three years")
    c.setFillColor(ORANGE)
    c.drawString(48, PAGE_H - 155, "are a systems problem.")
    para(c, "we want a network that feels local when you enter it and national when you need it. that means more places to start, more people who can help, and a reliable path from a first prototype to a longer body of work.", 48, PAGE_H - 205, 430, BODY_LIGHT)
    targets = [
        ("20", "established Forks across India"),
        ("100", "partner schools and educational institutes"),
        ("5x", "the community size, without losing the builder-first bar"),
        ("always", "an event, cohort, squad, or build cycle in motion"),
    ]
    y = 491
    for i, (n, text) in enumerate(targets):
        x = 48 if i % 2 == 0 else 313
        yy = y - (i // 2) * 114
        c.setFillColor(BURGUNDY if i % 2 == 0 else ORANGE)
        c.rect(x, yy, 242, 91, fill=1, stroke=0)
        c.setFillColor(WHITE if i % 2 == 0 else INK)
        c.setFont("Display", 46)
        c.drawString(x + 17, yy + 43, n)
        para(c, text.upper(), x + 18, yy + 31, 206, ParagraphStyle(
            f"vision-label-{i}",
            parent=VISION_LABEL,
            textColor=WHITE if i % 2 == 0 else INK,
        ), h_limit=22)
    c.setFillColor(WARM)
    c.rect(48, 98, 507, 122, fill=1, stroke=0)
    c.setFillColor(BURGUNDY)
    c.setFont("Sans-Bold", 12)
    c.drawString(68, 192, "the new track")
    c.setFont("Display", 22)
    c.drawString(68, 163, "hardware, maker, and deeptech")
    para(c, "we plan to fund, mentor, and showcase serious hardware and electronics work, so the network does not stop at browser-based prototypes. physical work needs a place to survive.", 68, 144, 437, BODY_SMALL)
    footer(c, page, dark=True, section="the horizon")


def page_alumni(c: canvas.Canvas, page: int) -> None:
    c.setFillColor(PAPER)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    bookmark(c, "alumni and the fund")
    y = page_title(c, "20 / continuity", "the network should outlive\nits first generation", "the most valuable thing a young builder can become is not a success story. it is a person who comes back with context.")
    c.setFillColor(BURGUNDY)
    c.rect(48, 453, 507, 141, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont("Display", 31)
    c.drawString(68, 548, "alumni are distribution")
    c.setFillColor(ORANGE)
    c.drawString(68, 514, "for the next builder.")
    para(c, "an alumni layer lets people return as mentors, reviewers, collaborators, funders, founders, researchers, and hosts. it keeps the network from confusing age with authority. someone who has shipped more can make the first step less lonely for someone who has not.", 68, 486, 437, BODY_LIGHT_SMALL)
    c.setFillColor(PEACH)
    c.rect(48, 274, 242, 121, fill=1, stroke=0)
    c.setFillColor(BURGUNDY)
    c.setFont("Sans-Bold", 12)
    c.drawString(68, 366, "the alumni network")
    para(c, "mentorship, peer review, research collaborations, founder sessions, and a route back into the rooms where people first started.", 68, 345, 202, BODY_SMALL)
    c.setFillColor(WARM)
    c.rect(313, 274, 242, 121, fill=1, stroke=0)
    c.setFillColor(BURGUNDY)
    c.setFont("Sans-Bold", 12)
    c.drawString(333, 366, "the alumni fund")
    para(c, "a planned pool that recycles later success into first hardware parts, cloud credits, travel, prototypes, and small grants for the next generation of builders.", 333, 345, 202, BODY_SMALL)
    rule(c, 48, 219, 507, LINE, 0.8)
    para(c, "the long-term argument for partnership is simple: you are not only funding an event. you are helping create a system that can return value, care, and capital to the people who come after.", 48, 194, 440, BODY_BOLD)
    footer(c, page, section="continuity")


def page_next_steps(c: canvas.Canvas, page: int) -> None:
    c.setFillColor(BURGUNDY)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    bookmark(c, "next steps")
    dot_grid(c, 0, 0, PAGE_W, PAGE_H, color=ORANGE, alpha=0.06, step=12)
    label(c, "21 / next steps", 48, PAGE_H - 55, dark=True)
    c.setFillColor(WHITE)
    c.setFont("Display", 50)
    c.drawString(48, PAGE_H - 122, "bring us a problem")
    c.setFillColor(ORANGE)
    c.drawString(48, PAGE_H - 173, "worth giving to teenagers.")
    para(c, "start with the thing your organisation already knows is difficult: the technology people are not learning fast enough, the public problem that needs a new lens, the students who have more ability than evidence, or the hardware idea that keeps getting deferred.", 48, PAGE_H - 228, 430, BODY_LIGHT)
    c.setFillColor(PEACH)
    c.rect(48, 391, 507, 134, fill=1, stroke=0)
    c.setFillColor(BURGUNDY)
    c.setFont("Display", 25)
    c.drawString(68, 488, "the first conversation")
    c.setFillColor(INK)
    c.setFont("Serif", 12)
    c.drawString(68, 452, "1. tell us what you want to make possible.")
    c.drawString(68, 429, "2. tell us what cannot be compromised.")
    c.drawString(68, 406, "3. we will sketch the smallest working partnership.")
    c.setFillColor(WHITE)
    c.setFont("Display", 29)
    c.drawString(48, 322, "hello@gobitsnbytes.org")
    c.setFont("Sans-Bold", 12)
    c.drawString(48, 294, "gobitsnbytes.org  /  gobitsnbytes.org/contact")
    c.setFont("Mono", 8)
    c.drawString(48, 264, "linkedin.com/company/gobitsbytes")
    c.drawString(48, 249, "github.com/gobitsnbytes")
    c.drawString(48, 234, "instagram.com/gobitsnbytes")
    c.setFillColor(WARM)
    c.rect(48, 108, 507, 74, fill=1, stroke=0)
    para(c, "research sources used in the problem and context pages: ASER Centre (2023); ILO, India Employment Report 2024; World Economic Forum, Future of Jobs Report 2025; Government of India, National Education Policy 2020; Tao et al., 2023 project-based learning meta-analysis; UNESCO Global Education Monitoring Report 2023.", 68, 162, 437, BODY_SMALL)
    footer(c, page, dark=True, section="next steps")


def page_closing(c: canvas.Canvas, page: int) -> None:
    c.setFillColor(DEEP)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    bookmark(c, "closing")
    dot_grid(c, 0, 0, PAGE_W, PAGE_H, color=ORANGE, alpha=0.08, step=13)
    draw_logo(c, PAGE_W - 118, PAGE_H - 132, 70)
    c.setFillColor(WHITE)
    c.setFont("Display", 58)
    c.drawString(48, PAGE_H - 178, "somewhere in india")
    c.drawString(48, PAGE_H - 238, "a teenager is trying")
    c.setFillColor(ORANGE)
    c.drawString(48, PAGE_H - 298, "to become useful.")
    para(c, "they do not need a prophecy. they need a room, a problem, a few people who will stay, and a reason to put the first version in the world.", 48, PAGE_H - 366, 425, BODY_LIGHT)
    c.setFillColor(PEACH)
    c.setFont("Serif-Italic", 20)
    c.drawString(48, 298, "we are building that room.")
    c.setFillColor(WHITE)
    c.setFont("Sans-Bold", 12)
    c.drawString(48, 210, "bits&bytes™")
    c.setFont("Mono", 8)
    c.drawString(48, 190, "a teen-led builder network from india, for india, and with the world watching")
    c.setFillColor(ORANGE)
    c.rect(48, 143, 170, 4, fill=1, stroke=0)
    c.setFillColor(PEACH)
    c.setFont("Mono", 8)
    c.drawString(48, 116, "gobitsnbytes.org")
    c.drawString(48, 101, "hello@gobitsnbytes.org")
    footer(c, page, dark=True, section="closing")


def build() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    TMP_DIR.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUT), pagesize=A4, pageCompression=1)
    c.setTitle("bits&bytes™ Partnership & Sponsorship Prospectus")
    c.setAuthor("GOBITSNBYTES FOUNDATION")
    c.setSubject("Partnership and sponsorship prospectus")
    pages = [
        page_cover,
        page_founder_letter,
        page_contents,
        page_what,
        page_problem,
        page_research,
        page_mission,
        page_difference,
        page_timeline,
        page_numbers,
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
        page_alumni,
        page_next_steps,
        page_closing,
    ]
    for page_num, fn in enumerate(pages, start=1):
        fn(c, page_num)
        c.showPage()
    c.save()
    print(f"built {OUT} ({len(pages)} pages)")


if __name__ == "__main__":
    build()
