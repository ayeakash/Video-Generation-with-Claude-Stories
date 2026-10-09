// Shared staging for every scene (series bible §5b): C1 main stage, C2 reverse (ashram), POV window, close-up helpers.
// Positions here are the floor plan; scenes only move cameras and act, so the world never jumps between shots.
import React from "react";
import { staticFile } from "remotion";
import { W, H, Layer, Cam } from "../camera/Camera";
import { Sky, Hills, FarTrees, Ground, HORIZON } from "../backgrounds/Gurukul";
import { AshramBackdrop } from "../backgrounds/Ashram";
import { Prince, place, aimFrames, AIM, LOOKS, LookName } from "../characters/Prince";
import { Tree, WoodenBird, treeEyeLocal, TREE, BIRD_BASE } from "../graphics/props";
import { POVWindow, POV_CENTER } from "../formats/POVWindow";
import { apply, clamp, ease, lerp, progress, mul, T, S, M, svgM } from "../utils/motion";

export type P2 = [number, number];

export const softLinear = (u: number, k = 0.12) => {
  u = clamp(u);
  if (u < k) return (u * u) / (2 * k * (1 - k));
  if (u > 1 - k) return 1 - ((1 - u) * (1 - u)) / (2 * k * (1 - k));
  return (u - k / 2) / (1 - k);
};

export const Grain: React.FC = () => <image href={staticFile("paper-grain.png")} x={0} y={0} width={W} height={H} style={{ mixBlendMode: "multiply" }} opacity={0.8} />;

// ---------------- C1 main stage (floor plan) ----------------
export const FIRING = { x: 420, y: 1860 };        // the archer on the firing line (mirrored front view: aims screen-right)
export const AIM_POSE = { lean: 16, tRot: 22 };    // every prince aims along the same line at the same painted eye
export const DRONA_C1 = { x: 158, y: 1585, s: 0.72 };
const archerM = (look: LookName) => place(FIRING.x, FIRING.y, LOOKS[look].height, true);
const { toChar } = aimFrames(AIM_POSE.lean, AIM_POSE.tRot);
export const archerEye = (look: LookName): P2 => apply(archerM(look), toChar(AIM.eyeL));
const unit = (a: P2, b: P2): P2 => { const dx = b[0] - a[0], dy = b[1] - a[1], n = Math.hypot(dx, dy); return [dx / n, dy / n]; };
const A0 = apply(archerM("arjuna"), toChar(AIM.anchor)), T0 = apply(archerM("arjuna"), toChar(AIM.arrowTip));
const DIR = unit(A0, T0);
const EYE: P2 = [790, A0[1] + DIR[1] * ((790 - A0[0]) / DIR[0])];
export const C1_EYE = EYE;
export const C1_ANCHOR = A0;
export const C1_DIR = DIR;
const TREE_S = 0.6, REACH = 330;
export const C1_TREE: M = mul(T(EYE[0] + TREE_S * treeEyeLocal(REACH)[0], EYE[1] - TREE_S * treeEyeLocal(REACH)[1]), S(-TREE_S, TREE_S));
/** Points on the C1 target tree (tree-local → world). */
export const treePt = (p: P2): P2 => apply(C1_TREE, p);
export const TREE_TOP = treePt([0, -780]), TREE_BASE = treePt([0, 0]), BRANCH_MID = treePt([200, -350]), BIRD_BODY = treePt([REACH - 52, -352 - 60]);
export const DRONA_C1_FACE: P2 = apply(place(DRONA_C1.x, DRONA_C1.y, DRONA_C1.s), [212, 172]);

export const ArcherAim: React.FC<{ look: LookName; expr?: "focused" | "smug" | "calm" | "angry"; blink?: number; draw?: number; lean?: number; tRot?: number; breath?: number; angry?: number }> = ({
  look, expr = "focused", blink = 0, draw = 1, lean = AIM_POSE.lean, tRot = AIM_POSE.tRot, breath = 0.5, angry = 0,
}) => (
  <g transform={svgM(archerM(look))}>
    <Prince look={look} pose="aim" expr={expr} lean={lean} tRot={tRot} draw={draw} breath={breath} blink={blink} angry={angry} />
  </g>
);
export const archerPlace = archerM;

export const C1World: React.FC<{ cam: Cam; children: React.ReactNode; foreground?: React.ReactNode; warm?: number; arrowIn?: boolean; sky?: React.ReactNode; treeProps?: Record<string, number>; bird?: React.ReactNode; behind?: React.ReactNode }> = ({ cam, children, foreground, warm = 0, arrowIn, sky, treeProps, bird, behind }) => (
  <g>
    <defs><filter id="fg-soft" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation={3} /></filter></defs>
    <Layer cam={cam} depth={0.25}><Sky warm={warm} sunY={warm ? 700 : 520} /></Layer>
    {sky && <Layer cam={cam} depth={0.4}>{sky}</Layer>}
    <Layer cam={cam} depth={0.55}><Hills /></Layer>
    <Layer cam={cam} depth={0.8}><FarTrees /></Layer>
    <Layer cam={cam}>
      <Ground />
      {behind}
      <g transform={svgM(C1_TREE)}><Tree reach={REACH} bird={bird ?? <WoodenBird arrowIn={arrowIn} />} {...(treeProps ?? {})} /></g>
      {children}
    </Layer>
    {foreground && progress(cam.z, 1.19, 1.27) < 1 && (
      <g filter="url(#fg-soft)" opacity={(1 - progress(cam.z, 1.19, 1.27)) * progress(cam.z, 0.9, 1.0)}><Layer cam={cam} depth={1.18}>{foreground}</Layer></g>
    )}
    {warm > 0 && <rect width={W} height={H} fill="#FF9E50" opacity={0.1 * warm} style={{ mixBlendMode: "multiply" }} />}
  </g>
);

/** Waiting princes between camera and the line, seen from behind (C1 depth layer). */
export const Watchers: React.FC<{ who?: [LookName, LookName] }> = ({ who = ["yudhishthira", "bhima"] }) => (
  <g>
    <g transform={svgM(place(-20, 2330, 1.3))}><Prince look={who[0]} view="back" /></g>
    <g transform={svgM(place(1040, 2360, 1.32))}><Prince look={who[1]} view="back" /></g>
  </g>
);

// ---------------- C2 reverse: looking south at the ashram (sun on the LEFT) ----------------
export const C2World: React.FC<{ cam: Cam; children: React.ReactNode; sunY?: number }> = ({ cam, children, sunY = 520 }) => (
  <g>
    <Layer cam={cam} depth={0.25}><Sky sunX={330} sunY={sunY} /></Layer>
    <Layer cam={cam}>
      <Ground />
      <AshramBackdrop />
      {children}
    </Layer>
  </g>
);

/** The line-up seen from the ashram side (faces). Order and spacing are fixed so every C2 shot matches. */
export const LINEUP: { look: LookName; x: number; mirror: boolean; view: "front" | "threeQuarter" }[] = [
  { look: "duryodhana", x: 190, mirror: false, view: "threeQuarter" },
  { look: "yudhishthira", x: 440, mirror: false, view: "front" },
  { look: "bhima", x: 690, mirror: true, view: "threeQuarter" },
  { look: "arjuna", x: 910, mirror: true, view: "threeQuarter" },
];

// ---------------- POV window (generic): the whole tree as seen from the firing line ----------------
const PV_S = 1.7, PV_REACH = 430;
export const PV_EYE: P2 = [520, 770];
const PV_TX = PV_EYE[0] + PV_S * treeEyeLocal(PV_REACH)[0];
const PV_TY = PV_EYE[1] - PV_S * treeEyeLocal(PV_REACH)[1];
export const PV_TREE_M: M = mul(T(PV_TX, PV_TY), S(-PV_S, PV_S));
export const PV_WHOLE: P2 = [(PV_EYE[0] + PV_TX) / 2 + 20, PV_TY - 0.5 * PV_S * 640];

/** POV window showing the whole tree (wide). `glow` outlines the entire tree (Yudhishthira's "पूरा पेड़").
 *  `r` radius, centre (cx, cy); content dims with `opacity`. */
export const POVWholeTree: React.FC<{ r: number; cx?: number; cy?: number; glow?: number; drift?: P2; id: string; opacity?: number; wiggle?: number; birdPulse?: number; extra?: React.ReactNode; inner?: React.ReactNode; open?: number }> = ({
  r, cx = POV_CENTER[0], cy = POV_CENTER[1], glow = 0, drift = [0, 0], id, opacity = 1, wiggle = 0, birdPulse = 0, extra, inner: innerExtra, open = 1,
}) => {
  const z = 0.6;
  const inner = `translate(${cx + drift[0]} ${cy + drift[1]}) scale(${z}) translate(${-PV_WHOLE[0]} ${-PV_WHOLE[1]})`;
  return (
    <POVWindow r={r} cx={cx} cy={cy} id={id} open={open}>
      <g opacity={opacity}>
        <defs>
          <filter id={`glow-${id}`} x="-20%" y="-20%" width="140%" height="140%">
            <feMorphology operator="dilate" radius={10} in="SourceAlpha" result="d" />
            <feGaussianBlur in="d" stdDeviation={8} result="b" />
            <feFlood floodColor="#FFD34D" />
            <feComposite in2="b" operator="in" />
          </filter>
        </defs>
        <g transform={inner}>
          <g transform="translate(0 -60)"><Sky /></g>
          <g transform={`translate(0 ${-HORIZON + 1180})`}><Hills /><rect x={-2000} y={HORIZON + 30} width={5080} height={2000} fill="#D9A066" /></g>
          {glow > 0 && <g filter={`url(#glow-${id})`} opacity={glow}><g transform={svgM(PV_TREE_M)}><Tree reach={PV_REACH} /></g></g>}
          <g transform={svgM(PV_TREE_M)}>
            <Tree reach={PV_REACH} bird={<WoodenBird />} wiggle={wiggle} birdPulse={birdPulse} />
            {innerExtra}
          </g>
        </g>
        {extra}
      </g>
    </POVWindow>
  );
};
void BIRD_BASE; void TREE; void lerp; void ease;

/** The Question → iris: camera glides to the prince's face, pushes gently toward his eye, and his view opens from the eye.
 *  Returns the camera and the window geometry for time t. */
export const irisOpen = (t: number, eye: P2, before: Cam, glideStart: number, faceAt: number, openStart: number, openEnd: number) => {
  const face: Cam = { cx: eye[0] + 12, cy: eye[1] + 30, z: 2.9 };
  const cam = camAtLocal([
    { t: glideStart, cam: before },
    { t: faceAt, cam: face, e: ease.inOut },
    { t: openEnd, cam: { cx: eye[0], cy: eye[1], z: 5.2 }, e: (x: number) => softLinear(x, 0.25) },
  ], t);
  const u = progress(t, openStart, openEnd);
  const eyeScr: P2 = [(eye[0] - cam.cx) * cam.z + W / 2, (eye[1] - cam.cy) * cam.z + H / 2];
  return { cam, u, eyeScr };
};
/** POV closes back into the eye while the world camera pulls back (inverse of irisOpen). */
export const irisClose = (t: number, eye: P2, after: Cam, start: number, end: number, settle: number) => {
  const cam = camAtLocal([
    { t: start, cam: { cx: eye[0], cy: eye[1], z: 5.2 } },
    { t: settle, cam: after, e: (x: number) => softLinear(x, 0.25) },
  ], t);
  const u = progress(t, start, end);
  const eyeScr: P2 = [(eye[0] - cam.cx) * cam.z + W / 2, (eye[1] - cam.cy) * cam.z + H / 2];
  return { cam, u, eyeScr };
};
const camAtLocal = (keys: { t: number; cam: Cam; e?: (x: number) => number }[], t: number): Cam => {
  if (t <= keys[0].t) return keys[0].cam;
  for (let i = 1; i < keys.length; i++) {
    if (t <= keys[i].t) {
      const a = keys[i - 1], b = keys[i];
      const e = (b.e ?? ease.inOut)(progress(t, a.t, b.t));
      return { cx: lerp(a.cam.cx, b.cam.cx, e), cy: lerp(a.cam.cy, b.cam.cy, e), z: Math.exp(lerp(Math.log(a.cam.z), Math.log(b.cam.z), e)) };
    }
  }
  return keys[keys.length - 1].cam;
};
