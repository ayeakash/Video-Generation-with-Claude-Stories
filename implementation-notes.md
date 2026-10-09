# Implementation notes: Arjuna and the bird's eye

## FROZEN (sync test approved 2026-10-09)
These files must not change. Re-verify with `shasum -a 256 -c` before every render.

```
203680e80d64132760f35b314038294e2e3b4c28e4fc4c701b6181b14132d9a7  arjuna narration.mp3
ecb9da674c8eea5a56396c791ac65d3ef68a04e9c95c6e17c1dccd305fa840dd  arjuna narration.txt
3e1238a0af3c8e1e2ce6cd173ec450bfdff5aad15ee16ba09a79097d03322921  word-timestamps.json
7890810648579b2bf300097fc515e487fca3ee7c45f2984a922f2a000eeaaf3c  phrases.json
```
(The same list is saved as `frozen.sha256`.)

## Stage 1: alignment
- torchaudio 2.5.1 MMS_FA + uroman, with a wildcard `*` between lines. No Demucs (clean TTS voice, real silences between lines).
- Clean-up: held-vowel extension (−42 dB), line-final tails to the silence onset (−45 dB), gaps under 80 ms closed.
- Cross-check: mlx-whisper large-v3-turbo. Its word starts snap 0.3–2.5 s early on this file, so lines are verified against silence edges (36/38 within 20 ms) and Whisper end times.
- Manual override: the line 6 "हा हा हा" is pinned to laugh bursts 29.569 / 30.011 / 30.290 s. 31.21–32.35 s is an unscripted chuckle.
- Think pauses: after line 1 (5.760–7.291) and line 19 (89.747–90.967).

## Stage 2: sync test
- `alignment/sync_test.py`, Pillow + libraqm (needs `DYLD_FALLBACK_LIBRARY_PATH=/opt/homebrew/lib`), Noto Sans Devanagari (OFL) in `assets/fonts/`.
- `sync-test.mp4`: 1080×1920, 30 fps, 168.67 s. Approved by the user.

## Stage 3: creative direction (2026-10-09)
- `series-bible.md` (series "Kahaani Ki Seekh", working title), `learning-plan.md`, `visual-screenplay.json` (38 lines, 9 sequences, every syncWord checked against the frozen timing), `audio-map.json` (librosa: per-word peak dB and pitch, ≤2 emphasis words per line, energy 1–10).
- Illustration test sheet: `design/illustration-test-sheet.png` (generator `design/test_sheet.py`; rig-ready SVG groups; resvg render).
- No on-screen text anywhere (onScreenText = none ×38).
- Revisions (user feedback): princes made visibly distinct (hair, garments, build, height); aiming pose re-layered so the string is in front of the face with an under-chin anchor; bird re-seated on a flat branch tip. Bowstring darkened to #5A4632.

## Stage 4: engine + hero proof (2026-10-09)
**Hero proof:** `hero-proof.mp4`, 108.3–120.9 s of the narration (L25–L27), 1080×1920, 30 fps, h264 CRF 18, original audio (offset checked against silence edges: within 10 ms). 8 frames in `hero-frames/`. Renders in about 14 s on an M2.

### Architecture (`video/`, Remotion 4.0.534, React 19, TypeScript)
- `scripts/sync-frozen.mjs`: verifies `frozen.sha256` and copies the audio and timing into the engine. **Every render runs it first and aborts if a frozen file changed.**
- `src/timing/clock.tsx`: one story clock (`useStoryTime`), `word(line, text)` lookups (they throw if the script lacks the word), and `mouthOpen()`, which opens a mouth only inside that speaker's word spans.
- `src/utils/motion.ts`: easing families, per-material springs (cloth, body, swagger, wood, glow), seeded PRNG, deterministic blink, and 2D matrices. There's no `Math.random`.
- `src/characters/`: `parts.tsx` (Face with blink, talking mouth, anger tint inside the face; Crown; Head with 6 hairstyles), `Prince.tsx` (one skeleton plus LOOKS; stand pose and aim pose), `Drona.tsx` (palm or beard pose, lean, head tilt, talk, smile). All ported 1:1 from the approved test sheet.
- **Aim pose:** the torso leans about the waist, then the "T" (head, arms, bow, string, arrow) rotates about the neck. The string stays under the chin and in front of the face at any aim angle.
- `src/graphics/props.tsx`: WoodenBird (rock about the base, eye glint), Tree (level perch, cord wraps, separable canopy/branch opacity), FocusRing (draw-on plus lock echo).
- `src/backgrounds/Gurukul.tsx`: sky, hills, huts and ground as parallax layers.
- `src/camera/Camera.tsx`: keyframed camera, zoom interpolated in log space, applied as an **SVG transform** so vectors stay crisp at 26× zoom.
- `src/formats/POVWindow.tsx`: the signature teaching format (circular eye-view with a feathered warm-dark surround that matches the pupil ink, so the iris transition is seamless).
- `src/sequences/S6ArjunaSees.tsx`: the hero. Every beat is keyed to frozen word times (द्रोणाचार्य, पूछा, अर्जुन, दिखाई, मुझे, बस, चिड़िया, आँख).
- `typography/`, `transitions/`, `effects/` are empty for now (no on-screen text in this series; the iris and effects live inside the format and sequence until a second use justifies extracting them).

### Accuracy and safety decisions
- **The arrow axis passes exactly through the painted eye:** the bird is placed on the line of aim computed from the rig.
- Arrows point only up and away. Drona stands behind the archer's draw side, never in the line of fire.
- No flashes: the ring draws on over 550 ms; the lock echo expands and fades over 800 ms; the eye glint is a spring.
- No text anywhere.
- Teaching objects sit inside the critical box. The POV window rim crosses the right UI column only as decoration.

### Deviations from the screenplay
- L27 inner framing: the window opens on the **whole tree** (per the screenplay), then the push-in to the bird runs *during* the fade ("मुझे…बस") instead of after it, which reads more continuously.
- The world tree is placed far away (small, on the horizon) so the bird reads as a small, high target and the aim angle stays natural (16° lean + 22° T-rotation).

### Known weaknesses
- Characters are front-facing flat rigs. Aiming reads well, but there are no 3/4 or profile turns yet.
- The wide shot has little ambient motion (deliberate stillness after "शांत", but the full video should add gentle cloth and leaf motion outside the hush).
- In the "falling away" frame the world turns greyish-warm for about 0.5 s before the paper wash takes over.
    0d9969333ff220d0a2bf2f58a8f576ace77472029a3a08afb0f4718700f9803d  hero-proof.mp4
    d4ce92bd3046d501d8279d5f082f51beea5fe844f0be295cfdd8698b177f21de  hero-frames/01-wide-guru-and-arjuna.png
    dfe3b3f899b415b1a8bd6a5f1b925981529d8597f807fcc4d5e872156a3e2367  hero-frames/02-drona-asks-puchha.png
    46bbc06e29dbe3f67ca1d1045214634037f9449fa31104b741bc77afe85b891a  hero-frames/03-arjuna-focused-closeup.png
    7c0e8f437ff69284390323a7d1d670c32ffa4b9d9db0a55d5e1a4c8b24088efd  hero-frames/04-into-his-eye.png
    2f4aca6a4e3738f70810459733416dd4c364ba29aa66a7fd28628ba0f99bd620  hero-frames/05-pov-whole-tree-gurudev.png
    5d036b6706dc752549a562db55c1a2887971d381db96785855b18c7c85ce95fd  hero-frames/06-world-falls-away-bas.png
    ee830cf2086546f07df6fad32c9a183a0f9c635459a05e85d6bdf4526e68174f  hero-frames/07-only-the-bird-chidiya.png
    b260beded1e668674bcce58e2cec73838eab28c3bcac33d2e66decea034c8d88  hero-frames/08-ring-locked-on-aankh.png

## Stage 4 revision: character views (2026-10-09, user feedback)
- **Views in the engine:** `parts.tsx` (`Head` dispatches front, 3/4, side, back; `Face` uses per-view layouts; `Crown` has a back variant), `PrinceViews.tsx` (3/4, side and back bodies, walk cycle, namaste), `Prince.tsx` (view, walk, namaste, contact `Shadow`, back-view aim), `Drona.tsx` (front, 3/4, side, back; palm, beard and rest poses), `Girl.tsx` (new; four views, paper ball).
- **QA compositions:** `TurnaroundA` and `TurnaroundB` render every character in every view from the engine → `design/turnaround-A.png`, `design/turnaround-B.png`.
- **Back-view aim:** the same pose seen from behind (mirrored). The head is drawn last, so it hides the anchor, string and draw hand (physically correct from behind).
- **Screenplay:** `shot`, `camera`, `views` and `extras` added to all 38 lines (`design/build_screenplay.py`); L18, L25 and L30 re-described. Bible §5b (camera grammar) and §5c (more interesting) added.
- **Pending:** the hero proof (L25–27) is to be re-rendered with the over-the-shoulder opening (L25) after the views are approved.
- **3/4 rebuilt (user: "3/4 views look very weird"):** the first pass had the turn backwards (small eye on the near side, near arm on the far side, a round front head with the nose drawn on the cheek). Now, facing screen-right: a dedicated turned silhouette (`HEAD34`) with the nose breaking the outline and the chin left of the nose; the near eye is full size, the far eye is squeezed (0.7) toward the nose; the near ear is set back; the hairline sweeps toward the face side; the crown is centred on the face line. Bodies: the near shoulder, arm and leg (screen-left) are full width and in front, the far side narrows behind, and the chest centre line and necklace shift toward the facing side. Applied to the princes, Drona and the girl.
- **3/4 faces, second fix (user: eyes and nose still weird):** the nose that broke the outline read as a beak and pinched the far eye. Now the head is a smooth turned egg with the chin toward the facing side; the nose is the **same small hook as the front view**, placed inside the face toward the far eye; the eyes are similar size (far eye 0.86 wide) with even spacing; the blush is kept clear of the nose. Checked at 1.5× against the front view for all six characters (`design/heads-front-vs-3q.png`).

## Hero proof v2 (2026-10-09, user feedback on sync and zoom)
- **Sync:** Arjuna's view no longer opens while Drona is still asking. Shot B holds on Drona (3/4, mouth on his words) through "…दिखाई दे रहा है?"; the glide to Arjuna's face lands as "है" ends (114.38 s); his view opens 115.05–115.55 s, just before he answers "गुरुदेव" (115.65 s).
- **No lingering eye shot:** the push toward his eye is short and gentle (2.9× → 5.2× over ~1.2 s, soft-linear), not the old 26× dive into the pupil. The window grows straight out of the eye.
- **Human-like zoom in the view:** one continuous zoom from the whole tree to the painted eye (0.6× → 8.7×), log-linear with short soft ends (`softLinear`), from just before "मुझे" to just after "आँख". The eye glides steadily to the centre as the zoom grows. The fades and blur stay keyed to मुझे / बस / चिड़िया.
- **New opening (approved views):** an over-the-shoulder shot from behind Arjuna (back-view aim). The far tree is placed on his line of aim (`treeOnAim`), and Drona (3/4) leans in on "पूछा". Cut to shot B in the silence before Drona speaks (111.15 s).
    19993b770deb3a51bb69f889c79e7d999a2379ad16068cea292d555093957061  hero-proof.mp4

## Hero proof v3 + staging (2026-10-09, user feedback: views without spatial logic; abrupt cuts)
- **Problem:** v2 showed Arjuna from behind with Drona, then from the front with Drona, on the same backdrop. That's a camera jump across the action with no change of background. From behind, the bow also pointed the "wrong" way (it read as left-handed). The cut between them was abrupt.
- **Fix: a floor plan** (`design/staging-plan.py/.png`) defines positions, facings and camera setups. C1 main stage looks north (target on the right, all archery); C2 reverse looks south (new **ashram backdrop**, `backgrounds/Ashram.tsx`, sun flips to the left via `Sky sunX`); plus SKY, POV, CU and HOME. Views are derived from the plan; back views are used only where they are true. Back-view aiming is retired.
- **Backdrops:** `FarTrees` added to the north horizon (huts moved to the south backdrop). The ashram has huts, tulsi platform, well, mango tree, pots and a low wall on a rise. `design/backdrops-C1-C2.png` (`Staging` composition).
- **Transitions:** continuous moves within a setup; between setups sky-tilt, wipe-by-figure, iris, match/ripple, or a dissolve of 0.5 s or less; never a cut inside a spoken phrase. The screenplay now has `setup`, `backdrop`, `shot`, `transitionIn`, `views` and `extras` for all 38 lines.
- **Hero v3:** **one continuous C1 camera, no cuts** (wide with soft foreground watchers in back view → glide to Drona on "द्रोणाचार्य", he leans on "पूछा" → hold while he asks → glide to Arjuna's face as "है" ends → short push → iris just before "गुरुदेव" → steady POV zoom). The foreground watchers fade as the camera moves in.
    3b70de76b07797899c13f39903a339dce0b632a3ead4ca6b2a0a792e13681d2f  hero-proof.mp4
- **Drona's head (user: "very lifted from his torso"):** the head centre moved down 24 px (`hy` 140 → 164) onto a short visible neck, and his white hair now falls behind to his shoulders (front, 3/4, back) instead of ending in a straight edge. There's no sky gap between head and shoulders in any view. The hero proof, turnaround A, the C1/C2 sheet and the hero frames are re-rendered.
    694bf8323d2ca347197f1afdfb9b84813ac11b2d12506a0b4141bfad643089a0  hero-proof.mp4

## Review clips (2026-10-09): five random 5 s windows, one from each of five sequences (seeded draw)
`review-clips/`: Clip1-L2-arrival (7.9 s, C2), Clip2-L8-duryodhana-asked (42.0 s, C1), Clip3-L17-yudhishthira-steps-back (78.0 s, POV→C1→wipe→C2), Clip4-L34-the-lesson (144.5 s, C2→dissolve→C1 afternoon), Clip5-L37-today (159.5 s, eye match → HOME).
- Built as real scenes on the shared floor plan (`sequences/shared.tsx`, `sequences/ReviewClips.tsx`); they carry into Stage 5.
- New rig and props: front walk (toward or away from camera), `headTilt`, `nod`, `carryBow` (side), Drona back-view beckon/point and 3/4 `reach` (hand on shoulder), Diya, Kite, Basket, the arrow left in the painted eye after the hit, the HOME room set, `Sky` sunX/sunY/warm.
- QA fixes made before delivery: Drona moved left in C2 so his gesture isn't off-screen and Arjuna isn't hidden; strands added to his back-view hair; the target kept in frame while Duryodhana aims; the bow kept through Yudhishthira's nod and walk (no vanishing prop); the foreground watchers clear fully on push-in (no ghosts); Drona's hand actually on Arjuna's shoulder; a bigger diya on a stone stand; the ring tracks the girl's eye through her turn; the basket kept clear of the UI edge.
- Audio offsets checked against silence edges (within about 15 ms).
- **Not yet in these clips (planned for Stage 5):** ambient life (clouds, butterflies, falling leaves, squirrel), the soft foreground grass/leaf layer, god-rays.

## Stage 5: full episode (2026-10-09, autonomous run while the user was away; user asked for a creative, polished full render)
**Output:** `final-arjuna-birds-eye-9x16.mp4`, 1080×1920, 30 fps, 168.67 s, original narration. Composition `Episode` (`src/episode/Episode.tsx`) routes ten scenes on one story clock. Each scene begins on exactly the camera and frame the previous one ends on.

| Scene | Lines | Creative device |
|---|---|---|
| A opening | L1–L2 | Rim-lit prince silhouettes on a dawn ridge (large, tracking with parallax; heads lift in a chain on "कौन"). A golden bow rises behind the ridge, glints on "धनुर्धर", turns to the silhouettes and **morphs into a "?"**. The dot **falls**, the camera dives into the dark ground and cranes up at the ashram where the same dot **rises as the sun** (dawn → morning sky, rays). Drona walks in (profile) across his name, the princes **run in** with run cycles and dust, he points up, heads tilt up in a chain, and a **whip-tilt** lands on the treetop. |
| B tree | L3–L4 | Tilt down the tall trunk; a glow runs along the डाल; push to the tiny bird; a falling **leaf taps it ("tok") and it rocks like a wooden toy**; the squirrel peeks; pull back to Drona; a quick push to the eye as the ring draws on "आँख". |
| C Duryodhana | L5–L13 | Swagger walk-in, crown glint, laugh bounces on the three bursts, left hand up on "बाएँ हाथ", puff-up on "अकड़कर", the string drawn on "निशाना साधा", glide to Drona, iris into a **drifting, busy view** (the tree glows on पेड़, branches wiggle on डालियाँ, the bird pulses on चिड़िया, the squirrel runs up the trunk, leaves fall). The view **closes back into his eye**, then the anger close-up (tint + steam), the stamp, **the crown slipping over his eyes**, the bow dropped with dust, snatched back up, and he stomps off. |
| D Yudhishthira | L14–L17 | Walk-in, namaste (3/4) with Drona's nod, a careful slow draw, a steady wide view with the whole tree glowing; the view closes, a soft palm, a nod of acceptance, walking off with the bow, and **Bhima's back wipes to the ashram line-up**. |
| E impossible? | L18–L19 | Heads turn to each other in a chain, Bhima shrugs; a **blurred tilt into the sky**; the bird shrinks into a vast sky; the golden "?" in the think pause. |
| F Arjuna | L20–L24 | We ride a single falling leaf down; Arjuna's calm walk-in; the **hush** (all ambient motion ramps to zero, the squirrel freezes, cooler light); low and backlit raise; a glint along the प्रत्यंचा and the slow draw; the breath held. |
| G hero | L25–L27 | (Approved v3) one continuous camera, the steady zoom inside his view, the ring lock. |
| H the shot | L28–L33 | The view closes into Drona's smile; nod and palm on "चलाओ"; release (the string snaps, air lines); cut to the flight **before** the arrow could reach the bird; side-on flight with parallax that slows to slow-motion on the holds; wind parts around the tip; the bird slides in on "सीधा", "tok" on "आँख", ripple rings and sparkles; the **ripple fills the frame → the jaw-drop chain** (and the squirrel), Duryodhana turns away. |
| I lesson | L34–L36 | Warm afternoon, the hand on the shoulder, the diya lights on "सीख"; on a plain page, Bhima lifts a log on "ताकत", Duryodhana puffs up on "घमंड", both grey out on "नहीं" and **slide apart to reveal Arjuna's eye**; the ring forms on "अटूट", **a butterfly and a leaf bounce off it**, and it glows on "एकाग्रता". |
| J today | L37–L38 | Eye → girl's eye (match); pull back into her room; the ring floats to the basket on "लक्ष्य"; the room stretches on "मुश्किल"; side-on wind-up and lob; it drops in on "आसान"; ripple, cheer, the storybook sparkle. |

**QA done before the final render:** contact sheets at about 70 key moments. Fixed: the dark band in tree close-ups (hills layer too short; hills redrawn as a continuous band), foreground-watcher ghosts at medium zoom, the bow peeking over the ridge, Drona's walk-in being too fast, the arrow passing through the bird in the wide shot, the empty lower half of the flight, small figures in L35, a muddy vignette on Arjuna's close-up, and the opening whip-blur edge band.

### Final QA on the delivered file (`final-arjuna-birds-eye-9x16.mp4`)
- h264 1080×1920 30 fps + AAC, 168.70 s. Renders in about 4.7 min on an M2 (`npm --prefix video run sync && npx remotion render … Episode`).
- **Audio sync:** all 38 line starts vs silence edges: median 7 ms, max 73 ms (the known early voice onset on L27).
- **Scene joins:** frames just before, on and just after every boundary inspected. Pops fixed at G→H (ring), E→F ("?" + figures), I→J (glow/leaf), B→C (Drona's arm).
- **Photosensitivity:** no 1-second window has more than 3 large luma jumps. Iris transitions were softened from a one-frame 128-level drop to a 3–4-frame ramp (max step 40). The flashing rule is met.
- **Frozen files verified** before every render (`frozen.sha256`).
- Stills: `final-frames/` (20 key moments + `contact-sheet.png`).
- **Known weaknesses:** turns between views are short crossfades (0.15–0.3 s) rather than drawn in-betweens; Bhima and Duryodhana in L35 could be larger; there's no music or SFX bed (narration only, per the brief).
    bac5e287804e9d22d5bed14947260085106b0f2c59fa3bd00d8919325dd6d83a  final-arjuna-birds-eye-9x16.mp4
