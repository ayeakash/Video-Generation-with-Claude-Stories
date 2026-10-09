// Episode kit: small shared helpers for scenes (frame shell, ambient amount, sparkle, ripple, dust, flips).
import React from "react";
import { W, H } from "../camera/Camera";
import { Grain } from "../sequences/shared";
import { line, word } from "../timing/clock";
import { clamp, progress, ease } from "../utils/motion";
import { P } from "../characters/parts";

export const Frame: React.FC<{ children: React.ReactNode; bg?: string }> = ({ children, bg = "#2A1B12" }) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
    <defs>
      <filter id="soft3" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation={3} /></filter>
    </defs>
    <rect width={W} height={H} fill={bg} />
    {children}
    <Grain />
  </svg>
);

/** Ambient life amount: full, except the hush from "शांत" (L21) until the release (L30), when everything holds still. */
export const ambient = (t: number) => {
  const hushStart = word(21, "शांत").start - 0.6, hushFull = word(21, "शांत").end;
  const release = line(30).start;
  if (t < hushStart) return 1;
  if (t < release) return 1 - ease.inOut(progress(t, hushStart, hushFull));
  return ease.inOut(progress(t, release + 0.6, release + 2.5));
};

export const Sparkle: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) =>
  o <= 0 ? null : (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={clamp(o)}>
      <path d="M0,-26 L6,-6 L26,0 L6,6 L0,26 L-6,6 L-26,0 L-6,-6Z" fill="#FFF3B0" stroke="#F7C948" strokeWidth={3} />
    </g>
  );

/** Golden rings rippling out from a point (the hit). Fades out; never a flash. */
export const Ripple: React.FC<{ x: number; y: number; u: number; max?: number; n?: number }> = ({ x, y, u, max = 420, n = 3 }) =>
  u <= 0 || u >= 1 ? null : (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const k = clamp((u - i * 0.15) / 0.7);
        if (k <= 0 || k >= 1) return null;
        return <circle key={i} cx={x} cy={y} r={20 + max * ease.out(k)} fill="none" stroke="#FFD34D" strokeWidth={14 * (1 - k) + 2} opacity={0.9 * (1 - k)} />;
      })}
    </g>
  );

export const DustPuff: React.FC<{ x: number; y: number; age: number; s?: number }> = ({ x, y, age, s = 1 }) =>
  age < 0 || age > 0.7 ? null : (
    <g opacity={1 - age / 0.7}>
      {[-1, 0, 1].map((k) => <circle key={k} cx={x + k * 26 * s + k * age * 60 * s} cy={y - age * 34 * s - Math.abs(k) * 6} r={(12 + age * 30) * s} fill="#EBCB9C" />)}
    </g>
  );

/** "tok" impact marks (wood tap). */
export const Tok: React.FC<{ x: number; y: number; u: number }> = ({ x, y, u }) =>
  u <= 0 || u >= 1 ? null : (
    <g opacity={1 - u} transform={`translate(${x} ${y}) scale(${0.8 + u * 0.6})`}>
      {[-50, -10, 30].map((a, i) => <path key={i} d="M0,-30 L0,-58" transform={`rotate(${a})`} stroke="#3A2418" strokeWidth={6} strokeLinecap="round" />)}
    </g>
  );

/** Flat-animation turn: squash through 0 to the mirrored side. k 0→1 flips. Returns a transform for a figure at x. */
export const flipX = (x: number, k: number) => {
  const sx = Math.cos(Math.PI * clamp(k));
  return `translate(${x} 0) scale(${Math.abs(sx) < 0.02 ? 0.02 * Math.sign(sx || 1) : sx} 1) translate(${-x} 0)`;
};

/** Crossfade helper between two renders (e.g. side → front turn). */
export const XFade: React.FC<{ k: number; a: React.ReactNode; b: React.ReactNode }> = ({ k, a, b }) => (
  <g>
    {k < 1 && <g opacity={1 - clamp(k)}>{a}</g>}
    {k > 0 && <g opacity={clamp(k)}>{b}</g>}
  </g>
);

/** The golden "?" (bow-shaped question mark) used for think pauses. */
export const GoldQ: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) =>
  o <= 0 ? null : (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={clamp(o)}>
      <path d="M-80,-95 C-80,-185 90,-185 86,-85 C82,-22 0,-12 0,58" fill="none" stroke="#FFE08A" strokeWidth={36} strokeLinecap="round" opacity={0.5} />
      <path d="M-80,-95 C-80,-185 90,-185 86,-85 C82,-22 0,-12 0,58" fill="none" stroke="#F7C948" strokeWidth={22} strokeLinecap="round" />
      <circle cx={0} cy={130} r={22} fill="#FFE08A" stroke="#F7C948" strokeWidth={6} />
    </g>
  );

export const Speed: React.FC<{ y: number; x0: number; x1: number; o: number }> = ({ y, x0, x1, o }) =>
  o <= 0 ? null : <path d={`M${x0},${y} L${x1},${y}`} stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" opacity={o} />;

export const Wiggle: React.FC = () => <P d="M0,0" fill="none" />;
