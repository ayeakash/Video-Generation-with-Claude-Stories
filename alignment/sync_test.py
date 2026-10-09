"""Stage 2: sync-test video (internal QA). Timestamps used exactly as they are; nothing is re-timed.

Usage: python sync_test.py [--still SECONDS ...]   (stills go to alignment/sync-stills/)
Needs DYLD_FALLBACK_LIBRARY_PATH=/opt/homebrew/lib so Pillow finds libraqm (Devanagari shaping).
"""
import json, subprocess, sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, features

assert features.check("raqm"), "libraqm missing: Devanagari matras would break"

ROOT = Path(__file__).resolve().parent.parent
W, H, FPS = 1080, 1920, 30
FONT = ROOT / "assets/fonts/NotoSansDevanagari-Bold.ttf"
FONT_R = ROOT / "assets/fonts/NotoSansDevanagari-Regular.ttf"
PUNCT = "\"'“”‘’.,!?।…;:()[]"

P = json.loads((ROOT / "phrases.json").read_text())
LINES, PAUSES, DUR = P["lines"], P["pauses"], P["duration"]
f_line = ImageFont.truetype(str(FONT), 76, layout_engine=ImageFont.Layout.RAQM)
f_dbg = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Unicode.ttf", 40)  # Latin debug text (Noto Devanagari has no Latin letters)
f_dbg_b = ImageFont.truetype(str(FONT), 52, layout_engine=ImageFont.Layout.RAQM)
f_dbg_lb = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 52)

ACTIVE, PAST, FUTURE = (255, 214, 0), (150, 150, 150), (85, 85, 85)


def layout(line):
    """Split the script line into display tokens (with their punctuation) mapped to timed word indexes."""
    toks, wi = [], 0
    for tok in line["text"].split():
        if tok.strip(PUNCT):
            toks.append((tok, wi)); wi += 1
        else:
            toks.append((tok, None))
    space = f_line.getlength(" ")
    rows, row, x = [], [], 0
    for tok, idx in toks:
        w = f_line.getlength(tok, direction="ltr", language="hi")
        if row and x + space + w > 960:
            rows.append(row); row, x = [], 0
        row.append((tok, idx, w)); x += (space if len(row) > 1 else 0) + w
    rows.append(row)
    return rows, space


LAYOUTS = [layout(l) for l in LINES]


def state_at(t):
    """(line index, active word index or None, gap/pause info)."""
    for i, l in enumerate(LINES):
        if l["start"] <= t < l["end"]:
            act = next((k for k, w in enumerate(l["words"]) if w["start"] <= t < w["end"]), None)
            return i, act, None
    nxt = next((i for i, l in enumerate(LINES) if l["start"] > t), None)
    pause = next((p for p in PAUSES if p["start"] <= t < p["end"]), None)
    return nxt, None, pause or "gap"


def fmt(t):
    return f"{int(t // 60):02d}:{t % 60:06.3f}"


def frame(t):
    img = Image.new("RGB", (W, H), (0, 0, 0))
    d = ImageDraw.Draw(img)
    li, act, gap = state_at(t)
    if li is not None:
        line = LINES[li]
        rows, space = LAYOUTS[li]
        lh = 132
        y = 820 - len(rows) * lh // 2
        for row in rows:
            rw = sum(w for _, _, w in row) + space * (len(row) - 1)
            x = (W - rw) / 2
            for tok, idx, w in row:
                if gap is not None:
                    col = FUTURE
                elif idx is not None and idx == act:
                    col = ACTIVE
                elif idx is not None and line["words"][idx]["end"] <= t:
                    col = PAST
                else:
                    col = FUTURE
                d.text((x, y), tok, font=f_line, fill=col, direction="ltr", language="hi")
                x += w + space
            y += lh
    # debug strip
    d.rectangle([0, 1480, W, 1920], fill=(18, 18, 18))
    y0 = 1510
    d.text((60, y0), f"LINE {li + 1 if li is not None else '-'} / {len(LINES)}   {fmt(t)}", font=f_dbg, fill=(220, 220, 220))
    if gap is None and li is not None:
        conf = LINES[li]["confidence"]
        d.text((760, y0), conf.upper(), font=f_dbg, fill={"high": (90, 200, 90), "medium": (230, 170, 40), "low": (235, 80, 70)}[conf])
    if gap is None and act is not None:
        w = LINES[li]["words"][act]
        d.text((60, y0 + 80), w["word"], font=f_dbg_b, fill=ACTIVE, direction="ltr", language="hi")
        d.text((60, y0 + 175), f"{w['start']:.3f} → {w['end']:.3f}   ({w['end'] - w['start']:.3f}s)", font=f_dbg, fill=(200, 200, 200))
    elif gap is None:
        d.text((60, y0 + 80), "· between words ·", font=f_dbg, fill=(120, 120, 120))
    elif isinstance(gap, dict) and gap["pause"]:
        d.text((60, y0 + 80), "PAUSE (think)", font=f_dbg_lb, fill=(80, 180, 255))
        d.text((60, y0 + 175), f"{gap['start']:.3f} → {gap['end']:.3f}   ({gap['dur']:.2f}s)", font=f_dbg, fill=(200, 200, 200))
    elif isinstance(gap, dict):
        d.text((60, y0 + 80), "beat (dramatic gap)", font=f_dbg, fill=(140, 140, 140))
        d.text((60, y0 + 175), f"{gap['start']:.3f} → {gap['end']:.3f}   ({gap['dur']:.2f}s)", font=f_dbg, fill=(140, 140, 140))
    else:
        d.text((60, y0 + 80), "gap", font=f_dbg, fill=(120, 120, 120))
    # progress bar
    d.rectangle([60, 1840, 60 + (W - 120) * t / DUR, 1852], fill=(255, 214, 0))
    return img


def main():
    if "--still" in sys.argv:
        out = ROOT / "alignment/sync-stills"; out.mkdir(exist_ok=True)
        for s in sys.argv[sys.argv.index("--still") + 1:]:
            frame(float(s)).save(out / f"still-{float(s):07.3f}.png")
        return
    n = int(DUR * FPS) + 1
    ff = subprocess.Popen(["ffmpeg", "-y", "-v", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS),
                           "-i", "-", "-i", str(ROOT / "arjuna narration.mp3"), "-map", "0:v", "-map", "1:a",
                           "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p",
                           "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", str(ROOT / "sync-test.mp4")],
                          stdin=subprocess.PIPE)
    cache = {}
    for k in range(n):
        t = k / FPS
        ff.stdin.write(frame(t).tobytes())
        if k % 300 == 0:
            print(f"frame {k}/{n}", flush=True)
    ff.stdin.close(); ff.wait()
    print("done", ff.returncode)


if __name__ == "__main__":
    main()
