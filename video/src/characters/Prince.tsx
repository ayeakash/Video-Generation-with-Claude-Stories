// Prince rig: Arjuna, Yudhishthira, Duryodhana, Bhima share one skeleton; LOOKS make them distinct (series bible §4).
import React from "react";
import { GOLD, INK, Limb, P, Head, Expr, CrownKind, HairStyle, View } from "./parts";
import { PrinceView } from "./PrinceViews";
import { M, R, apply, mul, svgM } from "../utils/motion";

export type LookName = "arjuna" | "yudhishthira" | "duryodhana" | "bhima";
type Look = { skin: string; dhoti: string; border: string; sash: string; crown: CrownKind; style: HairStyle; upper: "sash" | "shawl" | "cape"; bw: number; arm: number; mustache?: boolean; belly?: boolean; height: number };

export const LOOKS: Record<LookName, Look> = {
  arjuna: { skin: "#6E4129", dhoti: "#F2E6C9", border: "#1F8A8A", sash: "#1F8A8A", crown: "small", style: "ponytail", upper: "sash", bw: 0.92, arm: 26, height: 1.03 },
  yudhishthira: { skin: "#A86E47", dhoti: "#FAF5EA", border: "#E9A23B", sash: "#E9A23B", crown: "modest", style: "curly", upper: "shawl", bw: 1.0, arm: 28, mustache: true, height: 1.08 },
  duryodhana: { skin: "#C98B5D", dhoti: "#8E2B3A", border: "#E8B23A", sash: "#5B2A6E", crown: "big", style: "wavy", upper: "cape", bw: 1.22, arm: 32, belly: true, height: 1.0 },
  bhima: { skin: "#94603D", dhoti: "#3E7D4F", border: "#E8B23A", sash: "#C8642B", crown: "headband", style: "crop", upper: "sash", bw: 1.55, arm: 40, belly: true, height: 0.97 },
};

const CX = 200;
const WAIST: [number, number] = [200, 440];
const NECK: [number, number] = [200, 262];
// Aim pose, T-frame (head + arms + bow move together so the string stays in front of the face, under the chin).
export const AIM = {
  hand: [-14, 296] as [number, number],
  anchor: [214, 304] as [number, number],
  elbowBow: [70, 302] as [number, number],
  elbowDraw: [350, 312] as [number, number],
  tipTop: [10, 168] as [number, number],
  tipBot: [-38, 424] as [number, number],
  belly: [-94, 286] as [number, number],
  arrowTip: [-80, 290] as [number, number],
  eyeL: [172, 195] as [number, number],
  eyeR: [228, 195] as [number, number],
};
const STRING = "#5A4632";

/** Matrices of the aim pose: lean (torso about the waist) then T-rotation (head/arms/bow about the neck). */
export const aimFrames = (lean: number, tRot: number) => {
  const ML = R(lean, ...WAIST);
  const MT = R(tRot, ...NECK);
  return { ML, MT, toChar: (p: [number, number]) => apply(mul(ML, MT), p) };
};

export type PrinceProps = {
  look: LookName; expr?: Expr; pose?: "stand" | "aim";
  lean?: number; tRot?: number; draw?: number;   // aim: degrees, degrees, string draw 0..1
  blink?: number; mouth?: number; angry?: number; breath?: number; sway?: number; bowAtSide?: boolean; gid?: string;
  view?: View;          // front | threeQuarter | side | back (aim: front only on screen; see bible §5b)
  headTilt?: number;    // degrees about the neck (positive = forward when facing right)
  nod?: number;         // 0..1 front-view head bow (head dips, eyes close): acceptance / respect
  carryBow?: boolean;   // side view walking with the bow
  stride?: number;      // side view: 1 walk … 2 run
  bodyLean?: number;    // side view: degrees (+ forward, − skid back)
  armUp?: number;       // front: screen-right arm (his left hand) rises, palm up ("बाएँ हाथ का खेल")
  lift?: number;        // front: both arms overhead holding a log (Bhima, "ताकत")
  cheer?: number;       // front: both fists up
  puff?: number;        // front: chest swells (pride); crown grows with it
  crownDrop?: number;   // crown slips down over the eyes (comic)
  hideBow?: boolean;
  walk?: number;        // walk-cycle phase (3/4 and side)
  namaste?: number;     // 0..1
  shadow?: boolean;
};

/** Soft contact shadow under the feet (adds weight and depth). */
export const Shadow: React.FC<{ w: number }> = ({ w }) => <ellipse cx={200} cy={728} rx={86 * w} ry={15} fill="#6B4426" opacity={0.22} />;

export const Prince: React.FC<PrinceProps> = ({
  look, expr = "calm", pose = "stand", lean = 0, tRot = 0, draw = 1, blink = 0, mouth = 0, angry = 0, breath = 0, sway = 0, bowAtSide, gid = look,
  view = "front", walk = 0, namaste = 0, shadow = true, headTilt = 0, nod = 0, carryBow = false, stride = 1, bodyLean = 0,
  armUp = 0, lift = 0, cheer = 0, puff = 0, crownDrop = 0,
}) => {
  const L = LOOKS[look];
  const sh = shadow ? <Shadow w={LOOKS[look].bw} /> : null;
  if (pose === "stand" && view !== "front")
    return <g>{sh}<PrinceView look={look} view={view} expr={expr} blink={blink} mouth={mouth} angry={angry} walk={walk} namaste={namaste} sway={sway} gid={gid} headTilt={headTilt} carryBow={carryBow} stride={stride} bodyLean={bodyLean} /></g>;
  const isBack = pose === "aim" && view === "back";
  const { bw, skin, arm } = L;
  const sw = 66 * bw, ww = (L.belly ? 62 : 50) * bw, hw = 70 * bw;
  const legW = 30 + (bw - 1) * 20;
  const neckW = 17 + (bw - 1) * 14;
  const hand = 17 + (arm - 28) * 0.4;
  const tor = L.belly
    ? `M${CX - sw},298 Q${CX - sw - 8},380 ${CX - ww - 4},444 L${CX + ww + 4},444 Q${CX + sw + 8},380 ${CX + sw},298 Q${CX},280 ${CX - sw},298Z`
    : `M${CX - sw},298 Q${CX - sw + 2},380 ${CX - ww},444 L${CX + ww},444 Q${CX + sw - 2},380 ${CX + sw},298 Q${CX},282 ${CX - sw},298Z`;

  const head = (
    <g transform={`${headTilt ? `rotate(${headTilt} 200 262)` : ""} translate(0 ${12 * nod}) translate(200 262) scale(1 ${1 - 0.06 * nod}) translate(-200 -262)`}>
      <Head skin={skin} crown={L.crown} expr={expr} style={L.style} mustache={L.mustache} angry={angry} blink={Math.max(blink, nod > 0.5 ? 1 : 0)} mouth={mouth} gid={gid} sway={sway} view={isBack ? "back" : "front"} crownDrop={crownDrop} crownScale={1 + 0.35 * puff} />
    </g>
  );
  const torso = (
    <g transform={`translate(0 ${-breath * 4}) translate(200 380) scale(${1 + 0.1 * puff} ${1 + 0.04 * puff}) translate(-200 -380)`}>
      <rect x={CX - neckW} y={255} width={2 * neckW} height={40} fill={skin} stroke={INK} strokeWidth={4} />
      <P d={tor} fill={skin} />
      {L.upper === "shawl" ? (
        <>
          <P d={`M${CX - sw - 8},300 Q${CX},276 ${CX + sw + 8},300 L${CX + sw - 4},424 L${CX + 30},424 Q${CX + 22},344 ${CX},334 Q${CX - 22},344 ${CX - 30},424 L${CX - sw + 4},424Z`} fill={L.sash} />
          <path d={`M${CX - 30},424 Q${CX - 22},344 ${CX},334 Q${CX + 22},344 ${CX + 30},424`} fill="none" stroke={GOLD} strokeWidth={5} />
        </>
      ) : (
        <>
          <P d={`M${CX - sw + 6},300 L${CX - sw + 40},296 L${CX + ww + 2},420 L${CX + ww - 26},438Z`} fill={L.sash} />
          <path d={`M${CX - sw + 22},300 L${CX + ww - 12},430`} stroke={GOLD} strokeWidth={4} opacity={0.9} />
        </>
      )}
      {isBack ? (
        <path d={`M${CX - 16},289 Q${CX},297 ${CX + 16},289`} fill="none" stroke={GOLD} strokeWidth={6} strokeLinecap="round" />
      ) : (
        <>
          <path d={`M${CX - 34},292 Q${CX},330 ${CX + 34},292`} fill="none" stroke={GOLD} strokeWidth={7} strokeLinecap="round" />
          <circle cx={CX} cy={318} r={7} fill="#C8283A" stroke={INK} strokeWidth={2.5} />
        </>
      )}
      <rect x={CX - ww - 4} y={430} width={2 * ww + 8} height={20} rx={8} fill={GOLD} stroke={INK} strokeWidth={4} />
      {L.upper === "cape" &&
        [-1, 1].map((s) => (
          <g key={s}>
            <circle cx={CX + s * (sw - 4)} cy={302} r={18} fill={GOLD} stroke={INK} strokeWidth={4} />
            <circle cx={CX + s * (sw - 4)} cy={302} r={7} fill="#C8283A" />
          </g>
        ))}
    </g>
  );
  const lower = (
    <>
      {L.upper === "cape" && (
        <g>
          <P d={`M${CX - sw - 6},296 L${CX + sw + 6},296 L${CX + sw + 46},650 Q${CX},672 ${CX - sw - 46},650Z`} fill="#5B2A6E" />
          <path d={`M${CX - sw - 40},640 Q${CX},660 ${CX + sw + 40},640`} fill="none" stroke={GOLD} strokeWidth={6} />
        </g>
      )}
      <Limb pts={[[CX - 24 * bw, 590], [CX - 26 * bw, 712]]} color={skin} w={legW} />
      <Limb pts={[[CX + 24 * bw, 590], [CX + 26 * bw, 712]]} color={skin} w={legW} />
      {[-1, 1].map((s) => <ellipse key={s} cx={CX + s * 32 * bw} cy={722} rx={26} ry={11} fill={skin} stroke={INK} strokeWidth={4} />)}
      <path d={`M${CX - 42 * bw},700 l20,0 M${CX + 22 * bw},700 l20,0`} stroke={GOLD} strokeWidth={5} strokeLinecap="round" />
      <P d={`M${CX - ww},440 L${CX + ww},440 L${CX + hw},610 Q${CX + 30},620 ${CX + 6},598 L${CX - 6},598 Q${CX - 30},620 ${CX - hw},610Z`} fill={L.dhoti} />
      <P d={`M${CX - 8},446 L${CX + 8},446 L${CX + 14},596 L${CX - 14},596Z`} fill={L.border} sw={3} />
      <path d={`M${CX - hw + 4},600 Q${CX - 30},612 ${CX - 8},592 M${CX + hw - 4},600 Q${CX + 30},612 ${CX + 8},592`} fill="none" stroke={L.border} strokeWidth={8} strokeLinecap="round" />
    </>
  );

  if (pose === "stand") {
    const lx = CX - sw - 4, rx = CX + sw + 4;
    const n = namaste;
    const ph = Math.sin(walk * Math.PI * 2);
    const bobY = walk ? -Math.abs(ph) * 7 : 0;
    const liftL = walk ? 18 * Math.max(0, ph) : 0, liftR = walk ? 18 * Math.max(0, -ph) : 0;
    const mix = (a: [number, number], b: [number, number]): [number, number] => [a[0] + (b[0] - a[0]) * n, a[1] + (b[1] - a[1]) * n];
    const to = (a: [number, number], b: [number, number], k: number): [number, number] => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
    let eL = mix([lx - 6, 390], [lx + 4, 400]), hL = mix([lx - 2, 465], [CX - 10, 352]);
    let eR = mix([rx + 6, 390], [rx - 4, 400]), hR = mix([rx + 2, 465], [CX + 10, 352]);
    eR = to(eR, [rx + 40, 300], armUp); hR = to(hR, [rx + 30, 214], armUp);
    eL = to(eL, [lx - 40, 210], lift); hL = to(hL, [CX - 70, 124], lift); eR = to(eR, [rx + 40, 210], lift); hR = to(hR, [CX + 70, 124], lift);
    eL = to(eL, [lx - 34, 250], cheer); hL = to(hL, [lx - 20, 168], cheer); eR = to(eR, [rx + 34, 250], cheer); hR = to(hR, [rx + 20, 168], cheer);
    const legsWalk = walk ? (
      <g>
        {L.upper === "cape" && <P d={`M${CX - sw - 6},296 L${CX + sw + 6},296 L${CX + sw + 46},650 Q${CX},672 ${CX - sw - 46},650Z`} fill="#5B2A6E" />}
        <Limb pts={[[CX - 24 * bw, 590], [CX - 26 * bw, 712 - liftL]]} color={skin} w={legW} />
        <Limb pts={[[CX + 24 * bw, 590], [CX + 26 * bw, 712 - liftR]]} color={skin} w={legW} />
        <ellipse cx={CX - 32 * bw} cy={722 - liftL} rx={26} ry={11} fill={skin} stroke={INK} strokeWidth={4} />
        <ellipse cx={CX + 32 * bw} cy={722 - liftR} rx={26} ry={11} fill={skin} stroke={INK} strokeWidth={4} />
        <P d={`M${CX - ww},440 L${CX + ww},440 L${CX + hw},610 Q${CX + 30},620 ${CX + 6},598 L${CX - 6},598 Q${CX - 30},620 ${CX - hw},610Z`} fill={L.dhoti} />
        <P d={`M${CX - 8},446 L${CX + 8},446 L${CX + 14},596 L${CX - 14},596Z`} fill={L.border} sw={3} />
      </g>
    ) : lower;
    const swingX = walk ? 8 * ph : 0;
    return (
      <g>
        {sh}
        <g transform={`translate(0 ${bobY})`}>
        {legsWalk}
        {torso}
        <Limb pts={[[lx + 8, 310], [eL[0] + swingX, eL[1]], [hL[0] + swingX * 1.5, hL[1]]]} color={skin} w={arm} />
        {n < 0.5 && <path d={`M${lx - 12},350 l26,4`} stroke={GOLD} strokeWidth={7} strokeLinecap="round" />}
        {bowAtSide && n === 0 && lift === 0 && cheer === 0 && <BowAtSide gx={lx - 4} gy={470} h={300} />}
        <Limb pts={[[rx - 8, 310], [eR[0] - swingX, eR[1]], [hR[0] - swingX * 1.5, hR[1]]]} color={skin} w={arm} />
        {n < 0.5 && <path d={`M${rx - 12},354 l26,-4`} stroke={GOLD} strokeWidth={7} strokeLinecap="round" />}
        {n > 0.6 ? (
          // palms pressed together, fingers up
          <P d={`M${CX - 16},372 Q${CX - 18},334 ${CX},314 Q${CX + 18},334 ${CX + 16},372Z`} fill={skin} />
        ) : (
          <>
            <circle cx={hL[0] + swingX * 1.5} cy={hL[1]} r={hand} fill={skin} stroke={INK} strokeWidth={4} />
            <circle cx={hR[0] - swingX * 1.5} cy={hR[1]} r={hand} fill={skin} stroke={INK} strokeWidth={4} />
          </>
        )}
        {lift > 0.05 && (
          <g transform={`translate(0 ${(1 - lift) * 300})`} opacity={Math.min(1, lift * 3)}>
            <P d={`M${CX - 190},100 L${CX + 190},96 L${CX + 194},140 L${CX - 186},146Z`} fill="#8A5530" />
            <ellipse cx={CX + 192} cy={118} rx={12} ry={22} fill="#C68B52" stroke={INK} strokeWidth={4} />
            <path d={`M${CX - 140},118 L${CX + 120},114`} stroke="#6E4224" strokeWidth={3} />
          </g>
        )}
        {armUp > 0.5 && <path d={`M${rx + 18},200 q12,-14 6,-24 M${rx + 30},198 q10,-16 4,-26 M${rx + 42},202 q8,-14 2,-22`} stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />}
        {head}
        </g>
      </g>
    );
  }

  // ---- aim pose ----
  const { ML, MT } = aimFrames(lean, tRot);
  const t = (p: [number, number]) => apply(MT, p); // T-frame → torso frame
  const SL: [number, number] = [CX - sw + 8, 310], SR: [number, number] = [CX + sw - 6, 310];
  const H = t(AIM.hand);
  // string rest position = the chord between the tips; full draw = the under-chin anchor
  const rest: [number, number] = [(AIM.tipTop[0] + AIM.tipBot[0]) / 2 + 6, (AIM.tipTop[1] + AIM.tipBot[1]) / 2];
  const A0: [number, number] = [rest[0] + (AIM.anchor[0] - rest[0]) * draw, rest[1] + (AIM.anchor[1] - rest[1]) * draw];
  const A = t(A0);
  const [tt, tb, bl] = [AIM.tipTop, AIM.tipBot, AIM.belly];
  const flex = 1 + 0.18 * draw; // limbs bend more as the string is drawn
  const belly: [number, number] = [AIM.hand[0] + (bl[0] - AIM.hand[0]) * flex, bl[1]];
  const backFlip = isBack ? `translate(${2 * CX} 0) scale(-1 1)` : undefined;
  return (
    <g>
      {sh}
      <g transform={backFlip}>
      {lower}
      <g transform={svgM(ML)}>
        {torso}
        <Limb pts={[SL, t(AIM.elbowBow), [H[0] + 8, H[1] + 2]]} color={skin} w={arm} />
        <circle cx={H[0]} cy={H[1]} r={18} fill={skin} stroke={INK} strokeWidth={4} />
        <g transform={svgM(MT)}>
          <path d={`M${tt[0]},${tt[1]} Q${belly[0]},${belly[1]} ${tb[0]},${tb[1]}`} fill="none" stroke={INK} strokeWidth={17} strokeLinecap="round" />
          <path d={`M${tt[0]},${tt[1]} Q${belly[0]},${belly[1]} ${tb[0]},${tb[1]}`} fill="none" stroke="#A86B3C" strokeWidth={10} strokeLinecap="round" />
          {[tt, tb].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={7} fill={GOLD} stroke={INK} strokeWidth={3} />)}
          {!isBack && head}
          <path d={`M${tt[0]},${tt[1]} L${A0[0]},${A0[1]} L${tb[0]},${tb[1]}`} fill="none" stroke={STRING} strokeWidth={3.5} strokeLinejoin="round" />
          <Arrow x0={A0[0] + 6} y0={A0[1]} x1={AIM.arrowTip[0]} y1={AIM.arrowTip[1]} />
        </g>
        <Limb pts={[SR, t(AIM.elbowDraw), [A[0] + 16, A[1] + 4]]} color={skin} w={arm} />
        <circle cx={A[0] + 8} cy={A[1] + 2} r={17} fill={skin} stroke={INK} strokeWidth={4} />
        {/* from behind, the face is on the far side: the head hides the anchor, string and draw hand (physically correct) */}
        {isBack && <g transform={svgM(MT)}><g transform={`translate(${2 * CX} 0) scale(-1 1)`}>{head}</g></g>}
      </g>
      </g>
    </g>
  );
};

/** Arrow from nock (x0,y0) to tip (x1,y1): wooden shaft, steel tip, saffron fletching. */
export const Arrow: React.FC<{ x0: number; y0: number; x1: number; y1: number }> = ({ x0, y0, x1, y1 }) => {
  const ang = (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI;
  const len = Math.hypot(x1 - x0, y1 - y0);
  return (
    <g transform={`translate(${x0} ${y0}) rotate(${ang})`}>
      <path d={`M0,0 L${len},0`} stroke={INK} strokeWidth={10} strokeLinecap="round" />
      <path d={`M0,0 L${len},0`} stroke="#C89A5E" strokeWidth={5} strokeLinecap="round" />
      <P d={`M${len - 4},-9 L${len + 22},0 L${len - 4},9 Q${len + 4},0 ${len - 4},-9Z`} fill="#8E9AA6" sw={3} />
      <P d="M2,-3 L44,-3 L30,-18 L-10,-18Z" fill="#F08A3C" sw={3} />
      <P d="M2,3 L44,3 L30,18 L-10,18Z" fill="#E06A2C" sw={3} />
    </g>
  );
};

const BowAtSide: React.FC<{ gx: number; gy: number; h: number }> = ({ gx, gy, h }) => {
  const t = gy - h / 2, b = gy + h / 2, bx = gx - h * 0.24;
  return (
    <g>
      <path d={`M${gx},${t} L${gx},${b}`} stroke={STRING} strokeWidth={3} />
      <path d={`M${gx},${t} Q${bx},${gy} ${gx},${b}`} fill="none" stroke={INK} strokeWidth={17} strokeLinecap="round" />
      <path d={`M${gx},${t} Q${bx},${gy} ${gx},${b}`} fill="none" stroke="#A86B3C" strokeWidth={10} strokeLinecap="round" />
      <circle cx={gx} cy={t} r={7} fill={GOLD} stroke={INK} strokeWidth={3} />
      <circle cx={gx} cy={b} r={7} fill={GOLD} stroke={INK} strokeWidth={3} />
    </g>
  );
};

/** Matrix that places a character: feet at (x, y), scale, optional mirror (faces the other way). */
export const place = (x: number, y: number, s: number, mirror = false): M => [mirror ? -s : s, 0, 0, s, x - (mirror ? -s : s) * 200, y - s * 730];
