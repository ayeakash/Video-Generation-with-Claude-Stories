// QA sheet (not part of the episode): the two camera directions on the floor plan, rendered by the engine.
// Left: C1 main stage, looking north at the firing line (target on the right). Right: C2 reverse, looking south at the ashram.
import React from "react";
import { Sky, Hills, FarTrees, Ground, HORIZON } from "../backgrounds/Gurukul";
import { AshramBackdrop } from "../backgrounds/Ashram";
import { Prince, place } from "../characters/Prince";
import { Drona } from "../characters/Drona";
import { Tree, WoodenBird, treeEyeLocal } from "../graphics/props";
import { svgM, mul, T, S } from "../utils/motion";

const label = (x: number, y: number, t: string) => <text x={x} y={y} fontFamily="Arial" fontSize={40} fill="#3A2418">{t}</text>;

export const Staging: React.FC = () => {
  const eye = treeEyeLocal(330);
  const tree = mul(T(790 + 0.6 * eye[0], 1150 - 0.6 * eye[1]), S(-0.6, 0.6));
  return (
    <svg width={2240} height={2040} viewBox="0 0 2240 2040">
      <rect width={2240} height={2040} fill="#F7EEDC" />
      {label(40, 60, "C1 main stage: looking north, target on the RIGHT (all archery)")}
      {label(1180, 60, "C2 reverse: looking south at the ashram (no archery); sun flips side")}
      <svg x={40} y={100} width={1080} height={1920} viewBox="0 0 1080 1920">
        <defs><filter id="soft"><feGaussianBlur stdDeviation={3} /></filter></defs>
        <Sky /><Hills /><FarTrees /><Ground />
        <g transform={svgM(tree)}><Tree reach={330} bird={<WoodenBird />} /></g>
        <g transform={svgM(place(158, 1585, 0.72))}><Drona view="threeQuarter" pose="beard" /></g>
        <g transform={svgM(place(420, 1860, 1.03, true))}><Prince look="arjuna" pose="aim" expr="focused" lean={16} tRot={22} /></g>
        <g filter="url(#soft)">
          <g transform={svgM(place(-20, 2330, 1.3))}><Prince look="yudhishthira" view="back" /></g>
          <g transform={svgM(place(1040, 2360, 1.32))}><Prince look="bhima" view="back" /></g>
        </g>
      </svg>
      <svg x={1160} y={100} width={1080} height={1920} viewBox="0 0 1080 1920">
        <Sky sunX={330} /><Ground /><AshramBackdrop />
        <g transform={svgM(place(190, 1720, 0.92))}><Prince look="duryodhana" view="threeQuarter" expr="smug" /></g>
        <g transform={svgM(place(450, 1700, 0.9))}><Prince look="yudhishthira" expr="calm" /></g>
        <g transform={svgM(place(700, 1720, 0.92, true))}><Prince look="bhima" view="threeQuarter" expr="smile" /></g>
        <g transform={svgM(place(920, 1690, 0.88, true))}><Prince look="arjuna" view="threeQuarter" expr="calm" /></g>
      </svg>
      <rect x={40} y={100} width={1080} height={1920} fill="none" stroke="#3A2418" strokeWidth={4} />
      <rect x={1160} y={100} width={1080} height={1920} fill="none" stroke="#3A2418" strokeWidth={4} />
      <text x={600} y={HORIZON} fontSize={1} />
    </svg>
  );
};
