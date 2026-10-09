# Stage 0: Inspect & brief, "Arjuna and the bird's eye"

Date: 2026-10-09 · Status: **waiting for brief + approval** (alignment not started)

## Inputs
| File | Findings |
|---|---|
| `arjuna narration.mp3` | 2:48.67 (168.7 s) · MP3 192 kb/s · 44.1 kHz · **mono** · mean −20.2 dB, peak −1.7 dB. ElevenLabs TTS. **Clean voice only**: the gaps between lines drop below −45 dB (57 silences of 0.4–1.5 s), so there's no music bed and no Demucs pass is needed. |
| `arjuna narration.txt` | UTF-8 · **38 spoken lines** (74 physical lines, blank-line separated; lines 15+16 sit together but are 2 spoken lines) · ~275 words · **Hindi only, Devanagari**, no Latin. Uses `...` for dramatic pauses, `!`/`?`, quoted dialogue, and `शूँऽऽऽ` (an avagraha-elongated arrow whoosh). |

The silence count (57) is higher than the line count (38). That's consistent with the `...` pauses inside lines. Timing looks well-paced for alignment.

## Story / content
A Mahabharata episode: Guru Drona tests the princes on a wooden bird target. Duryodhana and then Yudhishthira "see the tree" and are sent back. Arjuna sees only the bird's eye and hits it. **Moral: एकाग्रता (focus/concentration).**
Characters: Drona, Duryodhana, Yudhishthira, Arjuna, other princes (crowd). One narrator voice does every role.

## Age-fit & accuracy flags (report only, script NOT changed)

### Must decide
1. **Age band.** This is a moral story with abstract vocabulary and a 2:49 runtime. **Recommend 6–9** (an OK stretch down to 5+). It is **not suitable for 0–3**, and heavy for 3–6.
2. **Bow and arrow (weapon rule).** The age-band rules say "no weapons". This is a traditional archery-*practice* story with a **wooden** target (line 5 says so). Proposed handling: archery is shown as a sport/skill, nothing living is targeted, the bird is clearly a painted wooden toy, nobody is ever in the line of fire, and no one points an arrow at a person. **Please confirm this is OK.**
3. **Line 62 "सीधा चिड़िया की आँख में जा लगा".** To a child this can read as hurting a bird. Visual fix (no script change): the wooden bird has a painted target-ring eye, and the arrow "tocks" into wood with a sparkle, no damage.

### Accuracy (popular retelling vs. Mahabharata, Adi Parva)
4. **Order of turns.** In the source, Drona questions **Yudhishthira first**, then the others (Duryodhana, Bhima, etc.). The script puts Duryodhana first. This is common in kids' retellings and fine for storytelling. Flagged only.
5. **Outcome.** In the source, Arjuna sees the bird's head/eye and **severs the bird's head**. "Hits the eye" is the standard popular version. Fine, and safer.
6. **Line 68 wording**: "महान बनने के लिए सिर्फ़ ताकत या घमंड नहीं…" ("not *only* strength or pride…") implies pride helps a little. Pride (घमंड) is the thing being rejected. The audio is already recorded, so the visual will show घमंड as clearly wrong and focus as the answer. **Re-record only if you want the moral airtight**, e.g. "…ताकत या घमंड से नहीं…".

### Vocabulary above 3–6 (fine for 6–9 if shown visually)
धनुर्धर · प्रत्यंचा · अकड़कर · झल्लाकर · असंभव · अटूट एकाग्रता · लक्ष्य · बाएँ हाथ का खेल (idiom). Each needs a clear **show beat**, e.g. प्रत्यंचा = close-up of the bowstring pulled back; एकाग्रता = everything blurs/fades away except the eye.

### Behaviour / safety
7. **Line 24: Duryodhana slams his bow down in anger.** It's OK as the *wrong* example, but stage it gently (a thud and a dust puff, no breaking or shaking) and don't make it look cool or funny.
8. **Line 11 "हा हा हा!" mocking laugh** and line 22 face "red with anger": keep them comic-arrogant, not menacing. A blushing-red cheek tint, **no red full-frame flash** (photosensitivity rule).
9. **Characters**: respectful, original designs for Drona and the Pandavas/Kauravas. Don't imitate any TV serial or existing animated series. Show diverse but period-appropriate Indian looks.

### Interaction / pacing
10. Line 36 "क्या ये चुनौती… सचमुच असंभव थी?" is a rhetorical question and a natural **think pause**. Line 1 is also a hook question. Both will be measured in Stage 1.
11. Expected alignment hotspots: `शूँऽऽऽ` (vocal SFX), the elongated `...` holds, and the laugh "हा हा हा".

## Brief: needs your answers
| Item | Proposed default | Confirm? |
|---|---|---|
| Age band | **6–9** | ? |
| Topic | Arjuna & the bird's eye (महाभारत कथा) | ? |
| Learning objectives | 1) Child can retell the story: who tried, what each saw, who succeeded · 2) Child understands **एकाग्रता** = looking only at your goal · 3) Child sees that showing off/anger (घमंड) doesn't help | ? |
| Language | Hindi (Devanagari) | ✓ |
| Text on screen | 6–9 budget: at most 1–3-word labels, e.g. "लक्ष्य" or "एकाग्रता" once at the moral. **Default: none** | ? |
| Series name | e.g. "कहानी के रंग" / "Mythology for kids"? | ? |
| Output | **1080×1920 9:16** (Reels/Shorts) + in-app player? (app size, and do controls overlay the video?) | ? |
| Disk | 14 GB free (OK; ~5 GB needed) | ✓ |
