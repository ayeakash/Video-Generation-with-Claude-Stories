// Guru Drona: tall, lean, still. One clear gesture per line (series bible §4). Views: front, 3/4, side, back.
// 3/4 and side face screen-right; mirror the placement to face left.
import React from "react";
import { INK, Limb, P, View, HEAD34 } from "./parts";

const SKIN = "#B47A50";
const WHITE = "#F7F7F3";
const HAIR = "#E9E7E1";
const OCHRE = "#D9822B", OCHRE_D = "#B9651C", BELT = "#7A3B12";

export type DronaProps = {
  pose?: "palm" | "beard" | "rest" | "point" | "reach"; // teaching palm, beard-stroke, relaxed, pointing up, hand on a shoulder
  raise?: number;                    // 0..1 how far the gesture arm is up (back view beckon/point)
  stroke?: number;                   // beard-stroke phase
  lean?: number;                     // degrees about the feet (positive = toward screen-right)
  headTilt?: number;
  mouth?: number;
  smile?: number;
  blink?: number;
  view?: View;
  walk?: number;
  shadow?: boolean;
};

const Shadow = () => <ellipse cx={200} cy={728} rx={86} ry={15} fill="#6B4426" opacity={0.22} />;

const Brow: React.FC<{ x: number; s: number; hy: number; smile: number; k?: number }> = ({ x, s, hy, smile, k = 1 }) => (
  <P d={`M${x - s * 16 * k},${hy - 18 - smile * 3} Q${x},${hy - 30 - smile * 3} ${x + s * 14 * k},${hy - 16} Q${x},${hy - 22} ${x - s * 16 * k},${hy - 18 - smile * 3}Z`} fill={WHITE} sw={3} />
);
const Eye: React.FC<{ x: number; hy: number; closed: boolean; sx?: number }> = ({ x, hy, closed, sx = 1 }) =>
  closed ? (
    <path d={`M${x - 9 * sx},${hy} Q${x},${hy - 8} ${x + 9 * sx},${hy}`} fill="none" stroke={INK} strokeWidth={4.5} strokeLinecap="round" />
  ) : (
    <g>
      <ellipse cx={x} cy={hy - 2} rx={7 * sx} ry={9} fill={INK} />
      <circle cx={x - 2 * sx} cy={hy - 5} r={2.5} fill="#fff" />
    </g>
  );
const Mouth: React.FC<{ x: number; hy: number; mouth: number; smile: number; sx?: number }> = ({ x, hy, mouth, smile, sx = 1 }) =>
  mouth > 0.04 ? (
    <ellipse cx={x} cy={hy + 42} rx={10 * sx} ry={2 + 8 * mouth} fill="#6E2A24" stroke={INK} strokeWidth={3} />
  ) : (
    <path d={`M${x - (12 + 4 * smile) * sx},${hy + 40 - 2 * smile} Q${x},${hy + 46 + 6 * smile} ${x + (12 + 4 * smile) * sx},${hy + 40 - 2 * smile}`} fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />
  );

export const Drona: React.FC<DronaProps> = ({ pose = "palm", stroke = 0, lean = 0, headTilt = 0, mouth = 0, smile = 0, blink = 0, view = "front", walk = 0, shadow = true, raise = 1 }) => {
  const cx = 200, hy = 164; // head centre: low enough that the chin meets a short neck
  const closed = blink > 0.6 || smile > 0.6;
  const swing = walk ? Math.sin(walk * Math.PI * 2) : 0;
  const handY = 268 + 13 * Math.sin(stroke * Math.PI * 2) + 13;

  if (view === "side") {
    const beardTip: [number, number] = [cx + 30, hy + 144];
    return (
      <g transform={`rotate(${lean} 200 730)`}>
        {shadow && <Shadow />}
        {/* far arm, legs */}
        <Limb pts={[[cx - 6, 270], [cx - 6 - swing * 18, 352], [cx - 2 - swing * 26, 430]]} color={SKIN} w={24} />
        {[-1, 1].map((s) => <ellipse key={s} cx={cx + 16 + s * swing * 16} cy={724} rx={30} ry={10} fill={SKIN} stroke={INK} strokeWidth={4} />)}
        <P d={`M${cx - 34},420 L${cx + 40},420 L${cx + 56},712 L${cx - 46},712Z`} fill={OCHRE} />
        <P d={`M${cx + 26},426 L${cx + 40},426 L${cx + 56},708 L${cx + 40},708Z`} fill={OCHRE_D} sw={3} />
        <path d={`M${cx - 44},700 L${cx + 54},700`} stroke={BELT} strokeWidth={7} />
        <rect x={cx - 11} y={hy + 50} width={30} height={262 - hy - 50} fill={SKIN} stroke={INK} strokeWidth={4} />
        <P d={`M${cx - 30},258 Q${cx + 10},246 ${cx + 34},262 Q${cx + 44},350 ${cx + 38},424 L${cx - 34},424 Q${cx - 40},350 ${cx - 30},258Z`} fill={SKIN} />
        <P d={`M${cx - 34},262 L${cx - 6},256 L${cx + 38},410 L${cx + 14},420Z`} fill="#F4EFE4" />
        {Array.from({ length: 8 }, (_, i) => <circle key={i} cx={cx + 24 + i * 1.6} cy={270 + i * 12} r={5} fill="#6B3A22" stroke={INK} strokeWidth={1.5} />)}
        <rect x={cx - 38} y={412} width={80} height={16} rx={7} fill={BELT} stroke={INK} strokeWidth={4} />
        <g transform={`rotate(${headTilt} ${cx} 230)`}>
          {/* back hair + top-knot behind */}
          <circle cx={cx - 22} cy={hy - 78} r={24} fill={HAIR} stroke={INK} strokeWidth={4} />
          <path d={`M${cx - 42},${hy - 70} Q${cx - 22},${hy - 60} ${cx - 2},${hy - 72}`} stroke={BELT} strokeWidth={6} fill="none" />
          <g transform={`translate(${cx} ${hy}) scale(0.84 0.87) translate(${-cx} ${-hy})`}>
            <P d={`M${cx - 6},${hy - 74} Q${cx + 54},${hy - 74} ${cx + 64},${hy - 16} L${cx + 80},${hy + 8} Q${cx + 82},${hy + 14} ${cx + 68},${hy + 16} Q${cx + 70},${hy + 30} ${cx + 64},${hy + 36} Q${cx + 68},${hy + 44} ${cx + 60},${hy + 50} Q${cx + 58},${hy + 70} ${cx + 22},${hy + 74} Q${cx - 50},${hy + 76} ${cx - 68},${hy + 22} Q${cx - 76},${hy - 62} ${cx - 6},${hy - 74}Z`} fill={SKIN} />
            <P d={`M${cx + 30},${hy - 66} Q${cx - 20},${hy - 92} ${cx - 66},${hy - 50} Q${cx - 82},${hy} ${cx - 66},${hy + 46} L${cx - 34},${hy + 36} Q${cx - 30},${hy - 10} ${cx - 6},${hy - 28} Q${cx + 14},${hy - 48} ${cx + 30},${hy - 66}Z`} fill={HAIR} />
          </g>
          <ellipse cx={cx - 12} cy={hy + 6} rx={11} ry={15} fill={SKIN} stroke={INK} strokeWidth={4} />
          {[0, 1, 2].map((i) => <path key={i} d={`M${cx + 34},${hy - 36 + i * 7} L${cx + 50},${hy - 36 + i * 7}`} stroke="#F3E1B5" strokeWidth={3.5} strokeLinecap="round" />)}
          <Eye x={cx + 34} hy={hy} closed={closed} sx={0.7} />
          <P d={`M${cx + 20},${hy - 20} Q${cx + 34},${hy - 32} ${cx + 52},${hy - 20} Q${cx + 36},${hy - 24} ${cx + 20},${hy - 20}Z`} fill={WHITE} sw={3} />
          {/* beard flows down and forward from the jaw */}
          <P d={`M${cx - 18},${hy + 18} Q${cx - 24},${hy + 100} ${beardTip[0]},${beardTip[1]} Q${cx + 60},${hy + 96} ${cx + 58},${hy + 36} Q${cx + 30},${hy + 52} ${cx - 18},${hy + 18}Z`} fill={WHITE} />
          <Mouth x={cx + 46} hy={hy} mouth={mouth} smile={smile} sx={0.5} />
          <P d={`M${cx + 60},${hy + 22} Q${cx + 40},${hy + 22} ${cx + 30},${hy + 38} Q${cx + 46},${hy + 32} ${cx + 62},${hy + 32}Z`} fill={WHITE} sw={3} />
        </g>
        {pose === "palm" ? (
          <g>
            <Limb pts={[[cx + 4, 272], [cx + 52, 330], [cx + 92, 278]]} color={SKIN} w={26} />
            <P d={`M${cx + 82},284 Q${cx + 84},246 ${cx + 96},240 L${cx + 102},252 L${cx + 106},232 Q${cx + 114},230 ${cx + 114},244 Q${cx + 118},280 ${cx + 100},290Z`} fill={SKIN} sw={3.5} />
          </g>
        ) : pose === "beard" ? (
          <g>
            <Limb pts={[[cx + 4, 272], [cx + 40, 352], [cx + 56, handY + 6]]} color={SKIN} w={26} />
            <circle cx={cx + 52} cy={handY} r={17} fill={SKIN} stroke={INK} strokeWidth={4} />
          </g>
        ) : (
          <g>
            <Limb pts={[[cx + 4, 272], [cx + 6 + swing * 18, 352], [cx + 10 + swing * 26, 430]]} color={SKIN} w={26} />
            <circle cx={cx + 10 + swing * 26} cy={438} r={16} fill={SKIN} stroke={INK} strokeWidth={4} />
          </g>
        )}
      </g>
    );
  }

  if (view === "back") {
    return (
      <g transform={`rotate(${lean} 200 730)`}>
        {shadow && <Shadow />}
        {[-1, 1].map((s) => <ellipse key={s} cx={cx + s * 30} cy={722} rx={24} ry={11} fill={SKIN} stroke={INK} strokeWidth={4} />)}
        <P d={`M${cx - 52},420 L${cx + 52},420 L${cx + 74},712 L${cx - 74},712Z`} fill={OCHRE} />
        <path d={`M${cx - 72},700 L${cx + 72},700`} stroke={BELT} strokeWidth={7} />
        <rect x={cx - 16} y={hy + 50} width={32} height={262 - hy - 50} fill={SKIN} stroke={INK} strokeWidth={4} />
        <P d={`M${cx - 60},258 Q${cx - 56},350 ${cx - 50},424 L${cx + 50},424 Q${cx + 56},350 ${cx + 60},258 Q${cx},242 ${cx - 60},258Z`} fill={SKIN} />
        <path d={`M${cx},268 Q${cx + 3},350 ${cx},410`} stroke={INK} strokeWidth={3} fill="none" opacity={0.3} />
        <P d={`M${cx - 60},258 L${cx - 26},256 L${cx + 52},420 L${cx + 20},424Z`} fill="#F4EFE4" />
        <rect x={cx - 54} y={412} width={108} height={16} rx={7} fill={BELT} stroke={INK} strokeWidth={4} />
        <Limb pts={[[cx - 60, 270], [cx - 76, 350], [cx - 72, 430]]} color={SKIN} w={26} />
        <circle cx={cx - 72} cy={438} r={16} fill={SKIN} stroke={INK} strokeWidth={4} />
        {pose === "palm" || pose === "point" ? (() => {
          const up = pose === "point" ? 1 : 0.6;
          const e: [number, number] = [cx + 76 + 30 * raise, 350 - 110 * raise * up];
          const h: [number, number] = [cx + 80 + 30 * raise, 430 - 300 * raise * up];
          return (
            <g>
              <Limb pts={[[cx + 60, 270], e, h]} color={SKIN} w={26} />
              <circle cx={h[0]} cy={h[1]} r={16} fill={SKIN} stroke={INK} strokeWidth={4} />
              {pose === "point" && raise > 0.6 && <path d={`M${h[0]},${h[1] - 14} l2,-26`} stroke={INK} strokeWidth={13} strokeLinecap="round" />}
              {pose === "point" && raise > 0.6 && <path d={`M${h[0]},${h[1] - 14} l2,-26`} stroke={SKIN} strokeWidth={7} strokeLinecap="round" />}
            </g>
          );
        })() : (
          <>
            <Limb pts={[[cx + 60, 270], [cx + 76, 350], [cx + 72, 430]]} color={SKIN} w={26} />
            <circle cx={cx + 72} cy={438} r={16} fill={SKIN} stroke={INK} strokeWidth={4} />
          </>
        )}
        <g transform={`rotate(${headTilt} ${cx} 230)`}>
          {[-1, 1].map((s) => <ellipse key={s} cx={cx + s * 58} cy={hy + 4} rx={11} ry={15} fill={SKIN} stroke={INK} strokeWidth={4} />)}
          {/* beard peeks out either side of the jaw */}
          <P d={`M${cx - 50},${hy + 30} Q${cx - 44},${hy + 100} ${cx},${hy + 128} Q${cx + 44},${hy + 100} ${cx + 50},${hy + 30}Z`} fill={WHITE} />
          <P d={`M${cx - 62},${hy - 4} Q${cx - 66},${hy - 74} ${cx},${hy - 76} Q${cx + 66},${hy - 74} ${cx + 62},${hy - 4} Q${cx + 62},${hy + 52} ${cx + 46},${hy + 80} Q${cx},${hy + 92} ${cx - 46},${hy + 80} Q${cx - 62},${hy + 52} ${cx - 62},${hy - 4}Z`} fill={HAIR} />
          {[-30, -12, 8, 26].map((dx, i) => (
            <path key={i} d={`M${cx + dx * 0.6},${hy - 60} Q${cx + dx * 1.3},${hy + 10} ${cx + dx * 1.1},${hy + 72}`} stroke="#C9C6BE" strokeWidth={3} fill="none" />
          ))}
          <circle cx={cx} cy={hy - 86} r={24} fill={HAIR} stroke={INK} strokeWidth={4} />
          <path d={`M${cx - 22},${hy - 76} Q${cx},${hy - 66} ${cx + 22},${hy - 76}`} stroke={BELT} strokeWidth={6} fill="none" />
        </g>
      </g>
    );
  }

  const q = view === "threeQuarter";
  const fx = q ? 10 : 0; // features shift toward the facing side in 3/4
  const beads = Array.from({ length: 15 }, (_, i) => {
    const a = (-14 + i * 2) / 10;
    return <circle key={i} cx={cx + fx + 34 * Math.sin(a) * (q ? 0.85 : 1)} cy={262 + 70 * (1 - Math.cos(a))} r={5} fill="#6B3A22" stroke={INK} strokeWidth={1.5} />;
  });
  return (
    <g transform={`rotate(${lean} 200 730)`}>
      {shadow && <Shadow />}
      {[-1, 1].map((s) => <ellipse key={s} cx={cx + s * 30 + (q ? 12 : 0)} cy={724} rx={28} ry={11} fill={SKIN} stroke={INK} strokeWidth={4} />)}
      <P d={`M${cx - 52 + (q ? 6 : 0)},420 L${cx + 52},420 L${cx + 74},712 L${cx - 74 + (q ? 12 : 0)},712Z`} fill={OCHRE} />
      <P d={`M${cx - 9 + fx},426 L${cx + 9 + fx},426 L${cx + 16 + fx},708 L${cx - 16 + fx},708Z`} fill={OCHRE_D} sw={3} />
      <path d={`M${cx - 72},700 L${cx + 72},700`} stroke={BELT} strokeWidth={7} />
      <rect x={cx - 16 + fx / 2} y={hy + 50} width={32} height={262 - hy - 50} fill={SKIN} stroke={INK} strokeWidth={4} />
      <P d={`M${cx - 60},258 Q${cx - 56},350 ${cx - 50},424 L${cx + 50 - (q ? 12 : 0)},424 Q${cx + 56 - (q ? 14 : 0)},350 ${cx + 60 - (q ? 16 : 0)},258 Q${cx + fx},242 ${cx - 60},258Z`} fill={SKIN} />
      <path d={`M${cx - 44 + fx},262 L${cx + 46},418`} stroke="#FFF7E2" strokeWidth={4} />
      <P d={`M${cx + 60},258 L${cx + 26},256 L${cx - 52 + fx},420 L${cx - 20 + fx},424Z`} fill="#F4EFE4" />
      {beads}
      <rect x={cx - 54 + (q ? 8 : 0)} y={412} width={108 - (q ? 8 : 0)} height={16} rx={7} fill={BELT} stroke={INK} strokeWidth={4} />
      <Limb pts={[[cx - 60, 270], [cx - 76, 350], [cx - 72, 430]]} color={SKIN} w={26} />
      <circle cx={cx - 72} cy={438} r={16} fill={SKIN} stroke={INK} strokeWidth={4} />

      {pose === "palm" && (
        <g>
          <Limb pts={[[cx + 60, 270], [cx + 104, 330], [cx + 112, 262]]} color={SKIN} w={26} />
          <P d={`M${cx + 98},262 Q${cx + 96},226 ${cx + 108},222 L${cx + 112},236 L${cx + 116},214 Q${cx + 124},212 ${cx + 124},226 L${cx + 126},218 Q${cx + 134},218 ${cx + 132},236 Q${cx + 134},268 ${cx + 112},272Z`} fill={SKIN} sw={3.5} />
        </g>
      )}
      {pose === "rest" && (
        <g>
          <Limb pts={[[cx + 60, 270], [cx + 76, 350], [cx + 72, 430]]} color={SKIN} w={26} />
          <circle cx={cx + 72} cy={438} r={16} fill={SKIN} stroke={INK} strokeWidth={4} />
        </g>
      )}
      {pose === "point" && (() => {
        const L = (a: number, b: number) => a + (b - a) * raise;
        const e: [number, number] = [L(cx + 76, cx + 92), L(350, 196)], h: [number, number] = [L(cx + 72, cx + 104), L(430, 112)];
        return (
          <g>
            <Limb pts={[[cx + 60, 270], e, h]} color={SKIN} w={26} />
            <circle cx={h[0]} cy={h[1]} r={16} fill={SKIN} stroke={INK} strokeWidth={4} />
            {raise > 0.5 && <><path d={`M${h[0] + 2},${h[1] - 12} l3,-30`} stroke={INK} strokeWidth={13} strokeLinecap="round" /><path d={`M${h[0] + 2},${h[1] - 12} l3,-30`} stroke={SKIN} strokeWidth={7} strokeLinecap="round" /></>}
          </g>
        );
      })()}
      {pose === "reach" && (
        <g>
          <Limb pts={[[cx + 56, 272], [cx + 120, 312 - 10 * raise], [cx + 190, 300 - 6 * raise]]} color={SKIN} w={26} />
          <P d={`M${cx + 176},286 Q${cx + 206},280 ${cx + 214},296 Q${cx + 206},314 ${cx + 180},312Z`} fill={SKIN} sw={3.5} />
        </g>
      )}
      {q ? (
        <g transform={`rotate(${headTilt} ${cx} 230)`}>
          <P d={`M${cx + 24},${hy - 66} Q${cx - 70},${hy - 92} ${cx - 72},${hy - 4} Q${cx - 74},${hy + 70} ${cx - 56},${hy + 94} Q${cx - 34},${hy + 100} ${cx - 20},${hy + 70}Z`} fill={HAIR} />
          <circle cx={cx - 14} cy={hy - 84} r={24} fill={HAIR} stroke={INK} strokeWidth={4} />
          <path d={`M${cx - 36},${hy - 74} Q${cx - 14},${hy - 64} ${cx + 8},${hy - 74}`} stroke={BELT} strokeWidth={6} fill="none" />
          <g transform={`translate(${cx} ${hy}) scale(0.84 0.87) translate(${-cx} ${-hy})`}>
            <P d={HEAD34(cx, hy)} fill={SKIN} />
            <P d={`M${cx + 58},${hy - 30} Q${cx + 52},${hy - 90} ${cx - 6},${hy - 90} Q${cx - 80},${hy - 86} ${cx - 78},${hy - 8} Q${cx - 76},${hy + 34} ${cx - 64},${hy + 48} L${cx - 54},${hy + 30} Q${cx - 50},${hy - 6} ${cx - 34},${hy - 26} Q${cx},${hy - 54} ${cx + 30},${hy - 52} Q${cx + 48},${hy - 48} ${cx + 58},${hy - 30}Z`} fill={HAIR} />
          </g>
          <ellipse cx={cx - 38} cy={hy + 6} rx={11} ry={15} fill={SKIN} stroke={INK} strokeWidth={4} />
          {[0, 1, 2].map((i) => <path key={i} d={`M${cx + 2},${hy - 36 + i * 7} L${cx + 32},${hy - 36 + i * 7}`} stroke="#F3E1B5" strokeWidth={3.5} strokeLinecap="round" />)}
          <circle cx={cx + 17} cy={hy - 30} r={3.5} fill="#C8283A" />
          <path d={`M${cx + 22},${hy + 6} q-5,12 4,13`} fill="none" stroke={INK} strokeWidth={3.5} strokeLinecap="round" opacity={0.7} />
          {[{ x: cx + 2, s: -1, k: 1 }, { x: cx + 34, s: 1, k: 0.86 }].map(({ x, s, k }) => (
            <g key={s}>
              <Eye x={x} hy={hy} closed={closed} sx={k} />
              <Brow x={x} s={s} hy={hy} smile={smile} k={k} />
            </g>
          ))}
          <g transform={`translate(${cx + 14} 0) scale(0.88 1) translate(${-cx} 0)`}>
            <P d={`M${cx - 50},${hy + 14} Q${cx - 46},${hy + 104} ${cx},${hy + 140} Q${cx + 46},${hy + 104} ${cx + 50},${hy + 14} Q${cx + 30},${hy + 50} ${cx},${hy + 48} Q${cx - 30},${hy + 50} ${cx - 50},${hy + 14}Z`} fill={WHITE} />
            <Mouth x={cx} hy={hy} mouth={mouth} smile={smile} />
            <P d={`M${cx},${hy + 24} Q${cx - 18},${hy + 22} ${cx - 30},${hy + 38} Q${cx - 12},${hy + 34} ${cx},${hy + 32} Q${cx + 12},${hy + 34} ${cx + 30},${hy + 38} Q${cx + 18},${hy + 22} ${cx},${hy + 24}Z`} fill={WHITE} sw={3} />
          </g>
        </g>
      ) : (
      <g transform={`rotate(${headTilt} ${cx} 230)`}>
        <g transform={q ? "translate(-10 0)" : undefined}>
          <P d={`M${cx - 64},${hy - 4} Q${cx - 70},${hy - 74} ${cx},${hy - 76} Q${cx + 70},${hy - 74} ${cx + 64},${hy - 4} Q${cx + 70},${hy + 64} ${cx + 54},${hy + 94} L${cx - 54},${hy + 94} Q${cx - 70},${hy + 64} ${cx - 64},${hy - 4}Z`} fill={HAIR} />
          <circle cx={cx} cy={hy - 86} r={24} fill={HAIR} stroke={INK} strokeWidth={4} />
          <path d={`M${cx - 22},${hy - 76} Q${cx},${hy - 66} ${cx + 22},${hy - 76}`} stroke={BELT} strokeWidth={6} fill="none" />
        </g>
        {(q ? [-1] : [-1, 1]).map((s) => <ellipse key={s} cx={cx + s * (q ? 50 : 58)} cy={hy + 4} rx={11} ry={15} fill={SKIN} stroke={INK} strokeWidth={4} />)}
        <ellipse cx={cx + (q ? 4 : 0)} cy={hy} rx={q ? 54 : 56} ry={64} fill={SKIN} stroke={INK} strokeWidth={4} />
        <P d={`M${cx - 56 + fx / 2},${hy - 12} Q${cx - 52 + fx / 2},${hy - 62} ${cx + fx / 2},${hy - 64} Q${cx + 52 + fx / 2},${hy - 62} ${cx + 56 + fx / 2},${hy - 12} Q${cx + 30 + fx},${hy - 44} ${cx + fx},${hy - 46} Q${cx - 30 + fx},${hy - 44} ${cx - 56 + fx / 2},${hy - 12}Z`} fill={HAIR} />
        {[0, 1, 2].map((i) => <path key={i} d={`M${cx - 18 + fx},${hy - 36 + i * 7} L${cx + 18 + fx},${hy - 36 + i * 7}`} stroke="#F3E1B5" strokeWidth={3.5} strokeLinecap="round" />)}
        <circle cx={cx + fx} cy={hy - 30} r={3.5} fill="#C8283A" />
        {(q ? [{ x: cx - 4, s: -1, k: 0.75 }, { x: cx + 30, s: 1, k: 1 }] : [{ x: cx - 22, s: -1, k: 1 }, { x: cx + 22, s: 1, k: 1 }]).map(({ x, s, k }) => (
          <g key={s}>
            <Eye x={x} hy={hy} closed={closed} sx={k} />
            <Brow x={x} s={s} hy={hy} smile={smile} k={k} />
          </g>
        ))}
        {q ? (
          <path d={`M${cx + 40},${hy + 2} q11,11 -2,16`} fill="none" stroke={INK} strokeWidth={3.5} strokeLinecap="round" opacity={0.75} />
        ) : (
          <path d={`M${cx + 1},${hy + 6} q-6,12 3,13`} fill="none" stroke={INK} strokeWidth={3.5} strokeLinecap="round" opacity={0.7} />
        )}
        <g transform={q ? `translate(${cx + 14} 0) scale(0.9 1) translate(${-cx} 0)` : undefined}>
          <P d={`M${cx - 50},${hy + 14} Q${cx - 46},${hy + 104} ${cx},${hy + 140} Q${cx + 46},${hy + 104} ${cx + 50},${hy + 14} Q${cx + 30},${hy + 50} ${cx},${hy + 48} Q${cx - 30},${hy + 50} ${cx - 50},${hy + 14}Z`} fill={WHITE} />
          <Mouth x={cx} hy={hy} mouth={mouth} smile={smile} />
          <P d={`M${cx},${hy + 24} Q${cx - 18},${hy + 22} ${cx - 30},${hy + 38} Q${cx - 12},${hy + 34} ${cx},${hy + 32} Q${cx + 12},${hy + 34} ${cx + 30},${hy + 38} Q${cx + 18},${hy + 22} ${cx},${hy + 24}Z`} fill={WHITE} sw={3} />
        </g>
      </g>
      )}
      {pose === "beard" && (
        <g>
          <Limb pts={[[cx + 60, 270], [cx + 96, 352], [cx + 34 + fx, handY + 8]]} color={SKIN} w={26} />
          <circle cx={cx + 28 + fx} cy={handY} r={17} fill={SKIN} stroke={INK} strokeWidth={4} />
          <path d={`M${cx + 14 + fx},${handY - 6} q-8,6 -6,14`} stroke={INK} strokeWidth={3.5} fill="none" strokeLinecap="round" />
        </g>
      )}
    </g>
  );
};
