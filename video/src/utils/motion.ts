// Easing families, per-material springs, seeded randomness and 2D matrices.
// Deterministic: nothing here reads Math.random or the wall clock.

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const progress = (t: number, t0: number, t1: number) => clamp((t - t0) / (t1 - t0));

export const ease = {
  linear: (x: number) => x,
  inOut: (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
  out: (x: number) => 1 - Math.pow(1 - x, 3),
  in: (x: number) => x * x * x,
  /** slow start, long glide: camera pushes */
  glide: (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2),
};

/** Damped spring response (0 → 1) at time `t` seconds after its trigger. */
export const spring = (t: number, { stiffness = 120, damping = 14, mass = 1 } = {}) => {
  if (t <= 0) return 0;
  const w0 = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));
  if (zeta < 1) {
    const wd = w0 * Math.sqrt(1 - zeta * zeta);
    return 1 - Math.exp(-zeta * w0 * t) * (Math.cos(wd * t) + ((zeta * w0) / wd) * Math.sin(wd * t));
  }
  return 1 - Math.exp(-w0 * t) * (1 + w0 * t);
};

/** Materials move differently (series bible §5). */
export const MATERIAL = {
  cloth: { stiffness: 60, damping: 9 },        // sashes, capes: float and trail
  body: { stiffness: 110, damping: 16 },       // calm character moves
  swagger: { stiffness: 220, damping: 12 },    // Duryodhana: bouncy, overshoots
  wood: { stiffness: 340, damping: 10, mass: 2 }, // heavy wooden bird on its peg: stiff low rock
  glow: { stiffness: 70, damping: 14 },        // focus ring, light: soft settle
};

/** Seeded PRNG (mulberry32). */
export const rng = (seed: number) => () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
  let r = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
  return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
};

/** Deterministic blink: 0 open … 1 closed. */
export const blink = (t: number, seed: number, every = 3.6) => {
  const r = rng(seed);
  let tt = r() * every;
  while (tt < t - 0.2) tt += every * (0.7 + 0.6 * r());
  const d = t - tt;
  return d >= 0 && d < 0.16 ? Math.sin((d / 0.16) * Math.PI) : 0;
};

// ---- 2D affine matrices (a b c d e f), SVG order ----
export type M = [number, number, number, number, number, number];
export const I: M = [1, 0, 0, 1, 0, 0];
export const mul = (m: M, n: M): M => [
  m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1],
  m[0] * n[2] + m[2] * n[3], m[1] * n[2] + m[3] * n[3],
  m[0] * n[4] + m[2] * n[5] + m[4], m[1] * n[4] + m[3] * n[5] + m[5],
];
export const T = (x: number, y: number): M => [1, 0, 0, 1, x, y];
export const S = (sx: number, sy = sx): M => [sx, 0, 0, sy, 0, 0];
export const R = (deg: number, cx = 0, cy = 0): M => {
  const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
  return mul(mul(T(cx, cy), [c, s, -s, c, 0, 0]), T(-cx, -cy));
};
export const apply = (m: M, [x, y]: [number, number]): [number, number] => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
export const svgM = (m: M) => `matrix(${m.map((v) => +v.toFixed(5)).join(" ")})`;
