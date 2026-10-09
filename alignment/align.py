"""Stage 1: force-align the canonical script against the narration (torchaudio MMS_FA + uroman).

Script = source of truth for WORDS, audio = source of truth for TIMING.
Writes ../word-timestamps.json, ../phrases.json and mms-raw.json (per-word scores) in this folder.
"""
import json, re, subprocess, sys
from pathlib import Path

import numpy as np
import torch, torchaudio
import uroman as ur

ROOT = Path(__file__).resolve().parent.parent
AUDIO = ROOT / "arjuna narration.mp3"
SCRIPT = ROOT / "arjuna narration.txt"
SR = 16000

PUNCT = "\"'“”‘’.,!?।…;:()[]"


def load_lines():
    lines = [l.strip() for l in SCRIPT.read_text(encoding="utf-8").splitlines()]
    return [l for l in lines if l]


def clean_word(tok):
    return tok.strip(PUNCT)


def load_audio():
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", str(AUDIO), "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
        capture_output=True, check=True).stdout
    return torch.from_numpy(np.frombuffer(raw, dtype=np.float32).copy()).unsqueeze(0)


def main():
    lines = load_lines()
    words = []  # (line_idx, display_word)
    for li, line in enumerate(lines):
        for tok in line.split():
            w = clean_word(tok)
            if w:
                words.append((li, w))

    uroman = ur.Uroman()
    bundle = torchaudio.pipelines.MMS_FA
    dictionary = bundle.get_dict(star="*")

    def romanize(w):
        r = uroman.romanize_string(w).lower()
        r = re.sub(r"[^a-z']", "", r.replace("’", "'"))
        r = "".join(c for c in r if c in dictionary)
        return r or "a"

    roman = [romanize(w) for _, w in words]

    # transcript with a wildcard between lines to absorb breaths / unscripted sounds
    transcript, owner = [], []
    for i, ((li, _), r) in enumerate(zip(words, roman)):
        if i > 0 and words[i - 1][0] != li:
            transcript.append("*"); owner.append(None)
        transcript.append(r); owner.append(i)
    transcript = ["*"] + transcript + ["*"]
    owner = [None] + owner + [None]

    wav = load_audio()
    model = bundle.get_model(with_star=True)
    with torch.inference_mode():
        emission, _ = model(wav)
    tokenizer, aligner = bundle.get_tokenizer(), bundle.get_aligner()
    spans = aligner(emission[0], tokenizer(transcript))
    ratio = wav.size(1) / emission.size(1) / SR

    out = []
    for toks, own in zip(spans, owner):
        if own is None:
            continue
        li, w = words[own]
        start, end = toks[0].start * ratio, toks[-1].end * ratio
        score = float(sum(t.score * len(t) for t in toks) / sum(len(t) for t in toks))
        out.append({"word": w, "line": li, "roman": roman[own],
                    "start": round(start, 3), "end": round(end, 3), "score": round(score, 3)})

    (ROOT / "alignment" / "mms-raw.json").write_text(json.dumps(out, ensure_ascii=False, indent=1))
    print(f"aligned {len(out)} words over {wav.size(1)/SR:.2f}s; emission frames {emission.size(1)}")


if __name__ == "__main__":
    main()
