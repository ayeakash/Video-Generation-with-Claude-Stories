// Five review scenes (5 s each), drawn at random from five different sequences. Built as real episode scenes
// on the shared floor plan; every beat is keyed to FROZEN word times.
import React from "react";
import { useStoryTime, word, mouthOpen, line } from "../timing/clock";
import { camAt, CamKey, Cam, W, H, Layer, toScreen } from "../camera/Camera";
import { Prince, place } from "../characters/Prince";
import { Drona } from "../characters/Drona";
import { Girl, PaperBall } from "../characters/Girl";
import { FocusRing, Diya, Basket } from "../graphics/props";
import { Room, FLOOR_Y } from "../backgrounds/Home";
import { HORIZON } from "../backgrounds/Gurukul";
import { ASHRAM_RISE } from "../backgrounds/Ashram";
import { POV_CENTER } from "../formats/POVWindow";
import {
  C1World, C2World, Watchers, ArcherAim, archerEye, LINEUP, DRONA_C1, DRONA_C1_FACE, FIRING, POVWholeTree, Grain, softLinear, P2,
} from "./shared";
import { blink, clamp, ease, lerp, progress, spring, MATERIAL, svgM, rng } from "../utils/motion";

const Frame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
    <rect width={W} height={H} fill="#2A1B12" />
    {children}
    <Grain />
  </svg>
);
const Fade: React.FC<{ o: number; children: React.ReactNode }> = ({ o, children }) => (o <= 0 ? null : <g opacity={clamp(o)}>{children}</g>);

// ============ Clip 1 · L2 (C2 ashram): sunrise, Drona calls, the princes run in, "चुनौती" → he points up ============
export const ClipArrival: React.FC = () => {
  const t = useStoryTime();
  const wSubah = word(2, "सुबह"), wGuru = word(2, "गुरु"), wSabhi = word(2, "सभी"), wAnokhi = word(2, "अनोखी"), wChunauti = word(2, "चुनौती");
  const sunY = lerp(820, 520, ease.out(progress(t, word(2, "एक").start, wSubah.end + 0.8)));
  const cam = camAt([
    { t: 7.2, cam: { cx: 540, cy: 1260, z: 1.0 } },
    { t: wChunauti.start + 0.1, cam: { cx: 540, cy: 1280, z: 1.04 }, ease: ease.linear },
    { t: wChunauti.end + 0.6, cam: { cx: 540, cy: 380, z: 1.04 }, ease: ease.in }, // sky-tilt begins (→ L3 on C1)
  ], t);
  const beckon = spring(t - wGuru.start, MATERIAL.body);
  const point = spring(t - wAnokhi.start, MATERIAL.body);
  const surprised = t > wChunauti.start;
  const start = wSabhi.start - 0.1;
  const far = HORIZON - ASHRAM_RISE + 60;
  const princes = LINEUP.map((p, i) => {
    const t0 = start + i * 0.16, dur = 1.35;
    const u = progress(t, t0, t0 + dur);
    const e = ease.out(u);
    const x = lerp(300 + i * 170, p.x + 70, e), y = lerp(far, 1660, e), s = lerp(0.3, 0.84, e);
    const running = u > 0 && u < 1;
    const settle = u >= 1 ? -6 * Math.exp(-(t - t0 - dur) * 6) * Math.cos((t - t0 - dur) * 18) : 0;
    const dust = running && Math.floor((t - t0) * 8) % 2 === 0;
    if (t < t0) return null;
    return (
      <g key={p.look}>
        {dust && <ellipse cx={x} cy={y + 4} rx={30 * s} ry={8 * s} fill="#E8C79A" opacity={0.6} />}
        <g transform={svgM(place(x, y + settle, s))}>
          <Prince look={p.look} expr={surprised ? "surprised" : "calm"} walk={running ? (t - t0) * 2.6 : 0} blink={blink(t, 20 + i)} />
        </g>
      </g>
    );
  }).reverse(); // nearer (later, larger) princes draw last
  return (
    <Frame>
      <C2World cam={cam} sunY={sunY}>
        {princes}
        <g transform={svgM(place(150, 2260, 1.35))}>
          <Drona view="back" pose={t < wAnokhi.start ? "palm" : "point"} raise={t < wAnokhi.start ? beckon : point} />
        </g>
      </C2World>
    </Frame>
  );
};

// ============ Clip 2 · L7 end → L8 → L9 start (C1): Duryodhana aims, the guru is named, leans in, "बताओ दुर्योधन" ============
export const ClipDuryodhanaAsked: React.FC = () => {
  const t = useStoryTime();
  const wDrona = word(8, "द्रोणाचार्य"), wPuchha = word(8, "पूछा"), wBatao = word(9, "बताओ");
  const dEye = archerEye("duryodhana");
  const cam = camAt([
    { t: 41.6, cam: { cx: 530, cy: 1380, z: 1.42 } },                     // the target stays in frame while he aims
    { t: wDrona.start - 0.2, cam: { cx: 515, cy: 1385, z: 1.46 }, ease: ease.linear },
    { t: wPuchha.end, cam: { cx: 330, cy: 1230, z: 1.6 }, ease: ease.inOut },
    { t: wBatao.start + 0.3, cam: { cx: DRONA_C1_FACE[0] + 120, cy: DRONA_C1_FACE[1] + 110, z: 2.0 }, ease: ease.inOut },
  ], t);
  const lean = spring(t - wPuchha.start, MATERIAL.body);
  return (
    <Frame>
      <C1World cam={cam} foreground={<Watchers />}>
        <g transform={svgM(place(DRONA_C1.x, DRONA_C1.y, DRONA_C1.s))}>
          <Drona view="threeQuarter" pose="beard" stroke={(t - 41) * 0.42} lean={4 * lean} headTilt={-2 + 6 * lean} mouth={mouthOpen(t, [9])} blink={blink(t, 11)} />
        </g>
        <ArcherAim look="duryodhana" expr="smug" blink={blink(t, 31)} />
      </C1World>
    </Frame>
  );
};

// ============ Clip 3 · L16 end → L17 → L18 start: his wide view closes into his eye; "तुम भी पीछे हट जाओ!";
//              he bows his head and walks back; Bhima's back wipes to the line-up (C2) ============
export const ClipYudhishthiraStepsBack: React.FC = () => {
  const t = useStoryTime();
  const L16 = line(16), wPeechhe = word(17, "पीछे"), wTum = word(17, "तुम"), L17 = line(17), wSabhi = word(18, "सभी");
  const yEye = archerEye("yudhishthira");
  const close = { start: L16.end + 0.15, end: L16.end + 0.75 };
  const closeU = progress(t, close.start, close.end);
  const lowered = t > wPeechhe.start + 0.2;
  const bow = spring(t - (L17.end + 0.05), MATERIAL.body);
  const walkStart = L17.end + 0.65;
  const walkU = progress(t, walkStart, wSabhi.start - 0.05);
  const wipe = { start: wSabhi.start - 0.45, end: wSabhi.start + 0.3 };
  const wipeU = progress(t, wipe.start, wipe.end);
  const cam = camAt([
    { t: close.start, cam: { cx: yEye[0], cy: yEye[1], z: 5.2 } },
    { t: wTum.start, cam: { cx: 360, cy: 1260, z: 1.5 }, ease: (x) => softLinear(x, 0.25) },
    { t: wipe.end, cam: { cx: 330, cy: 1270, z: 1.45 }, ease: ease.linear },
  ], t);
  const eyeScr = toScreen(cam, yEye);
  const yx = lerp(FIRING.x, 90, ease.inOut(walkU));
  const yud = !lowered ? (
    <ArcherAim look="yudhishthira" expr="calm" />
  ) : walkU <= 0 ? (
    <g transform={svgM(place(FIRING.x, FIRING.y, 1.08, true))}>
      <Prince look="yudhishthira" expr="calm" nod={bow} bowAtSide />
    </g>
  ) : (
    <g transform={svgM(place(yx, FIRING.y, 1.08, true))}>
      <Prince look="yudhishthira" view="side" expr="calm" walk={(t - walkStart) * 1.6} carryBow />
    </g>
  );
  const povR = lerp(440, 14, ease.in(closeU));
  const povC: P2 = [lerp(POV_CENTER[0], eyeScr[0], ease.inOut(closeU)), lerp(POV_CENTER[1], eyeScr[1], ease.inOut(closeU))];
  const showC2 = wipeU > 0.5;
  const bhimaX = lerp(1700, -700, ease.inOut(wipeU));
  return (
    <Frame>
      {!showC2 ? (
        <C1World cam={cam} foreground={<Watchers />}>
          <g transform={svgM(place(DRONA_C1.x, DRONA_C1.y, DRONA_C1.s))}>
            <Drona view="threeQuarter" pose="palm" lean={3} headTilt={2} mouth={mouthOpen(t, [17])} blink={blink(t, 11)} />
          </g>
          {yud}
        </C1World>
      ) : (
        <C2World cam={{ cx: 540, cy: 1250, z: 1.0 }}>
          {LINEUP.map((p, i) => (
            <g key={p.look} transform={svgM(place(p.x, 1760, 0.9, p.mirror))}>
              <Prince look={p.look} view={p.view} expr={p.look === "duryodhana" ? "smug" : "calm"} blink={blink(t, 40 + i)} />
            </g>
          ))}
        </C2World>
      )}
      {closeU < 1 && (
        <g>
          <rect width={W} height={H} fill="#2A1B12" opacity={1 - ease.inOut(closeU)} />
          <POVWholeTree r={povR} cx={povC[0]} cy={povC[1]} glow={0.8 * (1 - closeU)} id="yud" />
        </g>
      )}
      {wipeU > 0 && wipeU < 1 && (
        <g filter="url(#wipe-soft)">
          <defs><filter id="wipe-soft" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation={5} /></filter></defs>
          <g transform={svgM(place(bhimaX, 3100, 3.4))}><Prince look="bhima" view="back" shadow={false} /></g>
        </g>
      )}
    </Frame>
  );
};

// ============ Clip 4 · L33 end → L34 (C2 faces → dissolve → C1 warm afternoon): the guru's hand on Arjuna's shoulder,
//              a diya lights on "बड़ी सीख" ============
export const ClipLesson: React.FC = () => {
  const t = useStoryTime();
  const wArjun = word(34, "अर्जुन"), wBadi = word(34, "बड़ी"), wSeekh = word(34, "सीख");
  const dis = progress(t, line(34).start - 0.55, line(34).start - 0.1);
  const lit = ease.out(progress(t, wBadi.start, wSeekh.end));
  const reach = spring(t - (line(34).start - 0.2), MATERIAL.body);
  const cam = camAt([
    { t: 144.6, cam: { cx: 520, cy: 1240, z: 1.12 } },
    { t: wArjun.start - 0.1, cam: { cx: 500, cy: 1250, z: 1.15 }, ease: ease.linear },
    { t: wBadi.start, cam: { cx: 430, cy: 1320, z: 1.45 }, ease: ease.inOut },
    { t: 149.6, cam: { cx: 430, cy: 1340, z: 1.5 }, ease: ease.linear },
  ], t);
  const ARJ_X = 398; // his shoulder sits right under the guru's hand
  return (
    <Frame>
      <Fade o={1}>
        <C1World cam={cam} foreground={<Watchers who={["duryodhana", "bhima"]} />} warm={1} arrowIn>
          <g transform={svgM(place(ARJ_X, DRONA_C1.y + 80, 0.82, true))}>
            <Prince look="arjuna" view="threeQuarter" expr="smile" blink={blink(t, 33)} />
          </g>
          <g transform={svgM(place(DRONA_C1.x + 30, DRONA_C1.y + 60, 0.78))}>
            <Drona view="threeQuarter" pose="reach" raise={reach} smile={0.6 + 0.4 * lit} lean={2} blink={blink(t, 11)} />
          </g>
          <g transform={`translate(${ARJ_X - 120} ${DRONA_C1.y + 175})`}>
            <path d="M-56,0 L56,0 L46,70 L-46,70Z" fill="#B9A089" stroke="#3A2418" strokeWidth={4} />
            <path d="M-62,-10 L62,-10 L56,0 L-56,0Z" fill="#A58C74" stroke="#3A2418" strokeWidth={4} />
            <g transform="translate(-6 -12) scale(1.35)"><Diya lit={lit} t={t} /></g>
          </g>
        </C1World>
      </Fade>
      {dis < 1 && (
        <g opacity={1 - ease.inOut(dis)}>
          <C2World cam={{ cx: 540, cy: 1250, z: 1.0 }}>
            {LINEUP.map((p, i) => (
              <g key={p.look} transform={svgM(place(p.x, 1760, 0.9, p.mirror))}>
                <Prince look={p.look} view={p.view} expr={p.look === "duryodhana" ? "angry" : "surprised"} angry={p.look === "duryodhana" ? 0.25 : 0} blink={blink(t, 40 + i)} />
              </g>
            ))}
          </C2World>
        </g>
      )}
    </Frame>
  );
};

// ============ Clip 5 · L36 end → L37 → L38 start: Arjuna's eye in the ring → the girl's eye (match) → her room;
//              on "लक्ष्य" the ring floats to the basket ============
export const ClipToday: React.FC = () => {
  const t = useStoryTime();
  const wKyonki = word(37, "क्योंकि"), wLakshya = word(37, "लक्ष्य"), wMushkil = word(38, "मुश्किल");
  const match = { start: wKyonki.start - 0.35, end: wKyonki.start + 0.1 };
  const pull = { start: match.end, end: wLakshya.start - 0.15 };
  const G = { x: 300, y: 1720 };
  const gEye: P2 = [G.x - 28, G.y - (730 - 195)];
  const BASKET: P2 = [780, FLOOR_Y + 210];
  const zEye = 11;
  const pu = softLinear(progress(t, pull.start, pull.end), 0.2);
  const zoom = Math.exp(lerp(Math.log(zEye), Math.log(1.0), pu));
  const stretch = progress(t, wMushkil.start, wMushkil.start + 1.2);
  const wideC: P2 = [540, 1340];
  const camRoom: Cam = {
    cx: lerp(gEye[0], wideC[0], pu), cy: lerp(gEye[1], wideC[1], pu),
    z: Math.exp(lerp(Math.log(zEye), Math.log(1.28), pu)) * lerp(1, 0.86, ease.inOut(stretch)),
  };
  // Arjuna close-up world: his head on a soft field backdrop, same eye position/scale as the girl's close-up
  const A = { x: 540, y: 2400 };
  const aEye: P2 = [A.x - 28, A.y - (730 - 195)];
  const camA: Cam = { cx: aEye[0], cy: aEye[1], z: zEye };
  const m = ease.inOut(progress(t, match.start, match.end));
  const turnE = progress(t, wLakshya.start - 0.35, wLakshya.start - 0.05);
  const eyeRoom = toScreen(camRoom, [lerp(gEye[0], G.x + 2, turnE), gEye[1]]); // front eye → 3/4 near eye as she turns
  const toBasket = ease.inOut(progress(t, wLakshya.start, wLakshya.start + 0.6));
  const basketScr = toScreen(camRoom, [BASKET[0], BASKET[1] + 60]);
  const ringC: P2 = [lerp(eyeRoom[0], basketScr[0], toBasket), lerp(eyeRoom[1], basketScr[1], toBasket)];
  const ringR = lerp(Math.max(11 * camRoom.z * 1.6, 40), 100 * camRoom.z, toBasket);
  const turn = progress(t, wLakshya.start - 0.35, wLakshya.start - 0.05);
  const kiteX = 780 + 90 * Math.sin((t - 159) * 0.7);
  const r = rng(7);
  void r;
  return (
    <Frame>
      {m < 1 && (
        <g opacity={1}>
          <Layer cam={camA}>
            <rect x={-2000} y={-2000} width={5000} height={6000} fill="#EBD3A6" />
            <g transform={svgM(place(A.x, A.y, 1))}><Prince look="arjuna" expr="focused" shadow={false} /></g>
          </Layer>
        </g>
      )}
      <g opacity={m}>
        <Layer cam={camRoom}>
          <Room kiteX={kiteX} />
          <g transform={`translate(${BASKET[0]} ${BASKET[1]}) scale(0.9)`}><Basket /></g>
          <g transform={svgM(place(G.x, G.y, 1))}>
            {turn < 1 && <g opacity={1 - turn}><Girl view="front" expr="focused" /></g>}
            {turn > 0 && <g opacity={turn}><Girl view="threeQuarter" expr="focused" /></g>}
          </g>
          {turn > 0 && <g opacity={turn}><PaperBall x={G.x + 70} y={G.y - 270} r={24} /></g>}
        </Layer>
      </g>
      <FocusRing cx={ringC[0]} cy={ringC[1]} r={t < match.start ? 11 * zEye * 1.6 : ringR} drawn={1} lock={0} width={12} />
    </Frame>
  );
};

export const CLIPS = [
  { id: "Clip1-L2-arrival", from: 7.9, C: ClipArrival },
  { id: "Clip2-L8-duryodhana-asked", from: 42.0, C: ClipDuryodhanaAsked },
  { id: "Clip3-L17-yudhishthira-steps-back", from: 78.0, C: ClipYudhishthiraStepsBack },
  { id: "Clip4-L34-the-lesson", from: 144.5, C: ClipLesson },
  { id: "Clip5-L37-today", from: 159.5, C: ClipToday },
];
