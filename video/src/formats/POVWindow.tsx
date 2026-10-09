// Format "The Question" → POV Window: we go inside a prince's eye and see what he sees, framed in a circle.
// Used 3× in the episode (Duryodhana wide+drifting, Yudhishthira wide+steady, Arjuna tightening to the eye).
import React from "react";
import { W, H } from "../camera/Camera";

export const POV_CENTER: [number, number] = [540, 860];
const DARK = "#2A1B12"; // matches the pupil ink so the iris transition is seamless

/** Circular window with a feathered warm-dark surround. `open` 0..1 fades the surround in. */
export const POVWindow: React.FC<{ r: number; cx?: number; cy?: number; open?: number; id: string; children: React.ReactNode }> = ({
  r, cx = POV_CENTER[0], cy = POV_CENTER[1], open = 1, id, children,
}) => {
  const feather = 36;
  return (
    <g>
      <defs>
        <clipPath id={`pov-clip-${id}`}>
          <circle cx={cx} cy={cy} r={r + feather * 0.6} />
        </clipPath>
        <radialGradient id={`pov-vig-${id}`} gradientUnits="userSpaceOnUse" cx={cx} cy={cy} r={r + feather}>
          <stop offset={Math.max(0, (r - feather * 0.4) / (r + feather))} stopColor={DARK} stopOpacity={0} />
          <stop offset={1} stopColor={DARK} stopOpacity={1} />
        </radialGradient>
      </defs>
      <g clipPath={`url(#pov-clip-${id})`}>{children}</g>
      <g opacity={open}>
        <rect x={0} y={0} width={W} height={H} fill={`url(#pov-vig-${id})`} />
        {/* soft rim light: reads as the edge of an eye-view, not a hard cut-out */}
        <circle cx={cx} cy={cy} r={r + 2} fill="none" stroke="#F7D774" strokeWidth={3} opacity={0.35} />
      </g>
    </g>
  );
};
