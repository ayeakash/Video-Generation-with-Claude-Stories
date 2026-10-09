# Video Generation with Claude: Stories

A gated, picture-led pipeline for turning a **narration audio file plus its exact script** into a motion-designed kids' story video, built with Claude Code. Claude does the alignment, design, animation code, rendering and QA, and a human approves the result at every stage.

The first episode is **Arjuna and the bird's eye** (Mahabharata, Hindi, ages 6–9, 9:16 at 1080×1920):

- Final video: [`final-arjuna-birds-eye-9x16.mp4`](final-arjuna-birds-eye-9x16.mp4) (2:49)
- Key frames: [`final-frames/contact-sheet.png`](final-frames/contact-sheet.png)

## The skill

[`skill/kids-edu-video/`](skill/kids-edu-video) is the Claude Code skill that runs the process. To install it, copy the folder to `~/.claude/skills/`, then run `/kids-edu-video` in a project folder that holds your narration and script.

| Stage | Output | Gate |
|---|---|---|
| 0. Inspect & brief | `stage0-report.md`, `brief.md` | the brief is approved |
| 1. Word timing | `word-timestamps.json`, `phrases.json`, `alignment/alignment-report.md` | |
| 2. Sync test | a debug video with words highlighted in time (not included in this repo) | timing is approved, then **frozen** (`frozen.sha256`) |
| 3. Creative direction | `series-bible.md`, `learning-plan.md`, `visual-screenplay.json`, `audio-map.json`, `design/` sheets | the design is approved |
| 4. Engine + hero proof | `video/` engine, `hero-frames/` | a short proof is approved |
| 5. Full render | `final-*.mp4`, `final-frames/` | |

Rules the skill always follows:
- The script and audio are never edited. The script decides the words and the audio decides the timing.
- Pictures teach and there is no on-screen text.
- Child safety comes first: no flashing (photosensitivity is checked), nothing scary.
- Every stage ends with something to watch or read.

`skill/kids-edu-video/references/prompts.md` and `age-bands.md` hold the stage prompts and the age-band rules. The skill was adapted from a lyric-video process guide, and that source material (`references/origin-pyaar/`) is not included here.

## Repo layout

```
skill/kids-edu-video/         the Claude Code skill
alignment/                    forced alignment (torchaudio MMS_FA + uroman), Whisper cross-check, sync-test renderer
design/                       screenplay builder, test sheets, staging plan, turnarounds
video/                        Remotion + React + TypeScript engine
  src/characters/             SVG character rigs (front, 3/4, side, back views)
  src/backgrounds/ graphics/  the gurukul world, props, ambient life
  src/camera/ formats/        2.5D camera, POV window
  src/sequences/ episode/     scenes and the full Episode composition
  scripts/sync-frozen.mjs     verifies frozen checksums before every render
implementation-notes.md       full log of every stage, revision and QA result
```

## Re-rendering

The narration audio and script aren't included in this repo. Add your own `arjuna narration.mp3` and `.txt`, whose checksums must match `frozen.sha256`. Then run:

```bash
cd video && npm install
npx remotion render Episode ../final-arjuna-birds-eye-9x16.mp4 --codec h264 --crf 18
```

Run `npm run sync` before rendering; it checks the frozen files and copies the audio into `video/public/`.
