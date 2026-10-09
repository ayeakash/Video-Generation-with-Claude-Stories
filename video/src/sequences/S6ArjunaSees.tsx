// S6 (L25–L27): "गुरु द्रोणाचार्य ने पूछा… अर्जुन… तुम्हें क्या दिखाई दे रहा है?" → "…मुझे तो बस… चिड़िया की आँख…"
// Staging (series bible §5d): ONE camera setup, C1 "main stage" looking north at the firing line. Arjuna faces camera and
// aims screen-right at the far tree; Drona stands behind-left in 3/4 facing him; waiting princes are foreground BACK views.
// No cuts: one continuous camera move, keyed to FROZEN word times:
//   wide → glide to the guru as he is named → he leans in on "पूछा" → hold on him while he asks →
//   glide to Arjuna's face as the question ends → short push toward the eye → his view opens just before "गुरुदेव" →
//   POV: one steady, near-linear zoom from the whole tree to the painted eye; ring locks on "आँख".
import React from "react";
import { staticFile } from "remotion";
import { useStoryTime, word, mouthOpen, line } from "../timing/clock";
import { camAt, Layer, W, H, CamKey, Cam } from "../camera/Camera";
import { Sky, Hills, FarTrees, Ground, HORIZON } from "../backgrounds/Gurukul";
import { Prince, place, aimFrames, AIM, LOOKS } from "../characters/Prince";
import { Drona } from "../characters/Drona";
import { Tree, WoodenBird, FocusRing, treeEyeLocal, TREE, BIRD_BASE } from "../graphics/props";
import { POVWindow, POV_CENTER } from "../formats/POVWindow";
import { apply, blink, clamp, ease, lerp, progress, spring, MATERIAL, svgM, mul, T, S, M } from "../utils/motion";

type P2 = [number, number];
const unit = (a: P2, b: P2): P2 => {
  const dx = b[0] - a[0], dy = b[1] - a[1], n = Math.hypot(dx, dy);
  return [dx / n, dy / n];
};

/** Places the far tree so the arrow axis (anchor → tip) passes exactly through the painted eye at x = eyeX. */
const treeOnAim = (anchor: P2, tip: P2, eyeX: number, treeS: number, reach: number) => {
  const dir = unit(anchor, tip);
  const d = (eyeX - anchor[0]) / dir[0];
  const eye: P2 = [anchor[0] + dir[0] * d, anchor[1] + dir[1] * d];
  const local = treeEyeLocal(reach);
  const m: M = mul(T(eye[0] + treeS * local[0], eye[1] - treeS * local[1]), S(-treeS, treeS)); // mirrored: branch reaches left
  return { eye, m };
};

// ---------------- shot B / C world (front): Drona left in 3/4 facing Arjuna, Arjuna front aim ----------------
const ARJ = { x: 420, y: 1860, s: LOOKS.arjuna.height, lean: 16, tRot: 22 };
const DRONA = { x: 158, y: 1585, s: 0.72 };
const ARJ_M = place(ARJ.x, ARJ.y, ARJ.s, true);
const { toChar } = aimFrames(ARJ.lean, ARJ.tRot);
const fwd = (p: P2) => apply(ARJ_M, toChar(p));
const FRONT_TREE = treeOnAim(fwd(AIM.anchor), fwd(AIM.arrowTip), 790, 0.6, 330);
export const ARJUNA_EYE = fwd(AIM.eyeL);
const DRONA_FACE: P2 = apply(place(DRONA.x, DRONA.y, DRONA.s), [212, 150]);


// ---------------- POV layout ----------------
const PV_S = 1.7;
const PV_REACH = 430; // perch far enough out that only open sky sits behind the bird
const PV_EYE: P2 = [520, 770];
const PV_TX = PV_EYE[0] + PV_S * treeEyeLocal(PV_REACH)[0];
const PV_TY = PV_EYE[1] - PV_S * treeEyeLocal(PV_REACH)[1];
const PV_TREE_M = mul(T(PV_TX, PV_TY), S(-PV_S, PV_S));
const PV_BIRD_BODY: P2 = apply(PV_TREE_M, [PV_REACH - 52, -352 - BIRD_BASE * TREE.birdScale * 0.55]);
const EYE_R_UNIT = 15 * TREE.birdScale * PV_S; // painted-eye radius on screen at inner zoom 1
const PV_WHOLE: P2 = [(PV_EYE[0] + PV_TX) / 2 + 20, PV_TY - 0.5 * PV_S * 640];
const Z_WHOLE = 0.6, Z_EYE = 150 / EYE_R_UNIT;

/** Mostly linear ramp with short soft ends (a human "focusing in", not an eased swoop). */
const softLinear = (u: number, k = 0.12) => {
  u = clamp(u);
  if (u < k) return (u * u) / (2 * k * (1 - k));
  if (u > 1 - k) return 1 - ((1 - u) * (1 - u)) / (2 * k * (1 - k));
  return (u - k / 2) / (1 - k);
};

const Grain: React.FC = () => <image href={staticFile("paper-grain.png")} x={0} y={0} width={W} height={H} style={{ mixBlendMode: "multiply" }} opacity={0.8} />;

const World: React.FC<{ cam: Cam; children: React.ReactNode; foreground?: React.ReactNode }> = ({ cam, children, foreground }) => (
  <g>
    <defs>
      <filter id="fg-soft" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation={3} /></filter>
    </defs>
    <Layer cam={cam} depth={0.25}><Sky /></Layer>
    <Layer cam={cam} depth={0.55}><Hills /></Layer>
    <Layer cam={cam} depth={0.8}><FarTrees /></Layer>
    <Layer cam={cam}>
      <Ground />
      {children}
    </Layer>
    {/* foreground watchers belong to the wide framing; they ease away as the camera moves in */}
    {foreground && cam.z < 1.55 && (
      <g filter="url(#fg-soft)" opacity={1 - progress(cam.z, 1.22, 1.5)}><Layer cam={cam} depth={1.18}>{foreground}</Layer></g>
    )}
  </g>
);

/** Waiting princes in the foreground, seen from behind as they watch the firing line (C1 depth layer). */
const Watchers: React.FC = () => (
  <g>
    <g transform={svgM(place(-20, 2330, 1.3))}><Prince look="yudhishthira" view="back" /></g>
    <g transform={svgM(place(1040, 2360, 1.32))}><Prince look="bhima" view="back" /></g>
  </g>
);

export const S6ArjunaSees: React.FC = () => {
  const t = useStoryTime();
  const wDrona = word(25, "द्रोणाचार्य");
  const wPuchha = word(25, "पूछा");
  const L25end = line(25).end;
  const wArjun = word(26, "अर्जुन");
  const wHai = word(26, "है");
  const wGurudev = word(27, "गुरुदेव");
  const wMujhe = word(27, "मुझे");
  const wBas = word(27, "बस");
  const wChidiya = word(27, "चिड़िया");
  const wAankh = word(27, "आँख");

  const IRIS = { start: wGurudev.start - 0.6, end: wGurudev.start - 0.1 }; // his view opens just before he answers
  const puchha = spring(t - wPuchha.start, MATERIAL.body);
  const bird = <WoodenBird />;
  void L25end; void wArjun;

  // ---------------- one continuous camera (C1 main stage) ----------------
  const wide: Cam = { cx: 560, cy: 1190, z: 1.16 };
  const onGuru: Cam = { cx: 330, cy: 1230, z: 1.6 };
  const dronaClose: Cam = { cx: DRONA_FACE[0] + 120, cy: DRONA_FACE[1] + 110, z: 2.0 };
  const faceCam: Cam = { cx: ARJUNA_EYE[0] + 12, cy: ARJUNA_EYE[1] + 30, z: 2.9 };
  const keys: CamKey[] = [
    { t: 107.25, cam: { cx: 470, cy: 1330, z: 1.55 } },          // continues from scene F (MID_ARJ)
    { t: 108.5, cam: wide, ease: ease.inOut },
    { t: wDrona.start, cam: { ...wide, z: 1.18 }, ease: ease.linear },
    { t: wPuchha.end, cam: onGuru, ease: ease.inOut },                                     // the guru is named → we go to him
    { t: wArjun.start + 0.4, cam: dronaClose, ease: ease.inOut },                           // he asks
    { t: wHai.start - 0.5, cam: { ...dronaClose, cx: dronaClose.cx + 12, z: 2.05 }, ease: ease.linear },
    { t: wHai.end + 0.15, cam: faceCam, ease: ease.inOut },                                 // arrive on Arjuna as the question ends
    { t: IRIS.end, cam: { cx: ARJUNA_EYE[0], cy: ARJUNA_EYE[1], z: 5.2 }, ease: (x) => softLinear(x, 0.25) }, // short, gentle push
  ];
  const camB = camAt(keys, t);
  const iris = progress(t, IRIS.start, IRIS.end);
  const eyeScr: P2 = [(ARJUNA_EYE[0] - camB.cx) * camB.z + W / 2, (ARJUNA_EYE[1] - camB.cy) * camB.z + H / 2];

  // ---------------- POV beats ----------------
  const blurAmt = 7 * ease.inOut(progress(t, wMujhe.start, wBas.end)) + 7 * ease.inOut(progress(t, wBas.end, wChidiya.start + 0.4));
  const envOpacity = 1 - 0.45 * ease.inOut(progress(t, wMujhe.start, wBas.start)) - 0.45 * ease.inOut(progress(t, wBas.start, wChidiya.start + 0.2));
  const wash = 0.78 * ease.inOut(progress(t, wBas.start, wChidiya.start + 0.25));
  const sat = 1 - 0.45 * ease.inOut(progress(t, wMujhe.start, wChidiya.start));
  const povR = lerp(440, 360, ease.inOut(progress(t, wBas.start, wBas.end + 0.2))) - 60 * ease.inOut(progress(t, wAankh.start, wAankh.start + 0.6));
  const rNow = lerp(11 * ARJ.s * 5.2, povR, ease.out(iris));
  const cNow: P2 = [lerp(eyeScr[0], POV_CENTER[0], ease.inOut(iris)), lerp(eyeScr[1], POV_CENTER[1], ease.inOut(iris))];
  // one steady zoom: whole tree → painted eye; the eye glides to the centre as the zoom grows
  const f = softLinear(progress(t, wMujhe.start - 0.2, wAankh.start + 0.55));
  const zIn = Math.exp(lerp(Math.log(Z_WHOLE), Math.log(Z_EYE), f));
  const e0: P2 = [(PV_EYE[0] - PV_WHOLE[0]) * Z_WHOLE, (PV_EYE[1] - PV_WHOLE[1]) * Z_WHOLE];
  const cIn: P2 = [PV_EYE[0] - (e0[0] * (1 - f)) / zIn, PV_EYE[1] - (e0[1] * (1 - f)) / zIn];
  const inner = `translate(${cNow[0]} ${cNow[1]}) scale(${zIn}) translate(${-cIn[0]} ${-cIn[1]})`;
  const eyeScreen: P2 = [(PV_EYE[0] - cIn[0]) * zIn + cNow[0], (PV_EYE[1] - cIn[1]) * zIn + cNow[1]];
  const eyeR = EYE_R_UNIT * zIn;
  const ringDraw = ease.out(progress(t, wAankh.start - 0.1, wAankh.start + 0.45));
  const lock = progress(t, wAankh.start + 0.45, wAankh.start + 1.25);
  const breathe = lock > 0 ? 1 + 0.015 * Math.sin((t - wAankh.start) * 2.2) : 1;
  const glint = clamp(spring(t - (wAankh.start + 0.5), MATERIAL.glow)) * 0.9;
  const halo = ease.inOut(progress(t, wBas.end, wChidiya.start + 0.3));
  const toEyeW = progress(t, wAankh.start - 0.05, wAankh.start + 0.85);

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <rect width={W} height={H} fill="#2A1B12" />
      {iris < 1 && (
        <World cam={camB} foreground={<Watchers />}>
          <g transform={svgM(FRONT_TREE.m)}><Tree reach={330} bird={bird} /></g>
          <g transform={svgM(place(DRONA.x, DRONA.y, DRONA.s))}>
            <Drona view="threeQuarter" pose="beard" stroke={(t - 108.3) * 0.42} lean={4 * puchha} headTilt={-2 + 6 * puchha} mouth={mouthOpen(t, [26])} blink={blink(t, 11)} />
          </g>
          <g transform={svgM(ARJ_M)}>
            <Prince look="arjuna" pose="aim" expr="focused" lean={ARJ.lean} tRot={ARJ.tRot} draw={1} breath={0.5} />
          </g>
        </World>
      )}
      {iris > 0 && (
        <g>
          <rect width={W} height={H} fill="#2A1B12" opacity={ease.inOut(clamp(iris * 1.6))} />
          <POVWindow r={rNow} cx={cNow[0]} cy={cNow[1]} open={ease.inOut(clamp(iris * 2.2))} id="arj">
            <g opacity={ease.inOut(clamp((iris - 0.1) / 0.6))}>
              <defs>
                <filter id="pov-env" x="-20%" y="-20%" width="140%" height="140%">
                  <feColorMatrix type="saturate" values={sat.toFixed(3)} />
                  <feGaussianBlur stdDeviation={blurAmt.toFixed(2)} />
                </filter>
                <radialGradient id="bird-halo">
                  <stop offset="0.3" stopColor="#FFF6DA" stopOpacity={0.9} />
                  <stop offset="1" stopColor="#FFF6DA" stopOpacity={0} />
                </radialGradient>
              </defs>
              <g filter={blurAmt > 0.05 || sat < 0.99 ? "url(#pov-env)" : undefined} opacity={envOpacity}>
                <g transform={inner}>
                  <g transform="translate(0 -60)"><Sky /></g>
                  <g transform={`translate(0 ${-HORIZON + 1180})`}>
                    <Hills />
                    <rect x={-2000} y={HORIZON + 30} width={5080} height={2000} fill="#D9A066" />
                  </g>
                  <g transform={svgM(PV_TREE_M)}><Tree reach={PV_REACH} /></g>
                </g>
              </g>
              <rect width={W} height={H} fill="#F7EEDC" opacity={wash} />
              <g transform={inner}>
                <circle cx={PV_BIRD_BODY[0]} cy={PV_BIRD_BODY[1]} r={150} fill="url(#bird-halo)" opacity={halo} />
                <g transform={svgM(PV_TREE_M)}>
                  <g transform={`translate(${PV_REACH - 52} ${-352 - BIRD_BASE * TREE.birdScale}) scale(${TREE.birdScale})`}>
                    <WoodenBird glint={glint} />
                  </g>
                </g>
              </g>
              {ringDraw > 0 && (
                <g transform={`translate(${eyeScreen[0]} ${eyeScreen[1]}) scale(${breathe}) translate(${-eyeScreen[0]} ${-eyeScreen[1]})`}>
                  <FocusRing cx={eyeScreen[0]} cy={eyeScreen[1]} r={Math.max(eyeR * 1.45, eyeR + 26)} drawn={ringDraw} lock={lock} width={lerp(6, 12, toEyeW)} />
                </g>
              )}
            </g>
          </POVWindow>
        </g>
      )}
      <Grain />
    </svg>
  );
};

export const LAYOUT = { ARJ, DRONA, ARJUNA_EYE, FRONT_EYE: FRONT_TREE.eye, PV_EYE, Z_WHOLE, Z_EYE };
