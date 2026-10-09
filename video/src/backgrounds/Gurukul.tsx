// The gurukul world: warm morning sky, far hills, thatched huts, earth. Layers carry a parallax depth.
import React from "react";
import { INK, P } from "../characters/parts";

export const HORIZON = 1290;

export const Sky: React.FC<{ hush?: number; sunX?: number; sunY?: number; warm?: number }> = ({ hush = 0, sunX = 720, sunY = 520, warm = 0 }) => (
  <g>
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={warm ? "#EE9A52" : hush ? "#EBC690" : "#F2B872"} />
        <stop offset="0.65" stopColor={warm ? "#FAD9A6" : "#FBE9C6"} />
      </linearGradient>
      <radialGradient id="sunGlow">
        <stop offset="0.55" stopColor="#FCD98A" stopOpacity={0.9} />
        <stop offset="1" stopColor="#FCD98A" stopOpacity={0} />
      </radialGradient>
    </defs>
    <rect x={-2000} y={-2000} width={5080} height={2000 + HORIZON + 60} fill="url(#sky)" />
    <circle cx={sunX} cy={sunY} r={170} fill="url(#sunGlow)" />
    <circle cx={sunX} cy={sunY} r={84} fill={warm ? "#F4A84E" : "#F7C46A"} />
  </g>
);

/** Two rolling hill bands spanning the whole world width (no flat ends to reveal when the camera pans or zooms). */
const hillPath = (base: number, amp: number, period: number, phase: number) => {
  let d = `M-2400,${base}`;
  for (let x = -2400; x < 3600; x += period) {
    const k = Math.sin((x + phase) * 0.0013) * 0.5 + 0.5;
    d += ` Q${x + period / 2},${base - amp * (0.6 + 0.8 * k)} ${x + period},${base}`;
  }
  return d + ` L3600,${base + 3200} L-2400,${base + 3200}Z`;
};
export const Hills: React.FC = () => (
  <g>
    <path d={hillPath(HORIZON - 50, 110, 520, 0)} fill="#E7C08A" />
    <path d={hillPath(HORIZON - 14, 60, 640, 900)} fill="#DDB27A" />
  </g>
);

export const Hut: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <P d="M-70,0 L-70,-80 L70,-80 L70,0Z" fill="#C98E5C" />
    <P d="M-18,0 L-18,-50 Q0,-62 18,-50 L18,0Z" fill="#6E3F22" />
    <P d="M-96,-72 Q0,-170 96,-72 Q0,-96 -96,-72Z" fill="#B5893F" />
    <path d="M-60,-96 Q0,-140 60,-96" stroke="#8A6A2C" strokeWidth={3} fill="none" />
  </g>
);

export const Huts: React.FC = () => (
  <g>
    <Hut x={560} y={HORIZON + 6} s={0.55} />
    <Hut x={660} y={HORIZON + 16} s={0.68} />
  </g>
);

export const Ground: React.FC = () => (
  <g>
    <rect x={-2000} y={HORIZON} width={5080} height={2400} fill="#D9A066" />
    <ellipse cx={540} cy={HORIZON + 330} rx={760} ry={150} fill="#E2B07A" />
    <ellipse cx={300} cy={HORIZON + 560} rx={520} ry={90} fill="#CF9558" opacity={0.6} />
    {[[120, 1880], [930, 1860], [60, 1600], [1010, 1560]].map(([x, y], i) => (
      <path key={i} d={`M${x - 22},${y} Q${x - 14},${y - 40} ${x - 4},${y} Q${x + 4},${y - 52} ${x + 10},${y} Q${x + 20},${y - 36} ${x + 26},${y}`} fill="#7FA35A" stroke={INK} strokeWidth={3} />
    ))}
  </g>
);

/** Distant trees on the north horizon (target-field backdrop): small, soft, desaturated so the target tree leads. */
export const FarTrees: React.FC = () => (
  <g opacity={0.85}>
    {([[70, 0.5], [190, 0.38], [300, 0.46], [960, 0.34]] as const).map(([x, s], i) => (
      <g key={i} transform={`translate(${x} ${HORIZON - 30}) scale(${s})`}>
        <path d="M-10,60 L-8,-60 L8,-60 L10,60Z" fill="#8C6A48" stroke={INK} strokeWidth={4} opacity={0.8} />
        {[[-50, -90, 60], [40, -96, 64], [-4, -150, 70]].map(([cx, cy, r], k) => (
          <circle key={k} cx={cx} cy={cy} r={r} fill={k === 2 ? "#A9C48F" : "#93B27A"} stroke={INK} strokeWidth={4} opacity={0.9} />
        ))}
      </g>
    ))}
  </g>
);
