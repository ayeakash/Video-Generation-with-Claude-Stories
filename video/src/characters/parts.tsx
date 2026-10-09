// Shared drawing parts for every character (ported 1:1 from the approved test sheet, design/test_sheet.py).
import React from "react";

export const INK = "#3A2418";
export const GOLD = "#E8B23A";
export const GOLD_HI = "#F7D774";
export const BLUSH = "#E8806A";

type PP = React.SVGProps<SVGPathElement> & { d: string; fill: string; sw?: number };
/** Filled shape with the series' soft ink outline. */
export const P: React.FC<PP> = ({ d, fill, sw = 4, ...rest }) => (
  <path d={d} fill={fill} stroke={INK} strokeWidth={sw} strokeLinejoin="round" strokeLinecap="round" {...rest} />
);

/** Rounded limb: ink outline + colour core. */
export const Limb: React.FC<{ pts: [number, number][]; color: string; w?: number }> = ({ pts, color, w = 30 }) => {
  const d = "M" + pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" L");
  return (
    <>
      <path d={d} fill="none" stroke={INK} strokeWidth={w + 8} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
    </>
  );
};

export type Expr = "calm" | "smile" | "focused" | "smug" | "laugh" | "angry" | "surprised" | "stern" | "happy_closed";

const BROWS: Record<Expr, [number, number, number]> = {
  // [outer y, inner-x factor y, mid y] relative to eye centre
  calm: [-24, -18, -27], focused: [-19, -14, -17], smug: [-30, -20, -34], angry: [-26, -14, -16],
  laugh: [-28, -20, -32], surprised: [-34, -28, -38], smile: [-25, -19, -29], happy_closed: [-25, -19, -29], stern: [-22, -16, -19],
};

export type View = "front" | "threeQuarter" | "side" | "back";

/** Where the features sit for a view (all relative to the head centre). Facing screen-right for 3/4 and side. */
type FaceLayout = { eyes: { dx: number; sx: number; side: -1 | 1 }[]; nose: "front" | "threeQuarter" | "none"; mouthDx: number; mouthSx: number; blush: { dx: number; rx: number }[] };
export const FACE_LAYOUT: Record<"front" | "threeQuarter" | "side", FaceLayout> = {
  front: { eyes: [{ dx: -28, sx: 1, side: -1 }, { dx: 28, sx: 1, side: 1 }], nose: "front", mouthDx: 0, mouthSx: 1, blush: [{ dx: -42, rx: 13 }, { dx: 42, rx: 13 }] },
  threeQuarter: { eyes: [{ dx: 2, sx: 1, side: -1 }, { dx: 40, sx: 0.86, side: 1 }], nose: "threeQuarter", mouthDx: 24, mouthSx: 0.88, blush: [{ dx: -22, rx: 13 }, { dx: 50, rx: 8 }] },
  side: { eyes: [{ dx: 40, sx: 0.7, side: 1 }], nose: "none", mouthDx: 52, mouthSx: 0.55, blush: [{ dx: 32, rx: 12 }] },
};

/** Face: eyes (with blink), brows, nose, mouth (talking overrides the expression mouth), blush, anger tint. */
export const Face: React.FC<{ expr: Expr; cx?: number; cy?: number; angry?: number; blink?: number; mouth?: number; gid?: string; view?: "front" | "threeQuarter" | "side" }> = ({
  expr, cx = 200, cy = 195, angry = 0, blink = 0, mouth = 0, gid = "f", view = "front",
}) => {
  const L = FACE_LAYOUT[view];
  const my = cy + 42;
  const mx = cx + L.mouthDx;
  const eyes = L.eyes.map(({ dx, sx }, i) => {
    const x = cx + dx;
    const sc = (el: React.ReactNode) => <g key={i} transform={`translate(${x} 0) scale(${sx} 1) translate(${-x} 0)`}>{el}</g>;
    if (expr === "laugh" || expr === "happy_closed" || blink > 0.6)
      return sc(<path d={`M${x - 11},${cy + 2} Q${x},${cy - 10} ${x + 11},${cy + 2}`} fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />);
    if (expr === "focused")
      return sc(
        <g>
          <path d={`M${x - 11},${cy - 1} Q${x},${cy - 6} ${x + 11},${cy - 1} L${x + 9},${cy + 5} Q${x},${cy + 8} ${x - 9},${cy + 5}Z`} fill={INK} />
          <circle cx={x - 2} cy={cy} r={2.2} fill="#fff" />
        </g>,
      );
    if (expr === "surprised")
      return sc(
        <g>
          <ellipse cx={x} cy={cy} rx={10} ry={13} fill="#fff" stroke={INK} strokeWidth={3.5} />
          <circle cx={x + (view === "front" ? 0 : 2)} cy={cy + 1} r={5.5} fill={INK} />
        </g>,
      );
    return sc(
      <g transform={`translate(0 ${cy}) scale(1 ${1 - 0.85 * blink}) translate(0 ${-cy})`}>
        <ellipse cx={x} cy={cy} rx={8} ry={11} fill={INK} />
        <circle cx={x - 2.5 + (view === "front" ? 0 : 1.5)} cy={cy - 4} r={3} fill="#fff" />
      </g>,
    );
  });
  const [yo, yi, ym] = BROWS[expr];
  const brows = L.eyes.map(({ dx, sx, side: s }, i) => {
    const x = cx + dx, w = 13 * sx;
    return <path key={i} d={`M${x - s * w},${cy + yo} Q${x},${cy + ym} ${x + s * w},${cy + yo + (yi - yo) * 0.3}`} fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />;
  });
  let m: React.ReactNode;
  if (mouth > 0.04) {
    m = <ellipse cx={mx} cy={my + 2} rx={(9 + 4 * mouth) * L.mouthSx} ry={2 + 10 * mouth} fill="#8C2F2A" stroke={INK} strokeWidth={3.5} />;
  } else {
    const M: Record<Expr, React.ReactNode> = {
      calm: <path d={`M${cx - 12},${my} Q${cx},${my + 7} ${cx + 12},${my}`} fill="none" stroke={INK} strokeWidth={4.5} strokeLinecap="round" />,
      smile: <path d={`M${cx - 18},${my - 3} Q${cx},${my + 16} ${cx + 18},${my - 3}Z`} fill="#8C2F2A" stroke={INK} strokeWidth={4} strokeLinejoin="round" />,
      happy_closed: <path d={`M${cx - 18},${my - 3} Q${cx},${my + 16} ${cx + 18},${my - 3}Z`} fill="#8C2F2A" stroke={INK} strokeWidth={4} strokeLinejoin="round" />,
      focused: <path d={`M${cx - 10},${my + 1} L${cx + 10},${my + 1}`} stroke={INK} strokeWidth={4.5} strokeLinecap="round" />,
      smug: <path d={`M${cx - 14},${my + 2} Q${cx + 4},${my + 6} ${cx + 18},${my - 6}`} fill="none" stroke={INK} strokeWidth={4.5} strokeLinecap="round" />,
      laugh: (
        <>
          <path d={`M${cx - 22},${my - 6} Q${cx},${my + 26} ${cx + 22},${my - 6}Z`} fill="#8C2F2A" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
          <path d={`M${cx - 12},${my + 9} Q${cx},${my + 3} ${cx + 12},${my + 9}`} fill={BLUSH} />
        </>
      ),
      angry: <path d={`M${cx - 14},${my + 6} Q${cx},${my - 6} ${cx + 14},${my + 6}`} fill="none" stroke={INK} strokeWidth={4.5} strokeLinecap="round" />,
      surprised: <ellipse cx={cx} cy={my + 3} rx={9} ry={12} fill="#8C2F2A" stroke={INK} strokeWidth={4} />,
      stern: <path d={`M${cx - 12},${my + 2} L${cx + 12},${my + 2}`} stroke={INK} strokeWidth={4.5} strokeLinecap="round" />,
    };
    m = <g transform={`translate(${mx} 0) scale(${L.mouthSx} 1) translate(${-cx} 0)`}>{M[expr]}</g>;
  }
  return (
    <g>
      {angry > 0 && (
        <>
          <defs>
            <linearGradient id={`ang-${gid}`} x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor="#E04B3A" stopOpacity={0.55 * angry} />
              <stop offset={0.35 + 0.6 * angry} stopColor="#E04B3A" stopOpacity={0.4 * angry} />
              <stop offset="1" stopColor="#E04B3A" stopOpacity={0} />
            </linearGradient>
          </defs>
          <ellipse cx={cx + (view === "front" ? 0 : 6)} cy={cy} rx={64} ry={72} fill={`url(#ang-${gid})`} />
        </>
      )}
      {L.blush.map(({ dx, rx }, i) => <ellipse key={i} cx={cx + dx} cy={cy + 26} rx={rx} ry={8} fill={BLUSH} opacity={0.45} />)}
      {eyes}
      {brows}
      {L.nose === "front" && <path d={`M${cx + 1},${cy + 12} q-7,13 3,15`} fill="none" stroke={INK} strokeWidth={3.5} strokeLinecap="round" opacity={0.7} />}
      {L.nose === "threeQuarter" && <path d={`M${cx + 25},${cy + 12} q-5,13 5,15`} fill="none" stroke={INK} strokeWidth={3.5} strokeLinecap="round" opacity={0.7} />}
      {m}
    </g>
  );
};

export type CrownKind = "big" | "small" | "modest" | "headband" | "none";
export const Crown: React.FC<{ kind: CrownKind; cx?: number; top?: number; back?: boolean }> = ({ kind, cx = 200, top = 112, back = false }) => {
  if (kind === "big")
    return (
      <g>
        <P d={`M${cx - 62},${top + 30} L${cx - 58},${top - 40} L${cx - 32},${top - 5} L${cx},${top - 72} L${cx + 32},${top - 5} L${cx + 58},${top - 40} L${cx + 62},${top + 30}Z`} fill={GOLD} />
        {!back && <circle cx={cx} cy={top - 8} r={13} fill="#C8283A" stroke={INK} strokeWidth={3.5} />}
        {[-58, 58].map((d) => <circle key={d} cx={cx + d} cy={top - 40} r={7} fill={GOLD_HI} stroke={INK} strokeWidth={3} />)}
        <circle cx={cx} cy={top - 72} r={8} fill={GOLD_HI} stroke={INK} strokeWidth={3} />
        <rect x={cx - 64} y={top + 18} width={128} height={18} rx={6} fill={GOLD_HI} stroke={INK} strokeWidth={3.5} />
      </g>
    );
  if (kind === "small")
    return (
      <g>
        <P d={`M${cx - 48},${top + 26} L${cx - 40},${top - 6} L${cx - 18},${top + 8} L${cx},${top - 26} L${cx + 18},${top + 8} L${cx + 40},${top - 6} L${cx + 48},${top + 26}Z`} fill={GOLD} />
        {!back && <circle cx={cx} cy={top + 6} r={8} fill="#1F8A8A" stroke={INK} strokeWidth={3} />}
        <rect x={cx - 50} y={top + 18} width={100} height={13} rx={5} fill={GOLD_HI} stroke={INK} strokeWidth={3} />
      </g>
    );
  if (kind === "modest")
    return (
      <g>
        <P d={`M${cx - 52},${top + 28} Q${cx},${top - 22} ${cx + 52},${top + 28}Z`} fill={GOLD} />
        {!back && [-2, -1, 0, 1, 2].map((i) => <circle key={i} cx={cx + i * 18} cy={top + 4} r={5.5} fill="#FFF8E8" stroke={INK} strokeWidth={2.5} />)}
        <rect x={cx - 54} y={top + 18} width={108} height={14} rx={5} fill={GOLD_HI} stroke={INK} strokeWidth={3} />
      </g>
    );
  return null;
};

export type HairStyle = "bob" | "ponytail" | "curly" | "crop" | "wavy" | "braids";

export type HeadProps = {
  skin: string; hair?: string; crown?: CrownKind; expr: Expr; style: HairStyle; mustache?: boolean;
  angry?: number; blink?: number; mouth?: number; cx?: number; cy?: number; gid?: string; sway?: number; view?: View;
  crownDrop?: number; crownScale?: number;
};

/** Head in any view. 3/4 and side face screen-right (mirror the placement to face left). */
export const Head: React.FC<HeadProps> = (p) => {
  const v = p.view ?? "front";
  if (v === "threeQuarter") return <Head34 {...p} />;
  if (v === "side") return <HeadSide {...p} />;
  if (v === "back") return <HeadBack {...p} />;
  return <HeadFront {...p} />;
};

const HeadCrown: React.FC<{ kind: CrownKind; cx: number; cy: number; sx?: number; dx?: number; rot?: number; back?: boolean }> = ({ kind, cx, cy, sx = 1, dx = 0, rot = 0, back }) =>
  kind === "headband" ? (
    <g transform={`translate(${cx + dx} 0) scale(${sx} 1) translate(${-cx} 0)`}>
      <rect x={cx - 66} y={cy - 58} width={132} height={14} rx={7} fill={GOLD} stroke={INK} strokeWidth={3.5} />
      {!back && <circle cx={cx} cy={cy - 51} r={9} fill={GOLD_HI} stroke={INK} strokeWidth={3} />}
    </g>
  ) : (
    <g transform={`rotate(${rot} ${cx} ${cy - 70}) translate(${cx + dx} 0) scale(${sx} 1) translate(${-cx} 0)`}>
      <Crown kind={kind} cx={cx} top={cy - 83} back={back} />
    </g>
  );

const Ear: React.FC<{ x: number; y: number; skin: string; ring?: boolean }> = ({ x, y, skin, ring = true }) => (
  <g>
    <ellipse cx={x} cy={y} rx={13} ry={17} fill={skin} stroke={INK} strokeWidth={4} />
    {ring && <circle cx={x + 1} cy={y + 24} r={8} fill="none" stroke={GOLD} strokeWidth={5} />}
  </g>
);

/** Back-hair silhouettes shared by front, 3/4 and back views. */
const backHairFront = (style: HairStyle, cx: number, cy: number, hair: string) => {
  if (style === "curly")
    return (
      <g>
        <P d={`M${cx - 78},${cy - 10} Q${cx - 82},${cy - 94} ${cx},${cy - 94} Q${cx + 82},${cy - 94} ${cx + 78},${cy - 10} L${cx + 78},${cy + 66} L${cx - 78},${cy + 66}Z`} fill={hair} />
        {[-1, 1].flatMap((s) => [0, 1, 2].map((k) => <circle key={`${s}${k}`} cx={cx + s * (64 + k * 4)} cy={cy + 20 + k * 22} r={17} fill={hair} stroke={INK} strokeWidth={4} />))}
      </g>
    );
  if (style === "wavy")
    return (
      <g>
        <P d={`M${cx - 78},${cy - 10} Q${cx - 84},${cy - 94} ${cx},${cy - 94} Q${cx + 84},${cy - 94} ${cx + 78},${cy - 10} L${cx + 80},${cy + 86} L${cx - 80},${cy + 86}Z`} fill={hair} />
        {[-1, 1].map((s) => <circle key={s} cx={cx + s * 74} cy={cy + 92} r={19} fill={hair} stroke={INK} strokeWidth={4} />)}
      </g>
    );
  return <P d={`M${cx - 76},${cy - 10} Q${cx - 80},${cy - 92} ${cx},${cy - 92} Q${cx + 80},${cy - 92} ${cx + 76},${cy - 10} L${cx + 72},${cy + 58} Q${cx + 50},${cy + 70} ${cx + 44},${cy + 40} L${cx - 44},${cy + 40} Q${cx - 50},${cy + 70} ${cx - 72},${cy + 58}Z`} fill={hair} />;
};

const fringePath = (style: HairStyle, cx: number, cy: number) =>
  style === "ponytail"
    ? `M${cx - 68},${cy - 8} Q${cx - 66},${cy - 78} ${cx},${cy - 80} Q${cx + 66},${cy - 78} ${cx + 68},${cy - 8} Q${cx + 54},${cy - 58} ${cx - 6},${cy - 56} Q${cx - 50},${cy - 44} ${cx - 68},${cy - 8}Z`
    : style === "crop"
      ? `M${cx - 68},${cy - 16} Q${cx - 64},${cy - 82} ${cx},${cy - 84} Q${cx + 64},${cy - 82} ${cx + 68},${cy - 16} L${cx + 52},${cy - 42} L${cx + 36},${cy - 32} L${cx + 20},${cy - 46} L${cx},${cy - 34} L${cx - 20},${cy - 46} L${cx - 36},${cy - 32} L${cx - 52},${cy - 42}Z`
      : style === "curly"
        ? `M${cx - 68},${cy - 8} Q${cx - 66},${cy - 78} ${cx},${cy - 80} Q${cx + 66},${cy - 78} ${cx + 68},${cy - 8} Q${cx + 44},${cy - 40} ${cx + 30},${cy - 54} Q${cx + 16},${cy - 40} ${cx},${cy - 54} Q${cx - 16},${cy - 40} ${cx - 30},${cy - 54} Q${cx - 44},${cy - 40} ${cx - 68},${cy - 8}Z`
        : `M${cx - 68},${cy - 8} Q${cx - 66},${cy - 78} ${cx},${cy - 80} Q${cx + 66},${cy - 78} ${cx + 68},${cy - 8} Q${cx + 40},${cy - 48} ${cx + 4},${cy - 50} Q${cx - 34},${cy - 50} ${cx - 68},${cy - 8}Z`;

/** 3/4 head silhouette (facing screen-right): skull toward the back (left), face plane on the right,
 *  nose tip breaking the outline, jaw curving to a chin left of the nose. */
export const HEAD34 = (cx: number, cy: number) =>
  `M${cx - 2},${cy - 74} Q${cx + 56},${cy - 72} ${cx + 64},${cy - 14} Q${cx + 70},${cy + 30} ${cx + 52},${cy + 56} Q${cx + 38},${cy + 74} ${cx + 12},${cy + 74} Q${cx - 36},${cy + 76} ${cx - 60},${cy + 36} Q${cx - 74},${cy - 6} ${cx - 62},${cy - 46} Q${cx - 44},${cy - 74} ${cx - 2},${cy - 74}Z`;

/** Hair cap for the 3/4 head: covers the crown and back, hairline sweeps across the forehead toward the face side. */
const cap34 = (style: HairStyle, cx: number, cy: number) => {
  const back = `M${cx + 58},${cy - 30} Q${cx + 52},${cy - 90} ${cx - 6},${cy - 90} Q${cx - 80},${cy - 86} ${cx - 78},${cy - 8} Q${cx - 76},${cy + 34} ${cx - 64},${cy + 48} L${cx - 54},${cy + 30} Q${cx - 50},${cy - 6} ${cx - 34},${cy - 26}`;
  if (style === "crop")
    return `M${cx + 52},${cy - 36} Q${cx + 46},${cy - 88} ${cx - 6},${cy - 88} Q${cx - 76},${cy - 84} ${cx - 74},${cy - 10} Q${cx - 72},${cy + 26} ${cx - 62},${cy + 38} L${cx - 54},${cy + 22} Q${cx - 50},${cy - 10} ${cx - 36},${cy - 30} L${cx - 20},${cy - 44} L${cx - 4},${cy - 34} L${cx + 12},${cy - 48} L${cx + 26},${cy - 36} L${cx + 40},${cy - 50}Z`;
  if (style === "curly")
    return `${back} Q${cx - 22},${cy - 52} ${cx - 8},${cy - 40} Q${cx + 4},${cy - 58} ${cx + 20},${cy - 44} Q${cx + 34},${cy - 58} ${cx + 44},${cy - 40} Q${cx + 52},${cy - 44} ${cx + 58},${cy - 30}Z`;
  if (style === "ponytail")
    return `${back} Q${cx - 6},${cy - 52} ${cx + 22},${cy - 54} Q${cx + 46},${cy - 52} ${cx + 58},${cy - 30}Z`;
  return `${back} Q${cx - 10},${cy - 46} ${cx + 18},${cy - 50} Q${cx + 44},${cy - 50} ${cx + 58},${cy - 30}Z`;
};

const Head34: React.FC<HeadProps> = ({ skin, hair = "#1E1410", crown = "small", expr, style, mustache, angry = 0, blink = 0, mouth = 0, cx = 200, cy = 195, gid = "h", sway = 0 }) => {
  // hair that hangs behind the head goes toward the back (screen-left)
  let backHair: React.ReactNode = null;
  if (style === "ponytail")
    backHair = (
      <g transform={`rotate(${-sway} ${cx - 64} ${cy - 60})`}>
        <P d={`M${cx - 50},${cy - 76} Q${cx - 120},${cy - 50} ${cx - 108},${cy + 56} Q${cx - 102},${cy + 128} ${cx - 130},${cy + 172} Q${cx - 72},${cy + 152} ${cx - 76},${cy + 60} Q${cx - 72},${cy - 14} ${cx - 38},${cy - 62}Z`} fill={hair} />
      </g>
    );
  else if (style === "bob" || style === "wavy" || style === "curly") backHair = <g transform="translate(-14 0)">{backHairFront(style, cx, cy, hair)}</g>;
  else if (style === "braids")
    backHair = (
      <g>
        <P d={`M${cx + 30},${cy - 4} Q${cx + 48},${cy + 40} ${cx + 40},${cy + 66} L${cx + 56},${cy + 62} Q${cx + 62},${cy + 30} ${cx + 48},${cy - 8}Z`} fill={hair} />
      </g>
    );
  return (
    <g>
      {backHair}
      <P d={HEAD34(cx, cy)} fill={skin} />
      {angry > 0 && (
        <g>
          <defs>
            <linearGradient id={`ang34-${gid}`} x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor="#E04B3A" stopOpacity={0.55 * angry} />
              <stop offset={0.35 + 0.6 * angry} stopColor="#E04B3A" stopOpacity={0.4 * angry} />
              <stop offset="1" stopColor="#E04B3A" stopOpacity={0} />
            </linearGradient>
          </defs>
          <path d={HEAD34(cx, cy)} fill={`url(#ang34-${gid})`} />
        </g>
      )}
      <P d={cap34(style === "braids" ? "bob" : style, cx, cy)} fill={hair} />
      {style === "ponytail" && <P d={`M${cx - 66},${cy - 70} l-16,-12 l-2,20 l-18,6 l18,12Z`} fill="#1F8A8A" sw={3} />}
      {/* the near ear (screen-left), set back toward the skull */}
      <Ear x={cx - 46} y={cy + 8} skin={skin} ring={style !== "braids"} />
      {style === "braids" && (
        <g>
          <P d={`M${cx - 58},${cy + 10} Q${cx - 66},${cy + 80} ${cx - 56},${cy + 142} L${cx - 40},${cy + 142} Q${cx - 44},${cy + 70} ${cx - 40},${cy + 14}Z`} fill={hair} />
          <path d={`M${cx - 48},${cy + 130} l-12,16 m12,-16 l18,14`} stroke="#D2303A" strokeWidth={9} strokeLinecap="round" />
        </g>
      )}
      {style === "braids" ? <circle cx={cx + 22} cy={cy - 30} r={4.5} fill="#C8283A" /> : <path d={`M${cx + 22},${cy - 42} l0,16`} stroke="#C8283A" strokeWidth={6} strokeLinecap="round" />}
      <Face expr={expr} cx={cx} cy={cy} angry={0} blink={blink} mouth={mouth} gid={gid} view="threeQuarter" />
      {mustache && <path d={`M${cx + 6},${cy + 35} Q${cx + 16},${cy + 28} ${cx + 26},${cy + 32} Q${cx + 35},${cy + 28} ${cx + 44},${cy + 35}`} fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />}
      <HeadCrown kind={crown} cx={cx} cy={cy} sx={0.9} dx={12} />
    </g>
  );
};

const PROFILE_HEAD = (cx: number, cy: number) =>
  `M${cx - 6},${cy - 74} Q${cx + 54},${cy - 74} ${cx + 64},${cy - 16} L${cx + 80},${cy + 8} Q${cx + 82},${cy + 14} ${cx + 68},${cy + 16} Q${cx + 70},${cy + 30} ${cx + 64},${cy + 36} Q${cx + 68},${cy + 44} ${cx + 60},${cy + 50} Q${cx + 58},${cy + 70} ${cx + 22},${cy + 74} Q${cx - 50},${cy + 76} ${cx - 68},${cy + 22} Q${cx - 76},${cy - 62} ${cx - 6},${cy - 74}Z`;

const HeadSide: React.FC<HeadProps> = ({ skin, hair = "#1E1410", crown = "small", expr, style, mustache, angry = 0, blink = 0, mouth = 0, cx = 200, cy = 195, gid = "h", sway = 0 }) => {
  let back: React.ReactNode = null;
  if (style === "ponytail")
    back = (
      <g transform={`rotate(${-sway} ${cx - 48} ${cy - 56})`}>
        <P d={`M${cx - 40},${cy - 72} Q${cx - 112},${cy - 40} ${cx - 102},${cy + 60} Q${cx - 98},${cy + 130} ${cx - 124},${cy + 176} Q${cx - 66},${cy + 152} ${cx - 70},${cy + 60} Q${cx - 66},${cy - 10} ${cx - 30},${cy - 58}Z`} fill={hair} />
      </g>
    );
  else if (style === "wavy")
    back = (
      <g>
        <P d={`M${cx + 20},${cy - 88} Q${cx - 80},${cy - 96} ${cx - 82},${cy - 10} L${cx - 80},${cy + 88} L${cx - 20},${cy + 70} Z`} fill={hair} />
        <circle cx={cx - 66} cy={cy + 94} r={19} fill={hair} stroke={INK} strokeWidth={4} />
      </g>
    );
  else if (style === "curly")
    back = (
      <g>
        <P d={`M${cx + 20},${cy - 90} Q${cx - 80},${cy - 96} ${cx - 82},${cy - 10} L${cx - 78},${cy + 64} L${cx - 20},${cy + 50} Z`} fill={hair} />
        {[0, 1, 2].map((k) => <circle key={k} cx={cx - 70 + k * 6} cy={cy + 18 + k * 22} r={17} fill={hair} stroke={INK} strokeWidth={4} />)}
      </g>
    );
  else if (style === "bob") back = <P d={`M${cx + 20},${cy - 88} Q${cx - 80},${cy - 94} ${cx - 80},${cy - 10} L${cx - 74},${cy + 58} Q${cx - 44},${cy + 70} ${cx - 26},${cy + 40} Z`} fill={hair} />;
  else if (style === "braids")
    back = (
      <g>
        <P d={`M${cx - 56},${cy - 4} Q${cx - 76},${cy + 80} ${cx - 64},${cy + 140} L${cx - 48},${cy + 140} Q${cx - 50},${cy + 70} ${cx - 34},${cy + 4}Z`} fill={hair} />
        <path d={`M${cx - 56},${cy + 128} l-12,16 m12,-16 l18,14`} stroke="#D2303A" strokeWidth={9} strokeLinecap="round" />
      </g>
    );
  const cap =
    style === "crop"
      ? `M${cx + 50},${cy - 34} L${cx + 40},${cy - 52} L${cx + 26},${cy - 44} Q${cx + 20},${cy - 88} ${cx - 10},${cy - 86} Q${cx - 74},${cy - 80} ${cx - 72},${cy - 6} Q${cx - 66},${cy + 30} ${cx - 54},${cy + 40} L${cx - 34},${cy + 26} Q${cx - 28},${cy - 10} ${cx - 8},${cy - 24} Q${cx + 22},${cy - 36} ${cx + 50},${cy - 34}Z`
      : `M${cx + 56},${cy - 36} Q${cx + 52},${cy - 88} ${cx - 6},${cy - 88} Q${cx - 78},${cy - 84} ${cx - 78},${cy - 6} Q${cx - 76},${cy + 40} ${cx - 60},${cy + 54} L${cx - 34},${cy + 30} Q${cx - 28},${cy - 10} ${cx - 8},${cy - 24} Q${cx + 22},${cy - 38} ${cx + 56},${cy - 36}Z`;
  return (
    <g>
      {back}
      <P d={PROFILE_HEAD(cx, cy)} fill={skin} />
      {angry > 0 && (
        <g>
          <defs>
            <linearGradient id={`angs-${gid}`} x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor="#E04B3A" stopOpacity={0.55 * angry} />
              <stop offset="1" stopColor="#E04B3A" stopOpacity={0} />
            </linearGradient>
          </defs>
          <path d={PROFILE_HEAD(cx, cy)} fill={`url(#angs-${gid})`} />
        </g>
      )}
      <P d={cap} fill={hair} />
      {style === "ponytail" && <P d={`M${cx - 50},${cy - 64} l-14,-16 l-6,20 l-18,2 l14,16Z`} fill="#1F8A8A" sw={3} />}
      <Ear x={cx - 14} y={cy + 8} skin={skin} ring={style !== "braids"} />
      {style === "braids" ? <circle cx={cx + 56} cy={cy - 28} r={4} fill="#C8283A" /> : <path d={`M${cx + 58},${cy - 40} l0,12`} stroke="#C8283A" strokeWidth={5} strokeLinecap="round" />}
      <Face expr={expr} cx={cx} cy={cy} angry={0} blink={blink} mouth={mouth} gid={gid} view="side" />
      {mustache && <path d={`M${cx + 46},${cy + 33} Q${cx + 58},${cy + 26} ${cx + 70},${cy + 30}`} fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />}
      <HeadCrown kind={crown} cx={cx} cy={cy} sx={0.72} dx={-2} rot={-4} />
    </g>
  );
};

const HeadBack: React.FC<HeadProps> = ({ skin, hair = "#1E1410", crown = "small", style, cx = 200, cy = 195, sway = 0 }) => (
  <g>
    <Ear x={cx - 70} y={cy + 6} skin={skin} ring={style !== "braids"} />
    <Ear x={cx + 70} y={cy + 6} skin={skin} ring={style !== "braids"} />
    {style === "crop" ? (
      <>
        <ellipse cx={cx} cy={cy} rx={68} ry={74} fill={skin} stroke={INK} strokeWidth={4} />
        <P d={`M${cx - 70},${cy + 10} Q${cx - 74},${cy - 86} ${cx},${cy - 86} Q${cx + 74},${cy - 86} ${cx + 70},${cy + 10} Q${cx + 40},${cy + 52} ${cx},${cy + 50} Q${cx - 40},${cy + 52} ${cx - 70},${cy + 10}Z`} fill={hair} />
      </>
    ) : (
      <>
        {style !== "ponytail" && style !== "braids" && backHairFront(style, cx, cy, hair)}
        <ellipse cx={cx} cy={cy - 4} rx={72} ry={80} fill={hair} stroke={INK} strokeWidth={4} />
        <path d={`M${cx},${cy - 80} Q${cx - 6},${cy - 30} ${cx},${cy + 20}`} stroke="#3A2A20" strokeWidth={3} fill="none" opacity={0.6} />
      </>
    )}
    {style === "ponytail" && (
      <g transform={`rotate(${sway} ${cx} ${cy - 58})`}>
        <P d={`M${cx - 16},${cy - 60} Q${cx - 30},${cy + 40} ${cx - 14},${cy + 172} L${cx + 14},${cy + 172} Q${cx + 30},${cy + 40} ${cx + 16},${cy - 60}Z`} fill={hair} />
        <P d={`M${cx - 18},${cy - 66} l36,0 l-6,16 l-24,0Z`} fill="#1F8A8A" sw={3} />
      </g>
    )}
    {style === "braids" &&
      [-1, 1].map((s) => (
        <g key={s}>
          <P d={`M${cx + s * 30 - 12},${cy + 30} Q${cx + s * 40},${cy + 90} ${cx + s * 34},${cy + 150} L${cx + s * 34 + 16},${cy + 150} Q${cx + s * 50},${cy + 90} ${cx + s * 30 + 12},${cy + 30}Z`} fill={hair} />
          <path d={`M${cx + s * 40},${cy + 140} l-10,14 m10,-14 l14,12`} stroke="#D2303A" strokeWidth={8} strokeLinecap="round" />
        </g>
      ))}
    <HeadCrown kind={crown} cx={cx} cy={cy} back />
  </g>
);

const HeadFront: React.FC<HeadProps> = ({ skin, hair = "#1E1410", crown = "small", expr, style, mustache, angry = 0, blink = 0, mouth = 0, cx = 200, cy = 195, gid = "h", sway = 0, crownDrop: p_crownDrop, crownScale: p_crownScale }) => {
  const back: React.ReactNode[] = [];
  if (style === "braids") {
    [-1, 1].forEach((s) => {
      const bx = cx + s * 64;
      back.push(
        <g key={`b${s}`}>
          <P d={`M${bx - 14},${cy - 10} Q${bx + s * 16},${cy + 80} ${bx + s * 6},${cy + 140} L${bx + s * 22},${cy + 140} Q${bx + s * 30},${cy + 70} ${bx + 14},${cy - 10}Z`} fill={hair} />
          <path d={`M${bx + s * 4},${cy + 128} l${s * -12},16 m${s * 12},-16 l${s * 18},14`} stroke="#D2303A" strokeWidth={9} strokeLinecap="round" />
        </g>,
      );
    });
  } else if (style === "ponytail") {
    // the tail sways (cloth-like follow-through) from its tie point
    back.push(
      <g key="pt" transform={`rotate(${sway} ${cx + 76} ${cy - 64})`}>
        <P d={`M${cx + 30},${cy - 78} Q${cx + 124},${cy - 64} ${cx + 114},${cy + 56} Q${cx + 106},${cy + 128} ${cx + 136},${cy + 172} Q${cx + 78},${cy + 152} ${cx + 84},${cy + 60} Q${cx + 88},${cy - 16} ${cx + 20},${cy - 58}Z`} fill={hair} />
      </g>,
      <ellipse key="cap" cx={cx} cy={cy - 6} rx={75} ry={81} fill={hair} stroke={INK} strokeWidth={4} />,
      <P key="tie" d={`M${cx + 76},${cy - 64} l18,-14 l4,22 l18,4 l-16,14Z`} fill="#1F8A8A" sw={3} />,
    );
  } else if (style === "curly") {
    back.push(<P key="c" d={`M${cx - 78},${cy - 10} Q${cx - 82},${cy - 94} ${cx},${cy - 94} Q${cx + 82},${cy - 94} ${cx + 78},${cy - 10} L${cx + 78},${cy + 66} L${cx - 78},${cy + 66}Z`} fill={hair} />);
    [-1, 1].forEach((s) => [0, 1, 2].forEach((k) => back.push(<circle key={`c${s}${k}`} cx={cx + s * (64 + k * 4)} cy={cy + 20 + k * 22} r={17} fill={hair} stroke={INK} strokeWidth={4} />)));
  } else if (style === "crop") {
    back.push(<ellipse key="cr" cx={cx} cy={cy - 8} rx={72} ry={78} fill={hair} stroke={INK} strokeWidth={4} />);
  } else if (style === "wavy") {
    back.push(<P key="w" d={`M${cx - 78},${cy - 10} Q${cx - 84},${cy - 94} ${cx},${cy - 94} Q${cx + 84},${cy - 94} ${cx + 78},${cy - 10} L${cx + 80},${cy + 86} L${cx - 80},${cy + 86}Z`} fill={hair} />);
    [-1, 1].forEach((s) => back.push(<circle key={`w${s}`} cx={cx + s * 74} cy={cy + 92} r={19} fill={hair} stroke={INK} strokeWidth={4} />));
  } else {
    back.push(<P key="bob" d={`M${cx - 76},${cy - 10} Q${cx - 80},${cy - 92} ${cx},${cy - 92} Q${cx + 80},${cy - 92} ${cx + 76},${cy - 10} L${cx + 72},${cy + 58} Q${cx + 50},${cy + 70} ${cx + 44},${cy + 40} L${cx - 44},${cy + 40} Q${cx - 50},${cy + 70} ${cx - 72},${cy + 58}Z`} fill={hair} />);
  }
  const fringe =
    style === "ponytail"
      ? `M${cx - 68},${cy - 8} Q${cx - 66},${cy - 78} ${cx},${cy - 80} Q${cx + 66},${cy - 78} ${cx + 68},${cy - 8} Q${cx + 54},${cy - 58} ${cx - 6},${cy - 56} Q${cx - 50},${cy - 44} ${cx - 68},${cy - 8}Z`
      : style === "crop"
        ? `M${cx - 68},${cy - 16} Q${cx - 64},${cy - 82} ${cx},${cy - 84} Q${cx + 64},${cy - 82} ${cx + 68},${cy - 16} L${cx + 52},${cy - 42} L${cx + 36},${cy - 32} L${cx + 20},${cy - 46} L${cx},${cy - 34} L${cx - 20},${cy - 46} L${cx - 36},${cy - 32} L${cx - 52},${cy - 42}Z`
        : style === "curly"
          ? `M${cx - 68},${cy - 8} Q${cx - 66},${cy - 78} ${cx},${cy - 80} Q${cx + 66},${cy - 78} ${cx + 68},${cy - 8} Q${cx + 44},${cy - 40} ${cx + 30},${cy - 54} Q${cx + 16},${cy - 40} ${cx},${cy - 54} Q${cx - 16},${cy - 40} ${cx - 30},${cy - 54} Q${cx - 44},${cy - 40} ${cx - 68},${cy - 8}Z`
          : `M${cx - 68},${cy - 8} Q${cx - 66},${cy - 78} ${cx},${cy - 80} Q${cx + 66},${cy - 78} ${cx + 68},${cy - 8} Q${cx + 40},${cy - 48} ${cx + 4},${cy - 50} Q${cx - 34},${cy - 50} ${cx - 68},${cy - 8}Z`;
  return (
    <g>
      {back}
      {[-1, 1].map((s) => (
        <g key={s}>
          <ellipse cx={cx + s * 70} cy={cy + 6} rx={13} ry={17} fill={skin} stroke={INK} strokeWidth={4} />
          {style !== "braids" && <circle cx={cx + s * 71} cy={cy + 30} r={8} fill="none" stroke={GOLD} strokeWidth={5} />}
        </g>
      ))}
      <ellipse cx={cx} cy={cy} rx={68} ry={74} fill={skin} stroke={INK} strokeWidth={4} />
      <P d={fringe} fill={hair} />
      {style === "braids" ? <circle cx={cx} cy={cy - 30} r={4.5} fill="#C8283A" /> : <path d={`M${cx},${cy - 42} l0,16`} stroke="#C8283A" strokeWidth={6} strokeLinecap="round" />}
      <Face expr={expr} cx={cx} cy={cy} angry={angry} blink={blink} mouth={mouth} gid={gid} />
      {mustache && <path d={`M${cx - 20},${cy + 35} Q${cx - 9},${cy + 28} ${cx},${cy + 32} Q${cx + 9},${cy + 28} ${cx + 20},${cy + 35}`} fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />}
      {crown === "headband" ? (
        <g>
          <rect x={cx - 66} y={cy - 58} width={132} height={14} rx={7} fill={GOLD} stroke={INK} strokeWidth={3.5} />
          <circle cx={cx} cy={cy - 51} r={9} fill={GOLD_HI} stroke={INK} strokeWidth={3} />
        </g>
      ) : (
        <g transform={`translate(0 ${48 * (p_crownDrop ?? 0)}) rotate(${10 * (p_crownDrop ?? 0)} ${cx} ${cy - 70}) translate(${cx} ${cy - 60}) scale(${p_crownScale ?? 1}) translate(${-cx} ${-(cy - 60)})`}>
          <Crown kind={crown} cx={cx} top={cy - 83} />
        </g>
      )}
    </g>
  );
};
