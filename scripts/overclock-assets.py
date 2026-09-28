"""overclock brand kit: render every element of the A–Z design system in isolation and save it as a PNG.

  python scripts/overclock-assets.py

Reuses tmp/overclock/style.css and the dial/graph JS from tmp/overclock/build.py. Writes
public/overclock-assets/<slug>.png (3x), a manifest.json that app/overclock-assets/page.tsx reads,
and overclock-brandkit.zip of everything. The layout thumbnails come from overclock_a-z.html in the repo
root, so run tmp/overclock/build.py first if the doc changed.
"""
import html, json, pathlib, re, sys, zipfile

from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parents[1]
OC = ROOT / "tmp" / "overclock"
OUT = ROOT / "public" / "overclock-assets"
sys.path.insert(0, str(OC))
from build import JS  # noqa: E402  the dial + graph drawing code, same as the doc

CSS = (OC / "style.css").read_text(encoding="utf-8")
ROOTVARS = dict(re.findall(r"--([\w-]+):\s*(#[0-9a-fA-F]{6})", CSS.split(":root", 1)[1].split("}", 1)[0]))

# (css var, name, role). hex comes from style.css so this can't drift.
SWATCHES = [
    ("core burgundy", [
        ("burgundy", "burgundy", "the core voice: rails, cards, headings accents"),
        ("burgundy-1", "burgundy 1", "gradient step, pressed states"),
        ("burgundy-2", "burgundy 2", "labels on orange"),
        ("burgundy-3", "burgundy 3", "deep rail, dial rim, gradient start"),
        ("burgundy-4", "burgundy 4", "darkest step, cover gradient start"),
    ]),
    ("orange pop", [
        ("orange", "orange", "the pop: accents, stat numbers on dark, slider start"),
        ("orange-2", "orange 2", "labels on dark, dial lit arc"),
        ("orange-3", "orange 3", "rubric step, emphasis on burgundy"),
        ("orange-4", "orange 4", "highlighter marks, rubric step"),
        ("cream", "cream", "text on dark, cream cards"),
    ]),
    ("warm", [
        ("warm", "warm", "labels on paper, dark-card shadow"),
        ("warm-2", "warm 2", "secondary warm accent"),
    ]),
    ("neutrals", [
        ("ink", "ink", "text, borders, hard offset shadows"),
        ("ink-2", "ink 2", "spec-table keys"),
        ("mute", "mute", "muted copy, meter labels"),
        ("mute-2", "mute 2", "inactive meter letters, panel keys"),
        ("line", "line", "hairlines and table rules"),
        ("paper", "paper", "the page"),
        ("paper-2", "paper 2", "zebra rows, code"),
    ]),
    ("redline red", [
        ("red", "redline", "the redline: glow bars, needles, limits. use sparingly"),
        ("red-ink", "red ink", "red text on paper, tbd chips"),
    ]),
]
GRADIENTS = [
    ("grad-cover", "the burn", "cover and hero surfaces",
     "linear-gradient(118deg, var(--burgundy-4) 0%, var(--burgundy-3) 18%, var(--burgundy) 48%, var(--warm) 78%, var(--orange) 100%)"),
    ("grad-rail", "the climb", "the grad rail, vertical surfaces",
     "linear-gradient(180deg, var(--burgundy-3) 0%, var(--burgundy) 40%, var(--warm) 78%, var(--orange) 100%)"),
    ("grad-heat", "the heat", "OC slider fill, anything approaching the redline",
     "linear-gradient(90deg, var(--orange), var(--red))"),
    ("grad-burgundy", "burgundy scale", "the core scale as one ramp",
     "linear-gradient(90deg, var(--burgundy), var(--burgundy-1), var(--burgundy-2), var(--burgundy-3), var(--burgundy-4))"),
    ("grad-orange", "orange scale", "the pop scale as one ramp",
     "linear-gradient(90deg, var(--orange), var(--orange-2), var(--orange-3), var(--orange-4), var(--cream))"),
]

KIT_CSS = """
html, body { background: transparent; }
body { padding: 10px; width: 1400px; }
.asset { display: inline-block; vertical-align: top; padding: 6mm; margin: 0 10px 10px 0; }
.asset.paper { background: var(--paper); }
.asset.cream-bg { background: var(--cream); }
.wm-oc { font-family: "Anton"; font-size: 96pt; line-height: .84; letter-spacing: -.5px; text-transform: uppercase; }
.tagline { display: flex; align-items: center; gap: 12px; }
.tagline .redbar { width: 34mm; }
.tagline span { font-family: "Script"; font-size: 34pt; line-height: 1.1; }
.bb { display: flex; align-items: center; gap: 9px; color: var(--cream); }
.bb img { width: 34px; height: 34px; }
.bb .wm { display: flex; align-items: flex-start; line-height: .8; }
.bb .wm .b { font-family: "Archivo"; font-size: 27px; letter-spacing: -1px; }
.bb .wm .s { font-family: "Script"; font-size: 23px; margin: 4px 0 0 -2px; line-height: 1; }
.bb .wm .tm { font-family: "Archivo"; font-size: 8px; margin-left: 1px; }
.lock { display: flex; align-items: center; gap: 7mm; color: var(--cream); }
.lock .x { width: 2px; align-self: stretch; background: var(--cream); opacity: .6; }
.lock .wm-oc { font-size: 44pt; text-shadow: 3px 3px 0 var(--ink); }
.tf { background: var(--ink); color: var(--cream); border: 2px solid var(--ink); box-shadow: 3.5px 3.5px 0 var(--cream); padding: 3mm 3.4mm; display: flex; align-items: center; gap: 3.4mm; }
.tf.clear { background: transparent; border: 0; box-shadow: none; padding: 0; }
.tf img { height: 13mm; }
.tf .mono { font-size: 6pt; line-height: 1.5; }
.tf .mono b { display: block; font-family: "Anton"; font-weight: 400; font-size: 13pt; letter-spacing: .3px; line-height: 1.05; color: var(--orange); }
.sw { width: 60mm; border: 2px solid var(--ink); box-shadow: 3.5px 3.5px 0 var(--ink); background: var(--paper); }
.sw .c { height: 30mm; border-bottom: 2px solid var(--ink); }
.sw .t { padding: 2.4mm 3mm 2.8mm; }
.sw .t b { display: block; font-family: "Anton"; font-weight: 400; font-size: 14pt; text-transform: uppercase; line-height: 1; }
.sw .t .mono { font-size: 7pt; margin-top: 1mm; color: var(--burgundy); }
.sw .t p { font-size: 7.4pt; line-height: 1.3; margin-top: 1mm; color: var(--ink-2); }
.gr { width: 150mm; }
.gr .c { height: 30mm; }
.spec { width: 150mm; }
.spec .k { font-family: "Mono"; font-weight: 700; font-size: 6.4pt; letter-spacing: .16em; text-transform: uppercase; color: var(--mute); margin-top: 3mm; }
.rail { width: 70mm; height: 150mm; }
.rail .lede { font-size: 9.2pt; line-height: 1.42; margin-top: 3.2mm; opacity: .95; }
.meter { position: relative; left: auto; right: auto; bottom: auto; width: 250mm; }
.tex { width: 80mm; height: 50mm; border: 2px solid var(--ink); }
.tex.dots { background: var(--burgundy); background-image: radial-gradient(circle, rgba(254,233,207,.13) 1.05px, transparent 1.45px); background-size: 8px 8px; }
.tex.photo-dots { background: var(--orange-3); background-image: radial-gradient(circle, rgba(18,15,10,.22) 1px, transparent 1.4px); background-size: 5px 5px; }
.mon .ro { display: flex; justify-content: space-between; align-items: center; font-size: 5.8pt; letter-spacing: .14em; text-transform: uppercase; margin-top: 2mm; color: var(--mute-2); }
"""


def asset(slug, title, section, inner, bg="clear", tile="light", note="", **extra):
    """bg: clear (transparent PNG) | paper | cream-bg. tile: how the page shows a clear PNG (light or dark ground).
    Every data-* attribute ends up in manifest.json."""
    cls = "asset" + ("" if bg == "clear" else " " + bg)
    data = {"slug": slug, "title": title, "section": section, "tile": tile, "note": note, **extra}
    attrs = " ".join(f'data-{k}="{html.escape(v)}"' for k, v in data.items())
    return f'<div class="{cls}" {attrs}>{inner}</div>'


def dial(v, read, sub, label="CORE CLOCK"):
    return (f'<svg class="dial" style="width:92mm" data-max="6" data-stock="4.2" data-red="5" data-v="{v}" '
            f'data-label="{label}" data-unit="GHz" data-read="{read}" data-sub="{sub}"></svg>')


def rail(variant, letter, title, lede, who):
    L = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".index(letter) + 1
    return (f'<aside class="rail {variant}"><div class="dots"></div>'
            f'<div class="run"><span class="wm">bits<i>&amp;bytes</i>™</span><span>overclock · a–z</span></div>'
            f'<div class="L">{letter}</div><div class="of">chapter {L:02d} of 26</div><h1>{title}</h1>'
            f'<div class="lede">{lede}</div>'
            f'<div class="for"><div class="k">read this if you\'re</div>{"".join(f"<span>{w}</span>" for w in who)}</div></aside>')


def card(variant, label, title, body):
    return (f'<div class="card {variant}" style="width:78mm"><div class="label">{label}</div>'
            f'<h3 style="margin-top:1mm">{title}</h3><div class="rule"></div><p class="small">{body}</p></div>')


def build_assets():
    A = []
    # 1. name & wordmark
    s = "name"
    A.append(asset("wordmark-overclock-burgundy", "overclock, burgundy", s,
                   '<div class="wm-oc" style="color:var(--burgundy); text-shadow:6px 6px 0 var(--ink)">overclock</div>',
                   note="Anton, uppercase, 6px ink offset shadow"))
    A.append(asset("wordmark-overclock-cream", "overclock, cream", s,
                   '<div class="wm-oc" style="color:var(--cream); text-shadow:6px 6px 0 var(--ink)">overclock</div>',
                   tile="dark", note="for dark and gradient grounds"))
    A.append(asset("wordmark-overclock-on-burn", "overclock on the burn", s,
                   f'<div style="background:{GRADIENTS[0][3]}; padding:12mm 16mm; position:relative">'
                   '<div class="dots" style="position:absolute; inset:0; background-image:radial-gradient(circle, rgba(254,233,207,.13) 1.1px, transparent 1.5px); background-size:9px 9px"></div>'
                   '<div class="wm-oc" style="position:relative; color:var(--cream); text-shadow:6px 6px 0 var(--ink)">overclock</div>'
                   '<div class="tagline" style="position:relative; margin-top:5mm; color:var(--cream)"><div class="redbar"></div><span>past the redline.</span></div></div>',
                   bg="clear", note="the cover lockup: wordmark, redbar, tagline"))
    A.append(asset("tagline-ink", "past the redline., ink", s,
                   '<div class="tagline"><div class="redbar"></div><span>past the redline.</span></div>',
                   note="Yellowtail script with the glowing red bar"))
    A.append(asset("tagline-cream", "past the redline., cream", s,
                   '<div class="tagline" style="color:var(--cream)"><div class="redbar"></div><span>past the redline.</span></div>', tile="dark"))
    bb = ('<div class="bb"><img src="public/logo.svg" alt=""><div class="wm"><span class="b">bits</span>'
          '<span class="s">&amp;bytes</span><span class="tm">™</span></div></div>')
    A.append(asset("lockup-bitsnbytes-overclock", "bits&bytes™ + overclock", s,
                   f'<div class="lock">{bb}<div class="x"></div><div class="wm-oc">overclock</div></div>', tile="dark",
                   note="white cube, so dark grounds only"))
    A.append(asset("lockup-bitsnbytes-overclock-burgundy", "bits&bytes™ + overclock, on burgundy", s,
                   f'<div style="background:var(--burgundy); padding:9mm 11mm"><div class="lock">{bb}<div class="x"></div><div class="wm-oc">overclock</div></div></div>'))
    A.append(asset("lockup-techfest", "part of Techfest, IIT Bombay", s,
                   '<div class="tf"><img src="tmp/overclock/assets/techfest-logo.svg" alt=""><div class="mono">part of<b>Techfest</b>IIT Bombay</div></div>',
                   note="the only other logo we ever show"))
    A.append(asset("lockup-techfest-clear", "part of Techfest, clear", s,
                   '<div class="tf clear"><img src="tmp/overclock/assets/techfest-logo.svg" alt=""><div class="mono">part of<b>Techfest</b>IIT Bombay</div></div>', tile="dark"))
    A.append(asset("logo-bitsnbytes-cube", "bits&bytes™ cube", s, '<img src="public/logo.svg" style="width:60mm; display:block" alt="">', tile="dark"))
    A.append(asset("logo-techfest", "Techfest logo", s, '<img src="tmp/overclock/assets/techfest-logo.svg" style="height:40mm; display:block" alt="">', tile="dark"))

    # 2. colour
    for group, rows in SWATCHES:
        for var, name, role in rows:
            hx = ROOTVARS[var]
            A.append(asset(f"swatch-{var}", name, "colour",
                           f'<div class="sw"><div class="c" style="background:{hx}"></div><div class="t"><b>{name}</b>'
                           f'<div class="mono">{hx.upper()} · --{var}</div><p>{role}</p></div></div>',
                           note=role, group=group, hex=hx.upper()))
    for slug, name, role, g in GRADIENTS:
        A.append(asset(slug, name, "colour",
                       f'<div class="sw gr"><div class="c" style="background:{g}"></div><div class="t"><b>{name}</b>'
                       f'<p>{role}</p></div></div>', note=role, group="gradients"))

    # 3. type
    s = "type"
    specs = [
        ("type-display", "display", "Anton · 124pt cover / 168pt rail letter · uppercase, .84 leading",
         '<div class="display" style="font-size:72pt; line-height:.84">overclock</div>'),
        ("type-quote", "quote", "Anton · 20pt · uppercase, burgundy em",
         '<div class="quote">running a chip <em>past the clock it was rated for.</em></div>'),
        ("type-h2", "h2", "Anton · 17pt · uppercase, mono number",
         '<h2><span class="n">01</span>the day, hour by hour</h2><div class="rule"></div>'),
        ("type-h3", "h3", "Anton · 12.5pt · uppercase", '<h3>a hacker house at 2 am, for 700</h3>'),
        ("type-label", "label", "Space Mono Bold · 6.4pt · +.16em, uppercase, warm", '<div class="label">the push · hardcore</div>'),
        ("type-lead", "lead", "Georgia · 12.2pt · 1.4 leading, burgundy bold",
         '<p class="lead">it takes two things: the nerve to push, and cooling good enough to survive the push. <b>you bring the push. we bring the cooling.</b></p>'),
        ("type-body", "body", "Georgia · 9.4pt · 1.45 leading",
         '<p>a nationwide, in-person, freestyle hackathon for teenagers. sixteen city qualifiers, twelve hours each. every city\'s winning team goes to IIT Bombay on Dec 17–18 to build again from zero.</p>'),
        ("type-small", "small", "Georgia · 8.2pt (tiny 7pt) · 1.4 leading",
         '<p class="small">ship to a live URL, ring the bell, and the whole room cheers.</p><p class="tiny muted">tiny: captions, footnotes, stat notes.</p>'),
        ("type-mono", "mono", "Space Mono Bold · 5.8–7.4pt · +.14em, uppercase",
         '<div class="mono" style="font-size:7.4pt">overclock · the event document · rev. sep 28, 2026</div>'),
        ("type-script", "script", "Yellowtail · 34pt · the tagline only", '<div class="script" style="font-size:34pt">past the redline.</div>'),
        ("type-wordmark", "wordmark", "Archivo Black + Yellowtail · the bits&bytes™ wordmark",
         '<div class="bb" style="color:var(--ink)"><div class="wm"><span class="b">bits</span><span class="s">&amp;bytes</span><span class="tm">™</span></div></div>'),
    ]
    for slug, name, note, inner in specs:
        A.append(asset(slug, name, s, f'<div class="spec"><div>{inner}</div><div class="k">{note}</div></div>', bg="paper", note=note))
    scale = [("rail letter", "Anton", "168pt"), ("cover title", "Anton", "124pt"), ("stat number", "Anton", "24pt"),
             ("quote", "Anton", "20pt"), ("h2", "Anton", "17pt"), ("h3", "Anton", "12.5pt"), ("lead", "Georgia", "12.2pt"),
             ("body", "Georgia", "9.4pt"), ("small", "Georgia", "8.2pt"), ("tiny", "Georgia", "7pt"),
             ("label", "Space Mono Bold", "6.4pt"), ("chip", "Space Mono Bold", "6.2pt")]
    A.append(asset("type-scale", "the size scale", s,
                   '<div class="spec"><table class="grid"><tr><th>role</th><th>font</th><th>size</th></tr>'
                   + "".join(f"<tr><td>{r}</td><td>{f}</td><td>{z}</td></tr>" for r, f, z in scale) + "</table></div>",
                   bg="paper", note="A4 landscape print sizes; scale proportionally for screens"))

    # 4. motif
    A.append(asset("motif", "the motif", "motif",
                   '<div class="spec" style="width:200mm"><div class="label">what the word means</div>'
                   '<div class="quote" style="margin-top:1.6mm">overclocking is running a chip <em>past the clock it was rated for.</em> on purpose.</div>'
                   '<p class="lead" style="margin-top:2.6mm">it takes two things: the nerve to push, and cooling good enough to survive the push. <b>you bring the push. we bring the cooling.</b></p></div>',
                   bg="paper"))

    # 5. elements
    s = "elements"
    A.append(asset("dial-stock", "clock dial · stock", s, dial(4.2, "4 200 MHz", "STOCK CLOCK"), note="needle at the rated clock"))
    A.append(asset("dial-boost", "clock dial · boost", s, dial(4.8, "4 800 MHz", "+600 MHz OC"), note="pushed, still under the redline"))
    A.append(asset("dial-redline", "clock dial · redline", s, dial(5.4, "5 400 MHz", "+1 200 MHz OC"), note="in the red"))
    A.append(asset("dial-past", "clock dial · past the redline", s, dial(6.25, "6 250 MHz", "+2 050 MHz OC"), note="the cover state: needle past the scale"))
    A.append(asset("oc-panel", "OC slider panel", s,
                   '<div class="oc" style="width:120mm"><div class="hd"><span>overclock · the day\'s settings</span><i>profile 01</i></div>'
                   '<div class="sl"><span class="k">core clock</span><span class="tr"><b style="width:94%"></b><span class="stock" style="left:62%"></span></span><span class="v">12 hrs</span></div>'
                   '<div class="sl"><span class="k">power limit</span><span class="tr"><b style="width:100%"></b></span><span class="v">max</span></div>'
                   '<div class="sl"><span class="k">temp limit</span><span class="tr"><b style="width:88%"></b></span><span class="v">no throttle</span></div>'
                   '<div class="sl"><span class="k">cores (team)</span><span class="tr"><b style="width:66%"></b></span><span class="v">2–4</span></div>'
                   '<div class="sl"><span class="k">entry fee</span><span class="tr"><b style="width:0%"></b></span><span class="v">₹0</span></div>'
                   '<div class="ft"><span class="btn">reset</span><span class="prof"><i class="on">1</i><i class="on">2</i><i class="on">3</i><i class="on">4</i><i class="on">5</i></span><span class="btn go">✓ ship</span></div></div>'))
    A.append(asset("monitor", "monitor graph", s,
                   '<div class="mon" style="width:120mm"><div class="hd"><span>the redline board · core clock</span><b>illustrative</b></div>'
                   '<svg class="graph" data-points="12,12,16,16,16,21,25,25,30,30,34,39,39,43,48,48,52,57,61,61,66,70,75,79,84,88,93" data-limit="80" data-max="100"></svg>'
                   '<div class="xs"><span>09:00</span><span>11:00</span><span>13:00</span><span>15:00</span><span>17:30</span></div>'
                   '<div class="ro"><span>last push</span><span class="readout">14:32:07</span></div></div>',
                   note="dashed red line = the redline, the rated limit"))
    A.append(asset("readout", "digital readout", s,
                   '<span class="readout" style="font-size:14pt">17:30:00</span> <span class="readout" style="font-size:14pt; margin-left:3mm">T-28</span>'))
    L = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    A.append(asset("az-meter", "A–Z redline meter", s,
                   '<div class="meter"><span class="t">overclock · the event document</span><span class="scale">'
                   + "".join(f'<i class="{" ".join(c for c in ["done" if j < 8 else "", "now" if j == 8 else "", "red" if j >= 22 else ""] if c)}">{x}</i>' for j, x in enumerate(L))
                   + '</span><span class="pg">11 <small>/ 33</small></span></div>',
                   bg="paper", note="the folio: done in ink, current letter in red, W–Z in the red zone"))
    for variant, letter, title in [("", "A", "overclock, in one breath"), ("ink", "O", "the room"),
                                   ("orange", "C", "the calendar"), ("grad", "K", "overclock at IIT Bombay"), ("deep", "Z", "zero to shipped")]:
        name = variant or "burgundy"
        A.append(asset(f"rail-{name}", f"rail · {name}", s,
                       rail(variant, letter, title, "the chapter's one-line lede sits here, in Georgia on the rail.", ["everyone", "crew"]),
                       note="70mm wide, full page height in the doc"))
    A.append(asset("tbd-chip", "tbd chip", s,
                   '<span class="tbd" style="font-size:12pt"></span> <span class="tbd" style="font-size:12pt; margin-left:3mm">dates &amp; cities tbd</span>',
                   note="dashed red: anything not yet locked"))
    A.append(asset("chips", "chips", s,
                   '<div style="font-size:0">' + "".join(f'<span class="chip {c}" style="font-size:12pt; margin-right:3mm">{t}</span>'
                                                       for c, t in [("", "paper"), ("ink", "ink"), ("orange", "orange"), ("burg", "burgundy")]) + "</div>"))
    A.append(asset("stamp", "stamp", s, '<span class="stamp" style="font-size:14pt">final · rev. sep 28</span>'))
    A.append(asset("callout", "callout", s,
                   '<div class="callout" style="width:120mm"><div class="label">the one-line version</div>'
                   '<p style="font-size:10.6pt; margin-top:.8mm">sixteen cities, twelve hours each, one team per city goes to IIT Bombay. ship something real, and tell the truth about it.</p></div>'))
    A.append(asset("callout-light", "callout · light", s,
                   '<div class="callout light" style="width:120mm"><div class="label">heads up</div>'
                   '<p style="font-size:10.6pt; margin-top:.8mm">qualifiers get postponed, never cancelled.</p></div>'))
    for v, lab, t, b in [("", "the push · hardcore", "a billion-dollar startup in 12 hours", "a working product, live on a real URL by the evening."),
                         ("dark", "past the redline · the ethos", "all in, and honest about it", "no half-builds, no excuses, no throttling. and no faked numbers, ever."),
                         ("cream", "the cooling · cozy", "a hacker house at 2 am, for 700", "warm lamps, couches, a quiet room, power at every seat."),
                         ("burg", "the finale", "overclock at IIT Bombay", "16 winning teams build again from zero, Dec 17–18."),
                         ("orange", "the ship bell", "deploy, then ring it", "ship to a live URL, ring the bell, and the whole room cheers."),
                         ("dash", "open slot", "still being decided", "dashed cards hold anything that isn't locked yet.")]:
        A.append(asset(f"card-{v or 'paper'}", f"card · {v or 'paper'}", s, card(v, lab, t, b)))
    A.append(asset("stat-tiles", "stat tiles", s,
                   '<div class="stats" style="width:180mm"><div class="stat"><b>16</b><small>in-person city qualifiers</small></div>'
                   '<div class="stat"><b>12 HRS</b><small>door to door. no overnights</small></div>'
                   '<div class="stat"><b>2–4</b><small>builders per team. free, always</small></div>'
                   '<div class="stat dark"><b>DEC 17–18</b><small>overclock at IIT Bombay</small></div></div>'))
    A.append(asset("flow", "flow", s,
                   '<div class="flow" style="width:230mm"><div><span class="k">01</span><b>fork lead applies</b><p>someone applies to run their city.</p></div>'
                   '<div><span class="k">02</span><b>city gets a slot</b><p>an accepted lead gets one of q01–q16.</p></div>'
                   '<div class="warm"><span class="k">03</span><b>the qualifier</b><p>12 hours, door to door.</p></div>'
                   '<div><span class="k">04</span><b>the city winner</b><p>one team per city goes on.</p></div>'
                   '<div class="hot"><span class="k">05</span><b>the champion</b><p>one team takes the overclock title.</p></div></div>'))
    A.append(asset("rubric", "rubric bar", s,
                   '<div class="rubric" style="width:200mm">'
                   + "".join(f'<div class="c{i + 1}" style="flex:{w}"><b>{w}</b><span class="nm">{n}</span></div>'
                             for i, (w, n) in enumerate([(25, "it's real, working &amp; live"), (20, "real users &amp; usage"), (15, "distribution"),
                                                         (15, "GTM"), (15, "UX / UI"), (10, "tech depth")])) + "</div>"))
    A.append(asset("table-run", "run-of-show table", s,
                   '<table class="run" style="width:130mm">' + "".join(
                       f'<tr class="{c}"><td>{t}</td><td>{d}</td></tr>' for t, d, c in
                       [("08:00", "doors open. check-in and breakfast.", ""), ("09:00", "the clock starts.", "hot"),
                        ("13:00", "check-in closes.", ""), ("17:30", "code freeze.", "hot"), ("19:45", "the city winner.", ""), ("20:00", "home.", "")]) + "</table>",
                   bg="paper"))
    A.append(asset("table-spec", "spec table", s,
                   '<table class="kv" style="width:130mm"><tr><td>cost</td><td>free. no fee, no deposit.</td></tr>'
                   '<tr><td>team</td><td>2 to 4 builders, at least 2 attend.</td></tr>'
                   '<tr><td>platform</td><td>being finalised <span class="tbd"></span></td></tr>'
                   '<tr><td>never asks</td><td>a copy or scan of your ID.</td></tr></table>', bg="paper"))
    A.append(asset("table-grid", "grid table", s,
                   '<table class="grid" style="width:130mm"><tr><th>tier</th><th>per city</th></tr>'
                   '<tr><td>Bronze</td><td>₹1L</td></tr><tr><td>Silver</td><td>₹2.5L</td></tr><tr><td>Gold</td><td>₹3.5L</td></tr><tr><td>Platinum</td><td>₹5L</td></tr></table>',
                   bg="paper"))
    A.append(asset("checklist", "checklist", s,
                   '<ul class="check" style="width:90mm"><li class="on">AI tools, as much as you like</li><li class="on">libraries and frameworks</li>'
                   '<li class="on">your own hardware, or pure software</li><li>slides</li></ul>', bg="paper"))
    A.append(asset("lists", "lists", s,
                   '<div class="cols-3" style="width:200mm"><ul class="list small"><li>freestyle: any idea, any stack</li><li>in person, in 16 cities</li></ul>'
                   '<ul class="x small"><li>a slide contest or a quiz</li><li>an overnight</li></ul>'
                   '<ol class="steps small"><li>ship to a live URL</li><li>ring the bell</li></ol></div>', bg="paper",
                   note="diamond list, × list, numbered steps"))
    A.append(asset("texture-halftone", "halftone", s, '<div class="tex halftone" style="background-color:var(--paper)"></div>', note="7px ink dots on paper"))
    A.append(asset("texture-dots", "rail dots", s, '<div class="tex dots"></div>', note="8px cream dots on burgundy"))
    A.append(asset("texture-photo", "photo halftone", s, '<div class="tex photo-dots"></div>', note="5px multiply dots over photos"))
    A.append(asset("star", "star", s, '<span class="star" style="font-size:40mm; color:var(--orange)"></span>'))
    A.append(asset("redbar", "redbar", s, '<div class="redbar" style="width:120mm"></div>', note="3px red with a 10px glow"))
    return A


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for old in OUT.glob("*.png"):
        old.unlink()
    doc = f"""<!DOCTYPE html><html><head><meta charset="UTF-8"><base href="{ROOT.as_uri()}/">
<style>{CSS}{KIT_CSS}</style></head><body>{"".join(build_assets())}<script>{JS}</script></body></html>"""
    src = OC / "preview" / "assets.html"
    src.parent.mkdir(parents=True, exist_ok=True)
    src.write_text(doc, encoding="utf-8")

    items = []
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={"width": 1420, "height": 1000}, device_scale_factor=3)
        pg.goto(src.as_uri())
        pg.wait_for_selector("body[data-ready]")
        pg.evaluate("document.fonts.ready")
        pg.wait_for_timeout(300)
        for el in pg.query_selector_all(".asset"):
            d = el.evaluate("e => ({...e.dataset})")
            box = el.bounding_box()
            opaque = el.evaluate("e => e.classList.length > 1")
            el.screenshot(path=str(OUT / f"{d['slug']}.png"), omit_background=not opaque)
            items.append({**d, "w": round(box["width"]), "h": round(box["height"])})

        # layouts: the real pages of the finished doc
        az = b.new_page(device_scale_factor=2)
        az.set_viewport_size({"width": 1400, "height": 1000})
        az.goto((ROOT / "overclock_a-z.html").as_uri())
        az.wait_for_selector("body[data-ready]")
        az.evaluate("document.fonts.ready")
        pages = az.query_selector_all(".page")
        for i, slug, title in [(0, "layout-cover", "the cover"), (1, "layout-contents", "the contents"), (2, "layout-chapter", "a chapter page (A)")]:
            box = pages[i].bounding_box()
            pages[i].screenshot(path=str(OUT / f"{slug}.png"))
            items.append({"slug": slug, "title": title, "section": "layouts", "tile": "light", "note": "A4 landscape, 297 × 210 mm",
                          "w": round(box["width"]), "h": round(box["height"])})
        b.close()

    (OUT / "manifest.json").write_text(json.dumps(items, indent=1, ensure_ascii=False), encoding="utf-8")
    with zipfile.ZipFile(OUT / "overclock-brandkit.zip", "w", zipfile.ZIP_DEFLATED) as z:
        for f in sorted(OUT.glob("*.png")):
            z.write(f, f"overclock-brandkit/{f.name}")
    print(f"{len(items)} PNGs + manifest.json + overclock-brandkit.zip -> {OUT}")


if __name__ == "__main__":
    main()
