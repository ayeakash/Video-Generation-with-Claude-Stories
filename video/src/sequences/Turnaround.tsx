// QA sheet (not part of the episode): every character in front / 3/4 / side / back, rendered by the engine itself,
// plus extra poses (walk, namaste, back-view aim). Labels are for the team only.
import React from "react";
import { Prince, place, LookName } from "../characters/Prince";
import { Drona } from "../characters/Drona";
import { Girl } from "../characters/Girl";
import { svgM } from "../utils/motion";
import { View } from "../characters/parts";

const VIEWS: View[] = ["front", "threeQuarter", "side", "back"];
const LABEL: Record<View, string> = { front: "front", threeQuarter: "3/4", side: "side", back: "back" };
const CELL_W = 420, CELL_H = 800;

const cell = (who: string, v: View): React.ReactNode => {
  if (who === "drona") return <Drona view={v} pose={v === "front" || v === "threeQuarter" ? "palm" : "rest"} />;
  if (who === "girl") return <Girl view={v} expr={v === "back" ? "calm" : "smile"} holdBall={v === "front"} />;
  return <Prince look={who as LookName} view={v} expr={who === "duryodhana" ? "smug" : "calm"} bowAtSide={who === "arjuna" && v === "front"} />;
};

export const TURN_ROWS = { A: ["drona", "arjuna", "yudhishthira"], B: ["duryodhana", "bhima", "girl"] } as const;

export const Turnaround: React.FC<{ rows: readonly string[]; extras?: boolean }> = ({ rows, extras }) => (
  <svg width={CELL_W * 5 + 80} height={CELL_H * rows.length + 120} viewBox={`0 0 ${CELL_W * 5 + 80} ${CELL_H * rows.length + 120}`}>
    <rect width="100%" height="100%" fill="#F7EEDC" />
    {VIEWS.map((v, i) => (
      <text key={v} x={80 + i * CELL_W + CELL_W / 2} y={70} fontFamily="Arial" fontSize={36} textAnchor="middle" fill="#3A2418">{LABEL[v]}</text>
    ))}
    <text x={80 + 4 * CELL_W + CELL_W / 2} y={70} fontFamily="Arial" fontSize={36} textAnchor="middle" fill="#3A2418">{extras ? "action" : ""}</text>
    {rows.map((who, r) => (
      <g key={who}>
        <text x={40} y={120 + r * CELL_H + CELL_H / 2} fontFamily="Arial" fontSize={30} fill="#3A2418" transform={`rotate(-90 40 ${120 + r * CELL_H + CELL_H / 2})`} textAnchor="middle">{who}</text>
        {VIEWS.map((v, i) => (
          <g key={v} transform={svgM(place(80 + i * CELL_W + CELL_W / 2, 100 + r * CELL_H + 760, 0.95))}>{cell(who, v)}</g>
        ))}
        <g transform={svgM(place(80 + 4 * CELL_W + CELL_W / 2, 100 + r * CELL_H + 760, 0.95))}>
          {who === "drona" && <Drona view="side" pose="beard" stroke={0.25} lean={4} />}
          {who === "arjuna" && <g transform="translate(-60 0)"><Prince look="arjuna" pose="aim" view="back" lean={14} tRot={18} /></g>}
          {who === "yudhishthira" && <Prince look="yudhishthira" view="threeQuarter" namaste={1} expr="smile" />}
          {who === "duryodhana" && <Prince look="duryodhana" view="side" walk={0.25} expr="smug" />}
          {who === "bhima" && <Prince look="bhima" view="threeQuarter" walk={0.25} expr="smile" />}
          {who === "girl" && <Girl view="side" walk={0.25} expr="focused" />}
        </g>
      </g>
    ))}
  </svg>
);
