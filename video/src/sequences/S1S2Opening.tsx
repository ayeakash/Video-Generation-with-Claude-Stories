// Opening (L1 end → L2): designed transitions and motivated movement, all keyed to FROZEN word times.
//  HOOK   dawn ridge: prince silhouettes (rim-lit) on a ridge, Hastinapur far away; lateral tracking with layered parallax.
//         "सबसे महान" a golden bow rises behind the ridge like a sunrise; "धनुर्धर" a glint runs along it.
//  PAUSE  silhouettes turn to look at each other (chain); the bow morphs into a "?" and its arrowhead drops in as the dot.
//  MATCH  the dot falls; the camera dives with it into the dark ground → cranes up at the ashram where the same dot
//         RISES as the sun (dawn → morning sky, rays open).
//  L2     "गुरु द्रोणाचार्य" Drona walks in (profile) and turns; "सभी राजकुमारों" the princes RUN in with real run cycles
//         (camera pans with them, foreground grass sweeps past), skid to a stop in dust and turn to him;
//         "अनोखी चुनौती" he points up, a glint climbs, heads tilt up in a chain → WHIP-TILT into the sky → down onto the treetop.
import React from "react";
import { useStoryTime, word, line } from "../timing/clock";
import { W, H, Cam, camAt, Layer } from "../camera/Camera";
import { Ground, HORIZON } from "../backgrounds/Gurukul";
import { AshramBackdrop, ASHRAM_RISE } from "../backgrounds/Ashram";
import { Prince, place, LookName } from "../characters/Prince";
import { Drona } from "../characters/Drona";
import { INK, P } from "../characters/parts";
import { C1World, Grain } from "./shared";
import { TREETOP_CAM } from "../episode/ScenesA";
import { blink, clamp, ease, lerp, progress, spring, MATERIAL, svgM, rng } from "../utils/motion";

type P2 = [number, number];
const mixHex = (a: string, b: string, t: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return "#" + pa.map((v, i) => Math.round(v + (pb[i] - v) * clamp(t)).toString(16).padStart(2, "0")).join("");
};

/** Sky from pre-dawn (0) to morning (1). */
const DawnSky: React.FC<{ p: number; id: string }> = ({ p, id }) => (
  <g>
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={mixHex("#4B4A80", "#F2B872", p)} />
        <stop offset="0.45" stopColor={mixHex("#C9799A", "#F6CF96", p)} />
        <stop offset="0.7" stopColor={mixHex("#F6B07A", "#FBE9C6", p)} />
      </linearGradient>
    </defs>
    <rect x={-3000} y={-4000} width={7080} height={4000 + HORIZON + 80} fill={`url(#${id})`} />
  </g>
);

const Clouds: React.FC<{ tint: string }> = ({ tint }) => (
  <g opacity={0.9}>
    {([[120, 300, 1], [620, 160, 1.3], [900, 420, 0.8], [300, -300, 1.4], [820, -650, 1.1], [180, -1100, 1.2], [700, -1500, 1]] as const).map(([x, y, s], i) => (
      <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
        <P d="M-90,20 Q-100,-20 -60,-24 Q-50,-60 -10,-52 Q20,-80 56,-50 Q96,-56 96,-14 Q120,0 96,20Z" fill={tint} sw={3} opacity={0.95} />
      </g>
    ))}
  </g>
);

/** Distant Hastinapur on a far hill (dawn silhouette). */
const Hastinapur: React.FC = () => (
  <g fill="#6E5C8C" stroke="#4A3D63" strokeWidth={3}>
    <path d={`M-200,${HORIZON - 40} Q300,${HORIZON - 170} 900,${HORIZON - 60} L1400,${HORIZON - 60} L1400,${HORIZON + 40} L-200,${HORIZON + 40}Z`} />
    {[[420, 0.9], [520, 1.25], [640, 1], [730, 0.8]].map(([x, s], i) => (
      <g key={i} transform={`translate(${x} ${HORIZON - 150}) scale(${s})`}>
        <rect x={-30} y={-40} width={60} height={70} />
        <path d="M-36,-40 Q0,-110 36,-40Z" />
        <path d="M0,-104 L0,-130" strokeWidth={4} />
      </g>
    ))}
  </g>
);

// bow ↔ "?" share the same two cubic segments, so the shape can morph point by point
const BOW: P2[] = [[0, -160], [90, -120], [110, -40], [110, 0], [110, 40], [90, 120], [0, 160]];
const QMARK: P2[] = [[-80, -95], [-80, -185], [90, -185], [86, -85], [82, -22], [0, -12], [0, 58]];
const morphPath = (u: number) => {
  const p = BOW.map(([x, y], i) => [lerp(x, QMARK[i][0], u), lerp(y, QMARK[i][1], u)] as P2);
  return `M${p[0]} C${p[1]} ${p[2]} ${p[3]} C${p[4]} ${p[5]} ${p[6]}`;
};

const GoldenBow: React.FC<{ u: number; glint: number; stringO: number }> = ({ u, glint, stringO }) => (
  <g>
    <defs>
      <filter id="gold-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={14} /></filter>
    </defs>
    <path d={morphPath(u)} fill="none" stroke="#FFE08A" strokeWidth={40} strokeLinecap="round" filter="url(#gold-glow)" opacity={0.75} />
    {stringO > 0 && <path d={`M${BOW[0]} L${BOW[6]}`} stroke="#FFF2C4" strokeWidth={4} opacity={stringO} />}
    <path d={morphPath(u)} fill="none" stroke="#F7C948" strokeWidth={24} strokeLinecap="round" />
    <path d={morphPath(u)} fill="none" stroke="#FFF3B0" strokeWidth={8} strokeLinecap="round" opacity={0.8} />
    {glint > 0 && glint < 1 && <circle cx={lerp(BOW[0][0], 110, Math.sin(glint * Math.PI))} cy={lerp(-160, 160, glint)} r={16} fill="#FFFFFF" opacity={Math.sin(glint * Math.PI)} />}
  </g>
);

/** Silhouette with a gold rim on its top edge (backlit by the dawn). */
const Silhouette: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => (
  <g>
    <defs>
      <filter id={`sil-${id}`}><feFlood floodColor="#2A2140" /><feComposite in2="SourceAlpha" operator="in" /></filter>
      <filter id={`rim-${id}`}><feFlood floodColor="#FFC977" /><feComposite in2="SourceAlpha" operator="in" /></filter>
    </defs>
    <g filter={`url(#rim-${id})`} transform="translate(3 -5)">{children}</g>
    <g filter={`url(#sil-${id})`}>{children}</g>
  </g>
);

const Dust: React.FC<{ x: number; y: number; age: number; s?: number }> = ({ x, y, age, s = 1 }) =>
  age < 0 || age > 0.6 ? null : (
    <g opacity={1 - age / 0.6}>
      {[-1, 0, 1].map((k) => <circle key={k} cx={x + k * 22 * s + k * age * 50} cy={y - age * 30 - Math.abs(k) * 6} r={(10 + age * 26) * s} fill="#EBCB9C" />)}
    </g>
  );

/** Foreground tufts that sweep past the lens (depth layer > 1). */
const ForeTufts: React.FC<{ dark?: boolean }> = ({ dark }) => (
  <g>
    {[[-80, 2010, 1.6], [380, 2050, 2.2], [760, 2000, 1.4], [1180, 2040, 2.0], [1540, 2010, 1.7]].map(([x, y, s], i) => (
      <path key={i} transform={`translate(${x} ${y}) scale(${s})`} d="M-60,0 Q-50,-90 -30,0 Q-14,-120 6,0 Q22,-100 38,0 Q56,-70 70,0Z"
        fill={dark ? "#2A2140" : "#6E8E4A"} stroke={dark ? "none" : INK} strokeWidth={3} />
    ))}
  </g>
);

const PRINCES: { look: LookName; x: number }[] = [
  { look: "bhima", x: 170 }, { look: "duryodhana", x: 360 }, { look: "yudhishthira", x: 560 }, { look: "arjuna", x: 760 },
];

export const S1S2Opening: React.FC = () => {
  const t = useStoryTime();
  const wSabse = word(1, "सबसे"), wDhanurdhar = word(1, "धनुर्धर");
  const L1end = line(1).end, L2 = line(2);
  const wGuru = word(2, "गुरु"), wDronaW = word(2, "द्रोणाचार्य"), wNe = word(2, "ने"), wSabhi = word(2, "सभी"), wAnokhi = word(2, "अनोखी"), wChunauti = word(2, "चुनौती");

  // ---------- timeline ----------
  const turnStart = L1end + 0.08;                       // silhouettes look at each other
  const morph = { start: L1end + 0.15, end: L1end + 0.85 };
  const dotIn = morph.end - 0.1;
  const fall = { start: L2.start - 0.45, end: L2.start - 0.05 };   // the dot falls, camera dives
  const SWITCH = L2.start - 0.08;                       // hidden under the dark ground
  const rise = { start: SWITCH, end: word(2, "सुबह").end + 0.6 };
  const whip = { start: wChunauti.end - 0.05, peak: wChunauti.end + 0.28, end: wChunauti.end + 0.75 };

  // ================= HOOK (dawn ridge) =================
  if (t < SWITCH) {
    const fallU = progress(t, fall.start, fall.end);
    const cam: Cam = camAt([
      { t: 0, cam: { cx: 380, cy: 1010, z: 1.45 } },
      { t: L1end, cam: { cx: 560, cy: 1000, z: 1.5 }, ease: ease.linear },      // lateral tracking past the silhouettes
      { t: fall.start, cam: { cx: 580, cy: 980, z: 1.52 }, ease: ease.out },
      { t: fall.end, cam: { cx: 580, cy: 2300, z: 1.52 }, ease: ease.in },       // dive with the falling dot
    ], t);
    const wKaun = word(1, "कौन");
    const lookUp = (i: number) => -12 * Math.sin(Math.PI * progress(t, wKaun.start + i * 0.12, wKaun.start + i * 0.12 + 0.9));
    const rise1 = ease.out(progress(t, wSabse.start - 0.1, wDhanurdhar.start + 0.2));
    const bowY = lerp(1720, 700, rise1); // hidden fully behind the ridge until it rises
    const glint = progress(t, wDhanurdhar.start, wDhanurdhar.end);
    const mu = ease.inOut(progress(t, morph.start, morph.end));
    const dotS = spring(t - dotIn, { stiffness: 260, damping: 11 });
    const dotY = 130 + 1700 * ease.in(fallU) * 1.0;
    const BOW_X = 760;
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <Layer cam={cam} depth={0.2}><DawnSky p={0.12 + 0.1 * rise1} id="hook-sky" /></Layer>
        <Layer cam={cam} depth={0.35}><Clouds tint="#B77FA0" /></Layer>
        <Layer cam={cam} depth={0.45}><Hastinapur /></Layer>
        <Layer cam={cam} depth={0.7}>
          <g transform={`translate(${BOW_X} ${bowY})`}>
            <GoldenBow u={mu} glint={glint} stringO={1 - mu} />
            {dotS > 0 && <circle cx={0} cy={dotY} r={22 * clamp(dotS * 1.2)} fill="#FFE08A" stroke="#F7C948" strokeWidth={6} />}
          </g>
        </Layer>
        <Layer cam={cam}>
          <path d={`M-800,${HORIZON + 70} Q200,${HORIZON - 20} 700,${HORIZON + 40} Q1100,${HORIZON + 80} 1900,${HORIZON + 10} L1900,4200 L-800,4200Z`} fill="#3A2C52" />
          {PRINCES.map((p, i) => {
            const flip = i % 2 === 1; // 2nd and 4th turn to face their neighbour
            const k = progress(t, turnStart + i * 0.12, turnStart + i * 0.12 + 0.2);
            const sx = flip ? Math.cos(Math.PI * k) : 1; // classic flat turn: squash through 0 to −1
            return (
              <g key={p.look} transform={`translate(${p.x} 0) scale(${sx === 0 ? 0.001 : sx} 1) translate(${-p.x} 0)`}>
                <Silhouette id={p.look}>
                  <g transform={svgM(place(p.x, HORIZON + 70, 0.62))}>
                    <Prince look={p.look} view="side" shadow={false} bowAtSide headTilt={lookUp(i)} />
                  </g>
                </Silhouette>
              </g>
            );
          })}
        </Layer>
        <Layer cam={cam} depth={1.5}><ForeTufts dark /></Layer>
        {t < 0.7 && <rect width={W} height={H} fill="#000" opacity={1 - ease.out(progress(t, 0, 0.7))} />}
        <Grain />
      </svg>
    );
  }

  // ================= ASHRAM (sunrise → Drona → run-in → point → whip) =================
  const ru = ease.out(progress(t, rise.start, rise.end));
  const skyP = 0.15 + 0.85 * ease.inOut(progress(t, rise.start, rise.end + 0.4));
  const sun: P2 = [300, lerp(HORIZON - ASHRAM_RISE + 30, 560, ru)];
  const sunR = lerp(22, 84, ease.inOut(progress(t, rise.start + 0.2, rise.end)));
  const rays = progress(t, rise.start + 0.5, rise.end + 0.3);

  // the camera: crane up from the ground with the rising sun → pan with the runners → whip-tilt up
  const runPan = (x: number) => x;
  const camKeys = [
    { t: SWITCH, cam: { cx: 560, cy: 2300, z: 1.06 } },
    { t: rise.end, cam: { cx: 520, cy: 1270, z: 1.0 }, ease: ease.out },
    { t: wSabhi.start, cam: { cx: 540, cy: 1280, z: 1.0 }, ease: ease.linear },
    { t: wSabhi.start + 0.7, cam: { cx: runPan(660), cy: 1290, z: 1.02 }, ease: ease.inOut },
    { t: wAnokhi.start, cam: { cx: 560, cy: 1280, z: 1.04 }, ease: ease.inOut },
    { t: whip.start, cam: { cx: 560, cy: 1270, z: 1.05 }, ease: ease.linear },
    { t: whip.peak, cam: { cx: 560, cy: -1400, z: 1.05 }, ease: ease.in },
  ];
  const camA = camAt(camKeys, t);
  const whipU = progress(t, whip.start, whip.end);
  const speed = Math.sin(Math.PI * clamp(whipU));
  const inC1 = t > whip.peak;

  // Drona walks in (profile), stops, turns to the princes (3/4), calls on "ने", points on "अनोखी"
  const dWalk = progress(t, wGuru.start - 0.2, wDronaW.end - 0.25); // he walks in across his whole name
  const dX = lerp(-160, 210, ease.out(dWalk));
  const dTurn = progress(t, wDronaW.end - 0.3, wDronaW.end - 0.1);
  const call = spring(t - wNe.start, MATERIAL.body);
  const point = spring(t - wAnokhi.start, MATERIAL.body);
  const look = (i: number) => -16 * ease.inOut(progress(t, wChunauti.start + i * 0.08, wChunauti.start + i * 0.08 + 0.35));

  const RUNNERS: { look: LookName; delay: number; dur: number; stop: number; stride: number; bounce: number }[] = [
    { look: "arjuna", delay: 0.0, dur: 0.95, stop: 450, stride: 2.0, bounce: 1 },      // light, quick
    { look: "yudhishthira", delay: 0.12, dur: 1.15, stop: 610, stride: 1.8, bounce: 0.9 },
    { look: "bhima", delay: 0.22, dur: 1.35, stop: 790, stride: 1.7, bounce: 1.4 },    // heavy
    { look: "duryodhana", delay: 0.32, dur: 1.2, stop: 960, stride: 1.9, bounce: 1.2 }, // swagger
  ];
  const dustAt: { x: number; y: number; age: number; s: number }[] = [];
  const runners = RUNNERS.map((r, i) => {
    const t0 = wSabhi.start - 0.05 + r.delay;
    const u = progress(t, t0, t0 + r.dur);
    if (t < t0) return null;
    const start = 1500;
    const x = r.stop + (start - r.stop) * Math.pow(1 - u, 1.7);
    const dist = start - x;
    const phase = dist / 260;
    const running = u < 1;
    const skid = u > 0.78 ? (u - 0.78) / 0.22 : 0;
    const lean = running ? 8 * (1 - skid) - 12 * Math.sin(Math.PI * skid) : 0;
    const after = t - (t0 + r.dur);
    const settle = after > 0 ? -10 * r.bounce * Math.exp(-after * 7) * Math.cos(after * 16) : 0;
    const turn = progress(t, t0 + r.dur + 0.05, t0 + r.dur + 0.22);
    // footfall dust each half-cycle while running, and a big puff on the skid
    for (let k = 1; k * 0.5 <= phase; k++) {
      const ft = t0 + r.dur * (1 - Math.pow(1 - (k * 0.5 * 260) / (start - r.stop), 1 / 1.7));
      dustAt.push({ x: r.stop + (start - r.stop) * Math.pow(1 - progress(ft, t0, t0 + r.dur), 1.7) + 30, y: 1806, age: t - ft, s: 0.7 });
    }
    if (skid > 0) dustAt.push({ x: x - 40, y: 1806, age: t - (t0 + r.dur * 0.78), s: 1.3 });
    const s = 0.86;
    return (
      <g key={r.look} transform={`translate(0 ${settle})`}>
        {turn < 1 && (
          <g opacity={1 - turn} transform={svgM(place(x, 1800, s, true))}>
            <Prince look={r.look} view="side" walk={running ? phase : 0} stride={r.stride} bodyLean={lean}
              expr={r.look === "duryodhana" ? "smug" : "calm"} blink={blink(t, 50 + i)} />
          </g>
        )}
        {turn > 0 && (
          <g opacity={turn} transform={svgM(place(x, 1800, s, true))}>
            <Prince look={r.look} view="threeQuarter" headTilt={look(i + 1)} expr={t > wChunauti.start ? "surprised" : r.look === "duryodhana" ? "smug" : "calm"} blink={blink(t, 50 + i)} />
          </g>
        )}
      </g>
    );
  });

  const glintU = progress(t, wAnokhi.start + 0.35, wChunauti.end);
  const fingertip: P2 = [210 + (310 - 200) * 1.02, 1850 - (730 - 70) * 1.02];
  const r = rng(5);
  void r;

  const ashram = (
    <g filter={speed > 0.05 ? "url(#whip-blur)" : undefined}>
      <Layer cam={camA} depth={0.2}><DawnSky p={skyP} id="ash-sky" /></Layer>
      <Layer cam={camA} depth={0.2}>
        <defs>
          <radialGradient id="sun-g"><stop offset="0.5" stopColor="#FCD98A" stopOpacity={0.9} /><stop offset="1" stopColor="#FCD98A" stopOpacity={0} /></radialGradient>
        </defs>
        {rays > 0 && (
          <g transform={`translate(${sun[0]} ${sun[1]}) rotate(${(t - rise.start) * 4})`} opacity={0.22 * rays}>
            {Array.from({ length: 12 }, (_, i) => <path key={i} d="M0,0 L-34,-760 L34,-760Z" fill="#FFE7A8" transform={`rotate(${i * 30})`} />)}
          </g>
        )}
        <circle cx={sun[0]} cy={sun[1]} r={sunR * 2.1} fill="url(#sun-g)" />
        <circle cx={sun[0]} cy={sun[1]} r={sunR} fill={mixHex("#FFE08A", "#F7C46A", ru)} stroke="#F7C948" strokeWidth={6 * (1 - ru)} />
      </Layer>
      <Layer cam={camA} depth={0.4}><Clouds tint={mixHex("#E9B9C2", "#FFF4E2", skyP)} /></Layer>
      <Layer cam={camA}>
        <Ground />
        <AshramBackdrop />
        <rect x={-3000} y={HORIZON - ASHRAM_RISE - 400} width={7080} height={4000} fill="#3A2C52" opacity={0.35 * (1 - skyP)} />
        {dustAt.map((d, i) => <Dust key={i} {...d} />)}
        {runners.slice().reverse()}
        <g transform={svgM(place(dX, 1850, 1.02))}>
          {dTurn < 1 && <g opacity={1 - dTurn}><Drona view="side" pose="rest" walk={dWalk < 1 ? (t - wGuru.start) * 1.4 : 0} blink={blink(t, 11)} /></g>}
          {dTurn > 0 && (
            <g opacity={dTurn}>
              <Drona view="threeQuarter" pose={t < wAnokhi.start ? "palm" : "point"} raise={t < wAnokhi.start ? call : point} headTilt={-8 * ease.inOut(progress(t, wChunauti.start, wChunauti.start + 0.4))} blink={blink(t, 11)} />
            </g>
          )}
        </g>
        {glintU > 0 && glintU < 1 && (
          <g transform={`translate(${fingertip[0]} ${fingertip[1] - 900 * ease.in(glintU)})`} opacity={Math.sin(Math.PI * glintU)}>
            <path d="M0,-26 L6,-6 L26,0 L6,6 L0,26 L-6,6 L-26,0 L-6,-6Z" fill="#FFF3B0" stroke="#F7C948" strokeWidth={3} />
          </g>
        )}
      </Layer>
      <Layer cam={camA} depth={1.45}><ForeTufts /></Layer>
    </g>
  );

  // after the whip peak: we come down in C1 onto the top of the tall target tree
  const downU = progress(t, whip.peak, whip.end + 0.5);
  const camC1: Cam = { cx: lerp(760, TREETOP_CAM.cx, ease.out(downU)), cy: lerp(-1300, TREETOP_CAM.cy, ease.out(downU)), z: Math.exp(lerp(Math.log(1.05), Math.log(TREETOP_CAM.z), ease.out(downU))) };

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <defs>
        <filter id="whip-blur" x="-5%" y="-30%" width="110%" height="160%"><feGaussianBlur stdDeviation={`0 ${(26 * speed).toFixed(1)}`} edgeMode="duplicate" /></filter>
      </defs>
      {!inC1 ? ashram : (
        <g filter={speed > 0.05 ? "url(#whip-blur)" : undefined}>
          <C1World cam={camC1}>{null}</C1World>
          <Layer cam={camC1} depth={0.4}><Clouds tint="#FFF4E2" /></Layer>
        </g>
      )}
      {/* we come up out of the dark ground the dot fell into (the risen dot stays visible as the sun) */}
      {!inC1 && t < SWITCH + 0.7 && <rect width={W} height={H} fill="#2A2140" opacity={0.92 * (1 - ease.out(progress(t, SWITCH, SWITCH + 0.7)))} />}
      <Grain />
    </svg>
  );
};
