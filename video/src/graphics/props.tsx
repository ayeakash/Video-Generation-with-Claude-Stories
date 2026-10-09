// Story props: wooden bird (the target), tree with a level perch, focus ring. Original SVG, series style.
import React from "react";
import { INK, P } from "../characters/parts";

/** Painted eye centre in bird-local coordinates (the target). */
export const BIRD_EYE: [number, number] = [80, -56];
/** Bird local origin sits this far above the bottom of its wooden base. */
export const BIRD_BASE = 128;

/** Painted wooden parrot on a peg + base. Grain and paint chips say "toy". `rock` = degrees about the base. */
export const WoodenBird: React.FC<{ rock?: number; glint?: number; arrowIn?: boolean }> = ({ rock = 0, glint = 0, arrowIn = false }) => (
  <g transform={`rotate(${rock} 0 ${BIRD_BASE})`}>
    <P d="M-8,58 L8,58 L10,112 L-10,112Z" fill="#C68B52" sw={3} />
    <P d="M-46,108 L46,108 L40,128 L-40,128Z" fill="#A86B3C" />
    <path d="M-36,116 Q0,112 36,118" stroke="#7A4A26" strokeWidth={2} fill="none" opacity={0.7} />
    <P d="M-62,8 Q-118,30 -150,62 Q-110,58 -70,34Z" fill="#2F7E3E" />
    <path d="M-140,58 Q-128,52 -118,54" stroke="#C68B52" strokeWidth={7} strokeLinecap="round" />
    <P d="M-76,6 Q-70,-52 0,-50 Q58,-48 64,6 Q60,62 -6,64 Q-64,62 -76,6Z" fill="#4FA357" />
    {[0, 1, 2, 3].map((k) => (
      <path key={k} d={`M-60,${-18 + k * 18} Q0,${-30 + k * 18} 54,${-14 + k * 18}`} stroke="#2F6B3A" strokeWidth={2} fill="none" opacity={0.35} />
    ))}
    <P d="M-50,-4 Q-14,-26 26,2 Q-6,40 -54,24Z" fill="#2F7E3E" />
    <P d="M-34,10 Q-24,4 -16,12 Q-24,20 -34,10Z" fill="#C68B52" sw={2} />
    <P d="M30,-40 Q38,-96 80,-92 Q118,-86 112,-46 Q104,-14 64,-10 Q34,-12 30,-40Z" fill="#4FA357" />
    <path d="M44,-80 Q70,-90 96,-84" stroke="#2F6B3A" strokeWidth={2} fill="none" opacity={0.35} />
    <P d="M108,-66 Q140,-60 134,-30 Q126,-42 108,-40Z" fill="#E0452E" />
    <circle cx={80} cy={-56} r={15} fill="#fff" stroke="#FFC400" strokeWidth={5} />
    <circle cx={82} cy={-56} r={7} fill="#1A1A1A" />
    <circle cx={79} cy={-59} r={2.4} fill="#fff" />
    {glint > 0 && <circle cx={76} cy={-61} r={3.5} fill="#fff" opacity={glint} />}
    {/* after the hit: the arrow rests in the painted eye of the wooden toy (comes from the archer's side, +x) */}
    {arrowIn && (
      <g transform="translate(84 -56) rotate(14)">
        <path d="M0,0 L170,0" stroke={INK} strokeWidth={10} strokeLinecap="round" />
        <path d="M0,0 L170,0" stroke="#C89A5E" strokeWidth={5} strokeLinecap="round" />
        <P d="M146,-3 L188,-3 L202,-18 L162,-18Z" fill="#F08A3C" sw={3} />
        <P d="M146,3 L188,3 L202,18 L162,18Z" fill="#E06A2C" sw={3} />
      </g>
    )}
  </g>
);

export const TREE = { perchY: -352, birdScale: 0.68 };

/** Tall tree. The long branch (डाल) levels out into a flat perch (top edge y=-352) ending at x=reach.
 *  The bird's base sits squarely on it at x=reach-52, tied with two cord wraps. */
export const Tree: React.FC<{ reach?: number; bird?: React.ReactNode; canopyOpacity?: number; branchOpacity?: number; wiggle?: number; birdPulse?: number; glowBranch?: number }> = ({
  reach = 452, bird, canopyOpacity = 1, branchOpacity = 1, wiggle = 0, birdPulse = 0, glowBranch = 0,
}) => {
  const bx = reach - 52, bs = TREE.birdScale;
  return (
    <g>
      <g opacity={canopyOpacity}>
        <P d="M-40,0 Q-30,-200 -26,-420 L26,-420 Q30,-200 40,0Z" fill="#8A5530" />
        <g transform={`rotate(${-wiggle} -12 -230)`}><P d="M-12,-240 Q-110,-280 -190,-300 L-192,-284 Q-110,-258 -14,-214Z" fill="#8A5530" /></g>
        {([
          [-150, -440, 110, "#2F6B45"], [150, -450, 120, "#2F6B45"], [0, -520, 150, "#4E9A5E"],
          [-90, -600, 110, "#4E9A5E"], [100, -610, 110, "#4E9A5E"], [10, -680, 100, "#8CC27A"], [-210, -310, 60, "#4E9A5E"],
        ] as const).map(([x, y, r, c], i) => <circle key={i} cx={x} cy={y} r={r} fill={c} stroke={INK} strokeWidth={4} />)}
      </g>
      <g opacity={branchOpacity} transform={`rotate(${wiggle * 0.5} 20 -290)`}>
        {glowBranch > 0 && <path d={`M24,-300 Q120,-340 230,-344 L${reach},-344`} stroke="#FFD34D" strokeWidth={26} fill="none" strokeLinecap="round" opacity={0.6 * glowBranch} />}
        <P d={`M14,-300 Q110,-344 230,-352 L${reach},-352 Q${reach + 10},-344 ${reach},-336 L230,-336 Q120,-324 24,-268Z`} fill="#8A5530" />
        <P d="M262,-338 Q282,-316 306,-312 Q290,-330 274,-340Z" fill="#4E9A5E" sw={3} />
      </g>
      {bird && <g transform={`rotate(${wiggle * 0.5} 20 -290) translate(${bx} ${-352 - BIRD_BASE * bs}) scale(${bs}) translate(0 ${BIRD_BASE}) scale(${1 + 0.18 * birdPulse}) translate(0 ${-BIRD_BASE})`}>{bird}</g>}
      <g opacity={branchOpacity}>
        {[-18, 18].map((dx) => (
          <path key={dx} d={`M${bx + dx},${-352 - 18 * bs} L${bx + dx},-334`} stroke="#E9DDBF" strokeWidth={5} strokeLinecap="round" />
        ))}
      </g>
    </g>
  );
};

/** Bird-eye position in tree-local coordinates. */
export const treeEyeLocal = (reach = 452): [number, number] => {
  const bs = TREE.birdScale;
  return [reach - 52 + BIRD_EYE[0] * bs, -352 - BIRD_BASE * bs + BIRD_EYE[1] * bs];
};

/** The series' signature Focus Ring (लक्ष्य-वलय): draws itself on, then locks with a soft echo. */
export const FocusRing: React.FC<{ cx: number; cy: number; r: number; drawn: number; lock?: number; width?: number }> = ({
  cx, cy, r, drawn, lock = 0, width = 10,
}) => {
  const C = 2 * Math.PI * r;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#FFD34D" strokeWidth={width} strokeLinecap="round"
        strokeDasharray={`${C * drawn} ${C}`} transform={`rotate(-90 ${cx} ${cy})`} opacity={0.97} />
      {lock > 0 && (
        <>
          <circle cx={cx} cy={cy} r={r + 14 + 22 * lock} fill="none" stroke="#FFD34D" strokeWidth={3} opacity={0.55 * (1 - lock)} />
          <circle cx={cx} cy={cy} r={r + 14} fill="none" stroke="#FFD34D" strokeWidth={3} opacity={0.5 * Math.min(1, lock * 3)} />
        </>
      )}
    </g>
  );
};

/** Clay diya (lamp of learning). `lit` 0..1; flame flickers gently (< 2 Hz, never a flash). */
export const Diya: React.FC<{ lit: number; t: number }> = ({ lit, t }) => {
  const f = 1 + 0.05 * Math.sin(t * 2 * Math.PI * 1.6) + 0.03 * Math.sin(t * 2 * Math.PI * 0.7);
  return (
    <g>
      <defs>
        <radialGradient id="diya-glow">
          <stop offset="0" stopColor="#FFE29A" stopOpacity={0.85} />
          <stop offset="1" stopColor="#FFE29A" stopOpacity={0} />
        </radialGradient>
      </defs>
      {lit > 0 && <circle cx={0} cy={-46} r={120 * lit} fill="url(#diya-glow)" opacity={0.8 * lit} />}
      <P d="M-46,-10 Q-40,18 0,20 Q40,18 46,-10 Q0,4 -46,-10Z" fill="#B85C38" />
      <P d="M-46,-10 Q0,-22 46,-10 Q0,4 -46,-10Z" fill="#8A3F22" sw={3} />
      <P d="M40,-12 Q58,-20 62,-12 Q52,-4 40,-6Z" fill="#B85C38" sw={3} />
      {lit > 0 && (
        <g transform={`translate(56 -16) scale(${lit * f} ${lit * (2 - f)})`}>
          <P d="M0,0 Q-14,-20 0,-48 Q14,-20 0,0Z" fill="#FFB534" sw={3} />
          <path d="M0,-6 Q-6,-18 0,-32 Q6,-18 0,-6Z" fill="#FFF3B0" />
        </g>
      )}
    </g>
  );
};

/** Paper kite drifting outside the window (L37). */
export const Kite: React.FC = () => (
  <g>
    <P d="M0,-40 L30,0 L0,46 L-30,0Z" fill="#E0452E" />
    <path d="M0,-40 L0,46 M-30,0 L30,0" stroke="#7A2A1E" strokeWidth={3} />
    <path d="M0,46 Q-14,80 6,110 Q-10,140 4,170" stroke={INK} strokeWidth={3} fill="none" />
    {[86, 126].map((y) => <P key={y} d={`M-2,${y} l-12,-6 l2,12Z`} fill="#F2C230" sw={2} />)}
  </g>
);

/** Wicker basket (the child's target). */
export const Basket: React.FC = () => (
  <g>
    <P d="M-70,0 L70,0 L54,130 L-54,130Z" fill="#C9873F" />
    {[1, 2, 3, 4, 5].map((k) => <path key={k} d={`M${-70 + k * 3},${k * 22} L${70 - k * 3},${k * 22}`} stroke="#8A5523" strokeWidth={3} />)}
    {[-3, -2, -1, 0, 1, 2, 3].map((k) => <path key={k} d={`M${k * 20},0 L${k * 15},130`} stroke="#8A5523" strokeWidth={2.5} />)}
    <rect x={-76} y={-10} width={152} height={18} rx={9} fill="#B07330" stroke={INK} strokeWidth={4} />
  </g>
);
