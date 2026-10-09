// Today's child (moral, L37–38): ≈8-year-old girl, two braids with red ribbons, yellow kurta, blue leggings.
import React from "react";
import { INK, Limb, P, Head, Expr, View } from "./parts";

const SKIN = "#8A5634", KURTA = "#F2C230", DOT = "#E06A2C", LEGGING = "#3B5BA5", SHOE = "#D2303A";
const DOTS: [number, number][] = [[-30, 360], [20, 350], [-10, 420], [36, 440], [-44, 500], [10, 520], [50, 560], [-30, 570]];

export const PaperBall: React.FC<{ x: number; y: number; r?: number; spin?: number }> = ({ x, y, r = 26, spin = 0 }) => (
  <g transform={`rotate(${spin} ${x} ${y})`}>
    <circle cx={x} cy={y} r={r} fill="#FBFBF5" stroke={INK} strokeWidth={4} />
    <path d={`M${x - r * 0.6},${y - r * 0.2} l${r * 0.5},${r * 0.3} l${r * 0.2},${-r * 0.6} M${x},${y + r * 0.5} l${r * 0.4},${-r * 0.3} l${r * 0.3},${r * 0.2}`} stroke="#B9B6A8" strokeWidth={3} fill="none" />
  </g>
);

export const Girl: React.FC<{ view?: View; expr?: Expr; blink?: number; mouth?: number; holdBall?: boolean; walk?: number; shadow?: boolean;
  throwU?: number;   // side view: 0 wind-up … 1 follow-through; the ball leaves the hand at 0.55
  cheer?: number;    // front: both fists up
}> = ({
  view = "front", expr = "calm", blink = 0, mouth = 0, holdBall = false, walk = 0, shadow = true, throwU = -1, cheer = 0,
}) => {
  const cx = 200;
  const sw = walk ? Math.sin(walk * Math.PI * 2) : 0;
  const head = <Head skin={SKIN} crown="none" expr={expr} style="braids" blink={blink} mouth={mouth} view={view} gid="girl" />;
  const sh = shadow ? <ellipse cx={200} cy={728} rx={80} ry={14} fill="#6B4426" opacity={0.22} /> : null;
  const shoe = (x: number, dx = 0) => <ellipse cx={x + dx} cy={722} rx={26} ry={11} fill={SHOE} stroke={INK} strokeWidth={4} />;

  if (view === "side") {
    return (
      <g>
        {sh}
        <Limb pts={[[cx - 18, 300], [cx - 18 - sw * 20, 390], [cx - 14 - sw * 28, 466]]} color={SKIN} w={24} />
        {[-1, 1].map((s) => (
          <g key={s}>
            <Limb pts={[[cx, 560], [cx + s * sw * 22, 712]]} color={LEGGING} w={28} />
            {shoe(cx + s * sw * 22, 14)}
          </g>
        ))}
        <rect x={cx - 12} y={255} width={28} height={40} fill={SKIN} stroke={INK} strokeWidth={4} />
        <P d={`M${cx - 34},300 Q${cx + 6},284 ${cx + 38},302 Q${cx + 52},460 ${cx + 62},600 L${cx - 52},600 Q${cx - 44},460 ${cx - 34},300Z`} fill={KURTA} />
        {DOTS.slice(0, 5).map(([dx, dy], i) => <circle key={i} cx={cx + dx * 0.6} cy={dy} r={5} fill={DOT} />)}
        {head}
        {throwU >= 0 ? (() => {
          // underarm-to-overhand lob: arm swings from back-low to forward-high
          const a = ((-150 + 200 * Math.min(1, throwU)) * Math.PI) / 180;
          const sh: [number, number] = [cx + 2, 306];
          const el: [number, number] = [sh[0] + 80 * Math.sin(a * 0.85), sh[1] + 80 * Math.cos(a * 0.85)];
          const hd: [number, number] = [sh[0] + 158 * Math.sin(a), sh[1] + 158 * Math.cos(a)];
          return (
            <g>
              <Limb pts={[sh, el, hd]} color={SKIN} w={24} />
              {throwU < 0.55 && <PaperBall x={hd[0] + 6} y={hd[1] - 14} r={22} />}
              <circle cx={hd[0]} cy={hd[1]} r={15} fill={SKIN} stroke={INK} strokeWidth={4} />
            </g>
          );
        })() : (
          <>
            <Limb pts={[[cx + 2, 304], [cx + 4 + sw * 20, 392], [cx + 8 + sw * 28, 466]]} color={SKIN} w={24} />
            <circle cx={cx + 8 + sw * 28} cy={472} r={15} fill={SKIN} stroke={INK} strokeWidth={4} />
          </>
        )}
      </g>
    );
  }
  const q = view === "threeQuarter", back = view === "back";
  const shift = q ? 8 : 0;
  return (
    <g>
      {sh}
      {[-1, 1].map((s) => (
        <g key={s}>
          <Limb pts={[[cx + s * 22 - (q && s > 0 ? 8 : 0), 560], [cx + s * 24 - (q && s > 0 ? 6 : 0), 712]]} color={LEGGING} w={30} />
          {back ? <ellipse cx={cx + s * 26} cy={720} rx={22} ry={11} fill={SHOE} stroke={INK} strokeWidth={4} /> : shoe(cx + s * 30, q ? 14 : 0)}
        </g>
      ))}
      <rect x={cx - 16 + shift / 2} y={255} width={32} height={40} fill={SKIN} stroke={INK} strokeWidth={4} />
      <P d={`M${cx - 62},300 Q${cx - 70},460 ${cx - 84},600 L${cx + 84 - (q ? 16 : 0)},600 Q${cx + 70 - (q ? 16 : 0)},460 ${cx + 62 - (q ? 18 : 0)},300 Q${cx + shift},280 ${cx - 62},300Z`} fill={KURTA} />
      {DOTS.map(([dx, dy], i) => <circle key={i} cx={cx + dx + shift} cy={dy} r={5} fill={DOT} />)}
      {!back && <path d={`M${cx - 24 + shift},298 Q${cx + shift},326 ${cx + 24 + shift},298`} fill="none" stroke={DOT} strokeWidth={6} />}
      <Limb pts={[[cx - 62, 312], [cx - 80 - 10 * cheer, 400 - 150 * cheer], [cx - 76 - 14 * cheer, 470 - 290 * cheer]]} color={SKIN} w={26} />
      <circle cx={cx - 76 - 14 * cheer} cy={476 - 290 * cheer} r={16 + 3 * cheer} fill={SKIN} stroke={INK} strokeWidth={4} />
      {cheer > 0.01 ? (
        <g>
          <Limb pts={[[cx + 62 - (q ? 18 : 0), 312], [cx + 90 - (q ? 18 : 0), 400 - 150 * cheer], [cx + 90 - (q ? 18 : 0), 470 - 290 * cheer]]} color={SKIN} w={q ? 24 : 26} />
          <circle cx={cx + 90 - (q ? 18 : 0)} cy={476 - 290 * cheer} r={19} fill={SKIN} stroke={INK} strokeWidth={4} />
        </g>
      ) : holdBall && !back ? (
        <g>
          <Limb pts={[[cx + 62, 312], [cx + 104, 370], [cx + 110, 300]]} color={SKIN} w={26} />
          <PaperBall x={cx + 112} y={280} />
          <circle cx={cx + 110} cy={300} r={16} fill={SKIN} stroke={INK} strokeWidth={4} />
        </g>
      ) : (
        <g>
          <Limb pts={[[cx + 62 - (q ? 18 : 0), 312], [cx + 80 - (q ? 18 : 0), 400], [cx + 76 - (q ? 18 : 0), 470]]} color={SKIN} w={q ? 24 : 26} />
          <circle cx={cx + 76 - (q ? 18 : 0)} cy={476} r={16} fill={SKIN} stroke={INK} strokeWidth={4} />
        </g>
      )}
      {head}
    </g>
  );
};
