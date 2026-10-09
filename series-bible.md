# Series bible: "Kahaani Ki Seekh" (कहानी की सीख)

Picture-led Indian story videos for ages 6–9, 9:16 Shorts/Reels. The first episode is **Arjuna and the bird's eye**.
The series name is a working title; change it freely.

> FROZEN for this episode: `arjuna narration.mp3`, `arjuna narration.txt`, `word-timestamps.json`, `phrases.json` (checksums in `frozen.sha256`). Never modified by any later stage.

## 1. Core idea
**"What do you see?"** The story *is* a test of attention, so the camera becomes the eye. Every prince is asked the same question, and each time we go **inside his eye** and see the world as he sees it.
- Duryodhana sees everything, jittery and cluttered.
- Yudhishthira sees the whole tree, calm but wide.
- Arjuna sees the world fall away until only the bird's eye remains.

The child doesn't need the word एकाग्रता explained. They *watch* focus happen three times and feel the difference.

## 2. Signature device: the Focus Ring (लक्ष्य-वलय)
A warm golden circle (`#FFD34D`, 10 px stroke + a faint outer echo ring).
- **Introduced** on Drona's "आँख" (L4). It circles the painted eye once, as the target.
- **Wide and wobbly** for Duryodhana (L10), **wide and steady** for Yudhishthira (L16), **tightening and locking** for Arjuna (L27).
- **Unbreakable** on "अटूट" (L36): distractions bounce off it.
- **Passed on** to today's child (L37–38): the same ring lands on her basket.

It's the visual definition of एकाग्रता and the only recurring graphic. Never use it as decoration.

## 3. Visual world
- **Style:** warm Indian storybook, flat shapes with a soft deep-brown ink outline (`#3A2418`, 4 px at character scale), subtle paper grain (fractal noise ≈7%), no gradients on characters except the anger tint and light glows.
- **Places:** the gurukul clearing near Hastinapur. Thatched huts, a low mud wall, a tall tree with one long branch (the डाल) standing clear against the sky so the bird is always readable. Distant palace domes only in the opening hook.
- **Light tells time and mood:**
  - dawn saffron for the hook
  - morning gold for the challenge
  - a soft cooler hush when "पूरा मैदान शांत" (still warm, never dark)
  - warm afternoon gold for the moral
  - a modern home with daylight for the child scene
- **Palette:**

| Role | Hex | Role | Hex |
|---|---|---|---|
| dawn cream | `#FBE9C6` | saffron sky | `#F4A95A` |
| day sky | `#CFE6EA` | earth | `#D9A066` |
| leaf dark / mid / light | `#2F6B45` / `#4E9A5E` / `#8CC27A` | wood | `#A86B3C` |
| gold / highlight | `#E8B23A` / `#F7D774` | focus ring | `#FFD34D` |
| ink | `#3A2418` | paper | `#F7EEDC` |

  Each scene uses at most 4 dominant colours behind the action. The teaching object (bird, eye, ring) always has the highest contrast in the frame.

## 4. Characters (original designs, see `design/illustration-test-sheet.png`)
Proportions are about 1:4 (big friendly heads) for the princes and the child, and 1:6 for Drona (an adult, taller). Eyes are dark ovals with a white highlight. There's a tilak on the princes and a bindi on the girl.

| Character | Shape language | Colours | Personality in motion |
|---|---|---|---|
| **Guru Drona** | tall, lean, vertical; long white beard, white top-knot, sandal tilak, rudraksha mala, sacred thread | ochre dhoti, white angavastram | still and economical. One clear gesture per line (raised palm, chin-stroke, slow smile). Never shouts. |
| **Arjuna** | slimmest build; **long high ponytail with a teal tie**; small neat crown with a teal gem; **dark complexion** (traditional description) | cream dhoti, teal border and sash | quiet. Moves only when needed, slow and steady. His stillness is the point. |
| **Yudhishthira** | **tallest prince** (eldest); **shoulder-length curls**; thin young moustache; modest pearl band | white dhoti, **saffron shawl over both shoulders** | polite (namaste to the guru), careful, accepts the result gracefully. |
| **Duryodhana** | puffed chest and belly, wide stance; **wavy hair with curled ends**; **tallest showy crown** (red gem); **purple royal cape with gold shoulder discs** | maroon dhoti, purple sash | bouncy and swaggering, oversized gestures, chin up. Comic, never menacing. |
| **Bhima** (crowd) | **broadest, thick arms and legs**, slightly shorter; **short spiky crop**; plain gold headband, no crown | green dhoti, orange sash | big, friendly, strong (lifts the log in L35). |
| **Other princes** | 2–3 more from the same parts in new combinations | varied | react in small chains: head turns, shrugs, jaw-drops. |
| **Today's child** | an ≈8-year-old girl, two braids with red ribbons, yellow kurta, blue leggings | — | appears only in the moral and mirrors Arjuna's focused face. |

**Expressions:** calm, smile, focused (lids lowered, straight brows, flat mouth), smug, laugh (eyes closed arcs), angry (red tint rising chin → forehead inside the face only, brows down; tiny comic steam puffs allowed), surprised (round eyes, "o" mouth).
**Views (turnarounds in `design/turnaround-A.png`, `design/turnaround-B.png`, rendered by the engine itself):** every character has **front, 3/4, side and back**. 3/4 and side face screen-right, and mirroring gives the left-facing version. Body depth in side view scales with build, so Bhima stays broad from every angle. Extra actions: walk cycle (side and 3/4), namaste (front, 3/4, side), Drona's beard-stroke (front, 3/4, side). Aiming is drawn **front view only** (see §5b; the rig's back-view aim is retired because it breaks screen direction). The string is drawn in front of the face.
**Rig parts** (SVG groups): head (eyes, brows, mouth swappable), torso, armL, armR, legs, dhoti, crown, bow. Mouths flap **only during that speaker's word spans** from `word-timestamps.json`.

**Props:**
- **Wooden bird:** a painted green parrot on a peg and base, with visible wood grain and paint chips so it reads as a toy. Its **painted eye** is the target: white, black pupil, yellow ring.
- **Bow (धनुष), string (प्रत्यंचा), arrow (तीर):** a wooden bow with gold tips, a dark-brown string (`#5A4632`) that reads on light skies, a saffron-feathered arrow with a small steel tip.
- **Aiming pose rule:** an under-chin anchor. The string hand rests just below the chin, and the string is always drawn **in front of** the face and body (layer order: body → bow arm → bow → head → string + arrow → draw arm). The upper string clears the face.
- **Perch:** the long branch levels out into a flat tip in open sky. The bird's wooden base sits squarely on it, tied with two cord wraps, with no leaves behind the target.
- **Diya** for "सीख".
- **Paper ball + wicker basket** for the moral.

## 5. Motion personality
- **Storybook 2.5D:** layered parallax (sky / far / mid / characters / foreground leaves), soft camera moves (push, tilt, glide), never constant shake.
- **Physical, designed motion:** anticipation → action → overshoot → settle.
- **Each material moves differently:**
  - cloth sashes trail behind body moves
  - leaves flutter (seeded)
  - the wooden bird rocks stiffly on its peg (a heavy, low-frequency spring)
  - the bow flexes on the draw, then snaps back
  - Duryodhana's crown wobbles after each swagger
- **Tempo:** calm. At least 2 s per new idea. Arjuna's sequence is deliberately slower (ease-in-out 600–900 ms) than Duryodhana's (spring 250–400 ms).
- **Stillness is a tool:** on "पूरा मैदान… एकदम शांत" and "साँस रोक ली", all secondary motion ramps to zero. The `...` holds in the narration are honoured as held frames, not filled with busy motion.

## 5b. Staging & continuity (floor plan → views)
Every view is decided by **where the camera stands on the floor plan** (`design/staging-plan.png`), never chosen per shot for variety.
- **The ground:** the firing line is in the middle; the **target tree is EAST**; Drona stands behind-left of the archer facing him; the waiting princes stand stage-left in 3/4 facing the line; some watchers stand between camera and line. The **ashram is SOUTH** and the **morning sun is EAST**.
- **Camera setups:**

| Setup | Looks | Backdrop | Used for | How characters read |
|---|---|---|---|---|
| **C1 main stage** | north | target field: hills, far trees, the target tree on the RIGHT | **all archery**, Drona's questions | archer = **front**, bow → right · Drona = 3/4 facing right · watchers = **back** (soft foreground) · waiting princes = 3/4 facing right · someone walking to the line = back · walking back = side facing left |
| **C2 reverse** | south | ashram: huts, tulsi platform, well, mango tree, pots, low wall; **sun on the LEFT** | arrivals, the line-up, reactions (**never** the firing line) | princes = front / 3/4 (faces) · Drona calling them = back (foreground) |
| **SKY** | up / east | sky, branch, clouds | the tall tree, the tiny bird, the arrow's flight | arrow always flies **RIGHT** |
| **POV** | the prince's eye | his view of the tree | The Question (×3) | n/a |
| **CU** | as its setup | a soft, defocused version of that setup's backdrop | faces, the bowstring, the eye | as in its setup |
| **HOME** | n/a | girl's room; basket on the **RIGHT** (rhymes with the bird) | the moral | girl side/3/4 facing right |

- **The axis rule:** the arrow axis is always screen-right. No shot crosses it, so a child never sees the target jump sides.
- **Back views only where they are true:** watchers between camera and line, someone walking away into the scene, Drona calling toward the ashram. **No back-view aiming.** (From behind, the bow would point the other way; that is the continuity break we removed.)
- **Moves between setups (no abrupt cuts):**
  - **continuous** camera moves within a setup (the default)
  - **sky-tilt:** tilt up into empty sky and come down in the other setup
  - **wipe-by-figure:** a foreground prince passes the lens
  - **iris:** from the eye into the POV window and back
  - **match / ripple dissolves:** shape-to-shape or golden rings filling the frame
  - **soft dissolve** of 0.5 s or less
  - **Never a hard cut inside a spoken phrase;** any setup change lands in a pause between lines.

## 5c. Making it more interesting (without overstimulating)
- **Contact shadows** under every character, long at dawn (L1–2) and short by afternoon (L34).
- **Foreground depth layer:** soft, out-of-focus grass and leaves at the frame edges in wide shots.
- **Ambient life outside the hush:** drifting clouds, two butterflies, falling leaves, swaying grass and dust motes in the light. All of it **ramps to zero at "पूरा मैदान… एकदम शांत" (L21)** and stays still until the release (L30).
- **Light:** soft god-rays through the canopy (L3), a sun rim-light on Arjuna at full draw (L22), warm afternoon light for the lesson (L34).
- **A recurring squirrel cameo** (original design): peeks from the trunk (L3), is part of Duryodhana's busy view (L10), freezes mid-step in the hush (L21), and jaw-drops with the princes (L33). It's a small, kid-pleasing thread that never sits on the target.
- **One gentle comic beat:** Duryodhana's tall crown slips over his eyes when he stamps (L13) and he shoves it back up. Slapstick about pride, not mockery of a person.
- Limits stay as before: ≤3 moving accents per frame, nothing near the teaching object while it is being named, no flashes.

## 6. Recurring formats
1. **The Question** ("तुम्हें क्या दिखाई दे रहा है?"): one continuous C1 move. Drona (3/4) asks; as the question ends the camera glides to the prince's front close-up; a short push toward his eye; his view opens from the eye as a **circular POV window**. Used 3×.
2. **POV Window:** inside the circle we see exactly what the prince names, each thing pulsing on its word. The window's size and steadiness show the quality of attention.
3. **Step Back** ("पीछे हट जाओ"): Drona's open palm and a slow head-shake; the prince steps back into the line. Used 2×, the second time softer.
4. **Reaction Chain:** princes react one after another, left to right, about 120 ms apart.
5. **Focus Ring:** see section 2.

## 7. Sound-sync conventions
- `word.start` of the named thing = it is on screen and in focus (show it ≈80–150 ms early, never late).
- Story actions land on their verbs: उठाया = bow rises, खींची = string draws, पटक दिया = bow thuds, जा लगा = arrow hits.
- Dialogue mouths open only inside word spans.
- Think pauses (after L1 and L19) hold a simplified frame with the bow-shaped "?" symbol.
- `audio-map.json` emphasis peaks may add a small secondary pop (≤6% scale) to the *already-visible* object. Don't pulse on every peak.
- No added music or SFX in this episode (narration only). Visual "sound" comes from motion lines and small dust or sparkle puffs.

## 8. Text budget (6–9) applied
**No on-screen text at all.** No titles, captions, labels or name tags. Characters are identified by consistent design plus the narrator naming them while they act (the named prince steps forward on his name). The only symbol is a **"?" formed by a curved bow with a round arrow-tip as its dot**: a picture, not a word. No-text test: passes by design.

## 9. Safe zones (1080×1920, Shorts/Reels)
- Top 220 px: platform header/progress. Nothing critical.
- Bottom 400 px: captions, handle, CTA. Nothing critical (ground and feet may sit here).
- Right 140 px from y 900–1700: like/share column. Keep faces and the bird out.
- **Critical-action box:** x 70–940, y 240–1500. Every teaching object (bird, eye, ring, faces) lives here. The bird's branch is always composed in the upper-middle third.

## 10. Child-safety rules for this story
- Archery is shown as a **skill and practice**: arrows only ever point up and away toward the wooden target, never at a person or at the camera. The bow is lowered between turns.
- The target is unmistakably **wooden** (grain, peg, base, paint chips). The hit is a wood "tock" with golden rings rippling out from the painted eye. The bird rocks but doesn't break, and there's no damage imagery.
- Anger (L12–13) is comic and brief: the red tint stays inside the face, there are no red full-frame washes, and the bow thud makes a small dust puff with nothing breaking. Drona stays calm, and the scene doesn't reward the tantrum.
- No flashes; glows fade in over ≥300 ms; nothing alternates faster than 3 Hz.
- Respectful depiction of a guru and of epic characters. Original designs only, not modelled on any TV serial or existing animated series.
