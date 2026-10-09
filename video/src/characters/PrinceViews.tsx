// 3/4, side and back bodies for the prince rig (front lives in Prince.tsx). 3/4 and side face screen-right;
// mirror the placement to face left. Same LOOKS, same proportions, so every view reads as the same character.
import React from "react";
import { GOLD, INK, Limb, P, Head, Expr, View } from "./parts";
import { LOOKS, LookName } from "./Prince";

const CX = 200;
const clampN = (v: number) => Math.min(1, Math.max(0, v));
const rot = ([x, y]: [number, number], deg: number): [number, number] => {
  const a = (deg * Math.PI) / 180;
  return [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
};
const add = (a: [number, number], b: [number, number]): [number, number] => [a[0] + b[0], a[1] + b[1]];

export type ViewBodyProps = {
  look: LookName; view: Exclude<View, "front">; expr?: Expr; blink?: number; mouth?: number; angry?: number;
  walk?: number;        // walk-cycle phase (cycles); 0 = standing
  namaste?: number;     // 0..1 hands come together at the chest
  sway?: number; gid?: string; headTilt?: number;
  carryBow?: boolean;   // side view: bow carried upright in the near hand (continuity when walking with it)
  stride?: number;      // side view: 1 = walk, ~2 = run (bigger swing, knee kick, arm pump, more bounce)
  bodyLean?: number;    // degrees about the feet (+ = lean into the facing direction; − = skid back)
};

/** Leg from hip, swinging `deg` (positive = forward/right). */
const leg = (hip: [number, number], deg: number, skin: string, w: number, near: boolean, bend = 0) => {
  const knee = add(hip, rot([0, 62], -deg));
  const foot = add(knee, rot([0, 60], -(deg * 0.6 - bend))); // bend > 0 folds the shin back (running kick)
  return (
    <g opacity={near ? 1 : 0.92}>
      <Limb pts={[hip, knee, foot]} color={skin} w={w} />
      <ellipse cx={foot[0] + 14} cy={foot[1] + 10} rx={27} ry={10} fill={skin} stroke={INK} strokeWidth={4} />
      <path d={`M${foot[0] - 12},${foot[1] - 12} l22,0`} stroke={GOLD} strokeWidth={5} strokeLinecap="round" />
    </g>
  );
};

/** Arm from shoulder; swing in degrees (positive = forward/right); `namaste` folds it to the chest. */
const arm = (sh: [number, number], deg: number, skin: string, w: number, hand: number, chest: [number, number], namaste: number, pump = 0) => {
  const hangE = add(sh, rot([0, 80], -deg)), hangH = add(hangE, rot([2, 76], -(deg * 1.3 + pump))); // pump > 0 bends the forearm forward (running)
  const nE: [number, number] = [sh[0] + 6, sh[1] + 74], nH = chest;
  const E: [number, number] = [hangE[0] + (nE[0] - hangE[0]) * namaste, hangE[1] + (nE[1] - hangE[1]) * namaste];
  const Hh: [number, number] = [hangH[0] + (nH[0] - hangH[0]) * namaste, hangH[1] + (nH[1] - hangH[1]) * namaste];
  return (
    <g>
      <Limb pts={[sh, E, Hh]} color={skin} w={w} />
      <path d={`M${sh[0] + (E[0] - sh[0]) * 0.45 - 12},${sh[1] + (E[1] - sh[1]) * 0.45} l24,2`} stroke={GOLD} strokeWidth={7} strokeLinecap="round" />
      <circle cx={Hh[0]} cy={Hh[1]} r={hand} fill={skin} stroke={INK} strokeWidth={4} />
    </g>
  );
};

export const PrinceView: React.FC<ViewBodyProps> = ({ look, view, expr = "calm", blink = 0, mouth = 0, angry = 0, walk = 0, namaste = 0, sway = 0, gid = look, headTilt = 0, carryBow = false, stride = 1, bodyLean = 0 }) => {
  const L = LOOKS[look];
  const { bw, skin } = L;
  const w = L.arm, hand = 17 + (w - 28) * 0.4, legW = 30 + (bw - 1) * 20;
  const swing = walk ? Math.sin(walk * Math.PI * 2) : 0;
  const run = clampN(stride - 1);
  const bob = walk ? Math.abs(Math.cos(walk * Math.PI * 2)) * (6 + 8 * run) : 0;
  const kickNear = 60 * run * Math.max(0, -swing), kickFar = 60 * run * Math.max(0, swing);
  const pump = 70 * run;
  const head = (
    <g transform={headTilt ? `rotate(${headTilt} ${CX} 262)` : undefined}>
      <Head skin={skin} crown={L.crown} expr={expr} style={L.style} mustache={L.mustache} angry={angry} blink={blink} mouth={mouth} gid={gid} sway={sway + swing * 4} view={view} />
    </g>
  );

  if (view === "side") {
    const d = 0.65 + 0.55 * bw; // body depth grows with build (Bhima is broad from every side)
    const back = CX - 32 * d, front = CX + 38 * d + (L.belly ? 16 * bw : 0);
    const tor = L.belly
      ? `M${back},294 Q${CX + 20},282 ${CX + 40 * d},300 Q${front + 30},380 ${front},446 L${back - 4},446 Q${back - 12},370 ${back},294Z`
      : `M${back},294 Q${CX + 20},282 ${front},300 Q${front + 10},370 ${front - 2},446 L${back - 4},446 Q${back - 12},370 ${back},294Z`;
    const chest: [number, number] = [front + 22, 338];
    return (
      <g transform={`rotate(${bodyLean} 200 726) translate(0 ${-bob})`}>
        {L.upper === "cape" && <P d={`M${back + 4},296 L${back + 26},296 L${back - 14 - 30 * run},650 Q${back - 54 - 40 * run},662 ${back - 70 - 50 * run},640Z`} fill="#5B2A6E" />}
        {arm([CX - 4, 308], -swing * 16 * stride, skin, w, hand, chest, namaste, pump)}
        {leg([CX - 6, 588], -swing * 20 * stride, skin, legW, false, kickFar)}
        {leg([CX + 6, 588], swing * 20 * stride, skin, legW, true, kickNear)}
        <P d={`M${back - 6},440 L${front + 2},440 L${front + 20},606 Q${CX + 34},616 ${CX + 12},600 L${CX - 4},600 Q${CX - 26},612 ${back - 16},602Z`} fill={L.dhoti} />
        <P d={`M${front - 10},446 L${front + 2},446 L${front + 20},600 L${front + 6},602Z`} fill={L.border} sw={3} />
        <rect x={CX - 12} y={255} width={30} height={40} fill={skin} stroke={INK} strokeWidth={4} />
        <P d={tor} fill={skin} />
        {L.upper === "shawl" ? (
          <P d={`M${back - 8},298 Q${CX},274 ${front + 8},300 L${front + 4},366 Q${CX},380 ${back - 10},362Z`} fill={L.sash} />
        ) : (
          <P d={`M${CX - 22},292 L${CX + 6},288 L${front + 2},428 L${front - 22},438Z`} fill={L.sash} />
        )}
        <path d={`M${CX + 2},294 Q${CX + 26},318 ${front},302`} fill="none" stroke={GOLD} strokeWidth={6} strokeLinecap="round" />
        <rect x={back - 8} y={430} width={front - back + 16} height={20} rx={8} fill={GOLD} stroke={INK} strokeWidth={4} />
        {L.upper === "cape" && <circle cx={CX - 2} cy={302} r={18} fill={GOLD} stroke={INK} strokeWidth={4} />}
        {head}
        {carryBow && (() => {
          const hx = CX + 8 + swing * 16 * 1.3, hy = 468;
          return (
            <g>
              <path d={`M${hx + 4},${hy - 150} L${hx + 4},${hy + 150}`} stroke="#5A4632" strokeWidth={3} />
              <path d={`M${hx + 4},${hy - 150} Q${hx + 74},${hy} ${hx + 4},${hy + 150}`} fill="none" stroke={INK} strokeWidth={17} strokeLinecap="round" />
              <path d={`M${hx + 4},${hy - 150} Q${hx + 74},${hy} ${hx + 4},${hy + 150}`} fill="none" stroke="#A86B3C" strokeWidth={10} strokeLinecap="round" />
            </g>
          );
        })()}
        {arm([CX + 2, 312], swing * 16 * stride, skin, w, hand, chest, namaste, pump)}
        {namaste > 0.6 && <P d={`M${chest[0] - 10},${chest[1] + 18} Q${chest[0] - 6},${chest[1] - 22} ${chest[0] + 8},${chest[1] - 40} Q${chest[0] + 18},${chest[1] - 14} ${chest[0] + 12},${chest[1] + 18}Z`} fill={skin} />}
      </g>
    );
  }

  if (view === "threeQuarter") {
    // facing screen-right: the NEAR side (shoulder, arm, leg) is screen-left and in front; the far side narrows.
    const sw = 66 * bw, ww = (L.belly ? 62 : 50) * bw, hw = 70 * bw;
    const Lx = CX - sw * 0.98, Rx = CX + sw * 0.7, c = CX + 14;
    const wl = CX - ww * 0.95, wr = CX + ww * 0.75;
    const tor = L.belly
      ? `M${Lx},298 Q${Lx - 6},380 ${wl - 4},444 L${wr + 10},444 Q${Rx + 22},380 ${Rx},298 Q${c},280 ${Lx},298Z`
      : `M${Lx},298 Q${Lx + 2},380 ${wl},444 L${wr},444 Q${Rx - 2},380 ${Rx},298 Q${c},282 ${Lx},298Z`;
    const chest: [number, number] = [c + 6, 344];
    return (
      <g transform={`translate(0 ${-bob})`}>
        {L.upper === "cape" && <P d={`M${Lx - 6},296 L${Rx + 4},296 L${Rx + 24},650 Q${CX - 30},672 ${Lx - 58},646Z`} fill="#5B2A6E" />}
        {/* far arm (screen-right), tucked partly behind the torso */}
        {arm([Rx - 10, 312], swing * 10, skin, w * 0.92, hand * 0.92, [chest[0] + 10, chest[1]], namaste)}
        {leg([CX + 20 * bw, 590], swing * 12, skin, legW, false)}
        {leg([CX - 22 * bw, 590], -swing * 12, skin, legW, true)}
        <P d={`M${wl},440 L${wr},440 L${CX + hw * 0.78},610 Q${CX + 40},620 ${c + 6},598 L${c - 8},598 Q${CX - 30},616 ${CX - hw * 0.98},608Z`} fill={L.dhoti} />
        <P d={`M${c - 8},446 L${c + 8},446 L${c + 14},596 L${c - 14},596Z`} fill={L.border} sw={3} />
        <rect x={CX - 14} y={255} width={34} height={40} fill={skin} stroke={INK} strokeWidth={4} />
        <P d={tor} fill={skin} />
        {L.upper === "shawl" ? (
          <>
            <P d={`M${Lx - 8},300 Q${c},276 ${Rx + 6},300 L${Rx - 4},424 L${c + 26},424 Q${c + 18},344 ${c},334 Q${c - 22},344 ${c - 30},424 L${Lx + 4},424Z`} fill={L.sash} />
            <path d={`M${c - 30},424 Q${c - 22},344 ${c},334 Q${c + 18},344 ${c + 26},424`} fill="none" stroke={GOLD} strokeWidth={5} />
          </>
        ) : (
          <>
            <P d={`M${Lx + 6},300 L${Lx + 40},296 L${wr + 2},420 L${wr - 24},438Z`} fill={L.sash} />
            <path d={`M${Lx + 22},300 L${wr - 10},430`} stroke={GOLD} strokeWidth={4} opacity={0.9} />
          </>
        )}
        <path d={`M${c - 32},292 Q${c - 2},328 ${c + 26},292`} fill="none" stroke={GOLD} strokeWidth={7} strokeLinecap="round" />
        <circle cx={c - 2} cy={316} r={7} fill="#C8283A" stroke={INK} strokeWidth={2.5} />
        <rect x={wl - 4} y={430} width={wr - wl + 8} height={20} rx={8} fill={GOLD} stroke={INK} strokeWidth={4} />
        {L.upper === "cape" && <circle cx={Lx + 6} cy={302} r={18} fill={GOLD} stroke={INK} strokeWidth={4} />}
        {head}
        {/* near arm (screen-left), in front */}
        {arm([Lx + 8, 310], -swing * 10, skin, w, hand, [chest[0] - 12, chest[1]], namaste)}
        {namaste > 0.6 && <P d={`M${chest[0] - 18},${chest[1] + 22} Q${chest[0] - 20},${chest[1] - 18} ${chest[0] - 2},${chest[1] - 40} Q${chest[0] + 16},${chest[1] - 18} ${chest[0] + 12},${chest[1] + 22}Z`} fill={skin} />}
      </g>
    );
  }

  // ---- back ----
  const sw = 66 * bw, ww = (L.belly ? 62 : 50) * bw, hw = 70 * bw;
  const lx = CX - sw - 4, rx = CX + sw + 4;
  const tor = L.belly
    ? `M${CX - sw},298 Q${CX - sw - 8},380 ${CX - ww - 4},444 L${CX + ww + 4},444 Q${CX + sw + 8},380 ${CX + sw},298 Q${CX},280 ${CX - sw},298Z`
    : `M${CX - sw},298 Q${CX - sw + 2},380 ${CX - ww},444 L${CX + ww},444 Q${CX + sw - 2},380 ${CX + sw},298 Q${CX},282 ${CX - sw},298Z`;
  return (
    <g>
      {[-1, 1].map((s) => (
        <g key={s}>
          <Limb pts={[[CX + s * 24 * bw, 590], [CX + s * 26 * bw, 712]]} color={skin} w={legW} />
          <ellipse cx={CX + s * 30 * bw} cy={720} rx={22} ry={11} fill={skin} stroke={INK} strokeWidth={4} />
        </g>
      ))}
      <P d={`M${CX - ww},440 L${CX + ww},440 L${CX + hw},610 Q${CX + 30},620 ${CX + 6},598 L${CX - 6},598 Q${CX - 30},620 ${CX - hw},610Z`} fill={L.dhoti} />
      <P d={`M${CX - 7},446 L${CX + 7},446 L${CX + 4},560 L${CX - 4},560Z`} fill={L.border} sw={3} />
      <rect x={CX - 17} y={255} width={34} height={40} fill={skin} stroke={INK} strokeWidth={4} />
      <P d={tor} fill={skin} />
      <path d={`M${CX},304 Q${CX + 3},370 ${CX},428`} stroke={INK} strokeWidth={3} fill="none" opacity={0.35} />
      {L.upper === "shawl" ? (
        <P d={`M${CX - sw - 8},300 Q${CX},280 ${CX + sw + 8},300 L${CX + sw - 4},426 Q${CX},442 ${CX - sw + 4},426Z`} fill={L.sash} />
      ) : (
        <P d={`M${CX + sw - 6},300 L${CX + sw - 40},296 L${CX - ww - 2},420 L${CX - ww + 26},438Z`} fill={L.sash} />
      )}
      <path d={`M${CX - 16},289 Q${CX},297 ${CX + 16},289`} fill="none" stroke={GOLD} strokeWidth={6} strokeLinecap="round" />
      <rect x={CX - ww - 4} y={430} width={2 * ww + 8} height={20} rx={8} fill={GOLD} stroke={INK} strokeWidth={4} />
      <Limb pts={[[lx + 8, 310], [lx - 6, 390], [lx - 2, 465]]} color={skin} w={w} />
      <circle cx={lx - 2} cy={472} r={hand} fill={skin} stroke={INK} strokeWidth={4} />
      <Limb pts={[[rx - 8, 310], [rx + 6, 390], [rx + 2, 465]]} color={skin} w={w} />
      <circle cx={rx + 2} cy={472} r={hand} fill={skin} stroke={INK} strokeWidth={4} />
      {L.upper === "cape" && (
        <g>
          <P d={`M${CX - sw - 10},294 L${CX + sw + 10},294 L${CX + sw + 46},652 Q${CX},674 ${CX - sw - 46},652Z`} fill="#5B2A6E" />
          <path d={`M${CX - sw - 40},642 Q${CX},662 ${CX + sw + 40},642`} fill="none" stroke={GOLD} strokeWidth={6} />
          {[-1, 1].map((s) => <circle key={s} cx={CX + s * (sw - 4)} cy={300} r={18} fill={GOLD} stroke={INK} strokeWidth={4} />)}
        </g>
      )}
      {head}
    </g>
  );
};
