# Stage prompts: kids educational video

These prompts are adapted from the original PYAAR? prompts (`origin-pyaar/prompts-verbatim.md`) for narration audio and kids' learning content. Run each stage from its prompt. Fill `{{…}}` from the brief or project data. The user may send the short form (shown in quotes), and Claude then runs the full prompt.

| Placeholder | Meaning |
|---|---|
| `{{AUDIO}}` | narration audio filename (e.g. `narration.mp3`) |
| `{{SCRIPT}}` | script filename (e.g. `script.txt`) |
| `{{AGE_BAND}}` | 0–3 / 3–6 / 6–9 |
| `{{TOPIC}}`, `{{OBJECTIVES}}` | topic and 1–3 learning objectives |
| `{{LANGS}}` | English / Hindi / mixed |
| `{{LINE_COUNT}}` | lines in `phrases.json` |
| `{{DURATION_S}}` | audio length in seconds |
| `{{FORMATS}}` | 1080×1920 (Reels/Shorts) and/or the app size |
| `{{SERIES}}` | series name |
| `{{HERO_RANGE}}` | 5–15 s hero-proof range |

---

## A · Start
Short form: **"check the folder"**

```
Check the folder. Inspect {{AUDIO}} (duration, sample rate, channels, voice-only vs. music bed/SFX) and {{SCRIPT}} (line count, languages/scripts, oddities).
Confirm the brief: age band, topic, learning objectives, language(s), series name, output format(s) (Reels/Shorts 1080×1920 and/or in-app size — ask the app size and whether player controls overlay the video).
Run the age-fit & accuracy check from age-bands.md on the script and REPORT any issues. Do not change the script.
Do not start alignment yet.
```

---

## B · Word-level timing
Short form: **"make the timestamps"**

```
I have provided two files in this project:
- {{AUDIO}} — the narration for a kids' educational video ({{AGE_BAND}}, {{TOPIC}})
- {{SCRIPT}} — the exact/canonical script
Before creating any video, I need you to create highly accurate word-level timestamps for the script.
Inspect the environment and install/use whatever local tools are required. Prefer a forced-alignment approach (torchaudio MMS_FA + uroman; separate the voice with Demucs htdemucs if there is a music bed or SFX; cross-check with Whisper large-v3/turbo).
The script file is the source of truth for the WORDS.
The audio is the source of truth for the TIMING.
Do not simply transcribe the audio and replace my script. Align my supplied script against the actual narration.
I need output in this format:
[
  {
    "word": "example",
    "start": 1.240,
    "end": 1.510
  }
]
Save the final result as:
word-timestamps.json
Also create:
phrases.json
where individual words are grouped into the actual script lines while retaining their timing, and every interaction pause (narrator asks a question and waits) is marked with "pause": true and its start/end.
Because this is kids' narration, pay special attention to:
- elongated teaching words ("Aaaa-pple")
- letter sounds/phonemes and spelled-out letters ("A-P-P-L-E", "/b/ /b/ ball")
- counting sequences
- repeated words
- sung rhyme parts
- interaction pauses
- giggles, "yay!", SFX and other unscripted sounds
- English/Hindi switching within a line
- differences between transcription and script
First inspect the files and determine the best alignment approach available in this environment.
Then actually execute the alignment.
Do not start building the video yet.
At the end, verify that the timestamps cover the audio correctly and report any portions where alignment confidence appears poor.
```

---

## C · Sync test video
Short form: **"make the sync test"**

```
Great. Do NOT modify or re-run the alignment yet.
Before we build the actual video, I want to visually verify the synchronization.
(This is internal QA for our team, not for kids, so text is fine here.)
Create a very simple verification video using:
- {{AUDIO}}
- word-timestamps.json
- phrases.json
VIDEO:
{{primary format, default 1080 × 1920}}
30 FPS
Black background
Original {{AUDIO}} as audio
Display the CURRENT LINE around the center of the screen.
Within that line:
- inactive words = white/gray
- currently spoken word = visually highlighted
- change the highlight using the exact word-level start/end timestamps
- keep the entire line visible so I can understand context
- during interaction pauses show "PAUSE" with its remaining time
Also display small debug information at the bottom:
current time
line number
current word
word start → end
Do not add motion graphics, transitions, camera movements, effects, beat detection, or artistic styling yet.
This video's ONLY purpose is synchronization QA.
Render:
sync-test.mp4
Use the existing timestamps exactly as they currently exist. Do not silently alter them.
(Use a proper text shaper — libraqm/HarfBuzz — for Devanagari; check a still frame before rendering.)
After rendering, tell me the exact output path.
Stop after sync-test.mp4 is rendered.
```

---

## D · Learning & creative direction
Short form: **"sync approved"**

```
The synchronization test is approved.
The word-level timestamps are accurate enough. FREEZE the alignment data.
Do NOT modify:
- word-timestamps.json
- phrases.json
- the original audio
(Record checksums in implementation-notes.md.)
We are now moving to the LEARNING & MOTION DESIGN stage.
However, DO NOT start coding/rendering yet.
First behave like a senior motion designer + children's TV art director + early-years educator + creative developer, and DESIGN HOW THIS VIDEO TEACHES AND LOOKS.
Audience: {{AGE_BAND}}. Topic: {{TOPIC}}. Objectives: {{OBJECTIVES}}. Language: {{LANGS}}.
Read references/age-bands.md and apply the {{AGE_BAND}} rules and the universal rules.
My goal: a video a parent and an early-years teacher would both be proud to show a child — the child understands it, remembers it and enjoys it. It should feel like a professional kids' studio made it, NOT "AI animated a slideshow".

# THE MEANING (WHAT WE ARE TEACHING) SHOULD DRIVE THE VISUAL.
For every line ask:
"What should the child understand or remember here, and what is the clearest, most delightful way to SHOW it?"
Do NOT cycle through zoom/slide/fade/bounce primitives — those are tools, not ideas.
The named thing must be on screen, recognisable and in focus at (or just before) its word's start.

# CONTINUOUS VISUAL STORYTELLING
Think WORD → LINE → SCENE → SEQUENCE → VIDEO.
Objects from scene A should often CREATE scene B (the red apple rolls and becomes the red ball; the number 3 hops onto the third duck).
Use healthy repetition: consistent teaching formats, a recurring guide, introduce → reinforce → recall → recap.
Some moments should be calm and simple so key reveals feel special.

# VISUAL ASSETS
Original SVG/procedural illustrations, characters, objects, diagrams, textures — friendly, consistent, true to life, Indian context where relevant.
Children can't read (or barely), so GRAPHICS DO THE TEACHING. Every idea is shown as an object, a character acting, a facial expression, a side-by-side comparison or a step-by-step action, never as words on screen.
Nouns → the thing itself. Verbs → a character doing it. Feelings → faces. Rules/habits → the mascot doing it right.
Where a letter or number IS the lesson, it is a graphic: it traces itself, gets coloured, and morphs into or meets its object.
No copyrighted characters/imagery. List any external asset needed.

# GRAPHICS FIRST — TEXT BUDGET
Follow the text budget in age-bands.md: 0–3 no text; 3–6 only the letter/number being taught (as a graphic); 6–9 only 1–3-word diagram labels and maths numbers.
NO subtitles, NO narration captions, NO sentences on screen.
No-text test: if all text were hidden, would each scene still teach with the audio? If not, redesign it with pictures.
When letters/numbers are used: school-style letterforms, correct stroke order (English + Devanagari), correct Devanagari shaping, akshara/grapheme-safe units only.

# AUDIO
Timestamps tell you WHEN; the narration's pauses, emphasis and any music bed tell you HOW (gently).
Create audio-map.json (pauses, emphasis peaks, energy, beats if a music bed exists). Do NOT modify word timing. Do not pulse on every beat.

# FIRST TASK — DO NOT CODE YET
{{If first video of the series:}} Create series-bible.md: visual world, palette, illustration style (shape language, line weight), guide/mascot design + expressions, motion personality, recurring visual teaching formats, sound-sync conventions, minimal label style, safe zones for {{FORMATS}}, age-band rules + text budget applied. Render an illustration test sheet (mascot + 4–6 key objects); add a font test sheet only if letters/numbers/labels are used.
Create learning-plan.md: objectives, key vocabulary, concept order, introduce/reinforce/recall points, interaction pauses, recap.
Create visual-screenplay.json for ALL {{LINE_COUNT}} lines:
{
  "line": 0,
  "start": ...,
  "end": ...,
  "text": "...",
  "teachingGoal": "...",
  "syncWord": "...",
  "onScreenObject": "...",
  "visualConcept": "...",
  "howShownVisually": "... (what the child SEES happen)",
  "onScreenText": "none | <the letter/number/label, within the text budget>",
  "background": "...",
  "graphics": [...],
  "motion": "...",
  "transitionIn": "...",
  "transitionOut": "...",
  "interaction": "none | question | pause | celebrate",
  "energy": 1-10,
  "accuracyNotes": "...",
  "ageCheck": "...",
  "customAssetsNeeded": [...],
  "notes": "..."
}
Explicitly group adjacent lines into shared visual sequences.

# IMPORTANT REVIEW
Review it yourself. Reject concepts that are:
- factually wrong or ambiguous (wrong colour, wrong count, wrong animal sound, wrong stroke order)
- too fast / too many items for {{AGE_BAND}}
- scary, unsafe, overstimulating, flashing
- decoration with no learning value
- generic zoom/slide/fade
- culturally off for Indian kids
- relying on reading to be understood (fails the no-text test)
- over the age's text budget, or any caption/sentence on screen
Check how often each idea repeats: repetition of FORMAT is good, repetition of the same lazy animation is not.

# TECHNICAL FEASIBILITY
Must be achievable in Remotion/React with SVG, CSS transforms, Canvas where useful, procedural graphics, masks, filters, textures and generated assets.

Create only the files above. Then give me a concise summary of the learning flow and the 10 strongest visual moments so I can review before implementation.
```

---

## E · Engine + hero proof
Short form: **"direction approved"**

```
Learning & creative direction APPROVED.
series-bible.md, learning-plan.md and visual-screenplay.json are now the source of truth. Do not redesign unless implementation reveals a genuine technical problem.
The word timestamps, phrases and original audio remain FROZEN.
Now begin implementation in Remotion + React/TypeScript.
DO NOT render the whole {{DURATION_S}}-second video yet. We establish the QUALITY BAR first.

# PHASE 1 — ENGINE (reused for the whole series)
Clean architecture: timing/ typography/ backgrounds/ graphics/ characters/ transitions/ effects/ camera/ sequences/ formats/ assets/ utils/
The engine is GRAPHICS-FIRST: illustration and character systems are the core; text is a small add-on.
Low-level primitives: illustrated objects with animatable parts (wheels turn, tails wag, petals open), character rigs with expressions (happy/sad/surprised/sleepy) and actions (blink, wave, point, nod, look-at, eat, jump), object reveal, count-along pops, letter/numeral stroke-order tracing (English + Devanagari, only for when they're the lesson), arrows/✓/✗ symbols, diagram builders (cycles, cutaways, side-by-side), soft camera moves, parallax, textures, gentle pops/sparkles, background transitions.
Teaching formats on top: RevealAndName, ShowTheAction, CountAlong, TraceTheLetter, CompareTwo, Sequence/LifeCycle, FindIt/QuizPause, Recap (picture parade) (+ custom ones the screenplay needs).
These are tools; the screenplay makes the creative decisions.

# MOTION MUST FEEL DESIGNED
Avoid: linear slides, scale(0→1) pops on everything, the same spring everywhere, constant fades, everything entering separately, random rotation/glitch, hard resets.
Need: anticipation, overshoot, follow-through, weight, settle — softer and slower for younger ages. Materials feel different (rubber ball bounces, cloth floats, elephant is heavy).

# SAFETY & ACCURACY (from age-bands.md)
No flashing > 3/s, no full-frame flashes, no scary/unsafe imagery, no clutter behind the teaching object. Correct colours, counts, sounds, shapes, stroke order.

# OUTPUT FORMATS
Render for {{FORMATS}}. Keep critical content (teaching object, characters, any label) clear of Reels/Shorts UI (bottom caption, right-side buttons, top) and any app player controls; decoration may bleed.

# PERFORMANCE
SVG/CSS/Remotion-native first; Canvas only when needed; precompute paths; deterministic — no Math.random() without seeding.

# PHASE 2 — HERO PROOF
Build ONLY {{HERO_RANGE}} (5–15 s showing the series' signature teaching format) at FULL final quality — no placeholders.
Render hero-proof.mp4 (30 FPS, original audio) in the primary format.

# QA — inspect rendered frames, not code
1. word ↔ object sync (object visible at/before word start)
2. accuracy (colour, count, sound, shape, stroke order, facts)
3. broken Devanagari shaping
4. graphics-first: within the text budget, no captions, and every scene passes the no-text test
5. pacing for {{AGE_BAND}}
6. flashing / overstimulation / anything scary
7. clipping, overlaps, objects teleporting
8. weak or unmotivated transitions, linear-feeling motion
9. content hidden by platform/app UI
10. interaction pauses hold long enough and reveal the answer
Bar: "Would a parent and an early-years teacher happily show this to a child — and would the child understand it?"

# DELIVERABLES
hero-proof.mp4, implementation-notes.md (architecture, components, assets, deviations and why, known weaknesses, perf notes, checksums), and 8 representative PNG frames in hero-frames/.
STOP after the hero proof. Do NOT continue until I approve.
```

## E2 · Scope-down (any time)
Short form: **"make a small section quickly"**

```
can we make a small section of the video quickly with all this & not take too much time
```
→ Cut to the shortest representative moment (~5 s) at final quality and render it.

---

## F · Full render
Short form: **"approved, make the full video"**

```
I approve hero-proof.mp4. Build the full video on the same engine following the screenplay.
Before the final render, make contact sheets at every key moment (each object introduction, every count, every letter trace, every pause and reveal, the recap), inspect them (including the no-text test), fix issues, then render:
final-{{slug}}-{{format}}.mp4 for each of {{FORMATS}}.
Update implementation-notes.md with known weaknesses. Stop.
```

## G · Render a section
Short form: **"now from 0:40 to 1:30"**

```
Now make the section from {{start}} to {{end}} on the same engine — contact sheets first, fix, then render section-{{start}}-{{end}}.mp4. Stop.
```

## Next video in the same series
Short form: **"new video, same series"**
Reuse `series-bible.md` and the `video/` engine (frozen). Run A → B → C → D (per-video learning-plan + screenplay only) → F. Run E only if new formats or assets are needed.
