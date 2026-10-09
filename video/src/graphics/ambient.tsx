// Ambient life (bible §5c): drifting clouds, butterflies, falling leaves, the recurring squirrel, the dropped bow.
// Everything takes an `amount` (0..1) so the hush at "पूरा मैदान… एकदम शांत" can ramp it to zero. Deterministic.
import React from "react";
import { INK, P } from "../characters/parts";
import { rng } from "../utils/motion";

export const DriftClouds: React.FC<{ t: number; amount?: number; tint?: string; y0?: number }> = ({ t, amount = 1, tint = "#FFF6E6", y0 = 0 }) => (
  <g opacity={0.95}>
    {([[60, 260, 1.1, 9], [520, 150, 1.4, 6], [860, 380, 0.9, 11], [300, -260, 1.3, 7], [760, -620, 1.0, 8]] as const).map(([x, y, s, v], i) => {
      const dx = ((x + t * v * amount + 1400) % 1900) - 400;
      return (
        <g key={i} transform={`translate(${dx} ${y + y0}) scale(${s})`}>
          <P d="M-90,20 Q-100,-20 -60,-24 Q-50,-60 -10,-52 Q20,-80 56,-50 Q96,-56 96,-14 Q120,0 96,20Z" fill={tint} sw={3} />
        </g>
      );
    })}
  </g>
);

const Butterfly: React.FC<{ flap: number; c: string }> = ({ flap, c }) => {
  const k = 0.35 + 0.65 * Math.abs(Math.cos(flap));
  return (
    <g>
      <g transform={`scale(${k} 1)`}>
        <P d="M0,0 Q-30,-34 -40,-10 Q-36,8 0,0Z" fill={c} sw={2.5} />
        <P d="M0,0 Q30,-34 40,-10 Q36,8 0,0Z" fill={c} sw={2.5} />
        <P d="M0,0 Q-22,22 -26,8Z" fill={c} sw={2.5} />
        <P d="M0,0 Q22,22 26,8Z" fill={c} sw={2.5} />
      </g>
      <path d="M0,-10 L0,12" stroke={INK} strokeWidth={4} strokeLinecap="round" />
    </g>
  );
};

/** Two butterflies wandering over the field (never over the teaching object while it is named). */
export const Butterflies: React.FC<{ t: number; amount?: number; area?: [number, number, number, number] }> = ({ t, amount = 1, area = [80, 1300, 600, 300] }) => {
  if (amount <= 0.01) return null;
  return (
    <g opacity={amount}>
      {[0, 1].map((i) => {
        const tt = t * (0.35 + i * 0.1) + i * 7;
        const x = area[0] + area[2] * (0.5 + 0.5 * Math.sin(tt * 1.1 + i));
        const y = area[1] + area[3] * (0.5 + 0.5 * Math.sin(tt * 1.7 + i * 2)) - 20 * Math.abs(Math.sin(tt * 4));
        return <g key={i} transform={`translate(${x} ${y}) scale(${0.8 + 0.2 * i})`}><Butterfly flap={t * 9 + i} c={i ? "#F2C230" : "#E8806A"} /></g>;
      })}
    </g>
  );
};

/** A few leaves drifting down with a sway; `count` small. Positions are seeded. */
export const FallingLeaves: React.FC<{ t: number; amount?: number; count?: number; x0?: number; width?: number; top?: number; fall?: number; seed?: number }> = ({
  t, amount = 1, count = 3, x0 = 0, width = 1080, top = 300, fall = 1300, seed = 3,
}) => {
  if (amount <= 0.01) return null;
  const r = rng(seed);
  return (
    <g opacity={amount}>
      {Array.from({ length: count }, (_, i) => {
        const phase = r() * 10, speed = 0.06 + r() * 0.04, lx = x0 + r() * width;
        const u = ((t * speed + phase / 10) % 1 + 1) % 1;
        const x = lx + 60 * Math.sin(u * 12 + i), y = top + u * fall;
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${Math.sin(u * 10 + i) * 50})`}>
            <P d="M0,-16 Q14,0 0,16 Q-14,0 0,-16Z" fill={i % 2 ? "#8CC27A" : "#4E9A5E"} sw={2.5} />
          </g>
        );
      })}
    </g>
  );
};

/** One leaf on a scripted path (e.g. "तभी" or a leaf that taps the wooden bird). */
export const Leaf: React.FC<{ x: number; y: number; rot?: number; s?: number }> = ({ x, y, rot = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <P d="M0,-18 Q16,0 0,18 Q-16,0 0,-18Z" fill="#6FAE5E" sw={2.5} />
    <path d="M0,-14 L0,14" stroke="#3E7D4F" strokeWidth={2} />
  </g>
);

/** The recurring squirrel (original design), side view facing right; `run` animates the bound, `jaw` drops its mouth. */
export const Squirrel: React.FC<{ run?: number; jaw?: number; s?: number }> = ({ run = 0, jaw = 0, s = 1 }) => {
  const b = run ? Math.abs(Math.sin(run * Math.PI)) * 10 : 0;
  return (
    <g transform={`scale(${s}) translate(0 ${-b})`}>
      <P d="M-30,0 Q-90,-20 -80,-80 Q-70,-120 -40,-110 Q-60,-70 -36,-30Z" fill="#B97A45" />
      <path d="M-62,-96 Q-56,-60 -44,-40" stroke="#E9C69A" strokeWidth={6} fill="none" />
      <P d="M-36,0 Q-40,-40 -6,-44 Q30,-44 34,-14 Q36,4 10,6Z" fill="#B97A45" />
      <P d="M14,-40 Q12,-70 36,-70 Q60,-68 58,-46 Q54,-28 34,-30Z" fill="#B97A45" />
      <P d="M28,-66 L30,-82 L40,-68Z" fill="#B97A45" sw={3} />
      <circle cx={44} cy={-54} r={4.5} fill={INK} />
      <circle cx={43} cy={-56} r={1.5} fill="#fff" />
      <ellipse cx={57} cy={-48} rx={4} ry={3} fill={INK} />
      {jaw > 0.1 && <ellipse cx={52} cy={-38} rx={4} ry={2 + 6 * jaw} fill="#7A2A1E" stroke={INK} strokeWidth={2} />}
      <P d="M-10,-8 Q0,-4 4,6 L-8,6Z" fill="#E9C69A" sw={2} />
    </g>
  );
};

/** The bow lying on the ground after Duryodhana drops it. */
export const BowLying: React.FC = () => (
  <g>
    <path d="M-150,0 Q0,-60 150,0" fill="none" stroke={INK} strokeWidth={17} strokeLinecap="round" />
    <path d="M-150,0 Q0,-60 150,0" fill="none" stroke="#A86B3C" strokeWidth={10} strokeLinecap="round" />
    <path d="M-150,0 L150,0" stroke="#5A4632" strokeWidth={3} />
    <circle cx={-150} cy={0} r={7} fill="#E8B23A" stroke={INK} strokeWidth={3} />
    <circle cx={150} cy={0} r={7} fill="#E8B23A" stroke={INK} strokeWidth={3} />
  </g>
);

/** Comic steam puffs from the ears (anger, L12). */
export const Steam: React.FC<{ u: number }> = ({ u }) =>
  u <= 0 ? null : (
    <g opacity={Math.sin(Math.PI * Math.min(1, u))}>
      {[-1, 1].map((sd) => [0, 1].map((k) => (
        <circle key={`${sd}${k}`} cx={sd * (80 + 20 * u + k * 16)} cy={-20 - 50 * u - k * 26} r={14 + 10 * u + k * 4} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
      )))}
    </g>
  );
