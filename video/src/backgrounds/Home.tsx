// HOME set (L37–38): the girl's room today. The basket sits on the RIGHT, the same screen side as the bird (visual rhyme).
import React from "react";
import { INK, P } from "../characters/parts";
import { Kite } from "../graphics/props";
import { Prince } from "../characters/Prince";

export const FLOOR_Y = 1500;

export const Room: React.FC<{ kiteX: number }> = ({ kiteX }) => (
  <g>
    <rect x={-1500} y={-1500} width={4080} height={1500 + FLOOR_Y} fill="#F6E3C2" />
    <rect x={-1500} y={FLOOR_Y - 260} width={4080} height={260} fill="#EBCB9C" />
    <path d={`M-1500,${FLOOR_Y - 260} L2580,${FLOOR_Y - 260}`} stroke="#C9A06A" strokeWidth={6} />
    {/* window with sky and a kite */}
    <g>
      <rect x={560} y={420} width={420} height={460} fill="#CFE6EA" stroke={INK} strokeWidth={6} />
      <clipPath id="win"><rect x={560} y={420} width={420} height={460} /></clipPath>
      <g clipPath="url(#win)">
        <circle cx={900} cy={520} r={46} fill="#F7E3A0" />
        <path d="M560,800 Q700,740 820,790 Q900,760 980,790 L980,880 L560,880Z" fill="#9CC48B" />
        <g transform={`translate(${kiteX} 600) rotate(-12) scale(0.9)`}><Kite /></g>
      </g>
      <path d="M770,420 L770,880 M560,650 L980,650" stroke={INK} strokeWidth={6} />
      <rect x={540} y={872} width={460} height={22} rx={6} fill="#B98252" stroke={INK} strokeWidth={4} />
    </g>
    {/* shelf with books and the Arjuna storybook */}
    <g>
      <rect x={90} y={610} width={360} height={18} fill="#A86B3C" stroke={INK} strokeWidth={4} />
      {[["#3B5BA5", 110, 120], ["#D2303A", 140, 140], ["#4E9A5E", 172, 112]].map(([c, x, h], i) => (
        <rect key={i} x={x as number} y={610 - (h as number)} width={28} height={h as number} fill={c as string} stroke={INK} strokeWidth={3} />
      ))}
      <g transform="translate(250 452)">
        <rect x={0} y={0} width={150} height={158} rx={6} fill="#F7D774" stroke={INK} strokeWidth={4} />
        <circle cx={75} cy={92} r={52} fill="#CFE6EA" />
        <g transform="translate(26 26) scale(0.22)"><Prince look="arjuna" expr="smile" shadow={false} bowAtSide /></g>
      </g>
    </g>
    {/* floor + mat */}
    <rect x={-1500} y={FLOOR_Y} width={4080} height={1500} fill="#C99B6B" />
    {[0, 1, 2, 3, 4, 5, 6].map((k) => <path key={k} d={`M-1500,${FLOOR_Y + 60 + k * 90} L2580,${FLOOR_Y + 60 + k * 90}`} stroke="#B5875A" strokeWidth={3} />)}
    <P d={`M40,${FLOOR_Y + 120} L700,${FLOOR_Y + 120} L760,${FLOOR_Y + 300} L-20,${FLOOR_Y + 300}Z`} fill="#D9734A" />
    <path d={`M60,${FLOOR_Y + 160} L715,${FLOOR_Y + 160} M40,${FLOOR_Y + 260} L745,${FLOOR_Y + 260}`} stroke="#F2C230" strokeWidth={6} />
  </g>
);
