"""Stage 3: audio-map.json. Pauses, energy and emphasis peaks. Reads frozen timing and never modifies it."""
import json
from pathlib import Path
import numpy as np, librosa

ROOT = Path(__file__).resolve().parent.parent
P = json.loads((ROOT / "phrases.json").read_text())
y, sr = librosa.load(str(ROOT / "arjuna narration.mp3"), sr=16000, mono=True)
hop = 160
rms = librosa.feature.rms(y=y, frame_length=640, hop_length=hop)[0]
db = librosa.amplitude_to_db(rms, ref=np.max)
f0 = librosa.yin(y, fmin=70, fmax=450, sr=sr, frame_length=1024, hop_length=hop)
voiced = db > -35
t = librosa.frames_to_time(np.arange(len(rms)), sr=sr, hop_length=hop)
idx = lambda a, b: (t >= a) & (t < b)

words, all_e = [], []
for l in P["lines"]:
    for w in l["words"]:
        m = idx(w["start"], w["end"])
        e = float(db[m].max()) if m.any() else -80.0
        vm = m & voiced
        p = float(np.median(f0[vm])) if vm.any() else None
        words.append({"line": l["line"], "word": w["word"], "start": w["start"], "end": w["end"], "peakDb": round(e, 1),
                      "pitchHz": None if p is None else round(p, 1)})
lines = []
for l in P["lines"]:
    ws = [w for w in words if w["line"] == l["line"]]
    es = np.array([w["peakDb"] for w in ws]); ps = np.array([w["pitchHz"] or 0 for w in ws])
    # emphasis = loud AND high relative to the rest of this line (z-score); at most 2 per line
    z = (es - es.mean()) / (es.std() + 1e-6) + 0.7 * ((ps - ps.mean()) / (ps.std() + 1e-6))
    order = [int(i) for i in np.argsort(-z) if z[i] > 0.9][:2]
    m = idx(l["start"], l["end"])
    lines.append({"line": l["line"], "start": l["start"], "end": l["end"], "meanDb": round(float(db[m].mean()), 1),
                  "emphasis": [{"word": ws[i]["word"], "start": ws[i]["start"], "end": ws[i]["end"]} for i in sorted(order)],
                  "holds": l["holds"]})
# energy 1-10 per line from loudness + speech rate
md = np.array([x["meanDb"] for x in lines]); rate = np.array([len(l["words"]) / (l["end"] - l["start"]) for l in P["lines"]])
sc = 0.6 * (md - md.min()) / (np.ptp(md) + 1e-6) + 0.4 * (rate - rate.min()) / (np.ptp(rate) + 1e-6)
for x, s in zip(lines, sc):
    x["energy"] = int(round(1 + 9 * s))
env = [{"t": round(float(tt), 2), "db": round(float(d), 1)} for tt, d in zip(t[::10], db[::10])]
out = {"source": "arjuna narration.mp3 (frozen)", "musicBed": False, "bpm": None,
       "note": "Word timing drives sync. This map drives only gentle secondary motion. Don't pulse on every peak.",
       "pauses": P["pauses"], "lines": lines, "words": words, "envelope100ms": env}
(ROOT / "audio-map.json").write_text(json.dumps(out, ensure_ascii=False, indent=1))
for x in lines:
    print(x["line"], x["energy"], [e["word"] for e in x["emphasis"]])
