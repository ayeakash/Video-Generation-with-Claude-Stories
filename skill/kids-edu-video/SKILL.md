---
name: kids-edu-video
description: Turn a narration audio file plus its exact script into a polished, graphics-first, motion-designed educational video for children (pictures, characters and animation teach; on-screen text is minimal) in three age bands (0–3, 3–6, 6–9), in English, Hindi or mixed Hinglish. Uses a gated stage process: word-level forced alignment, sync-test video, learning and creative direction (series style bible plus per-video screenplay), Remotion engine and hero proof, then full renders. Outputs 9:16 for Reels/Shorts and/or the in-app player size. Use when the user wants a kids' learning video, explainer for toddlers or preschoolers, alphabet/numbers/colours/animals/varnmala video, educational Reel/Short, picture-led explainer, or says "check the folder" in a folder containing narration audio and a script.
---

# Kids educational video: gated motion-design pipeline

Adapted from the process in *"How we made a motion-designed lyric video with AI"* (the PYAAR? guide). The gated method is unchanged. The input is now **narration audio + script**, and the goal is to **teach a child something clearly and delightfully**.

Reference files (read them when the stage needs them):
- `references/prompts.md`: the stage prompts (A–G) for this workflow. **This is the canonical spec.** Run each stage from its prompt.
- `references/age-bands.md`: design, pedagogy and safety rules for 0–3, 3–6 and 6–9. **Read it before Stage 3 and before any render.**
- `references/origin-pyaar/prompts-verbatim.md` and `references/origin-pyaar/case-study.md`: the original prompts and worked example. Use them for the method, engineering detail and quality bar. **Do not carry over song or adult content** (blood-red worlds, chalk outlines, violence and heartbreak metaphors, "rap speed" framing), and **not its typography-as-hero approach**. Here pictures are the hero.
- For choosing or auditing topics and vocabulary for 0–3 (Indian context, English + Hindi), use the `early-childhood-curriculum` skill if available.

## Core idea

Two input files go through the stages. **Every stage ends with something the user can watch or read and approve before moving on.** That gate is the most important part of the process. Each approved stage becomes the foundation for the next.

## The rules (always on)

1. **Freeze what's been approved.** After the sync test is approved, `word-timestamps.json`, `phrases.json` and the audio are FROZEN. Record checksums (`shasum -a 256`) in `implementation-notes.md` and re-verify them before every render. Repeat the freeze statement in every later stage.
2. **Review a picture, not code.** Every stage ends with a viewable result: sync video, frame contact sheets, proof render, PNG stills. Inspect rendered frames yourself (Read the PNGs) and fix problems before showing the user.
3. **Prove quality on a small piece first.** Approve a short hero proof (≈5–15 s) before rendering whole videos.
4. **The script is the source of truth for words; the audio is the source of truth for timing.** Never "correct" the script by transcription. If the script contains a factual error or age-inappropriate content, **report it and ask**. Don't change it silently.
5. **Teach first, decorate second.** The thing being named must be **on screen, recognisable and in focus at the moment it is spoken**. Every visual must help the child understand or remember the concept. Delight serves learning.
6. **Graphics teach; text is the exception.** Young children can't read (or barely), so the narration plus pictures, characters, objects, actions and animation carry the whole meaning. Respect the per-age **text budget** in `age-bands.md` (0–3: no text; 3–6: only the letter or number being taught; 6–9: 1–3-word labels on diagrams). No subtitles or narration captions in the final video. **No-text test:** hide every piece of text, and each scene must still teach with the audio.
7. **Child safety is non-negotiable.** No flashing above 3 Hz or large full-frame flashes, no scary, violent or unsafe imagery, no frenetic overstimulation. Facts, counts, colours, letter shapes and stroke order must be correct. Details are in `age-bands.md`.

## Gates: hard stop at every one

After each stage: deliver the result, give exact output paths and a short report, then **STOP and wait for explicit approval.** Never start the next stage in the same turn. If the user asks for something faster or smaller, cut scope immediately.

## Inputs & brief (Stage 0)

| Input | Notes |
|---|---|
| Narration audio (mp3/wav/m4a) | Full take. May include a music bed or SFX; separate the voice if needed. |
| `script.txt` | Exact spoken script, one line per spoken line/phrase, in the script spoken (Latin, Devanagari or mixed). **Source of truth for the words.** |
| Brief (ask if not given) | **Age band** (0–3 / 3–6 / 6–9), **topic**, **1–3 learning objectives** ("child can name 5 farm animals and their sounds"), language(s), **series name** (for style reuse), **output format(s)**. |
| Output formats | **9:16 1080×1920** for Reels/Shorts, and/or the **in-app player**. Ask for the app size and whether player controls overlay the video. Default to 1080×1920 if unknown. |
| Environment | Claude Code in the project folder (terminal or VS Code); ~5 GB free disk. Install everything else yourself. |

## Series mode (for producing many videos)

- **First video of a series** (or a new age band or style): run every stage, including the **series style bible** and hero proof.
- **Later videos in the same series:** reuse the frozen `series-bible.md` and the existing engine (`video/`). Run Stage 0 → 1 → 2 → 3b (per-video screenplay only) → 5 (render). Skip the hero proof unless the video needs new scene types or assets. **Gates still apply.**
- Keep shared assets (mascot, fonts, SVGs, palette, sound-synced components) in the series engine so every video looks like the same show.

---

## Stage 0: Inspect & brief (prompt A)
Inspect the audio with ffprobe (duration, sample rate, channels; voice only or with a music bed/SFX). Inspect the script (line count, languages and scripts, oddities). Confirm the brief. Do an **age-fit & accuracy check** of the script against `age-bands.md`: flag factual errors, vocabulary above the band, and unsafe or scary content, as a report only. Output: a **file + brief report**. Stop.

## Stage 1: Word-level timing (prompt B), fully automatic
- Lyrics are replaced by the script, but the method is the same as the original:
  1. **Isolate the voice** with Demucs `htdemucs` when there's a music bed or SFX. Skip it for clean voice-only narration and say so.
  2. **Force-align** with torchaudio `MMS_FA` + `uroman` (multilingual; handles English + Hindi in one pass).
  3. **Absorb extras** with a "wildcard" token between lines for breaths, giggles, SFX and unscripted "yay!"s.
  4. **Cross-check independently** with Whisper large-v3 / turbo. Target line agreement within ≈0.3 s.
  5. **Clean-up & report**: extend held or sung words, close tiny gaps, score lines high/medium/low.
- Kids-specific: elongated teaching words ("Aaaa-pple"), letter sounds and phonemes ("/b/ /b/ ball"), spelled-out letters ("A-P-P-L-E"), counting sequences, sung rhymes, and **interaction pauses** (the narrator asks a question and waits for the child). Detect and list every interaction pause with start and end in `phrases.json` metadata (`"pause": true`).
- Outputs: `word-timestamps.json` (`[{word, start, end}]`, 3-decimal seconds), `phrases.json` (lines with their words and timing, plus pause markers) and a verification report (low-confidence spots, regions not covered by the script). Scripts go in `alignment/`. No video yet. Stop.

## Stage 2: Sync test video (prompt C)
Internal QA for the team, not for kids, so text is fine here. Synchronization QA only, rendered at the primary output size (default 1080×1920), 30 fps, black background, original audio. The current line sits centred, inactive words are gray and the spoken word is highlighted. Debug text at the bottom shows LINE n / total, time `mm:ss.mmm`, the word, `start → end` and `PAUSE` markers. No styling. Timestamps used exactly as they are.
Tools: Pillow + **libraqm** (HarfBuzz) + ffmpeg. Hindi needs a shaper or the matras break, so check a still frame before the full render. Tell the user what to watch for: early or late words, gaps, low-confidence spots, pauses. Stop.

## Stage 3: Learning & creative direction (prompt D)
After the sync test is approved, **freeze** the timing (rule 1). Read `age-bands.md` first.
- **3a. Series style bible** (first video of a series only): `series-bible.md` covers the visual world, palette, mascot or guide character, a minimal label style (for the rare text allowed), illustration style (shape language, line weight, how real objects are simplified), character design, motion personality, sound-sync conventions, recurring visual formats (e.g. "reveal → name → repeat → recap"), safe zones per output format and the age-band rules applied. Include an **illustration test sheet**: the mascot plus 4–6 key objects from the topic, drawn in the series style. Only when letters or numbers are taught (or 6–9 labels are used), add a **font test sheet** of those glyphs: Devanagari conjuncts and matras, numerals, school-style letterforms (single-storey "a", clear "g"). Open-licence (SIL OFL) fonts only, in `assets/fonts/`.
- **3b. Per-video plan:**
  - `learning-plan.md`: objectives, key vocabulary, the concept sequence, where each concept is **introduced → reinforced → recalled**, interaction moments, and the recap.
  - `visual-screenplay.json`: one entry per script line, with the fields in prompt D (including `teachingGoal`, `syncWord`, `onScreenObject`, `howShownVisually`, `onScreenText` (default `none`), `accuracyNotes`, `ageCheck`). Group adjacent lines into shared sequences.
  - `audio-map.json` (librosa): pauses, prosody/energy and emphasis peaks, plus music-bed beats if present. Word timing drives sync. Audio-map drives only gentle secondary motion. Don't pulse on every beat.
- **Meaning drives the visual**, now in a teaching sense: "What is the child supposed to understand here, and what is the clearest, most delightful way to *show* it?" Motivated transitions still apply: objects from scene A create scene B (a red apple rolls and becomes the red ball in the next scene). **Healthy repetition is required** (consistent formats, recurring guide, recap), but avoid lazy template animation.
- **Graphics first:** each line is planned as *what the child SEES happen*, never as words on screen. Abstract ideas become actions and characters (e.g. "big vs small" is an elephant beside a mouse, "hungry" is a tummy rumble and a sad face that turns happy when food arrives, "first, then" is a mascot doing the steps).
- **Self-review:** reject any scene that relies on reading. Also reject anything that is wrong, confusing, too fast for the band, scary, overstimulating, culturally off for Indian kids, or decoration without learning value. Also reject generic zoom/slide/fade-only scenes.
- No code or render yet. End with a short **top-10 moments + learning-flow summary**. Stop.

## Stage 4: Engine + hero proof (prompt E; scope-down E2), Remotion · React · TypeScript
Build the engine once per series in `video/src/`:
- `timing/`: reads the frozen JSON; one clock
- `graphics/` and `characters/` are the core of the engine; text is minimal
- `typography/`: only for letters or numbers being taught (**stroke-order drawing**, English + Devanagari, akshara-safe) and the rare 6–9 label
- `backgrounds/`: per series world
- `graphics/`: original friendly SVG illustrations of objects, animals, places and props, with consistent shape language and parts that can animate (wheels turn, tails wag, petals open)
- `characters/`: mascot and people rigs with expressions (happy, sad, surprised, sleepy) and actions (blink, wave, point, nod, look at the object, eat, jump), so emotions and verbs are *acted*, not written
- `transitions/`
- `effects/`: sparkle, pop, gentle bounce
- `camera/`: 2.5D with soft moves
- `sequences/`
- `formats/`: reusable teaching layouts such as RevealAndName, ShowTheAction, CountAlong (objects pop in one by one), TraceTheLetter, CompareTwo, LifeCycle, FindIt/QuizPause (point, glow, mascot looks) and Recap (picture parade)
- `assets/`
- `utils/`: easings, per-material springs, seeded random

Design rules:
- **Motion feels designed and physical** (anticipation, overshoot, follow-through, weight), softer and slower for younger bands.
- Materials still behave differently (rubbery ball, soft cloth, heavy elephant).
- No "AI slideshow" look.
- Text only within the age text budget. Where letters appear, use real script shaping, tested on every glyph used.
- Safe zones per format.
- Deterministic renders (seeded random only).
- Original SVG assets in a consistent style, no copyrighted characters or imagery.

**Hero proof:** the most representative 5–15 s, at full final quality. Render `hero-proof.mp4` plus **8 representative PNG frames** in `hero-frames/` and write `implementation-notes.md` (architecture, components, assets, deviations, known weaknesses, perf notes, checksums). QA with the kids checklist in prompt E. Bar: "Would a parent and an early-years teacher both be happy to show this to a child, and would the child understand it?" Stop until approved.

## Stage 5: Full render (prompt F; sections via G)
After approval, build all scenes on the same engine. Make **contact sheets** at every key moment (each object-introduction frame, every count, every letter trace, every pause), inspect them (including the no-text test), fix issues, then render `final-<slug>-<format>.mp4` (e.g. `final-farm-animals-9x16.mp4`, plus the app size if requested). Long videos can be rendered **by time range** (prompt G). Update `implementation-notes.md`. Stop.

---

## Project layout (one folder per video)
```
narration.mp3 · script.txt · brief.md                                   (inputs)
word-timestamps.json · phrases.json                                     (frozen timing)
series-bible.md · learning-plan.md · visual-screenplay.json · audio-map.json   (design)
sync-test.mp4 · hero-proof.mp4 · hero-frames/ · final-*.mp4              (outputs)
alignment/ · video/ (series engine, may be shared) · assets/fonts/ · implementation-notes.md
```

## Lessons carried over (do this, because…)
- Give the exact script and call it the source of truth, or transcription "corrects" your words and spellings.
- Always make the sync test. It's cheap, and timing bugs found later are expensive. For kids, a word said before its picture appears teaches the wrong pairing.
- Freeze approved files and say so in every prompt.
- Ask for the teaching meaning before the motion, and show it as a picture or action, not as words.
- Self-review concepts before showing them.
- Approve a short proof before scaling, and reuse the engine and series bible after that.
- Provide representative frames, not just the video.
- For Devanagari, demand shaping tests and correct stroke order.
- Name the platform so critical content avoids UI overlays.
