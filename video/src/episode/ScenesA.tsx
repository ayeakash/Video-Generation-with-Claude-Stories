// Scenes B–F (L3 → L24). C1 main stage unless noted; every beat keyed to FROZEN word times.
import React from "react";
import { useStoryTime, word, line, mouthOpen } from "../timing/clock";
import { camAt, Cam, Layer, W, H, toScreen } from "../camera/Camera";
import { Prince, place, LOOKS, aimFrames, AIM, LookName } from "../characters/Prince";
import { Drona } from "../characters/Drona";
import { WoodenBird, FocusRing, BIRD_BASE, TREE } from "../graphics/props";
import { DriftClouds, Butterflies, FallingLeaves, Leaf, Squirrel, BowLying, Steam } from "../graphics/ambient";
import { POV_CENTER } from "../formats/POVWindow";
import {
  C1World, C2World, Watchers, ArcherAim, archerEye, archerPlace, LINEUP, DRONA_C1, DRONA_C1_FACE, FIRING, POVWholeTree, softLinear, P2,
  treePt, TREE_TOP, BRANCH_MID, BIRD_BODY, C1_EYE, irisOpen, irisClose, AIM_POSE,
} from "../sequences/shared";
import { Frame, ambient, Sparkle, DustPuff, Tok, flipX, XFade, GoldQ } from "./kit";
import { apply, blink, clamp, ease, lerp, progress, spring, MATERIAL, svgM, mul, T, S } from "../utils/motion";

export const WIDE: Cam = { cx: 560, cy: 1190, z: 1.16 };
export const TREETOP_CAM: Cam = { cx: TREE_TOP[0] + 10, cy: TREE_TOP[1] + 170, z: 2.3 };

const standM = (look: LookName, x = FIRING.x, mirror = true) => place(x, FIRING.y, LOOKS[look].height, mirror);
const headW = (look: LookName, x = FIRING.x) => apply(standM(look, x), [200, 195]);
const BIRD_HEAD = treePt([TREE.birdScale * 80 + 278, -352 - BIRD_BASE * TREE.birdScale - 56 * TREE.birdScale]);

/** Ambient layer for C1 (clouds go in the sky slot; butterflies/leaves in the world). */
const c1Sky = (t: number) => <DriftClouds t={t} amount={ambient(t)} />;
const C1Life: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <Butterflies t={t} amount={ambient(t)} area={[60, 1380, 300, 260]} />
    <FallingLeaves t={t} amount={ambient(t)} count={3} x0={560} width={400} top={700} fall={1100} />
  </g>
);

const DronaC1: React.FC<{ children: React.ReactNode }> = ({ children }) => <g transform={svgM(place(DRONA_C1.x, DRONA_C1.y, DRONA_C1.s))}>{children}</g>;

// ======================= B · L3–L4: the tall tree, the wooden bird, the challenge =======================
export const SceneTree: React.FC = () => {
  const t = useStoryTime();
  const wOonche = word(3, "ऊँचे"), wDaal = word(3, "डाल"), wChhoti = word(3, "छोटी"), wLakdi = word(3, "लकड़ी"), wChidiya3 = word(3, "चिड़िया");
  const L3 = line(3), L4 = line(4);
  const wChidiya4 = word(4, "चिड़िया"), wAankh = word(4, "आँख"), wNishana = word(4, "निशाना");
  const trunkMid = treePt([0, -200]);
  const cam = camAt([
    { t: 14.1, cam: TREETOP_CAM },
    { t: wOonche.start - 0.1, cam: { ...TREETOP_CAM, cy: TREETOP_CAM.cy + 30 }, ease: ease.linear },
    { t: wDaal.start - 0.1, cam: { cx: trunkMid[0], cy: trunkMid[1] + 40, z: 2.3 }, ease: ease.inOut },   // down the tall trunk
    { t: wDaal.end + 0.3, cam: { cx: BRANCH_MID[0] - 20, cy: BRANCH_MID[1], z: 2.4 }, ease: ease.inOut }, // along the डाल
    { t: wChhoti.start + 0.5, cam: { cx: BIRD_BODY[0], cy: BIRD_BODY[1], z: 5.2 }, ease: ease.inOut },     // the tiny bird
    { t: L3.end + 0.25, cam: { cx: BIRD_BODY[0] - 4, cy: BIRD_BODY[1] + 4, z: 5.4 }, ease: ease.linear },
    { t: L4.start - 0.05, cam: { cx: 400, cy: 1250, z: 1.3 }, ease: (x) => softLinear(x, 0.25) },         // pull back: the guru
    { t: wAankh.start - 0.25, cam: { cx: 410, cy: 1250, z: 1.34 }, ease: ease.linear },
    { t: wAankh.start + 0.2, cam: { cx: C1_EYE[0] - 10, cy: C1_EYE[1] + 20, z: 3.4 }, ease: ease.inOut },  // "आँख"
    { t: wNishana.start + 0.1, cam: { cx: C1_EYE[0] - 10, cy: C1_EYE[1] + 20, z: 3.5 }, ease: ease.linear },
    { t: wNishana.start + 0.55, cam: { cx: 400, cy: 1250, z: 1.34 }, ease: ease.inOut },
    { t: L4.end + 0.4, cam: { cx: 420, cy: 1240, z: 1.3 }, ease: ease.linear },
    { t: 25.05, cam: WIDE, ease: ease.inOut },
  ], t);
  const glow = Math.sin(Math.PI * progress(t, wDaal.start - 0.1, wDaal.end + 0.7));
  // a leaf drifts down and taps the wooden bird: "tok" — it rocks stiffly like a toy
  const tap = wLakdi.start + 0.12;
  const leafU = progress(t, tap - 0.9, tap);
  const leafP: P2 = [lerp(BIRD_HEAD[0] + 30, BIRD_HEAD[0] + 6, leafU) + 10 * Math.sin(leafU * 9), lerp(BIRD_HEAD[1] - 160, BIRD_HEAD[1] - 14, leafU)];
  const after = t - tap;
  const rock = after > 0 ? 6 * Math.exp(-after * 2.6) * Math.sin(after * 15) : 0;
  const fallAway: P2 = [leafP[0] - 30 * clamp(after) - 40 * after, leafP[1] + 90 * after * after + 20 * after];
  const pointUp = spring(t - wChidiya4.start + 0.2, MATERIAL.body);
  const ring = ease.out(progress(t, wAankh.start - 0.05, wAankh.start + 0.4));
  const ringFade = 1 - progress(t, L4.end, L4.end + 0.6);
  const sq = progress(t, wOonche.start + 0.2, wDaal.start + 0.4);
  const sqPeek = Math.sin(Math.PI * sq);
  const sqPos = treePt([34 + 30 * sqPeek, -230]);
  return (
    <Frame>
      <C1World cam={cam} foreground={<Watchers />} sky={c1Sky(t)}
        treeProps={{ glowBranch: glow }}
        bird={<WoodenBird rock={rock} glint={ring > 0 ? 0.8 : 0} />}
        behind={sq > 0 && sq < 1 ? <g transform={`translate(${sqPos[0]} ${sqPos[1]}) scale(-0.42 0.42) rotate(-80)`}><Squirrel /></g> : null}>
        <C1Life t={t} />
        <DronaC1>
          {t < L4.end + 0.5 ? (
            <Drona view="front" pose={t > wChidiya4.start - 0.3 ? "reach" : "rest"} raise={pointUp} mouth={mouthOpen(t, [4])} blink={blink(t, 11)} />
          ) : (
            <XFade k={progress(t, L4.end + 0.5, L4.end + 0.8)}
              a={<Drona view="front" pose="reach" raise={1 - progress(t, L4.end + 0.5, L4.end + 0.8)} blink={blink(t, 11)} />}
              b={<Drona view="threeQuarter" pose="beard" stroke={(t - 40) * 0.42} blink={blink(t, 11)} />} />
          )}
        </DronaC1>
        {after < 1.5 && (after <= 0 ? <Leaf x={leafP[0]} y={leafP[1]} rot={leafU * 140} s={0.5} /> : <Leaf x={fallAway[0]} y={fallAway[1]} rot={140 + after * 200} s={0.5} />)}
        <Tok x={BIRD_HEAD[0]} y={BIRD_HEAD[1] - 8} u={progress(t, tap, tap + 0.45)} />
        {ring > 0 && ringFade > 0 && <g opacity={ringFade}><FocusRing cx={C1_EYE[0]} cy={C1_EYE[1]} r={22} drawn={ring} width={4} lock={progress(t, wAankh.start + 0.4, wAankh.start + 1.1)} /></g>}
      </C1World>
    </Frame>
  );
};

// ======================= C · L5–L13: Duryodhana — pride, the wide view, anger =======================
export const SceneDuryodhana: React.FC = () => {
  const t = useStoryTime();
  const L5 = line(5), wAaya = word(5, "आया"), wDury = word(5, "दुर्योधन");
  const has = [0, 1, 2].map((k) => word(6, "हा", k));
  const wBaen = word(6, "बाएँ"), wKhel = word(6, "खेल"), L6 = line(6);
  const wAkad = word(7, "अकड़कर"), wDhanush = word(7, "धनुष"), wNishana = word(7, "निशाना"), wSadha = word(7, "साधा");
  const wDrona8 = word(8, "द्रोणाचार्य"), wPuchha = word(8, "पूछा"), L9 = line(9), wHai9 = word(9, "है");
  const L10 = line(10), wPed = word(10, "पेड़"), wDaliyan = word(10, "डालियाँ"), wChidiya = word(10, "चिड़िया");
  const L11 = line(11), wPeechhe = word(11, "पीछे"), L12 = line(12), wGusse = word(12, "गुस्से"), wLaal = word(12, "लाल");
  const L13 = line(13), wJhalla = word(13, "झल्लाकर"), wPatak = word(13, "पटक");
  const D: LookName = "duryodhana";
  const dEye = archerEye(D);
  const dHead = headW(D);

  // walk-in (swagger) from the left to the firing line
  const walkU = progress(t, L5.start - 0.1, wAaya.end);
  const wx = lerp(-180, FIRING.x, ease.out(walkU));
  const turnFront = progress(t, wDury.start - 0.05, wDury.start + 0.15);
  const puffNamed = spring(t - wDury.start, MATERIAL.swagger);
  const puffAkad = spring(t - wAkad.start, MATERIAL.swagger) * (1 - progress(t, wDhanush.start, wDhanush.start + 0.3));
  const laugh = has.reduce((acc, h) => acc + Math.max(0, Math.sin(Math.PI * progress(t, h.start, h.end + 0.15))), 0);
  const laughing = t > has[0].start - 0.1 && t < L6.start + 3.7;
  const shake = t > has[2].end && t < 32.4 ? 3 * Math.sin(t * 40) : 0;
  const armUp = spring(t - wBaen.start, MATERIAL.body) * (1 - progress(t, wKhel.end + 0.2, wKhel.end + 0.6));
  const toAim = progress(t, wDhanush.start, wDhanush.start + 0.2);
  const draw = ease.inOut(progress(t, wNishana.start, wSadha.end));
  const lowered = progress(t, wPeechhe.start, wPeechhe.start + 0.25);
  const angry = ease.inOut(progress(t, wGusse.start, wLaal.end + 0.3)) * (1 - progress(t, L13.end + 0.6, L13.end + 1.6) * 0.6);
  const stamp = wJhalla.start + 0.15;
  const stampBounce = t > stamp ? -18 * Math.exp(-(t - stamp) * 7) * Math.abs(Math.sin((t - stamp) * 14)) : 0;
  const crownDrop = spring(t - (stamp + 0.05), { stiffness: 140, damping: 10 }) * (1 - ease.inOut(progress(t, stamp + 1.1, stamp + 1.4)));
  const dropT = wPatak.start;
  const bowFall = progress(t, dropT, dropT + 0.35);
  const bowGround: P2 = [FIRING.x + 150, FIRING.y - 6];
  const bowHand: P2 = apply(standM(D), [128, 470]);
  const snatch = progress(t, L13.end + 0.15, L13.end + 0.45);
  const exitU = progress(t, L13.end + 0.5, L13.end + 1.5);
  const ex = lerp(FIRING.x, -220, ease.in(exitU));

  // ---- camera ----
  const dronaClose: Cam = { cx: DRONA_C1_FACE[0] + 120, cy: DRONA_C1_FACE[1] + 110, z: 2.0 };
  const pre = camAt([
    { t: 25.0, cam: WIDE },
    { t: wAaya.end, cam: { cx: 500, cy: 1230, z: 1.3 }, ease: ease.inOut },
    { t: wDury.end, cam: { cx: dHead[0] + 30, cy: dHead[1] + 260, z: 1.7 }, ease: ease.inOut },       // the name: a push on his swagger
    { t: L6.end, cam: { cx: dHead[0] + 30, cy: dHead[1] + 250, z: 1.78 }, ease: ease.linear },
    { t: wAkad.start, cam: { cx: 520, cy: 1360, z: 1.45 }, ease: ease.inOut },                       // the target back in frame for the aim
    { t: wSadha.end, cam: { cx: 515, cy: 1370, z: 1.48 }, ease: ease.linear },
    { t: wPuchha.end, cam: { cx: 330, cy: 1230, z: 1.6 }, ease: ease.inOut },
    { t: L9.start + 0.3, cam: dronaClose, ease: ease.inOut },
  ], t);
  const io = irisOpen(t, dEye, dronaClose, wHai9.start - 0.5, L9.end + 0.15, L10.start - 0.6, L10.start - 0.1);
  const ic = irisClose(t, dEye, { cx: 330, cy: 1260, z: 1.45 }, L11.start - 0.55, L11.start - 0.05, L11.start + 0.5);
  const inPOV = t >= L10.start - 0.6 && t < L11.start - 0.05;
  const post = camAt([
    { t: L11.start + 0.5, cam: { cx: 330, cy: 1260, z: 1.45 } },
    { t: L12.start - 0.1, cam: { cx: 330, cy: 1260, z: 1.48 }, ease: ease.linear },
    { t: L12.start + 0.35, cam: { cx: dHead[0], cy: dHead[1] + 60, z: 3.0 }, ease: ease.inOut },      // close on his face
    { t: L12.end + 0.2, cam: { cx: dHead[0], cy: dHead[1] + 60, z: 3.15 }, ease: ease.linear },
    { t: L13.start + 0.3, cam: { cx: 420, cy: 1380, z: 1.45 }, ease: ease.inOut },
    { t: L13.end + 1.6, cam: WIDE, ease: ease.inOut },
  ], t);
  let cam: Cam = pre;
  if (t >= wHai9.start - 0.5 && t < L11.start - 0.55) cam = io.cam;
  else if (t >= L11.start - 0.55 && t < L11.start + 0.5) cam = ic.cam;
  else if (t >= L11.start + 0.5) cam = post;

  // ---- Duryodhana render ----
  let dury: React.ReactNode;
  const dStand = (extra: Record<string, unknown> = {}) => (
    <g transform={svgM(standM(D))}>
      <g transform={`translate(0 ${stampBounce + shake * 0.3})`}>
        <Prince look={D} expr={laughing ? "laugh" : angry > 0.2 ? "angry" : "smug"} angry={angry} bowAtSide={bowFall <= 0 || snatch >= 1}
          puff={Math.max(puffNamed * (1 - progress(t, L6.start + 0.2, L6.start + 1.2)) * 0.8, puffAkad)} armUp={armUp} crownDrop={crownDrop}
          headTilt={laughing ? -6 * laugh : 0} blink={blink(t, 31)} {...extra} />
      </g>
    </g>
  );
  if (t < wDury.start + 0.15) {
    dury = (
      <XFade k={turnFront}
        a={<g transform={svgM(place(wx, FIRING.y, LOOKS[D].height))}><Prince look={D} view="side" walk={walkU < 1 ? (t - L5.start) * 1.5 : 0} stride={1.25} bodyLean={-3} expr="smug" /></g>}
        b={dStand()} />
    );
  } else if (t < wDhanush.start + 0.2) {
    dury = <XFade k={toAim} a={dStand()} b={<ArcherAim look={D} expr="smug" draw={draw} blink={blink(t, 31)} />} />;
  } else if (t < wPeechhe.start + 0.25) {
    dury = <XFade k={lowered} a={<ArcherAim look={D} expr="smug" draw={draw} blink={blink(t, 31)} />} b={dStand()} />;
  } else if (exitU <= 0) {
    dury = dStand();
  } else {
    dury = (
      <g transform={svgM(place(ex, FIRING.y, LOOKS[D].height, true))}>
        <Prince look={D} view="side" walk={(t - L13.end) * 1.8} stride={1.2} expr="angry" angry={0.5} carryBow />
      </g>
    );
  }
  const bowProp = bowFall > 0 && snatch < 1 && exitU <= 0 ? (() => {
    const p: P2 = snatch > 0 ? [lerp(bowGround[0], bowHand[0], snatch), lerp(bowGround[1], bowHand[1], snatch)] : [lerp(bowHand[0], bowGround[0], ease.in(bowFall)), lerp(bowHand[1], bowGround[1], ease.in(bowFall))];
    const rot = snatch > 0 ? lerp(0, -80, snatch) : lerp(-80, 0, ease.in(bowFall));
    return <g transform={`translate(${p[0]} ${p[1]}) rotate(${rot}) scale(0.62)`}><BowLying /></g>;
  })() : null;

  // ---- POV (his wide, drifting view) ----
  const rNow = t < L11.start - 0.55 ? lerp(11 * 5.2, 440, ease.out(io.u)) : lerp(440, 14, ease.in(ic.u));
  const cNow: P2 = t < L11.start - 0.55
    ? [lerp(io.eyeScr[0], POV_CENTER[0], ease.inOut(io.u)), lerp(io.eyeScr[1], POV_CENTER[1], ease.inOut(io.u))]
    : [lerp(POV_CENTER[0], ic.eyeScr[0], ease.inOut(ic.u)), lerp(POV_CENTER[1], ic.eyeScr[1], ease.inOut(ic.u))];
  const showPOV = (t >= L10.start - 0.6 && t < L11.start - 0.05);
  const drift: P2 = [34 * Math.sin(t * 1.3), 20 * Math.sin(t * 1.9 + 1)];
  const glow = Math.sin(Math.PI * progress(t, wPed.start - 0.05, wPed.end + 0.5));
  const wiggle = 6 * Math.sin(t * 13) * Math.sin(Math.PI * progress(t, wDaliyan.start - 0.05, wDaliyan.end + 0.5));
  const pulse = Math.sin(Math.PI * progress(t, wChidiya.start - 0.05, wChidiya.end + 0.4));
  const sqU = progress(t, L10.start + 0.6, L10.end - 0.6);

  return (
    <Frame>
      {!inPOV || io.u < 1 || ic.u > 0 ? (
        <C1World cam={cam} foreground={<Watchers />} sky={c1Sky(t)}>
          <C1Life t={t} />
          <DronaC1>
            <Drona view="threeQuarter" pose={t > L11.start - 0.3 && t < L12.start ? "palm" : "beard"} raise={spring(t - (L11.start - 0.3), MATERIAL.body)}
              stroke={(t - 40) * 0.42} lean={4 * spring(t - wPuchha.start, MATERIAL.body) * (1 - progress(t, L11.start - 0.5, L11.start))}
              headTilt={(t > L11.start && t < L11.end + 0.4 ? 5 * Math.sin((t - L11.start) * 9) : 0) + (t > dropT + 0.3 && t < L13.end + 1 ? -6 : 0)}
              mouth={mouthOpen(t, [9, 11])} blink={blink(t, 11)} />
          </DronaC1>
          {bowFall > 0 && <DustPuff x={bowGround[0]} y={bowGround[1] + 6} age={t - (dropT + 0.35)} s={1.3} />}
          <DustPuff x={FIRING.x} y={FIRING.y} age={t - stamp} s={1.1} />
          {dury}
          {bowProp}
          {angry > 0.6 && t < L13.start + 0.2 && <g transform={`translate(${dHead[0]} ${dHead[1]})`}><Steam u={progress(t, wLaal.start, wLaal.start + 1.0)} /></g>}
          {t > wDury.start && t < wDury.start + 0.8 && <Sparkle x={dHead[0] - 24} y={dHead[1] - 150} s={0.9} o={Math.sin(Math.PI * progress(t, wDury.start, wDury.start + 0.8))} />}
        </C1World>
      ) : null}
      {showPOV && (
        <g>
          <rect width={W} height={H} fill="#2A1B12" opacity={t < L11.start - 0.55 ? ease.inOut(clamp(io.u * 1.6)) : 1 - ease.inOut(clamp((ic.u - 0.4) / 0.6))} />
          <POVWholeTree r={rNow} cx={cNow[0]} cy={cNow[1]} id="dur" drift={drift}
            open={t < L11.start - 0.55 ? ease.inOut(clamp(io.u * 2.2)) : 1 - ease.inOut(clamp((ic.u - 0.55) / 0.45))} glow={glow} wiggle={wiggle} birdPulse={pulse}
            opacity={t < L11.start - 0.55 ? ease.inOut(clamp((io.u - 0.1) / 0.6)) : 1}
            inner={sqU > 0 && sqU < 1 ? <g transform={`translate(${30} ${lerp(-40, -420, sqU)}) rotate(-90) scale(0.4)`}><Squirrel run={t * 6} /></g> : null}
            extra={<FallingLeaves t={t} count={4} x0={180} width={700} top={400} fall={900} seed={9} />} />
        </g>
      )}
    </Frame>
  );
};

// ======================= D · L14–L17 (+ wipe into L18): Yudhishthira — calm but wide =======================
export const SceneYudhishthira: React.FC = () => {
  const t = useStoryTime();
  const L14 = line(14), wYud = word(14, "युधिष्ठिर"), L15 = line(15), wNishana = word(15, "निशाना"), wSadha = word(15, "साधा");
  const L16 = line(16), wPoora = word(16, "पूरा"), wPed = word(16, "पेड़"), L17 = line(17), wPeechhe = word(17, "पीछे"), wTum = word(17, "तुम"), wSabhi = word(18, "सभी");
  const Y: LookName = "yudhishthira";
  const yEye = archerEye(Y);
  const walkU = progress(t, L14.start, wYud.start);
  const wx = lerp(-180, FIRING.x, ease.out(walkU));
  const toNamaste = progress(t, wYud.start - 0.1, wYud.start + 0.1);
  const namaste = spring(t - wYud.start, MATERIAL.body) * (1 - progress(t, L15.start - 0.4, L15.start - 0.1));
  const toFront = progress(t, L15.start - 0.2, L15.start);
  const toAim = progress(t, wNishana.start - 0.3, wNishana.start - 0.1);
  const draw = ease.inOut(progress(t, wNishana.start - 0.1, wSadha.end + 0.3));
  const close = { start: L16.end + 0.15, end: L16.end + 0.75 };
  const lowered = t > wPeechhe.start + 0.2;
  const bow = spring(t - (L17.end + 0.05), MATERIAL.body);
  const walkStart = L17.end + 0.65;
  const walkBack = progress(t, walkStart, wSabhi.start - 0.05);
  const wipe = { start: wSabhi.start - 0.45, end: wSabhi.start + 0.3 };
  const wipeU = progress(t, wipe.start, wipe.end);

  const pre = camAt([
    { t: 68.2, cam: WIDE },
    { t: wYud.start, cam: { cx: 430, cy: 1260, z: 1.35 }, ease: ease.inOut },
    { t: L15.end, cam: { cx: 470, cy: 1330, z: 1.45 }, ease: ease.linear },
  ], t);
  const io = irisOpen(t, yEye, { cx: 470, cy: 1330, z: 1.45 }, L15.end, L15.end + 0.45, L16.start - 0.55, L16.start - 0.05);
  const ic = irisClose(t, yEye, { cx: 360, cy: 1260, z: 1.5 }, close.start, close.end, wTum.start);
  const camPost = camAt([{ t: wTum.start, cam: { cx: 360, cy: 1260, z: 1.5 } }, { t: wipe.end, cam: { cx: 330, cy: 1270, z: 1.45 }, ease: ease.linear }], t);
  let cam = pre;
  if (t >= L15.end && t < close.start) cam = io.cam;
  else if (t >= close.start && t < wTum.start) cam = ic.cam;
  else if (t >= wTum.start) cam = camPost;
  const inPOV = t >= L16.start - 0.55 && t < close.end;

  let yud: React.ReactNode;
  if (t < wYud.start + 0.1) {
    yud = (
      <XFade k={toNamaste}
        a={<g transform={svgM(place(wx, FIRING.y, LOOKS[Y].height))}><Prince look={Y} view="side" walk={walkU < 1 ? (t - L14.start) * 1.3 : 0} carryBow /></g>}
        b={<g transform={svgM(place(FIRING.x, FIRING.y, LOOKS[Y].height, true))}><Prince look={Y} view="threeQuarter" namaste={namaste} expr="calm" /></g>} />
    );
  } else if (t < L15.start) {
    yud = (
      <XFade k={toFront}
        a={<g transform={svgM(place(FIRING.x, FIRING.y, LOOKS[Y].height, true))}><Prince look={Y} view="threeQuarter" namaste={namaste} expr="smile" /></g>}
        b={<g transform={svgM(place(FIRING.x, FIRING.y, LOOKS[Y].height, true))}><Prince look={Y} expr="calm" bowAtSide /></g>} />
    );
  } else if (!lowered) {
    yud = <XFade k={toAim} a={<g transform={svgM(place(FIRING.x, FIRING.y, LOOKS[Y].height, true))}><Prince look={Y} expr="calm" bowAtSide /></g>} b={<ArcherAim look={Y} expr="calm" draw={draw} />} />;
  } else if (walkBack <= 0) {
    yud = <g transform={svgM(place(FIRING.x, FIRING.y, LOOKS[Y].height, true))}><Prince look={Y} expr="calm" nod={bow} bowAtSide /></g>;
  } else {
    yud = <g transform={svgM(place(lerp(FIRING.x, 90, ease.inOut(walkBack)), FIRING.y, LOOKS[Y].height, true))}><Prince look={Y} view="side" walk={(t - walkStart) * 1.6} carryBow /></g>;
  }
  const povR = t < close.start ? lerp(11 * 5.2, 440, ease.out(io.u)) : lerp(440, 14, ease.in(ic.u));
  const povC: P2 = t < close.start
    ? [lerp(io.eyeScr[0], POV_CENTER[0], ease.inOut(io.u)), lerp(io.eyeScr[1], POV_CENTER[1], ease.inOut(io.u))]
    : [lerp(POV_CENTER[0], ic.eyeScr[0], ease.inOut(ic.u)), lerp(POV_CENTER[1], ic.eyeScr[1], ease.inOut(ic.u))];
  const glow = ease.inOut(progress(t, wPoora.start - 0.05, wPed.end + 0.2));
  const showC2 = wipeU > 0.5;
  const bhimaX = lerp(1700, -700, ease.inOut(wipeU));
  return (
    <Frame>
      {!showC2 ? (
        (!inPOV || io.u < 1 || ic.u > 0) && (
          <C1World cam={cam} foreground={<Watchers />} sky={c1Sky(t)}>
            <C1Life t={t} />
            <DronaC1>
              <Drona view="threeQuarter" pose={t > wTum.start - 0.3 ? "palm" : "beard"} raise={spring(t - (wTum.start - 0.3), MATERIAL.body)}
                stroke={(t - 60) * 0.42} headTilt={t > wYud.start && t < wYud.start + 1 ? 6 * Math.sin(Math.PI * progress(t, wYud.start, wYud.start + 1)) : 2}
                mouth={mouthOpen(t, [17])} blink={blink(t, 11)} lean={2} />
            </DronaC1>
            {yud}
          </C1World>
        )
      ) : (
        <C2World cam={{ cx: 540, cy: 1250, z: 1.0 }}>
          {LINEUP.map((p, i) => (
            <g key={p.look} transform={svgM(place(p.x, 1760, 0.9, p.mirror))}>
              <Prince look={p.look} view={p.view} expr={p.look === "duryodhana" ? "smug" : "calm"} blink={blink(t, 40 + i)} />
            </g>
          ))}
        </C2World>
      )}
      {inPOV && (
        <g>
          <rect width={W} height={H} fill="#2A1B12" opacity={t < close.start ? ease.inOut(clamp(io.u * 1.6)) : 1 - ease.inOut(clamp((ic.u - 0.4) / 0.6))} />
          <POVWholeTree r={povR} cx={povC[0]} cy={povC[1]} id="yud" glow={glow * (t < close.start ? 1 : 1 - ic.u)}
            open={t < close.start ? ease.inOut(clamp(io.u * 2.2)) : 1 - ease.inOut(clamp((ic.u - 0.55) / 0.45))}
            opacity={t < close.start ? ease.inOut(clamp((io.u - 0.1) / 0.6)) : 1} />
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

// ======================= E · L18–L19: they look at each other; "impossible?" =======================
export const SceneImpossible: React.FC = () => {
  const t = useStoryTime();
  const wEk = word(18, "एक-दूसरे"), L18 = line(18), wChunauti = word(19, "चुनौती"), wAsambhav = word(19, "असंभव"), L19 = line(19), L20 = line(20);
  const c2cam = camAt([
    { t: 82.6, cam: { cx: 540, cy: 1250, z: 1.0 } },
    { t: L18.end, cam: { cx: 600, cy: 1270, z: 1.12 }, ease: ease.linear },
    { t: wChunauti.start, cam: { cx: 600, cy: 1270, z: 1.14 }, ease: ease.linear },
    { t: wChunauti.start + 0.45, cam: { cx: 600, cy: -1400, z: 1.14 }, ease: ease.in },
  ], t);
  const tiltPeak = wChunauti.start + 0.45;
  const speed = Math.sin(Math.PI * progress(t, wChunauti.start, wChunauti.start + 0.9));
  const SKY_END: Cam = { cx: 820, cy: 520, z: 0.5 };
  const skyCam = camAt([
    { t: tiltPeak, cam: { cx: 820, cy: -1600, z: 0.62 } },
    { t: tiltPeak + 0.7, cam: { cx: 820, cy: 360, z: 0.62 }, ease: ease.out },
    { t: wAsambhav.start, cam: { cx: 820, cy: 400, z: 0.6 }, ease: ease.linear },
    { t: L19.end + 0.3, cam: SKY_END, ease: ease.inOut },     // the bird shrinks into the huge sky
    { t: L20.start, cam: SKY_END, ease: ease.linear },
  ], t);
  const look = (i: number) => {
    const s0 = wEk.start + i * 0.12;
    const there = progress(t, s0, s0 + 0.16), back = progress(t, s0 + 0.9, s0 + 1.06);
    return there * (1 - back);
  };
  const shrug = Math.sin(Math.PI * progress(t, wEk.end + 0.2, wEk.end + 1.1));
  const qO = ease.inOut(progress(t, L19.end, L19.end + 0.5));
  return (
    <Frame>
      <defs>
        <filter id="tilt-blur" x="-5%" y="-30%" width="110%" height="160%"><feGaussianBlur stdDeviation={`0 ${(24 * speed).toFixed(1)}`} edgeMode="duplicate" /></filter>
      </defs>
      {t < tiltPeak ? (
        <g filter={speed > 0.05 ? "url(#tilt-blur)" : undefined}>
          <C2World cam={c2cam}>
            {LINEUP.map((p, i) => {
              const k = look(i);
              const dir = i % 2 === 0 ? 1 : -1; // neighbours turn toward each other
              const flip = p.mirror ? dir < 0 : dir > 0;
              return (
                <g key={p.look} transform={k > 0 ? flipX(p.x, flip ? 0 : k) : undefined}>
                  <g transform={svgM(place(p.x, 1760, 0.9, p.mirror))}>
                    <Prince look={p.look} view={p.view === "front" && k > 0.5 ? "threeQuarter" : p.view} expr={t > wEk.start ? "surprised" : "calm"}
                      cheer={p.look === "bhima" ? 0.22 * shrug : 0} blink={blink(t, 40 + i)} />
                  </g>
                </g>
              );
            })}
          </C2World>
        </g>
      ) : (
        <g filter={speed > 0.05 ? "url(#tilt-blur)" : undefined}>
          <C1World cam={skyCam} sky={c1Sky(t)}>
            <DronaC1><Drona view="threeQuarter" pose="beard" stroke={(t - 108.3) * 0.42} blink={blink(t, 11)} /></DronaC1>
          </C1World>
          <Layer cam={skyCam}><GoldQ x={C1_EYE[0] + 150} y={C1_EYE[1] - 300} s={0.75} o={qO} /></Layer>
        </g>
      )}
    </Frame>
  );
};
export const SKY_END_CAM: Cam = { cx: 820, cy: 520, z: 0.5 };

// ======================= F · L20–L24: Arjuna steps up; the hush; the bow; the breath =======================
export const MID_ARJ: Cam = { cx: 470, cy: 1330, z: 1.55 };
export const SceneArjuna: React.FC = () => {
  const t = useStoryTime();
  const L20 = line(20), wAage = word(20, "आगे"), wArjun = word(20, "अर्जुन"), L21 = line(21), wShant = word(21, "शांत");
  const L22 = line(22), wUthaya = word(22, "उठाया"), L23 = line(23), wPratyancha = word(23, "प्रत्यंचा"), wKhinchi = word(23, "खींची"), L24 = line(24), wSaans = word(24, "साँस");
  const A: LookName = "arjuna";
  const { toChar } = aimFrames(AIM_POSE.lean, AIM_POSE.tRot);
  const M = archerPlace(A);
  const tipTop = apply(M, toChar(AIM.tipTop)), tipBot = apply(M, toChar(AIM.tipBot)), anchor = apply(M, toChar(AIM.anchor));
  const bowMid: P2 = [(tipTop[0] + tipBot[0]) / 2, (tipTop[1] + tipBot[1]) / 2];
  const cam = camAt([
    { t: L20.start - 0.05, cam: SKY_END_CAM },
    { t: wAage.start, cam: { cx: 560, cy: 1190, z: 1.1 }, ease: ease.inOut },            // follow the falling leaf down
    { t: wArjun.end, cam: { cx: 470, cy: 1260, z: 1.3 }, ease: ease.inOut },
    { t: L21.start + 0.2, cam: { cx: 540, cy: 1170, z: 1.02 }, ease: ease.inOut },        // the whole ground
    { t: wShant.end, cam: { cx: 540, cy: 1180, z: 1.06 }, ease: ease.linear },
    { t: L22.start, cam: { cx: 470, cy: 1450, z: 1.55 }, ease: ease.inOut },              // low and close: backlit
    { t: L22.end, cam: { cx: 470, cy: 1440, z: 1.6 }, ease: ease.linear },
    { t: L23.start + 0.35, cam: { cx: bowMid[0] + 40, cy: bowMid[1] + 30, z: 3.0 }, ease: ease.inOut }, // the bowstring
    { t: L23.end + 0.2, cam: { cx: bowMid[0] + 50, cy: bowMid[1] + 30, z: 3.1 }, ease: ease.linear },
    { t: L24.start + 0.3, cam: MID_ARJ, ease: ease.inOut },
    { t: 107.25, cam: MID_ARJ, ease: ease.linear },
  ], t);
  const leafU = progress(t, L20.start, wArjun.start);
  const leaf: P2 = [lerp(820, 600, leafU) + 50 * Math.sin(leafU * 8), lerp(300, 1840, ease.inOut(leafU))];
  const walkU = progress(t, wAage.start - 0.25, wArjun.start + 0.05);
  const wx = lerp(-180, FIRING.x, ease.out(walkU));
  const turn = progress(t, wArjun.start, wArjun.start + 0.2);
  const toAim = progress(t, wUthaya.start - 0.05, wUthaya.start + 0.2);
  const draw = ease.inOut(progress(t, wKhinchi.start, wKhinchi.end + 0.7));
  const glint = progress(t, wPratyancha.start, wPratyancha.end + 0.1);
  const breath = 0.5 * Math.sin(Math.PI * 0.5 * clamp(progress(t, wSaans.start, wSaans.end) * 1.0));
  const hush = ease.inOut(progress(t, wShant.start - 0.6, wShant.end));
  const rim = ease.inOut(progress(t, L22.start, L22.start + 0.8)) * (1 - progress(t, L23.start, L23.start + 0.4));
  const amb = ambient(t);
  const sq = treePt([30, -260]);
  let arj: React.ReactNode;
  if (walkU <= 0) {
    arj = null;
  } else if (t < wArjun.start + 0.2) {
    arj = <XFade k={turn}
      a={<g transform={svgM(place(wx, FIRING.y, LOOKS[A].height))}><Prince look={A} view="side" walk={walkU < 1 ? (t - wAage.start) * 1.2 : 0} stride={0.9} carryBow /></g>}
      b={<g transform={svgM(place(FIRING.x, FIRING.y, LOOKS[A].height, true))}><Prince look={A} expr="calm" bowAtSide /></g>} />;
  } else if (t < wUthaya.start + 0.2) {
    arj = <XFade k={toAim} a={<g transform={svgM(place(FIRING.x, FIRING.y, LOOKS[A].height, true))}><Prince look={A} expr="calm" bowAtSide blink={blink(t, 33)} /></g>} b={<ArcherAim look={A} expr="focused" draw={0} breath={0} />} />;
  } else {
    arj = <ArcherAim look={A} expr="focused" draw={draw} breath={breath} />;
  }
  const strP = (u: number): P2 => (u < 0.5 ? [lerp(tipTop[0], anchor[0], u * 2), lerp(tipTop[1], anchor[1], u * 2)] : [lerp(anchor[0], tipBot[0], u * 2 - 1), lerp(anchor[1], tipBot[1], u * 2 - 1)]);
  const gp = strP(glint);
  return (
    <Frame>
      <C1World cam={cam} foreground={cam.z > 0.9 ? <Watchers /> : undefined} sky={c1Sky(t)}
        behind={<g transform={`translate(${sq[0]} ${sq[1]}) scale(-0.42 0.42) rotate(-80)`} opacity={progress(t, L21.start, L21.start + 0.6)}><Squirrel run={amb > 0.05 ? t * 6 * amb : 0} /></g>}>
        {t < L20.start + 0.6 && <GoldQ x={C1_EYE[0] + 150} y={C1_EYE[1] - 300} s={0.75} o={1 - progress(t, L20.start, L20.start + 0.6)} />}
        <Butterflies t={t} amount={amb} area={[60, 1380, 300, 260]} />
        <FallingLeaves t={t} amount={amb} count={3} x0={560} width={400} top={700} fall={1100} />
        {leafU > 0 && leafU < 1 && <Leaf x={leaf[0]} y={leaf[1]} rot={leafU * 400} s={0.7} />}
        <DronaC1><Drona view="threeQuarter" pose="beard" stroke={(t - 108.3) * 0.42} blink={blink(t, 11)} /></DronaC1>
        {arj}
        {glint > 0 && glint < 1 && <Sparkle x={gp[0]} y={gp[1]} s={0.45} o={Math.sin(Math.PI * glint)} />}
      </C1World>
      {hush > 0 && <rect width={W} height={H} fill="#9FB4D9" opacity={0.07 * hush * (1 - progress(t, L22.start, L22.start + 1))} style={{ mixBlendMode: "multiply" }} />}
      {rim > 0 && (
        <g opacity={0.55 * rim}>
          <defs><radialGradient id="rimg"><stop offset="0" stopColor="#FFE7A8" stopOpacity={0.9} /><stop offset="1" stopColor="#FFE7A8" stopOpacity={0} /></radialGradient></defs>
          <circle cx={toScreen(cam, [720, 520])[0]} cy={toScreen(cam, [720, 520])[1]} r={700} fill="url(#rimg)" />
        </g>
      )}
    </Frame>
  );
};
void mul; void T; void S; void Layer;
