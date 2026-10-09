"""Stage 3a: illustration test sheet for the series style (original SVG, rig-ready groups).

Every character is built from the same parts (head, hair, crown, face, torso, sash, dhoti, arms, legs) so the
React/Remotion port in Stage 4 can animate each part. Writes design/illustration-test-sheet.svg (+ .png via resvg).
"""
import subprocess
from pathlib import Path

HERE = Path(__file__).resolve().parent
INK = "#3A2418"
GOLD, GOLD_HI = "#E8B23A", "#F7D774"
BLUSH = "#E8806A"

PAL = {
    "dawn cream": "#FBE9C6", "saffron sky": "#F4A95A", "day sky": "#CFE6EA", "leaf dark": "#2F6B45",
    "leaf mid": "#4E9A5E", "leaf light": "#8CC27A", "earth": "#D9A066", "wood": "#A86B3C",
    "gold": GOLD, "focus ring": "#FFD34D", "ink": INK, "paper": "#F7EEDC",
}


def S(d, fill, sw=4, extra=""):
    return f'<path d="{d}" fill="{fill}" stroke="{INK}" stroke-width="{sw}" stroke-linejoin="round" stroke-linecap="round" {extra}/>'


def limb(points, color, w=30):
    d = "M" + " L".join(f"{x},{y}" for x, y in points)
    return (f'<path d="{d}" fill="none" stroke="{INK}" stroke-width="{w + 8}" stroke-linecap="round" stroke-linejoin="round"/>'
            f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round"/>')


# ---------------- faces ----------------
def face(expr, cx=200, cy=195, skin="#A86E47", angry=0.0):
    ex, ey = 28, 0
    o = []
    # blush / anger tint (anger rises from chin to forehead; never a full-frame flash)
    if angry > 0:
        gid = f"ang{cx}{cy}{int(angry * 100)}"
        o.append(f'<defs><linearGradient id="{gid}" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#E04B3A" stop-opacity="{0.55 * angry}"/>'
                 f'<stop offset="{0.35 + 0.6 * angry}" stop-color="#E04B3A" stop-opacity="{0.4 * angry}"/><stop offset="1" stop-color="#E04B3A" stop-opacity="0"/></linearGradient></defs>'
                 f'<ellipse cx="{cx}" cy="{cy}" rx="66" ry="72" fill="url(#{gid})"/>')
    o.append(f'<ellipse cx="{cx - 42}" cy="{cy + 26}" rx="13" ry="8" fill="{BLUSH}" opacity=".45"/>')
    o.append(f'<ellipse cx="{cx + 42}" cy="{cy + 26}" rx="13" ry="8" fill="{BLUSH}" opacity=".45"/>')
    # eyes
    for s in (-1, 1):
        x = cx + s * ex
        if expr in ("laugh", "happy_closed"):
            o.append(f'<path d="M{x - 11},{cy + 2} Q{x},{cy - 10} {x + 11},{cy + 2}" fill="none" stroke="{INK}" stroke-width="5" stroke-linecap="round"/>')
        elif expr == "focused":
            o.append(f'<path d="M{x - 11},{cy - 1} Q{x},{cy - 6} {x + 11},{cy - 1} L{x + 9},{cy + 5} Q{x},{cy + 8} {x - 9},{cy + 5}Z" fill="{INK}"/>')
            o.append(f'<circle cx="{x - 2}" cy="{cy}" r="2.2" fill="#fff"/>')
        elif expr == "surprised":
            o.append(f'<ellipse cx="{x}" cy="{cy}" rx="10" ry="13" fill="#fff" stroke="{INK}" stroke-width="3.5"/><circle cx="{x}" cy="{cy + 1}" r="5.5" fill="{INK}"/>')
        else:
            o.append(f'<ellipse cx="{x}" cy="{cy}" rx="8" ry="11" fill="{INK}"/><circle cx="{x - 2.5}" cy="{cy - 4}" r="3" fill="#fff"/>')
    # brows
    brow = {
        "calm": [(-1, -24, -18, -27), (1, -24, -18, -27)],
        "focused": [(-1, -19, -14, -17), (1, -19, -14, -17)],
        "smug": [(-1, -30, -20, -34), (1, -22, -16, -20)],
        "angry": [(-1, -26, -14, -16), (1, -26, -14, -16)],
        "laugh": [(-1, -28, -20, -32), (1, -28, -20, -32)],
        "surprised": [(-1, -34, -28, -38), (1, -34, -28, -38)],
        "smile": [(-1, -25, -19, -29), (1, -25, -19, -29)],
        "happy_closed": [(-1, -25, -19, -29), (1, -25, -19, -29)],
        "stern": [(-1, -22, -16, -19), (1, -22, -16, -19)],
    }[expr]
    for s, y_out, y_in_x, y_mid in brow:
        x = cx + s * ex
        o.append(f'<path d="M{x - s * 13},{cy + y_out} Q{x},{cy + y_mid} {x + s * 13},{cy + y_out + (y_in_x - y_out) * 0.3}" fill="none" stroke="{INK}" stroke-width="5" stroke-linecap="round"/>')
    # nose
    o.append(f'<path d="M{cx + 1},{cy + 12} q-7,13 3,15" fill="none" stroke="{INK}" stroke-width="3.5" stroke-linecap="round" opacity=".7"/>')
    # mouth
    my = cy + 42
    m = {
        "calm": f'<path d="M{cx - 12},{my} Q{cx},{my + 7} {cx + 12},{my}" fill="none" stroke="{INK}" stroke-width="4.5" stroke-linecap="round"/>',
        "smile": f'<path d="M{cx - 18},{my - 3} Q{cx},{my + 16} {cx + 18},{my - 3}Z" fill="#8C2F2A" stroke="{INK}" stroke-width="4" stroke-linejoin="round"/>',
        "happy_closed": f'<path d="M{cx - 18},{my - 3} Q{cx},{my + 16} {cx + 18},{my - 3}Z" fill="#8C2F2A" stroke="{INK}" stroke-width="4" stroke-linejoin="round"/>',
        "focused": f'<path d="M{cx - 10},{my + 1} L{cx + 10},{my + 1}" stroke="{INK}" stroke-width="4.5" stroke-linecap="round"/>',
        "smug": f'<path d="M{cx - 14},{my + 2} Q{cx + 4},{my + 6} {cx + 18},{my - 6}" fill="none" stroke="{INK}" stroke-width="4.5" stroke-linecap="round"/>',
        "laugh": f'<path d="M{cx - 22},{my - 6} Q{cx},{my + 26} {cx + 22},{my - 6}Z" fill="#8C2F2A" stroke="{INK}" stroke-width="4" stroke-linejoin="round"/><path d="M{cx - 12},{my + 9} Q{cx},{my + 3} {cx + 12},{my + 9}" fill="#E8806A"/>',
        "angry": f'<path d="M{cx - 14},{my + 6} Q{cx},{my - 6} {cx + 14},{my + 6}" fill="none" stroke="{INK}" stroke-width="4.5" stroke-linecap="round"/>',
        "surprised": f'<ellipse cx="{cx}" cy="{my + 3}" rx="9" ry="12" fill="#8C2F2A" stroke="{INK}" stroke-width="4"/>',
        "stern": f'<path d="M{cx - 12},{my + 2} L{cx + 12},{my + 2}" stroke="{INK}" stroke-width="4.5" stroke-linecap="round"/>',
    }[expr]
    o.append(m)
    return "".join(o)


def crown(kind, cx=200, top=112):
    if kind == "big":  # Duryodhana: tall, showy (pride = inflated shapes)
        return (S(f"M{cx - 62},{top + 30} L{cx - 58},{top - 40} L{cx - 32},{top - 5} L{cx},{top - 72} L{cx + 32},{top - 5} L{cx + 58},{top - 40} L{cx + 62},{top + 30}Z", GOLD)
                + f'<circle cx="{cx}" cy="{top - 8}" r="13" fill="#C8283A" stroke="{INK}" stroke-width="3.5"/>'
                + f'<circle cx="{cx - 58}" cy="{top - 40}" r="7" fill="{GOLD_HI}" stroke="{INK}" stroke-width="3"/><circle cx="{cx + 58}" cy="{top - 40}" r="7" fill="{GOLD_HI}" stroke="{INK}" stroke-width="3"/>'
                + f'<circle cx="{cx}" cy="{top - 72}" r="8" fill="{GOLD_HI}" stroke="{INK}" stroke-width="3"/>'
                + f'<rect x="{cx - 64}" y="{top + 18}" width="128" height="18" rx="6" fill="{GOLD_HI}" stroke="{INK}" stroke-width="3.5"/>')
    if kind == "small":  # Arjuna: small, neat, teal gem
        return (S(f"M{cx - 48},{top + 26} L{cx - 40},{top - 6} L{cx - 18},{top + 8} L{cx},{top - 26} L{cx + 18},{top + 8} L{cx + 40},{top - 6} L{cx + 48},{top + 26}Z", GOLD)
                + f'<circle cx="{cx}" cy="{top + 6}" r="8" fill="#1F8A8A" stroke="{INK}" stroke-width="3"/>'
                + f'<rect x="{cx - 50}" y="{top + 18}" width="100" height="13" rx="5" fill="{GOLD_HI}" stroke="{INK}" stroke-width="3"/>')
    if kind == "modest":  # Yudhishthira: low band with pearls
        pearls = "".join(f'<circle cx="{cx + i * 18}" cy="{top + 4}" r="5.5" fill="#FFF8E8" stroke="{INK}" stroke-width="2.5"/>' for i in range(-2, 3))
        return (S(f"M{cx - 52},{top + 28} Q{cx},{top - 22} {cx + 52},{top + 28}Z", GOLD) + pearls
                + f'<rect x="{cx - 54}" y="{top + 18}" width="108" height="14" rx="5" fill="{GOLD_HI}" stroke="{INK}" stroke-width="3"/>')
    return ""


def head(skin, hair="#1E1410", crown_kind="small", expr="calm", angry=0.0, cx=200, cy=195, style="bob", mustache=False):
    """style: bob | ponytail (Arjuna) | curly (Yudhishthira) | crop (Bhima) | wavy (Duryodhana) | braids (girl)."""
    o = []
    # ---- hair behind the head ----
    if style == "braids":
        for s in (-1, 1):
            bx = cx + s * 64
            o.append(S(f"M{bx - 14},{cy - 10} Q{bx + s * 16},{cy + 80} {bx + s * 6},{cy + 140} L{bx + s * 22},{cy + 140} Q{bx + s * 30},{cy + 70} {bx + 14},{cy - 10}Z", hair))
            o.append(f'<path d="M{bx + s * 4},{cy + 128} l{s * -12},16 m{s * 12},-16 l{s * 18},14" stroke="#D2303A" stroke-width="9" stroke-linecap="round"/>')
    elif style == "ponytail":
        o.append(S(f"M{cx + 30},{cy - 78} Q{cx + 124},{cy - 64} {cx + 114},{cy + 56} Q{cx + 106},{cy + 128} {cx + 136},{cy + 172} Q{cx + 78},{cy + 152} {cx + 84},{cy + 60} Q{cx + 88},{cy - 16} {cx + 20},{cy - 58}Z", hair))
        o.append(f'<ellipse cx="{cx}" cy="{cy - 6}" rx="75" ry="81" fill="{hair}" stroke="{INK}" stroke-width="4"/>')
        o.append(S(f"M{cx + 76},{cy - 64} l18,-14 l4,22 l18,4 l-16,14Z", "#1F8A8A", 3))  # teal hair tie
    elif style == "curly":
        o.append(S(f"M{cx - 78},{cy - 10} Q{cx - 82},{cy - 94} {cx},{cy - 94} Q{cx + 82},{cy - 94} {cx + 78},{cy - 10} L{cx + 78},{cy + 66} L{cx - 78},{cy + 66}Z", hair))
        o.append("".join(f'<circle cx="{cx + s * (64 + k * 4)}" cy="{cy + 20 + k * 22}" r="17" fill="{hair}" stroke="{INK}" stroke-width="4"/>' for s in (-1, 1) for k in range(3)))
    elif style == "crop":
        o.append(f'<ellipse cx="{cx}" cy="{cy - 8}" rx="72" ry="78" fill="{hair}" stroke="{INK}" stroke-width="4"/>')
    elif style == "wavy":
        o.append(S(f"M{cx - 78},{cy - 10} Q{cx - 84},{cy - 94} {cx},{cy - 94} Q{cx + 84},{cy - 94} {cx + 78},{cy - 10} L{cx + 80},{cy + 86} L{cx - 80},{cy + 86}Z", hair))
        o.append("".join(f'<circle cx="{cx + s * 74}" cy="{cy + 92}" r="19" fill="{hair}" stroke="{INK}" stroke-width="4"/>' for s in (-1, 1)))
    else:
        o.append(S(f"M{cx - 76},{cy - 10} Q{cx - 80},{cy - 92} {cx},{cy - 92} Q{cx + 80},{cy - 92} {cx + 76},{cy - 10} L{cx + 72},{cy + 58} Q{cx + 50},{cy + 70} {cx + 44},{cy + 40} L{cx - 44},{cy + 40} Q{cx - 50},{cy + 70} {cx - 72},{cy + 58}Z", hair))
    # ears + earrings
    for s in (-1, 1):
        o.append(f'<ellipse cx="{cx + s * 70}" cy="{cy + 6}" rx="13" ry="17" fill="{skin}" stroke="{INK}" stroke-width="4"/>')
        if style != "braids":
            o.append(f'<circle cx="{cx + s * 71}" cy="{cy + 30}" r="8" fill="none" stroke="{GOLD}" stroke-width="5"/>')
    o.append(f'<ellipse cx="{cx}" cy="{cy}" rx="68" ry="74" fill="{skin}" stroke="{INK}" stroke-width="4"/>')
    # ---- fringe ----
    if style == "ponytail":  # neat, side-swept, pulled back
        o.append(S(f"M{cx - 68},{cy - 8} Q{cx - 66},{cy - 78} {cx},{cy - 80} Q{cx + 66},{cy - 78} {cx + 68},{cy - 8} Q{cx + 54},{cy - 58} {cx - 6},{cy - 56} Q{cx - 50},{cy - 44} {cx - 68},{cy - 8}Z", hair))
    elif style == "crop":  # short spiky crop
        o.append(S(f"M{cx - 68},{cy - 16} Q{cx - 64},{cy - 82} {cx},{cy - 84} Q{cx + 64},{cy - 82} {cx + 68},{cy - 16} L{cx + 52},{cy - 42} L{cx + 36},{cy - 32} L{cx + 20},{cy - 46} L{cx},{cy - 34} L{cx - 20},{cy - 46} L{cx - 36},{cy - 32} L{cx - 52},{cy - 42}Z", hair))
    elif style == "curly":
        o.append(S(f"M{cx - 68},{cy - 8} Q{cx - 66},{cy - 78} {cx},{cy - 80} Q{cx + 66},{cy - 78} {cx + 68},{cy - 8} Q{cx + 44},{cy - 40} {cx + 30},{cy - 54} Q{cx + 16},{cy - 40} {cx},{cy - 54} Q{cx - 16},{cy - 40} {cx - 30},{cy - 54} Q{cx - 44},{cy - 40} {cx - 68},{cy - 8}Z", hair))
    else:
        o.append(S(f"M{cx - 68},{cy - 8} Q{cx - 66},{cy - 78} {cx},{cy - 80} Q{cx + 66},{cy - 78} {cx + 68},{cy - 8} Q{cx + 40},{cy - 48} {cx + 4},{cy - 50} Q{cx - 34},{cy - 50} {cx - 68},{cy - 8}Z", hair))
    if style == "braids":
        o.append(f'<circle cx="{cx}" cy="{cy - 30}" r="4.5" fill="#C8283A"/>')  # small bindi
    else:
        o.append(f'<path d="M{cx},{cy - 42} l0,16" stroke="#C8283A" stroke-width="6" stroke-linecap="round"/>')  # tilak
    o.append(face(expr, cx, cy, skin, angry))
    if mustache:  # Yudhishthira, the eldest: a thin young moustache
        o.append(f'<path d="M{cx - 20},{cy + 35} Q{cx - 9},{cy + 28} {cx},{cy + 32} Q{cx + 9},{cy + 28} {cx + 20},{cy + 35}" fill="none" stroke="{INK}" stroke-width="5" stroke-linecap="round"/>')
    if crown_kind == "headband":  # Bhima: plain gold band, no crown
        o.append(f'<rect x="{cx - 66}" y="{cy - 58}" width="132" height="14" rx="7" fill="{GOLD}" stroke="{INK}" stroke-width="3.5"/>'
                 f'<circle cx="{cx}" cy="{cy - 51}" r="9" fill="{GOLD_HI}" stroke="{INK}" stroke-width="3"/>')
    else:
        o.append(crown(crown_kind, cx, cy - 83))
    return "".join(o)


# Each prince is made distinct by hair, upper garment, build, arm thickness and height (sheet scale).
LOOKS = {
    "arjuna":       dict(skin="#6E4129", dhoti="#F2E6C9", border="#1F8A8A", sash="#1F8A8A", crown_kind="small",  style="ponytail", upper="sash",  bw=0.92, arm=26),
    "yudhishthira": dict(skin="#A86E47", dhoti="#FAF5EA", border="#E9A23B", sash="#E9A23B", crown_kind="modest", style="curly",    upper="shawl", bw=1.0,  arm=28, mustache=True),
    "duryodhana":   dict(skin="#C98B5D", dhoti="#8E2B3A", border="#E8B23A", sash="#5B2A6E", crown_kind="big",    style="wavy",     upper="cape",  bw=1.22, arm=32, belly=True),
    "bhima":        dict(skin="#94603D", dhoti="#3E7D4F", border="#E8B23A", sash="#C8642B", crown_kind="headband", style="crop",   upper="sash",  bw=1.55, arm=40, belly=True),
}


def prince(skin, dhoti, border, sash, crown_kind, expr="calm", bw=1.0, bow=False, angry=0.0, belly=False, tag="",
           style="bob", upper="sash", arm=28, mustache=False):
    cx = 200
    sw, ww, hw = 66 * bw, (62 if belly else 50) * bw, 70 * bw
    o = [f'<g id="{tag}">']
    if upper == "cape":  # Duryodhana: royal cape behind the body
        o.append(f'<g id="{tag}-cape">' + S(f"M{cx - sw - 6},296 L{cx + sw + 6},296 L{cx + sw + 46},650 Q{cx},672 {cx - sw - 46},650Z", "#5B2A6E")
                 + f'<path d="M{cx - sw - 40},640 Q{cx},660 {cx + sw + 40},640" fill="none" stroke="{GOLD}" stroke-width="6"/></g>')
    leg_w = 30 + (bw - 1) * 20
    o.append(f'<g id="{tag}-legs">' + limb([(cx - 24 * bw, 590), (cx - 26 * bw, 712)], skin, leg_w) + limb([(cx + 24 * bw, 590), (cx + 26 * bw, 712)], skin, leg_w)
             + f'<ellipse cx="{cx - 32 * bw}" cy="722" rx="26" ry="11" fill="{skin}" stroke="{INK}" stroke-width="4"/>'
             + f'<ellipse cx="{cx + 32 * bw}" cy="722" rx="26" ry="11" fill="{skin}" stroke="{INK}" stroke-width="4"/>'
             + f'<path d="M{cx - 42 * bw},700 l20,0 M{cx + 22 * bw},700 l20,0" stroke="{GOLD}" stroke-width="5" stroke-linecap="round"/></g>')
    o.append(f'<g id="{tag}-dhoti">' + S(f"M{cx - ww},440 L{cx + ww},440 L{cx + hw},610 Q{cx + 30},620 {cx + 6},598 L{cx - 6},598 Q{cx - 30},620 {cx - hw},610Z", dhoti)
             + S(f"M{cx - 8},446 L{cx + 8},446 L{cx + 14},596 L{cx - 14},596Z", border, 3)
             + f'<path d="M{cx - hw + 4},600 Q{cx - 30},612 {cx - 8},592 M{cx + hw - 4},600 Q{cx + 30},612 {cx + 8},592" fill="none" stroke="{border}" stroke-width="8" stroke-linecap="round"/></g>')
    if belly:
        tor = f"M{cx - sw},298 Q{cx - sw - 8},380 {cx - ww - 4},444 L{cx + ww + 4},444 Q{cx + sw + 8},380 {cx + sw},298 Q{cx},280 {cx - sw},298Z"
    else:
        tor = f"M{cx - sw},298 Q{cx - sw + 2},380 {cx - ww},444 L{cx + ww},444 Q{cx + sw - 2},380 {cx + sw},298 Q{cx},282 {cx - sw},298Z"
    neck = 17 + (bw - 1) * 14
    o.append(f'<g id="{tag}-torso">' + f'<rect x="{cx - neck}" y="255" width="{2 * neck}" height="40" fill="{skin}" stroke="{INK}" stroke-width="4"/>' + S(tor, skin))
    if upper == "shawl":  # Yudhishthira: scholarly shawl over both shoulders
        o.append(S(f"M{cx - sw - 8},300 Q{cx},276 {cx + sw + 8},300 L{cx + sw - 4},424 L{cx + 30},424 Q{cx + 22},344 {cx},334 Q{cx - 22},344 {cx - 30},424 L{cx - sw + 4},424Z", sash)
                 + f'<path d="M{cx - 30},424 Q{cx - 22},344 {cx},334 Q{cx + 22},344 {cx + 30},424" fill="none" stroke="{GOLD}" stroke-width="5"/>')
    else:
        o.append(S(f"M{cx - sw + 6},300 L{cx - sw + 40},296 L{cx + ww + 2},420 L{cx + ww - 26},438Z", sash)
                 + f'<path d="M{cx - sw + 22},300 L{cx + ww - 12},430" stroke="{GOLD}" stroke-width="4" opacity=".9"/>')
    o.append(f'<path d="M{cx - 34},292 Q{cx},330 {cx + 34},292" fill="none" stroke="{GOLD}" stroke-width="7" stroke-linecap="round"/>'
             f'<circle cx="{cx}" cy="318" r="7" fill="#C8283A" stroke="{INK}" stroke-width="2.5"/>')
    o.append(f'<rect x="{cx - ww - 4}" y="430" width="{2 * ww + 8}" height="20" rx="8" fill="{GOLD}" stroke="{INK}" stroke-width="4"/>')
    if upper == "cape":
        o.append("".join(f'<circle cx="{cx + s * (sw - 4)}" cy="302" r="18" fill="{GOLD}" stroke="{INK}" stroke-width="4"/><circle cx="{cx + s * (sw - 4)}" cy="302" r="7" fill="#C8283A"/>' for s in (-1, 1)))
    o.append("</g>")
    lx, rx_ = cx - sw - 4, cx + sw + 4
    hand = 17 + (arm - 28) * 0.4
    o.append(f'<g id="{tag}-armL">' + limb([(lx + 8, 310), (lx - 6, 390), (lx - 2, 465)], skin, arm)
             + f'<path d="M{lx - 12},350 l26,4" stroke="{GOLD}" stroke-width="8" stroke-linecap="round"/>'
             + f'<path d="M{lx - 14},450 l24,2" stroke="{GOLD}" stroke-width="6" stroke-linecap="round"/>'
             + f'<circle cx="{lx - 2}" cy="472" r="{hand}" fill="{skin}" stroke="{INK}" stroke-width="4"/></g>')
    if bow:
        o.append(f'<g id="{tag}-bow">' + bow_svg(lx - 4, 470, 300) + "</g>")
    o.append(f'<g id="{tag}-armR">' + limb([(rx_ - 8, 310), (rx_ + 6, 390), (rx_ + 2, 465)], skin, arm)
             + f'<path d="M{rx_ - 12},354 l26,-4" stroke="{GOLD}" stroke-width="8" stroke-linecap="round"/>'
             + f'<path d="M{rx_ - 10},452 l24,-2" stroke="{GOLD}" stroke-width="6" stroke-linecap="round"/>'
             + f'<circle cx="{rx_ + 2}" cy="472" r="{hand}" fill="{skin}" stroke="{INK}" stroke-width="4"/></g>')
    o.append(f'<g id="{tag}-head">' + head(skin, crown_kind=crown_kind, expr=expr, angry=angry, style=style, mustache=mustache) + "</g>")
    o.append("</g>")
    return "".join(o)


def look(name, expr="calm", **kw):
    p = dict(LOOKS[name]); p.update(kw)
    return prince(p.pop("skin"), p.pop("dhoti"), p.pop("border"), p.pop("sash"), p.pop("crown_kind"), expr, tag=kw.pop("tag", name),
                  **{k: v for k, v in p.items() if k != "tag"})


STRING = "#5A4632"  # darker string so it reads on light skies


def aim_pose(name, expr="focused", tag="aim"):
    """Full draw, Olympic-style anchor: the string hand sits under the chin, IN FRONT of the face.
    Layer order: body → bow arm → bow limbs → head → string + arrow → draw arm (so the string never goes behind the head).
    Aimed up-left at the tree, away from everyone."""
    import re
    cx = 200
    p = LOOKS[name]
    base = look(name, expr, tag=tag)
    base = re.sub(rf'<g id="{tag}-armL">.*?</g>', "", base, flags=re.S)
    base = re.sub(rf'<g id="{tag}-armR">.*?</g>', "", base, flags=re.S)
    head_svg = re.search(rf'<g id="{tag}-head">.*</g></g>$', base, flags=re.S).group(0)[:-4]
    body = base.replace(head_svg, "")[:-4]
    skin, arm = p["skin"], p["arm"]
    sw = 66 * p["bw"]
    hx, hy = cx - 214, 296            # bow hand
    ax, ay = cx + 14, 304             # anchor: just under the chin, front of face
    top, bot = (hx + 24, hy - 128), (hx - 24, hy + 128)   # upper string clears the face by ~15 px
    limbs = (f'<path d="M{top[0]},{top[1]} Q{hx - 80},{hy - 10} {bot[0]},{bot[1]}" fill="none" stroke="{INK}" stroke-width="17" stroke-linecap="round"/>'
             f'<path d="M{top[0]},{top[1]} Q{hx - 80},{hy - 10} {bot[0]},{bot[1]}" fill="none" stroke="#A86B3C" stroke-width="10" stroke-linecap="round"/>'
             f'<circle cx="{top[0]}" cy="{top[1]}" r="7" fill="{GOLD}" stroke="{INK}" stroke-width="3"/><circle cx="{bot[0]}" cy="{bot[1]}" r="7" fill="{GOLD}" stroke="{INK}" stroke-width="3"/>')
    string = f'<path d="M{top[0]},{top[1]} L{ax},{ay} L{bot[0]},{bot[1]}" fill="none" stroke="{STRING}" stroke-width="3.5" stroke-linejoin="round"/>'
    arrow = (f'<path d="M{ax + 6},{ay} L{hx - 66},{hy - 6}" stroke="{INK}" stroke-width="10" stroke-linecap="round"/>'
             f'<path d="M{ax + 6},{ay} L{hx - 66},{hy - 6}" stroke="#C89A5E" stroke-width="5" stroke-linecap="round"/>'
             + S(f"M{hx - 60},{hy - 16} L{hx - 90},{hy - 8} L{hx - 62},{hy + 4} Q{hx - 68},{hy - 6} {hx - 60},{hy - 16}Z", "#8E9AA6", 3))
    armL = limb([(cx - sw + 8, 310), (cx - 130, 302), (hx + 8, hy + 2)], skin, arm) + f'<circle cx="{hx}" cy="{hy}" r="18" fill="{skin}" stroke="{INK}" stroke-width="4"/>'
    armR = limb([(cx + sw - 6, 310), (cx + 150, 312), (ax + 16, ay + 4)], skin, arm) + f'<circle cx="{ax + 8}" cy="{ay + 2}" r="17" fill="{skin}" stroke="{INK}" stroke-width="4"/>'
    return f'{body}{armL}{limbs}{head_svg}{string}{arrow}{armR}</g>'  # body still holds the opening <g id=tag>


def bow_svg(gx, gy, h, flip=1):
    """Bow centred on its grip (gx, gy), height h. Gold tips + grip wrap; cream string."""
    t, b = gy - h / 2, gy + h / 2
    bx = gx - flip * h * 0.24
    return (f'<path d="M{gx},{t} L{gx},{b}" stroke="#F3E6C8" stroke-width="2.5"/>'
            f'<path d="M{gx},{t} Q{bx},{gy} {gx},{b}" fill="none" stroke="{INK}" stroke-width="17" stroke-linecap="round"/>'
            f'<path d="M{gx},{t} Q{bx},{gy} {gx},{b}" fill="none" stroke="#A86B3C" stroke-width="10" stroke-linecap="round"/>'
            f'<circle cx="{gx}" cy="{t}" r="7" fill="{GOLD}" stroke="{INK}" stroke-width="3"/><circle cx="{gx}" cy="{b}" r="7" fill="{GOLD}" stroke="{INK}" stroke-width="3"/>')


def arrow_svg(x, y, L):
    return (f'<path d="M{x},{y} L{x + L},{y}" stroke="{INK}" stroke-width="10" stroke-linecap="round"/>'
            f'<path d="M{x},{y} L{x + L},{y}" stroke="#C89A5E" stroke-width="5" stroke-linecap="round"/>'
            + S(f"M{x + L - 4},{y - 9} L{x + L + 22},{y} L{x + L - 4},{y + 9} Q{x + L + 4},{y} {x + L - 4},{y - 9}Z", "#8E9AA6", 3)
            + S(f"M{x + 2},{y - 3} L{x + 44},{y - 3} L{x + 30},{y - 18} L{x - 10},{y - 18}Z", "#F08A3C", 3)
            + S(f"M{x + 2},{y + 3} L{x + 44},{y + 3} L{x + 30},{y + 18} L{x - 10},{y + 18}Z", "#E06A2C", 3))


def drona():
    cx, skin = 200, "#B47A50"
    o = ['<g id="drona">']
    # legs/feet under long dhoti
    o.append(f'<ellipse cx="{cx - 30}" cy="724" rx="28" ry="11" fill="{skin}" stroke="{INK}" stroke-width="4"/><ellipse cx="{cx + 30}" cy="724" rx="28" ry="11" fill="{skin}" stroke="{INK}" stroke-width="4"/>')
    o.append(S(f"M{cx - 52},420 L{cx + 52},420 L{cx + 74},712 L{cx - 74},712Z", "#D9822B")
             + S(f"M{cx - 9},426 L{cx + 9},426 L{cx + 16},708 L{cx - 16},708Z", "#B9651C", 3)
             + f'<path d="M{cx - 72},700 L{cx + 72},700" stroke="#7A3B12" stroke-width="7"/>')
    # torso (lean, tall)
    o.append(f'<rect x="{cx - 15}" y="216" width="30" height="36" fill="{skin}" stroke="{INK}" stroke-width="4"/>'
             + S(f"M{cx - 60},258 Q{cx - 56},350 {cx - 50},424 L{cx + 50},424 Q{cx + 56},350 {cx + 60},258 Q{cx},242 {cx - 60},258Z", skin))
    o.append(f'<path d="M{cx - 44},262 L{cx + 46},418" stroke="#FFF7E2" stroke-width="4"/>')  # sacred thread
    o.append(S(f"M{cx + 60},258 L{cx + 26},256 L{cx - 52},420 L{cx - 20},424Z", "#F4EFE4"))  # white angavastram
    beads = "".join(f'<circle cx="{cx + 34 * __import__("math").sin(a / 10)}" cy="{262 + 70 * (1 - __import__("math").cos(a / 10)) / 1.0}" r="5" fill="#6B3A22" stroke="{INK}" stroke-width="1.5"/>' for a in range(-14, 15, 2))
    o.append(beads)
    o.append(f'<rect x="{cx - 54}" y="412" width="108" height="16" rx="7" fill="#7A3B12" stroke="{INK}" stroke-width="4"/>')
    # arms: left relaxed, right raised in a teaching gesture (palm open)
    o.append(limb([(cx - 60, 270), (cx - 76, 350), (cx - 72, 430)], skin, 26) + f'<circle cx="{cx - 72}" cy="438" r="16" fill="{skin}" stroke="{INK}" stroke-width="4"/>')
    o.append('<g id="drona-armR">' + limb([(cx + 60, 270), (cx + 104, 330), (cx + 112, 262)], skin, 26)
             + S(f"M{cx + 98},262 Q{cx + 96},226 {cx + 108},222 L{cx + 112},236 L{cx + 116},214 Q{cx + 124},212 {cx + 124},226 L{cx + 126},218 Q{cx + 134},218 {cx + 132},236 Q{cx + 134},268 {cx + 112},272Z", skin, 3.5) + "</g>")

    # head: white hair with top-knot, long white beard
    hy = 140
    o.append('<g id="drona-head">')
    o.append(S(f"M{cx - 64},{hy - 4} Q{cx - 70},{hy - 74} {cx},{hy - 76} Q{cx + 70},{hy - 74} {cx + 64},{hy - 4} L{cx + 60},{hy + 52} L{cx - 60},{hy + 52}Z", "#E9E7E1"))
    o.append(f'<circle cx="{cx}" cy="{hy - 86}" r="24" fill="#E9E7E1" stroke="{INK}" stroke-width="4"/><path d="M{cx - 22},{hy - 76} Q{cx},{hy - 66} {cx + 22},{hy - 76}" stroke="#7A3B12" stroke-width="6" fill="none"/>')
    for s in (-1, 1):
        o.append(f'<ellipse cx="{cx + s * 58}" cy="{hy + 4}" rx="11" ry="15" fill="{skin}" stroke="{INK}" stroke-width="4"/>')
    o.append(f'<ellipse cx="{cx}" cy="{hy}" rx="56" ry="64" fill="{skin}" stroke="{INK}" stroke-width="4"/>')
    o.append(S(f"M{cx - 56},{hy - 12} Q{cx - 52},{hy - 62} {cx},{hy - 64} Q{cx + 52},{hy - 62} {cx + 56},{hy - 12} Q{cx + 30},{hy - 44} {cx},{hy - 46} Q{cx - 30},{hy - 44} {cx - 56},{hy - 12}Z", "#E9E7E1"))
    # tilak (three soft sandal lines)
    o.append("".join(f'<path d="M{cx - 18},{hy - 36 + i * 7} L{cx + 18},{hy - 36 + i * 7}" stroke="#F3E1B5" stroke-width="3.5" stroke-linecap="round"/>' for i in range(3)))
    o.append(f'<circle cx="{cx}" cy="{hy - 30}" r="3.5" fill="#C8283A"/>')
    # eyes, thick white brows
    for s in (-1, 1):
        x = cx + s * 22
        o.append(f'<ellipse cx="{x}" cy="{hy - 2}" rx="7" ry="9" fill="{INK}"/><circle cx="{x - 2}" cy="{hy - 5}" r="2.5" fill="#fff"/>')
        o.append(S(f"M{x - s * 16},{hy - 18} Q{x},{hy - 30} {x + s * 14},{hy - 16} Q{x},{hy - 22} {x - s * 16},{hy - 18}Z", "#F7F7F3", 3))
    o.append(f'<path d="M{cx + 1},{hy + 6} q-6,12 3,13" fill="none" stroke="{INK}" stroke-width="3.5" stroke-linecap="round" opacity=".7"/>')
    # beard + moustache
    o.append(S(f"M{cx - 50},{hy + 14} Q{cx - 46},{hy + 104} {cx},{hy + 140} Q{cx + 46},{hy + 104} {cx + 50},{hy + 14} Q{cx + 30},{hy + 50} {cx},{hy + 48} Q{cx - 30},{hy + 50} {cx - 50},{hy + 14}Z", "#F7F7F3"))
    o.append(f'<path d="M{cx - 12},{hy + 40} Q{cx},{hy + 46} {cx + 12},{hy + 40}" fill="none" stroke="{INK}" stroke-width="4" stroke-linecap="round"/>')
    o.append(S(f"M{cx},{hy + 24} Q{cx - 18},{hy + 22} {cx - 30},{hy + 38} Q{cx - 12},{hy + 34} {cx},{hy + 32} Q{cx + 12},{hy + 34} {cx + 30},{hy + 38} Q{cx + 18},{hy + 22} {cx},{hy + 24}Z", "#F7F7F3", 3))
    o.append("</g></g>")
    return "".join(o)


def wooden_bird(cx, cy, s=1.0):
    """Painted wooden parrot on a peg. Wood grain + paint chips say 'toy'. The painted eye is the target."""
    g = f'<g id="bird" transform="translate({cx},{cy}) scale({s})">'
    g += S("M-8,58 L8,58 L10,112 L-10,112Z", "#C68B52", 3)  # peg
    g += S("M-46,108 L46,108 L40,128 L-40,128Z", "#A86B3C", 4)  # base block
    g += '<path d="M-36,116 Q0,112 36,118" stroke="#7A4A26" stroke-width="2" fill="none" opacity=".7"/>'
    g += S("M-62,8 Q-118,30 -150,62 Q-110,58 -70,34Z", "#2F7E3E")  # tail
    g += '<path d="M-140,58 Q-128,52 -118,54" stroke="#C68B52" stroke-width="7" stroke-linecap="round"/>'  # chipped tail tip
    g += S("M-76,6 Q-70,-52 0,-50 Q58,-48 64,6 Q60,62 -6,64 Q-64,62 -76,6Z", "#4FA357")  # body
    for k in range(4):  # wood grain showing through paint
        g += f'<path d="M-60,{-18 + k * 18} Q0,{-30 + k * 18} 54,{-14 + k * 18}" stroke="#2F6B3A" stroke-width="2" fill="none" opacity=".35"/>'
    g += S("M-50,-4 Q-14,-26 26,2 Q-6,40 -54,24Z", "#2F7E3E")  # wing
    g += S("M-34,10 Q-24,4 -16,12 Q-24,20 -34,10Z", "#C68B52", 2)  # paint chip
    g += S("M30,-40 Q38,-96 80,-92 Q118,-86 112,-46 Q104,-14 64,-10 Q34,-12 30,-40Z", "#4FA357")  # head
    g += S("M108,-66 Q140,-60 134,-30 Q126,-42 108,-40Z", "#E0452E")  # beak
    # painted eye = the target (white, black pupil, yellow ring)
    g += '<circle id="bird-eye" cx="80" cy="-56" r="15" fill="#fff" stroke="#FFC400" stroke-width="5"/><circle cx="82" cy="-56" r="7" fill="#1A1A1A"/><circle cx="79" cy="-59" r="2.4" fill="#fff"/>'
    g += "</g>"
    return g


def tree(x, y, s=1.0, bird_s=.68):
    """Tall tree; the long branch (डाल) levels out into a flat perch so the bird's wooden base sits squarely on it,
    tied down with cord, against open sky (no leaves behind the target)."""
    g = f'<g id="tree" transform="translate({x},{y}) scale({s})">'
    g += S("M-40,0 Q-30,-200 -26,-420 L26,-420 Q30,-200 40,0Z", "#8A5530")
    # branch: rises from the trunk, then runs level for the perch (top edge y=-352)
    g += S("M14,-300 Q110,-344 230,-352 L452,-352 Q462,-344 452,-336 L230,-336 Q120,-324 24,-268Z", "#8A5530")
    g += S("M262,-338 Q282,-316 306,-312 Q290,-330 274,-340Z", "#4E9A5E", 3)   # one small leaf under the tip
    g += S("M-12,-240 Q-110,-280 -190,-300 L-192,-284 Q-110,-258 -14,-214Z", "#8A5530")
    for cxx, cyy, r, c in [(-150, -440, 110, "#2F6B45"), (150, -450, 120, "#2F6B45"), (0, -520, 150, "#4E9A5E"),
                            (-90, -600, 110, "#4E9A5E"), (100, -610, 110, "#4E9A5E"), (10, -680, 100, "#8CC27A"),
                            (-210, -310, 60, "#4E9A5E")]:
        g += f'<circle cx="{cxx}" cy="{cyy}" r="{r}" fill="{c}" stroke="{INK}" stroke-width="4"/>'
    bx = 400
    g += wooden_bird(bx, -352 - 128 * bird_s, bird_s)          # base bottom sits exactly on the branch top
    for dx in (-18, 18):                                          # cord wraps tying the base to the branch
        g += f'<path d="M{bx + dx},{-352 - 18 * bird_s} L{bx + dx},-334" stroke="#E9DDBF" stroke-width="5" stroke-linecap="round"/>'
    g += "</g>"
    return g


def girl():
    cx, skin = 200, "#8A5634"
    o = ['<g id="girl">']
    o.append(limb([(cx - 22, 560), (cx - 24, 712)], "#3B5BA5", 30) + limb([(cx + 22, 560), (cx + 24, 712)], "#3B5BA5", 30))
    o.append(f'<ellipse cx="{cx - 30}" cy="722" rx="26" ry="11" fill="#D2303A" stroke="{INK}" stroke-width="4"/><ellipse cx="{cx + 30}" cy="722" rx="26" ry="11" fill="#D2303A" stroke="{INK}" stroke-width="4"/>')
    o.append(f'<rect x="{cx - 16}" y="255" width="32" height="40" fill="{skin}" stroke="{INK}" stroke-width="4"/>')
    o.append(S(f"M{cx - 62},300 Q{cx - 70},460 {cx - 84},600 L{cx + 84},600 Q{cx + 70},460 {cx + 62},300 Q{cx},280 {cx - 62},300Z", "#F2C230"))
    o.append("".join(f'<circle cx="{cx + dx}" cy="{dy}" r="5" fill="#E06A2C"/>' for dx, dy in [(-30, 360), (20, 350), (-10, 420), (36, 440), (-44, 500), (10, 520), (50, 560), (-30, 570)]))
    o.append(f'<path d="M{cx - 24},298 Q{cx},326 {cx + 24},298" fill="none" stroke="#E06A2C" stroke-width="6"/>')
    o.append(limb([(cx - 62, 312), (cx - 80, 400), (cx - 76, 470)], skin, 26) + f'<circle cx="{cx - 76}" cy="476" r="16" fill="{skin}" stroke="{INK}" stroke-width="4"/>')
    # right hand holds a crumpled paper ball at shoulder height (ready to toss)
    o.append(limb([(cx + 62, 312), (cx + 104, 370), (cx + 110, 300)], skin, 26))
    o.append(paper_ball(cx + 112, 280, 26) + f'<circle cx="{cx + 110}" cy="300" r="16" fill="{skin}" stroke="{INK}" stroke-width="4"/>')
    o.append(head(skin, crown_kind="none", expr="focused", style="braids"))
    o.append("</g>")
    return "".join(o)


def paper_ball(x, y, r):
    return (f'<circle cx="{x}" cy="{y}" r="{r}" fill="#FBFBF5" stroke="{INK}" stroke-width="4"/>'
            f'<path d="M{x - r * .6},{y - r * .2} l{r * .5},{r * .3} l{r * .2},{-r * .6} M{x},{y + r * .5} l{r * .4},{-r * .3} l{r * .3},{r * .2}" stroke="#B9B6A8" stroke-width="3" fill="none"/>')


def basket(x, y):
    g = S(f"M{x - 70},{y} L{x + 70},{y} L{x + 54},{y + 130} L{x - 54},{y + 130}Z", "#C9873F")
    for k in range(1, 6):
        g += f'<path d="M{x - 70 + k * 3},{y + k * 22} L{x + 70 - k * 3},{y + k * 22}" stroke="#8A5523" stroke-width="3"/>'
    for k in range(-3, 4):
        g += f'<path d="M{x + k * 20},{y} L{x + k * 15},{y + 130}" stroke="#8A5523" stroke-width="2.5"/>'
    g += f'<rect x="{x - 76}" y="{y - 10}" width="152" height="18" rx="9" fill="#B07330" stroke="{INK}" stroke-width="4"/>'
    return g


def focus_ring(cx, cy, r):
    return (f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="#FFD34D" stroke-width="10" opacity=".95"/>'
            f'<circle cx="{cx}" cy="{cy}" r="{r + 14}" fill="none" stroke="#FFD34D" stroke-width="3" opacity=".5"/>')


def label(x, y, t, size=26):
    return f'<text x="{x}" y="{y}" font-family="Arial" font-size="{size}" fill="{INK}" text-anchor="middle">{t}</text>'


def build():
    Wd, Ht = 3100, 2000
    o = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{Wd}" height="{Ht}" viewBox="0 0 {Wd} {Ht}">',
         '<defs><filter id="paper"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="7"/>'
         '<feColorMatrix values="0 0 0 0 .45  0 0 0 0 .32  0 0 0 0 .2  0 0 0 .07 0"/></filter></defs>',
         f'<rect width="{Wd}" height="{Ht}" fill="{PAL["paper"]}"/>',
         label(Wd / 2, 70, "Arjuna and the bird's eye: illustration test sheet (original, rig-ready SVG)", 40)]
    # row 1: cast
    def H(svg, k):  # height variation, anchored at the feet
        return f'<g transform="translate(200,730) scale({k}) translate(-200,-730)">{svg}</g>'
    cast = [
        (drona(), "Guru Drona"),
        (H(look("arjuna", bow=True), 1.03), "Arjuna: ponytail, slim, teal"),
        ('<g transform="translate(110,0)">' + H(aim_pose("arjuna", tag="arjuna-aim"), 1.03) + "</g>", "Arjuna aiming (string in front)"),
        (H(look("yudhishthira"), 1.08), "Yudhishthira: eldest, curls, shawl"),
        (H(look("duryodhana", "smug"), 1.0), "Duryodhana: cape, big crown, wavy"),
        (H(look("bhima", "smile"), 0.97), "Bhima: broad, crop, headband"),
        (girl(), "Today's child (moral)"),
    ]
    for i, (svg, name) in enumerate(cast):
        x = 60 + i * 420 + (100 if i >= 2 else 0)
        o.append(f'<g transform="translate({x},110)">{svg}</g>')
        o.append(label(x + 200 + (50 if i == 2 else 0), 880, name))
    # row 2: props + world
    o.append(f'<g transform="translate(40,980) scale(.62)"><rect width="900" height="1500" fill="#FBE9C6" rx="30"/>'
             f'<circle cx="680" cy="330" r="110" fill="#F7C46A"/>'
             f'<path d="M0,1180 Q450,1100 900,1180 L900,1500 L0,1500Z" fill="#D9A066" stroke="{INK}" stroke-width="4"/>'
             f'{tree(330, 1200, 1.0)}</g>')
    o.append(label(320, 1950, "Gurukul world: tree, the डाल, wooden bird"))
    o.append(f'<g transform="translate(1000,1000)">{wooden_bird(260, 280, 1.9)}{focus_ring(260 + 80 * 1.9, 280 - 56 * 1.9, 46)}</g>')
    o.append(label(1270, 1600, "Wooden bird: painted eye = target; focus ring"))
    o.append(f'<g transform="translate(1700,1050)">{bow_svg(120, 260, 420)}{arrow_svg(210, 160, 330)}</g>')
    o.append(label(1960, 1600, "Bow (धनुष), string (प्रत्यंचा), arrow (तीर)"))
    o.append(f'<g transform="translate(2350,1180)">{basket(220, 140)}{paper_ball(120, 60, 34)}</g>')
    o.append(label(2570, 1600, "Paper ball + basket (moral)"))
    # expressions strip
    exprs = [("duryodhana", "laugh", 0, "हा हा हा"), ("duryodhana", "angry", 1.0, "लाल (anger)"),
             ("yudhishthira", "calm", 0, "calm"), ("arjuna", "focused", 0, "focused"),
             ("arjuna", "smile", 0, "smile"), ("bhima", "surprised", 0, "हैरान")]
    for i, (who, ex, an, nm) in enumerate(exprs):
        q = LOOKS[who]; sk, cr, st, mu = q["skin"], q["crown_kind"], q["style"], q.get("mustache", False)
        x = 1000 + i * 330
        o.append(f'<g transform="translate({x},1640) scale(.62)">{head(sk, crown_kind=cr, expr=ex, angry=an, style=st, mustache=mu)}</g>')
        o.append(f'<text x="{x + 124}" y="1955" font-family="Noto Sans Devanagari, Arial" font-size="26" fill="{INK}" text-anchor="middle">{nm}</text>')
    # palette
    for i, (n, c) in enumerate(PAL.items()):
        x = 2600 + (i % 2) * 230; y = 980 + (i // 2) * 30
        o.append(f'<rect x="{x}" y="{y}" width="26" height="22" fill="{c}" stroke="{INK}" stroke-width="2"/>'
                 f'<text x="{x + 34}" y="{y + 18}" font-family="Arial" font-size="18" fill="{INK}">{n} {c}</text>')
    o.append(f'<rect width="{Wd}" height="{Ht}" filter="url(#paper)"/>')
    o.append("</svg>")
    out = HERE / "illustration-test-sheet.svg"
    out.write_text("".join(o), encoding="utf-8")
    subprocess.run(["resvg", "--use-fonts-dir", str(HERE.parent / "assets/fonts"), str(out), str(out.with_suffix(".png"))], check=True)
    print("wrote", out.with_suffix(".png"))


if __name__ == "__main__":
    build()
