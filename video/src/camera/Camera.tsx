// 2.5D camera. Keyframes of {cx, cy, zoom}; zoom interpolates in log space so pushes feel even.
// Applied as an SVG transform (not CSS) so vectors stay crisp even at 20x zoom.
import React from "react";
import { ease, lerp, progress } from "../utils/motion";

export type Cam = { cx: number; cy: number; z: number };
export type CamKey = { t: number; cam: Cam; ease?: (x: number) => number };

export const W = 1080, H = 1920;

export const camAt = (keys: CamKey[], t: number): Cam => {
  if (t <= keys[0].t) return keys[0].cam;
  for (let i = 1; i < keys.length; i++) {
    if (t <= keys[i].t) {
      const a = keys[i - 1], b = keys[i];
      const e = (b.ease ?? ease.inOut)(progress(t, a.t, b.t));
      return { cx: lerp(a.cam.cx, b.cam.cx, e), cy: lerp(a.cam.cy, b.cam.cy, e), z: Math.exp(lerp(Math.log(a.cam.z), Math.log(b.cam.z), e)) };
    }
  }
  return keys[keys.length - 1].cam;
};

/** depth: 1 = moves with the world, smaller = farther away (parallax), 0 = fixed to screen. */
export const camTransform = (c: Cam, depth = 1, home: Cam = { cx: W / 2, cy: H / 2, z: 1 }) => {
  const cx = lerp(home.cx, c.cx, depth), cy = lerp(home.cy, c.cy, depth), z = Math.exp(Math.log(c.z) * depth);
  return `translate(${W / 2} ${H / 2}) scale(${z}) translate(${-cx} ${-cy})`;
};

export const toScreen = (c: Cam, [x, y]: [number, number]): [number, number] => [(x - c.cx) * c.z + W / 2, (y - c.cy) * c.z + H / 2];

export const Layer: React.FC<{ cam: Cam; depth?: number; children: React.ReactNode }> = ({ cam, depth = 1, children }) => (
  <g transform={camTransform(cam, depth)}>{children}</g>
);
