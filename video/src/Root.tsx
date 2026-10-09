import React from "react";
import { Composition, Html5Audio, staticFile } from "remotion";
import { StoryClock } from "./timing/clock";
import { S6ArjunaSees } from "./sequences/S6ArjunaSees";
import { Turnaround, TURN_ROWS } from "./sequences/Turnaround";
import { Staging } from "./sequences/Staging";
import { CLIPS } from "./sequences/ReviewClips";
import { S1S2Opening } from "./sequences/S1S2Opening";
import { Episode } from "./episode/Episode";

const FPS = 30;
/** Hero proof: L25–L27, "गुरु द्रोणाचार्य ने पूछा…" → "…चिड़िया की आँख दिखाई दे रही है।" */
export const HERO = { from: 108.3, to: 120.9 };

const HeroProof: React.FC = () => (
  <StoryClock offset={HERO.from}>
    <Html5Audio src={staticFile("narration.mp3")} trimBefore={Math.round(HERO.from * FPS)} />
    <S6ArjunaSees />
  </StoryClock>
);

const TurnA: React.FC = () => <Turnaround rows={TURN_ROWS.A} extras />;
const TurnB: React.FC = () => <Turnaround rows={TURN_ROWS.B} extras />;

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="HeroProof" component={HeroProof} durationInFrames={Math.round((HERO.to - HERO.from) * FPS)} fps={FPS} width={1080} height={1920} />
    {/* QA sheets: character turnarounds rendered by the engine */}
    <Composition id="TurnaroundA" component={TurnA} durationInFrames={1} fps={FPS} width={2180} height={2520} />
    <Composition id="TurnaroundB" component={TurnB} durationInFrames={1} fps={FPS} width={2180} height={2520} />
    <Composition id="Staging" component={Staging} durationInFrames={1} fps={FPS} width={2240} height={2040} />
    {/* THE EPISODE: full 2:49 at 1080×1920 */}
    <Composition id="Episode" durationInFrames={Math.ceil(168.674 * FPS)} fps={FPS} width={1080} height={1920}
      component={() => (
        <StoryClock offset={0}>
          <Html5Audio src={staticFile("narration.mp3")} />
          <Episode />
        </StoryClock>
      )} />
    {/* 10-second opening clip: designed transitions + motivated movement (L1 end → L2) */}
    <Composition id="Opening10" durationInFrames={10 * FPS} fps={FPS} width={1080} height={1920}
      component={() => (
        <StoryClock offset={3.6}>
          <Html5Audio src={staticFile("narration.mp3")} trimBefore={Math.round(3.6 * FPS)} />
          <S1S2Opening />
        </StoryClock>
      )} />
    {/* 5-second review clips drawn at random from five sequences */}
    {CLIPS.map(({ id, from, C }) => (
      <Composition key={id} id={id} durationInFrames={5 * FPS} fps={FPS} width={1080} height={1920}
        component={() => (
          <StoryClock offset={from}>
            <Html5Audio src={staticFile("narration.mp3")} trimBefore={Math.round(from * FPS)} />
            <C />
          </StoryClock>
        )} />
    ))}
  </>
);
