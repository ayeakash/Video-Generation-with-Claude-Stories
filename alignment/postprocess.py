"""Stage 1 clean-up + Whisper cross-check.

Reads mms-raw.json + whisper-raw.json, writes ../word-timestamps.json, ../phrases.json, alignment-report.md.
Never edits words: the script spelling is kept exactly as written.
"""
import difflib, json, re, subprocess
from pathlib import Path

import numpy as np
import uroman as ur

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
SR, HOP = 16000, 160  # 10 ms envelope
VOICED_DB = -42.0

lines = [l.strip() for l in (ROOT / "arjuna narration.txt").read_text(encoding="utf-8").splitlines() if l.strip()]
mms = json.loads((HERE / "mms-raw.json").read_text())
wh = json.loads((HERE / "whisper-raw.json").read_text())["words"]

raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(ROOT / "arjuna narration.mp3"), "-ac", "1", "-ar", str(SR),
                      "-f", "f32le", "-"], capture_output=True, check=True).stdout
x = np.frombuffer(raw, dtype=np.float32)
dur = len(x) / SR
n = len(x) // HOP
env = 20 * np.log10(np.sqrt((x[: n * HOP].reshape(n, HOP) ** 2).mean(1)) + 1e-9)
voiced = env > VOICED_DB
f = lambda t: min(max(int(t * 100), 0), n - 1)

# ---- 1. extend held / elongated words, close tiny gaps ----
W = [dict(w) for w in mms]
for i, w in enumerate(W):
    nxt = W[i + 1]["start"] if i + 1 < len(W) else dur
    prv = W[i - 1]["end"] if i > 0 else 0.0
    # extend end while the voice keeps sounding (held vowels, "शूँऽऽऽ", "...")
    t = w["end"]
    while t < nxt - 0.02 and t < w["end"] + 1.5 and voiced[f(t)]:
        t += 0.01
    w["extended"] = round(t - w["end"], 3)
    w["end"] = round(t, 3)
    # pull start back slightly onto the onset if voiced
    s = w["start"]
    while s > prv + 0.02 and s > w["start"] - 0.12 and voiced[f(s - 0.01)]:
        s -= 0.01
    w["start"] = round(s, 3)
for a, b in zip(W, W[1:]):
    if a["line"] == b["line"] and 0 < b["start"] - a["end"] < 0.08:
        a["end"] = b["start"]

# line-final words: let the decaying tail ring out to the true silence onset (-45 dB)
voiced45 = env > -45.0
for i, w in enumerate(W):
    if i + 1 < len(W) and W[i + 1]["line"] == w["line"]:
        continue
    nxt = W[i + 1]["start"] if i + 1 < len(W) else dur
    t = w["end"]
    while t < nxt - 0.02 and t < w["end"] + 0.6 and voiced45[f(t)]:
        t += 0.01
    w["end"] = round(t, 3)

# Manual overrides from envelope inspection (documented in alignment-report.md).
# Line 6 laugh: MMS put two "हा" on the tail of "दुर्योधन!". The -30 dB envelope shows three laugh bursts at
# 29.569-29.891 / 30.011-30.101 / 30.290-30.486 s; 31.21-32.35 s is an extra unscripted chuckle (wildcard).
OVERRIDES = {(4, 4): (27.782, 28.766), (5, 0): (29.569, 29.891), (5, 1): (30.011, 30.101), (5, 2): (30.290, 30.486)}
seen = {}
for w in W:
    k = (w["line"], seen.setdefault(w["line"], 0)); seen[w["line"]] += 1
    if k in OVERRIDES:
        w["start"], w["end"] = OVERRIDES[k]; w["override"] = True; w["score"] = 0.5

# silence edges for independent line-boundary check
sil_end = [k / 100 for k in range(1, n) if voiced45[k] and not voiced45[k - 1]]
sil_start = [k / 100 for k in range(1, n) if not voiced45[k] and voiced45[k - 1]]

# ---- 2. Whisper cross-check via romanised character alignment ----
uro = ur.Uroman()
rom = lambda s: re.sub(r"[^a-z]", "", uro.romanize_string(s).lower())
s_chars, s_owner = [], []
for i, w in enumerate(W):
    r = rom(w["word"]) or "a"
    s_chars += list(r); s_owner += [i] * len(r)
w_chars, w_owner = [], []
for j, w in enumerate(wh):
    r = rom(w["word"])
    w_chars += list(r); w_owner += [j] * len(r)
sm = difflib.SequenceMatcher(None, s_chars, w_chars, autojunk=False)
match = {}
for blk in sm.get_matching_blocks():
    for k in range(blk.size):
        match.setdefault(s_owner[blk.a + k], set()).add(w_owner[blk.b + k])
for i, w in enumerate(W):
    js = sorted(match.get(i, []))
    if js:
        w["whisperStart"] = wh[js[0]]["start"]; w["whisperEnd"] = wh[js[-1]]["end"]

# ---- 3. lines, pauses, confidence ----
phr, report_rows, pauses = [], [], []
for li, text in enumerate(lines):
    ws = [w for w in W if w["line"] == li]
    st, en = ws[0]["start"], ws[-1]["end"]
    sc = float(np.mean([w["score"] for w in ws]))
    d_st = abs(ws[0]["whisperStart"] - st) if "whisperStart" in ws[0] else None
    d_en = abs(ws[-1]["whisperEnd"] - en) if "whisperEnd" in ws[-1] else None
    # Whisper word STARTS on this file snap back into the preceding silence (0.3-2.5 s early on every line),
    # so the cross-check uses Whisper END times plus the measured silence edges.
    e_st = min(abs(t - st) for t in sil_end)
    e_en = min(abs(t - en) for t in sil_start)
    low_words = [w["word"] for w in ws if w["score"] < 0.3 or w.get("override")]
    if e_st <= 0.05 and e_en <= 0.15 and (d_en is None or d_en <= 0.3) and sc >= 0.55 and not low_words:
        conf = "high"
    elif e_st <= 0.15 and e_en <= 0.3 and (d_en is None or d_en <= 0.6) and sc >= 0.35:
        conf = "medium"
    else:
        conf = "low"
    holds = [{"after": a["word"], "start": a["end"], "end": b["start"], "dur": round(b["start"] - a["end"], 3)}
             for a, b in zip(ws, ws[1:]) if b["start"] - a["end"] >= 0.35]
    phr.append({"line": li + 1, "text": text, "start": st, "end": en, "confidence": conf, "score": round(sc, 3),
                "whisperDelta": {"start": None if d_st is None else round(d_st, 3), "end": None if d_en is None else round(d_en, 3)},
                "holds": holds,
                "words": [{"word": w["word"], "start": w["start"], "end": w["end"]} for w in ws]})
    report_rows.append((li + 1, st, en, conf, sc, e_st, e_en, d_en, low_words, text))

# gaps between lines; the narrator's rhetorical questions to the listener are interaction (think) pauses
THINK = {1, 19}  # line 1 hook question, line 19 "क्या ये चुनौती... सचमुच असंभव थी?"
for a, b in zip(phr, phr[1:]):
    gap = round(b["start"] - a["end"], 3)
    if a["line"] in THINK:
        pauses.append({"pause": True, "kind": "think", "afterLine": a["line"], "start": a["end"], "end": b["start"], "dur": gap})
    elif gap >= 1.0:
        pauses.append({"pause": False, "kind": "beat", "afterLine": a["line"], "start": a["end"], "end": b["start"], "dur": gap})
for p in phr:
    p["pauseAfter"] = next((q for q in pauses if q["afterLine"] == p["line"] and q["pause"]), None) is not None

# voiced audio not covered by any word
cov = np.zeros(n, bool)
for w in W:
    cov[f(w["start"]):f(w["end"]) + 1] = True
unc, k = [], 0
while k < n:
    if voiced[k] and not cov[k]:
        j = k
        while j < n and voiced[j] and not cov[j]:
            j += 1
        if j - k >= 15:
            unc.append((k / 100, j / 100))
        k = j
    else:
        k += 1

(ROOT / "word-timestamps.json").write_text(json.dumps(
    [{"word": w["word"], "start": w["start"], "end": w["end"]} for w in W], ensure_ascii=False, indent=2))
(ROOT / "phrases.json").write_text(json.dumps(
    {"audio": "arjuna narration.mp3", "script": "arjuna narration.txt", "duration": round(dur, 3),
     "lines": phr, "pauses": pauses}, ensure_ascii=False, indent=2))

fmt = lambda t: f"{int(t // 60)}:{t % 60:06.3f}"
md = ["# Stage 1 alignment report", "",
      f"Audio {dur:.3f}s · {len(lines)} lines · {len(W)} words · MMS_FA (uroman, wildcard between lines) · cross-check Whisper large-v3-turbo ({len(wh)} words)", "",
      "| # | start | end | conf | score | Δsilence start | Δsilence end | ΔWhisper end | flagged words | line |", "|---|---|---|---|---|---|---|---|---|---|"]
for r in report_rows:
    d = lambda v: "–" if v is None else f"{v:.2f}"
    md.append(f"| {r[0]} | {fmt(r[1])} | {fmt(r[2])} | {r[3]} | {r[4]:.2f} | {d(r[5])} | {d(r[6])} | {d(r[7])} | {' '.join(r[8])} | {r[9]} |")
md += ["", "Whisper word starts snap 0.3–2.5 s early into the preceding silence on every line here, so line starts are verified against measured silence edges and Whisper end times instead.",
       "", "**Manual override (line 6 laugh):** MMS placed two \"हा\" on the tail of \"दुर्योधन!\". The scripted \"हा हा हा\" is pinned to the three laugh bursts at 29.57 / 30.01 / 30.29 s. 31.21–32.35 s is an extra unscripted chuckle, absorbed by the wildcard. **Check this in the sync test.**"]
md += ["", "## Pauses", ""] + [f"- {'**THINK PAUSE**' if p['pause'] else 'beat'} after line {p['afterLine']}: {fmt(p['start'])} → {fmt(p['end'])} ({p['dur']:.2f}s)" for p in pauses]
md += ["", "## Voiced audio not covered by script words (≥0.15 s)", ""] + ([f"- {fmt(a)} → {fmt(b)}" for a, b in unc] or ["- none"])
md += ["", "## Most-extended words (held vowels)", ""] + [f"- {w['word']} (line {w['line']+1}) +{w['extended']:.2f}s" for w in sorted(W, key=lambda w: -w['extended'])[:10]]
(HERE / "alignment-report.md").write_text("\n".join(md) + "\n")
c = [r[3] for r in report_rows]
print("lines high/med/low:", c.count("high"), c.count("medium"), c.count("low"), "| uncovered:", len(unc))
