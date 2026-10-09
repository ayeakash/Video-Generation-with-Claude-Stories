// C2 "reverse" backdrop: looking SOUTH from the field back toward the ashram (used only for shots with no archery:
// arrivals, the line-up, reactions). Huts, tulsi platform, a well, a mango tree, clay pots and a low mud wall.
import React from "react";
import { INK, P } from "../characters/parts";
import { HORIZON, Hut } from "./Gurukul";

const Tulsi: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <P d="M-60,0 L-50,-90 L50,-90 L60,0Z" fill="#E7B98A" />
    <P d="M-66,-90 L66,-90 L60,-108 L-60,-108Z" fill="#D9A066" />
    <path d="M-30,-40 h60" stroke="#C8283A" strokeWidth={6} />
    {[[-18, -150, 26], [16, -160, 28], [0, -190, 26], [-30, -128, 18], [30, -132, 18]].map(([cx, cy, r], i) => (
      <circle key={i} cx={cx} cy={cy} r={r} fill={i % 2 ? "#4E9A5E" : "#2F6B45"} stroke={INK} strokeWidth={3.5} />
    ))}
  </g>
);

const Well: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <P d="M-70,0 L-70,-70 Q0,-90 70,-70 L70,0 Q0,16 -70,0Z" fill="#B9A089" />
    <path d="M-70,-36 Q0,-52 70,-36" stroke="#8C7660" strokeWidth={4} fill="none" />
    <P d="M-60,-70 L-60,-170 L-48,-170 L-48,-70Z M48,-70 L48,-170 L60,-170 L60,-70Z" fill="#8A5530" />
    <P d="M-70,-176 L70,-176 L70,-164 L-70,-164Z" fill="#8A5530" />
    <path d="M0,-164 L0,-110" stroke="#E9DDBF" strokeWidth={4} />
    <P d="M-14,-112 L14,-112 L10,-88 L-10,-88Z" fill="#B87333" sw={3} />
  </g>
);

const Mango: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <P d="M-30,0 Q-22,-160 -18,-300 L18,-300 Q22,-160 30,0Z" fill="#7A4E2C" />
    {[[-120, -340, 110, "#2F6B45"], [110, -350, 120, "#2F6B45"], [0, -430, 140, "#3F8550"], [-70, -500, 100, "#4E9A5E"], [80, -510, 100, "#4E9A5E"]].map(([cx, cy, r, c], i) => (
      <circle key={i} cx={cx as number} cy={cy as number} r={r as number} fill={c as string} stroke={INK} strokeWidth={4} />
    ))}
    {[[-60, -330], [50, -360], [10, -300], [-110, -380]].map(([cx, cy], i) => <ellipse key={i} cx={cx} cy={cy} rx={11} ry={15} fill="#E8B23A" stroke={INK} strokeWidth={3} />)}
  </g>
);

const Pots: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[[-40, 0, 1], [10, 0, 1.2], [56, 0, 0.9]].map(([px, py, k], i) => (
      <g key={i} transform={`translate(${px} ${py}) scale(${k})`}>
        <P d="M-22,0 Q-34,-30 -16,-50 L-12,-62 L12,-62 L16,-50 Q34,-30 22,0Z" fill="#B85C38" sw={3} />
        <path d="M-20,-36 h40" stroke="#E8B23A" strokeWidth={3} />
      </g>
    ))}
  </g>
);

/** The ashram sits on a gentle rise behind the waiting princes, so it stays visible above their heads. */
export const ASHRAM_RISE = 190;
export const AshramBackdrop: React.FC = () => (
  <g transform={`translate(0 ${-ASHRAM_RISE})`}>
    <path d={`M-600,${HORIZON + 10} Q540,${HORIZON - 30} 1700,${HORIZON + 10} L1700,${HORIZON + ASHRAM_RISE + 60} L-600,${HORIZON + ASHRAM_RISE + 60}Z`} fill="#D3A06C" />
    <P d={`M-600,${HORIZON - 20} L1700,${HORIZON - 20} L1700,${HORIZON + 30} L-600,${HORIZON + 30}Z`} fill="#C98E5C" sw={3} />
    <path d={`M-600,${HORIZON - 4} L1700,${HORIZON - 4}`} stroke="#B57A48" strokeWidth={3} />
    <Mango x={880} y={HORIZON + 10} s={0.7} />
    <Hut x={170} y={HORIZON + 4} s={0.9} />
    <Hut x={420} y={HORIZON + 14} s={0.72} />
    <Hut x={1010} y={HORIZON + 8} s={0.8} />
    <Tulsi x={640} y={HORIZON + 40} s={0.6} />
    <Well x={60} y={HORIZON + 90} s={0.55} />
    <Pots x={760} y={HORIZON + 70} s={0.7} />
  </g>
);
