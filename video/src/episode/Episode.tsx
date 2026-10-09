// The whole episode: one story clock, scenes in order. Each scene starts exactly where the previous one ends
// (same camera / same frame), so the cuts are designed transitions, not jumps.
import React from "react";
import { useStoryTime } from "../timing/clock";
import { S1S2Opening } from "../sequences/S1S2Opening";
import { S6ArjunaSees } from "../sequences/S6ArjunaSees";
import { SceneTree, SceneDuryodhana, SceneYudhishthira, SceneImpossible, SceneArjuna } from "./ScenesA";
import { SceneShot, SceneLesson, SceneToday } from "./ScenesB";

export const SCENES: { id: string; from: number; C: React.FC }[] = [
  { id: "A opening (L1–L2)", from: 0, C: S1S2Opening },
  { id: "B tree + challenge (L3–L4)", from: 14.12, C: SceneTree },
  { id: "C Duryodhana (L5–L13)", from: 25.05, C: SceneDuryodhana },
  { id: "D Yudhishthira (L14–L17)", from: 68.3, C: SceneYudhishthira },
  { id: "E impossible? (L18–L19)", from: 82.62, C: SceneImpossible },
  { id: "F Arjuna steps up (L20–L24)", from: 90.97, C: SceneArjuna },
  { id: "G Arjuna sees (L25–L27)", from: 107.25, C: S6ArjunaSees },
  { id: "H the shot (L28–L33)", from: 120.9, C: SceneShot },
  { id: "I the lesson (L34–L36)", from: 144.4, C: SceneLesson },
  { id: "J today (L37–L38)", from: 159.5, C: SceneToday },
];

export const Episode: React.FC = () => {
  const t = useStoryTime();
  let k = 0;
  for (let i = 0; i < SCENES.length; i++) if (t >= SCENES[i].from) k = i;
  const C = SCENES[k].C;
  return <C />;
};
