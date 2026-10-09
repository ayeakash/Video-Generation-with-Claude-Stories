"""Independent cross-check: Whisper large-v3-turbo (MLX) word timestamps. Writes whisper-raw.json."""
import json, mlx_whisper
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
r = mlx_whisper.transcribe(str(ROOT / "arjuna narration.mp3"), path_or_hf_repo="mlx-community/whisper-large-v3-turbo",
                           language="hi", word_timestamps=True, condition_on_previous_text=False)
words = [{"word": w["word"].strip(), "start": round(w["start"], 3), "end": round(w["end"], 3)}
         for s in r["segments"] for w in s.get("words", [])]
(ROOT / "alignment" / "whisper-raw.json").write_text(json.dumps({"text": r["text"], "words": words}, ensure_ascii=False, indent=1))
print(len(words), "whisper words")
