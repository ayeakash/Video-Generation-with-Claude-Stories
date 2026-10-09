// One clock for the whole episode. Every scene reads story time (seconds into the FROZEN narration),
// so a scene renders identically inside the hero proof or the full video.
import React, { createContext, useContext } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import phrases from "../data/phrases.json";

type Word = { word: string; start: number; end: number };
type Line = { line: number; text: string; start: number; end: number; words: Word[] };

export const LINES = (phrases as unknown as { lines: Line[] }).lines;

const OffsetCtx = createContext(0);

/** Wrap a composition that starts `offset` seconds into the narration. */
export const StoryClock: React.FC<{ offset: number; children: React.ReactNode }> = ({ offset, children }) => (
  <OffsetCtx.Provider value={offset}>{children}</OffsetCtx.Provider>
);

/** Current story time in seconds (frozen-audio timeline). */
export const useStoryTime = (): number => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return useContext(OffsetCtx) + frame / fps;
};

export const line = (n: number): Line => {
  const l = LINES.find((x) => x.line === n);
  if (!l) throw new Error(`line ${n} missing`);
  return l;
};

/** The k-th occurrence (0-based) of `text` in line n. Throws if the script doesn't contain it. */
export const word = (n: number, text: string, k = 0): Word => {
  const ws = line(n).words.filter((w) => w.word === text);
  if (!ws[k]) throw new Error(`word "${text}" #${k} not in line ${n}`);
  return ws[k];
};

/** Mouth openness 0..1 for a speaker voicing these lines: open only inside word spans. */
export const mouthOpen = (t: number, lines: number[]): number => {
  for (const n of lines) {
    for (const w of line(n).words) {
      if (t >= w.start && t < w.end) {
        const p = (t - w.start) / Math.max(0.08, w.end - w.start);
        const env = Math.sin(Math.PI * Math.min(1, p));
        const syl = 0.55 + 0.45 * Math.abs(Math.sin(2 * Math.PI * 5.5 * (t - w.start)));
        return Math.min(1, env * syl);
      }
    }
  }
  return 0;
};
