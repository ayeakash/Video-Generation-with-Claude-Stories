// Scenes H–J (L28 → end).
import React from "react";
import { useStoryTime, word, line, mouthOpen } from "../timing/clock";
import { camAt, Cam, Layer, W, H, toScreen } from "../camera/Camera";
import { Prince, place, aimFrames, AIM, LookName } from "../characters/Prince";
import { Drona } from "../characters/Drona";
import { Girl, PaperBall } from "../characters/Girl";
import { WoodenBird, FocusRing, Basket, BIRD_BASE } from "../graphics/props";
import { DriftClouds, FallingLeaves, Leaf, Squirrel } from "../graphics/ambient";
import { Sky, HORIZON } from "../backgrounds/Gurukul";
import { Room, FLOOR_Y } from "../backgrounds/Home";
import { POVWindow, POV_CENTER } from "../formats/POVWindow";
import {
  C1World, C2World, Watchers, ArcherAim, archerPlace, LINEUP, DRONA_C1, DRONA_C1_FACE, AIM_POSE, softLinear, P2, PV_EYE, PV_TREE_M,
} from "../sequences/shared";
import { ClipLesson } from "../sequences/ReviewClips";
import { Frame, Ripple, Sparkle, Tok, flipX, XFade } from "./kit";
import { apply, blink, clamp, ease, lerp, progress, spring, MATERIAL, svgM, rng } from "../utils/motion";
import { TREE, Tree } from "../graphics/props";

// ======================= H · L28–L33: the smile, "चलाओ", the release, the flight, the hit, amazement =======================
export const SceneShot: React.FC = () => {
  const t = useStoryTime();
  const L28 = line(28), wMuskan = word(28, "मुस्कान"), L29 = line(29), wPhir = word(29, "फिर"), wChalao = word(29, "चलाओ");
  const L30 = line(30), L31 = line(31), wHawa = word(31, "हवा"), wCheerta = word(31, "चीरता"), L32 = line(32), wAur = word(32, "और"), wSeedha = word(32, "सीधा"), wAankh = word(32, "आँख");
  const L33 = line(33), wHairan = word(33, "हैरान");
  const A: LookName = "arjuna";
  const { toChar } = aimFrames(AIM_POSE.lean, AIM_POSE.tRot);
  const M = archerPlace(A);
  const anchor = apply(M, toChar(AIM.anchor)), tip = apply(M, toChar(AIM.arrowTip));
  const dir: P2 = [(tip[0] - anchor[0]) / Math.hypot(tip[0] - anchor[0], tip[1] - anchor[1]), (tip[1] - anchor[1]) / Math.hypot(tip[0] - anchor[0], tip[1] - anchor[1])];
  const dFace = DRONA_C1_FACE;
  const release = L30.start;
  const SKY_IN = release + 0.32;     // cut to the flight BEFORE the arrow could reach the bird in the wide shot
  const RIPPLE_FILL = { start: L32.end + 0.45, end: L33.start + 0.05 };

  // ---- C1: the smile → two-shot → release (camera pans with the arrow) ----
  const POV_CLOSE = { start: 120.9, end: 121.45 };
  const smileCam: Cam = { cx: dFace[0] + 30, cy: dFace[1] + 40, z: 2.6 };
  const cam = camAt([
    { t: 120.9, cam: smileCam },
    { t: L28.end + 0.2, cam: { ...smileCam, z: 2.7 }, ease: ease.linear },
    { t: L29.start + 0.1, cam: { cx: 360, cy: 1270, z: 1.45 }, ease: ease.inOut },
    { t: release - 0.05, cam: { cx: 380, cy: 1280, z: 1.48 }, ease: ease.linear },
    { t: SKY_IN, cam: { cx: 620, cy: 1220, z: 1.4 }, ease: ease.in },     // pan with the arrow
  ], t);
  const smile = spring(t - wMuskan.start, MATERIAL.glow);
  const nod = t > wPhir.start && t < wPhir.start + 0.8 ? 6 * Math.sin(Math.PI * progress(t, wPhir.start, wPhir.start + 0.8)) : 0;
  const palm = spring(t - wChalao.start, MATERIAL.body);
  const released = t >= release;
  const drawNow = released ? clamp(1 - (t - release) / 0.07) : 1;
  const fly = Math.max(0, t - release - 0.05);
  const arrowAt: P2 = [anchor[0] + dir[0] * (fly * 600 + 60), anchor[1] + dir[1] * (fly * 600 + 60)];
  const povClose = progress(t, POV_CLOSE.start, POV_CLOSE.end);

  // ---- SKY flight (side-on, flying right; background slows into slow-motion on the holds) ----
  const vAt = (tt: number) => (tt < L31.start ? 2200 : tt < L31.end ? lerp(1500, 520, progress(tt, L31.start, L31.end)) : tt < wSeedha.start ? 220 : 900);
  let travel = 0;
  for (let tt = SKY_IN; tt < t; tt += 1 / 60) travel += vAt(tt) / 60;
  const ARROW_SCR: P2 = [330, 960], ARROW_LEN = 300;
  const hitT = wAankh.start;
  const approachU = progress(t, wSeedha.start - 0.2, hitT);
  const eyeX = lerp(1450, ARROW_SCR[0] + ARROW_LEN + 18, ease.inOut(approachU));
  const hit = t >= hitT;
  const afterHit = t - hitT;
  const rock = hit ? 7 * Math.exp(-afterHit * 2.4) * Math.sin(afterHit * 14) : 0;
  const BIRD_S = 2.1;
  const birdOrigin: P2 = [eyeX + 80 * BIRD_S, ARROW_SCR[1] + 56 * BIRD_S]; // mirrored: eye at local (80,-56) → screen-left of origin
  const windO = Math.sin(Math.PI * progress(t, wHawa.start - 0.1, wCheerta.end + 0.4));

  // ---- C2 amazement ----
  const fillU = progress(t, RIPPLE_FILL.start, RIPPLE_FILL.end);
  const inC2 = t >= RIPPLE_FILL.end - 0.15;
  const jaw = (i: number) => spring(t - (wHairan.start + i * 0.12), { stiffness: 160, damping: 12 });
  const peek = progress(t, wHairan.end + 0.2, wHairan.end + 0.4);

  if (inC2) {
    return (
      <Frame>
        <C2World cam={{ cx: 540, cy: 1250, z: 1.0 }}>
          <g transform="translate(860 1012) scale(0.45)"><Squirrel jaw={jaw(5)} /></g>
          {LINEUP.map((p, i) => {
            const turnAway = p.look === "duryodhana" ? peek : 0;
            return (
              <g key={p.look} transform={turnAway > 0 ? flipX(p.x, turnAway) : undefined}>
                <g transform={svgM(place(p.x, 1760, 0.9, p.mirror))}>
                  <Prince look={p.look} view={p.view} expr={t > wHairan.start + i * 0.12 ? (p.look === "duryodhana" && peek > 0.5 ? "angry" : "surprised") : "calm"}
                    angry={p.look === "duryodhana" ? 0.3 * peek : 0} headTilt={-6 * jaw(i)} blink={blink(t, 40 + i)} />
                </g>
              </g>
            );
          })}
        </C2World>
        {fillU < 1 && <circle cx={540} cy={960} r={lerp(400, 1400, fillU)} fill="none" stroke="#FFD34D" strokeWidth={lerp(60, 0, fillU)} opacity={1 - fillU} />}
        {t < RIPPLE_FILL.end + 0.35 && <rect width={W} height={H} fill="#FFE7A8" opacity={0.6 * (1 - progress(t, RIPPLE_FILL.end - 0.15, RIPPLE_FILL.end + 0.35))} />}
      </Frame>
    );
  }
  if (t >= SKY_IN) {
    const bgX = -travel;
    return (
      <Frame>
        <Sky />
        <g transform={`translate(${(bgX * 0.25) % 2000} 0)`}><DriftClouds t={0} tint="#FFF6E6" y0={300} /></g>
        <g transform={`translate(${((bgX * 0.25) % 2000) + 2000} 0)`}><DriftClouds t={0} tint="#FFF6E6" y0={300} /></g>
        <rect x={0} y={1330} width={W} height={H - 1330} fill="#D9A066" />
        <g transform={`translate(${(bgX * 0.5) % 1600} 0)`}>
          {[-1600, -900, -300, 300, 900, 1500, 2100].map((x, i) => <path key={i} d={`M${x},1440 Q${x + 300},1300 ${x + 600},1440Z`} fill="#E7C08A" />)}
        </g>
        <g transform={`translate(${(bgX * 1.2) % 1400} 0)`}>
          {[-1400, -700, 0, 700, 1400].map((x, i) => (
            <path key={i} d={`M${x + 100},1700 Q${x + 110},1640 ${x + 124},1700 Q${x + 134},1620 ${x + 146},1700Z`} fill="#7FA35A" stroke="#3A2418" strokeWidth={3} />
          ))}
        </g>
        {/* wind parting around the tip */}
        {windO > 0 && [-1, 1].map((s) => [0, 1, 2].map((k) => (
          <path key={`${s}${k}`} d={`M${ARROW_SCR[0] + ARROW_LEN + 30 - k * 120},${ARROW_SCR[1] + s * (20 + k * 18)} q-80,${s * 30} -220,${s * 40}`} stroke="#FFFFFF" strokeWidth={6} fill="none" strokeLinecap="round" opacity={windO * (0.8 - k * 0.2)} />
        )))}
        {windO > 0 && <FallingLeaves t={t * 3} count={3} x0={ARROW_SCR[0] + 100} width={300} top={700} fall={500} seed={21} />}
        {/* branch + bird enter from the right */}
        {approachU > 0 && (
          <g>
            <path d={`M${birdOrigin[0] - 160},${birdOrigin[1] + BIRD_BASE * BIRD_S} L2400,${birdOrigin[1] + BIRD_BASE * BIRD_S}`} stroke="#3A2418" strokeWidth={60} strokeLinecap="round" />
            <path d={`M${birdOrigin[0] - 160},${birdOrigin[1] + BIRD_BASE * BIRD_S} L2400,${birdOrigin[1] + BIRD_BASE * BIRD_S}`} stroke="#8A5530" strokeWidth={50} strokeLinecap="round" />
            <g transform={`translate(${birdOrigin[0]} ${birdOrigin[1]}) scale(${-BIRD_S} ${BIRD_S})`}><WoodenBird rock={rock} arrowIn={hit} /></g>
          </g>
        )}
        {!hit && (
          <g transform={`translate(${ARROW_SCR[0]} ${ARROW_SCR[1] + 6 * Math.sin(t * 5)})`}>
            <path d={`M-260,0 L-20,0`} stroke="#FFD34D" strokeWidth={10} opacity={0.35} strokeLinecap="round" />
            <path d={`M0,0 L${ARROW_LEN},0`} stroke="#3A2418" strokeWidth={12} strokeLinecap="round" />
            <path d={`M0,0 L${ARROW_LEN},0`} stroke="#C89A5E" strokeWidth={6} strokeLinecap="round" />
            <path d={`M${ARROW_LEN - 6},-11 L${ARROW_LEN + 28},0 L${ARROW_LEN - 6},11Z`} fill="#8E9AA6" stroke="#3A2418" strokeWidth={3} />
            <path d="M2,-4 L54,-4 L36,-22 L-12,-22Z M2,4 L54,4 L36,22 L-12,22Z" fill="#F08A3C" stroke="#3A2418" strokeWidth={3} />
          </g>
        )}
        <Tok x={ARROW_SCR[0] + ARROW_LEN + 18} y={ARROW_SCR[1] - 20} u={progress(t, hitT, hitT + 0.45)} />
        <Ripple x={ARROW_SCR[0] + ARROW_LEN + 18} y={ARROW_SCR[1]} u={progress(t, hitT + 0.05, hitT + 1.0)} max={460} />
        {hit && [0, 1, 2, 3].map((k) => {
          const a = (k / 4) * Math.PI * 2 + 0.4, d = 40 + 160 * clamp(afterHit / 0.8);
          return <Sparkle key={k} x={ARROW_SCR[0] + ARROW_LEN + 18 + Math.cos(a) * d} y={ARROW_SCR[1] + Math.sin(a) * d} s={0.6} o={1 - clamp(afterHit / 0.9)} />;
        })}
        {fillU > 0 && <circle cx={540} cy={960} r={lerp(80, 1400, ease.in(fillU))} fill="#FFE7A8" opacity={0.6 * fillU} />}
      </Frame>
    );
  }
  // C1
  const dEyeScr = toScreen(cam, [dFace[0] - 4, dFace[1] - 10]);
  return (
    <Frame>
      <C1World cam={cam} foreground={<Watchers />}>
        <g transform={svgM(place(DRONA_C1.x, DRONA_C1.y, DRONA_C1.s))}>
          <Drona view="threeQuarter" pose={t > wChalao.start - 0.2 ? "palm" : "beard"} raise={palm} smile={smile} headTilt={nod}
            stroke={0.2} mouth={mouthOpen(t, [29])} blink={blink(t, 11)} />
        </g>
        <ArcherAim look={A} expr="focused" draw={drawNow} />
        {released && fly < 1 && (
          <g transform={`translate(${arrowAt[0]} ${arrowAt[1]}) rotate(${(Math.atan2(dir[1], dir[0]) * 180) / Math.PI})`}>
            <path d="M-220,0 L-10,0" stroke="#FFD34D" strokeWidth={8} opacity={0.35} strokeLinecap="round" />
            <path d="M0,0 L120,0" stroke="#3A2418" strokeWidth={10} strokeLinecap="round" />
            <path d="M0,0 L120,0" stroke="#C89A5E" strokeWidth={5} strokeLinecap="round" />
            <path d="M116,-9 L142,0 L116,9Z" fill="#8E9AA6" stroke="#3A2418" strokeWidth={3} />
          </g>
        )}
        {released && fly < 0.5 && [-1, 1].map((s) => <path key={s} d={`M${anchor[0] + 30},${anchor[1] + s * 22} l70,${s * 18}`} stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" opacity={1 - fly * 2} />)}
      </C1World>
      {povClose < 1 && (
        <g>
          <rect width={W} height={H} fill="#2A1B12" opacity={1 - ease.inOut(clamp((povClose - 0.3) / 0.7))} />
          <POVWindow r={lerp(300, 10, ease.in(povClose))} cx={lerp(POV_CENTER[0], dEyeScr[0], ease.inOut(povClose))} cy={lerp(POV_CENTER[1], dEyeScr[1], ease.inOut(povClose))} id="close-arj"
            open={1 - ease.inOut(clamp((povClose - 0.5) / 0.5))}>
            <rect width={W} height={H} fill="#E9D7B5" />
            <g transform={`translate(${POV_CENTER[0]} ${POV_CENTER[1]}) scale(8.7) translate(${-PV_EYE[0]} ${-PV_EYE[1]})`}>
              <g transform={svgM(PV_TREE_M)}><g transform={`translate(${430 - 52} ${-352 - BIRD_BASE * TREE.birdScale}) scale(${TREE.birdScale})`}><WoodenBird /></g></g>
            </g>
          </POVWindow>
          {/* the locked ring rides the closing window down into Drona's eye */}
          {(() => {
            const c: P2 = [lerp(POV_CENTER[0], dEyeScr[0], ease.inOut(povClose)), lerp(POV_CENTER[1], dEyeScr[1], ease.inOut(povClose))];
            const rr = lerp(15 * TREE.birdScale * 1.7 * 8.7 * 1.45, 6, ease.in(povClose));
            return <FocusRing cx={c[0]} cy={c[1]} r={rr} drawn={1} width={lerp(12, 3, povClose)} />;
          })()}
        </g>
      )}
    </Frame>
  );
};
void Tree; void Layer; void HORIZON;

// ======================= I · L34–L36: the lesson; strength and pride are not enough; unbreakable focus =======================
export const SceneLesson: React.FC = () => {
  const t = useStoryTime();
  const L35 = line(35), wTakat = word(35, "ताकत"), wGhamand = word(35, "घमंड"), wNahin = word(35, "नहीं");
  const L36 = line(36), wAtoot = word(36, "अटूट"), wEkagrata = word(36, "एकाग्रता");
  if (t < L35.start - 0.4) return <ClipLesson />;
  const dis = progress(t, L35.start - 0.4, L35.start + 0.1);
  const lift = spring(t - wTakat.start, MATERIAL.body);
  const puff = spring(t - wGhamand.start, MATERIAL.swagger) * (1 - ease.inOut(progress(t, wNahin.end + 0.2, wNahin.end + 0.8)));
  const grey = ease.inOut(progress(t, wNahin.start, wNahin.end + 0.2));
  const part = ease.inOut(progress(t, wNahin.end + 0.3, L36.start + 0.3));
  // Arjuna's eye close-up revealed between them
  const A = { x: 540, y: 2400 };
  const aEye: P2 = [A.x - 28, A.y - (730 - 195)];
  const zEye = 11;
  const camA: Cam = { cx: aEye[0], cy: aEye[1], z: zEye };
  const reveal = ease.inOut(progress(t, wNahin.end + 0.4, L36.start + 0.2));
  const ringDraw = ease.out(progress(t, wAtoot.start - 0.05, wAtoot.end));
  const lock = progress(t, wAtoot.end, wAtoot.end + 0.8);
  const glowU = ease.inOut(progress(t, wEkagrata.start, wEkagrata.end));
  const R = 11 * zEye * 1.6;
  const eyeScr = toScreen(camA, aEye);
  // distractions drift toward the ring and bounce off it
  const bounce = (t0: number, from: P2, ang: number) => {
    const u = t - t0;
    if (u < 0 || u > 1.35) return null;
    const dirIn: P2 = [Math.cos(ang), Math.sin(ang)];
    const hitAt = 0.9;
    const d0 = Math.hypot(from[0] - eyeScr[0], from[1] - eyeScr[1]) - R - 30;
    const p: P2 = u < hitAt
      ? [from[0] + dirIn[0] * d0 * (u / hitAt), from[1] + dirIn[1] * d0 * (u / hitAt)]
      : [from[0] + dirIn[0] * d0 - dirIn[0] * 260 * (u - hitAt) + 80 * (u - hitAt), from[1] + dirIn[1] * d0 - dirIn[1] * 260 * (u - hitAt) - 60 * (u - hitAt)];
    return { p, o: u > 1.0 ? 1 - (u - 1.0) / 0.35 : 1 };
  };
  const bf = bounce(wAtoot.end - 0.2, [60, 420], Math.atan2(eyeScr[1] - 420, eyeScr[0] - 60));
  const lf = bounce(wAtoot.end + 0.05, [1040, 1500], Math.atan2(eyeScr[1] - 1500, eyeScr[0] - 1040));
  return (
    <Frame bg="#F3DFC0">
      {dis < 1 && <g opacity={1 - dis}><ClipLesson /></g>}
      <g opacity={dis}>
        <rect width={W} height={H} fill="#F3DFC0" />
        <defs><radialGradient id="paper-v"><stop offset="0.5" stopColor="#F3DFC0" stopOpacity={0} /><stop offset="1" stopColor="#D9B98C" stopOpacity={0.7} /></radialGradient></defs>
        {reveal > 0 && (
          <g opacity={reveal}>
            <Layer cam={camA}>
              <rect x={-2000} y={-2000} width={5000} height={6000} fill="#EBD3A6" />
              <g transform={svgM(place(A.x, A.y, 1))}><Prince look="arjuna" expr="focused" shadow={false} /></g>
            </Layer>
          </g>
        )}
        {[
          { look: "bhima" as LookName, x: lerp(290, -360, part), props: { lift } },
          { look: "duryodhana" as LookName, x: lerp(800, 1440, part), props: { puff, expr: "smug" as const } },
        ].map(({ look, x, props }) => (
          <g key={look} filter={grey > 0 ? "url(#greyout)" : undefined}>
            <defs>
              <filter id="greyout"><feColorMatrix type="saturate" values={(1 - grey).toFixed(3)} /><feComponentTransfer><feFuncA type="linear" slope={(1 - 0.5 * grey).toFixed(3)} /></feComponentTransfer></filter>
            </defs>
            <g transform={svgM(place(x, 1820, 1.32))}><Prince look={look} {...props} /></g>
          </g>
        ))}
        <rect width={W} height={H} fill="url(#paper-v)" opacity={1 - reveal} />
        {ringDraw > 0 && (
          <g>
            {glowU > 0 && <circle cx={eyeScr[0]} cy={eyeScr[1]} r={R + 40} fill="none" stroke="#FFE7A8" strokeWidth={60} opacity={0.45 * glowU} />}
            <FocusRing cx={eyeScr[0]} cy={eyeScr[1]} r={R} drawn={ringDraw} lock={lock} width={lerp(10, 16, lock)} />
          </g>
        )}
        {bf && <g transform={`translate(${bf.p[0]} ${bf.p[1]})`} opacity={bf.o}><g transform="scale(2.6)"><ButterflyMini t={t} /></g></g>}
        {lf && <Leaf x={lf.p[0]} y={lf.p[1]} rot={t * 120} s={2.6} />}
      </g>
    </Frame>
  );
};
const ButterflyMini: React.FC<{ t: number }> = ({ t }) => {
  const k = 0.35 + 0.65 * Math.abs(Math.cos(t * 9));
  return (
    <g>
      <g transform={`scale(${k} 1)`}>
        <path d="M0,0 Q-30,-34 -40,-10 Q-36,8 0,0Z M0,0 Q30,-34 40,-10 Q36,8 0,0Z" fill="#E8806A" stroke="#3A2418" strokeWidth={2.5} />
      </g>
      <path d="M0,-10 L0,12" stroke="#3A2418" strokeWidth={4} strokeLinecap="round" />
    </g>
  );
};

// ======================= J · L37–L38: today's child; the ring passes to her; the toss; "आसान" =======================
export const SceneToday: React.FC = () => {
  const t = useStoryTime();
  const wKyonki = word(37, "क्योंकि"), wLakshya = word(37, "लक्ष्य"), wMushkil = word(38, "मुश्किल", 0), wMushkil2 = word(38, "मुश्किल", 1);
  const wNishana = word(38, "निशाना"), wAasaan = word(38, "आसान"), L38 = line(38);
  const match = { start: wKyonki.start - 0.35, end: wKyonki.start + 0.1 };
  const pull = { start: match.end, end: wLakshya.start - 0.15 };
  const G = { x: 300, y: 1720 };
  const gEye: P2 = [G.x - 28, G.y - (730 - 195)];
  const BASKET: P2 = [790, FLOOR_Y + 210];
  const zEye = 11;
  const pu = softLinear(progress(t, pull.start, pull.end), 0.2);
  const stretch = progress(t, wMushkil.start, wMushkil2.end);
  const wideC: P2 = [540, 1340];
  const endPush = ease.inOut(progress(t, wAasaan.end, L38.end + 0.6));
  const camRoom: Cam = {
    cx: lerp(lerp(gEye[0], wideC[0], pu), 520, endPush * 0.3),
    cy: lerp(lerp(gEye[1], wideC[1], pu), 1300, endPush * 0.3),
    z: Math.exp(lerp(Math.log(zEye), Math.log(1.28), pu)) * lerp(1, 0.86, ease.inOut(stretch)) * (1 + 0.08 * endPush),
  };
  const A = { x: 540, y: 2400 };
  const aEye: P2 = [A.x - 28, A.y - (730 - 195)];
  const camA: Cam = { cx: aEye[0], cy: aEye[1], z: zEye };
  const m = ease.inOut(progress(t, match.start, match.end));
  const turnE = progress(t, wLakshya.start - 0.35, wLakshya.start - 0.05);
  const eyeRoom = toScreen(camRoom, [lerp(gEye[0], G.x + 2, turnE), gEye[1]]);
  const toBasket = ease.inOut(progress(t, wLakshya.start, wLakshya.start + 0.6));
  const basketScr = toScreen(camRoom, [BASKET[0], BASKET[1] + 60]);
  const ringC: P2 = [lerp(eyeRoom[0], basketScr[0], toBasket), lerp(eyeRoom[1], basketScr[1], toBasket)];
  const ringR = lerp(Math.max(11 * camRoom.z * 1.6, 40), 100 * camRoom.z, toBasket);
  const turn = progress(t, wLakshya.start - 0.35, wLakshya.start - 0.05);
  const toSide = progress(t, wMushkil2.start, wMushkil2.start + 0.2);
  const windup = progress(t, wMushkil2.start + 0.2, wNishana.end);
  const throwU = progress(t, wNishana.end - 0.1, wNishana.end + 0.35);
  const ballT = { start: wNishana.end + 0.12, end: wAasaan.start + 0.35 };
  const bu = progress(t, ballT.start, ballT.end);
  const hand0: P2 = [G.x + 150, G.y - 560];
  const ballP: P2 = [lerp(hand0[0], BASKET[0], bu), lerp(hand0[1], BASKET[1] - 20, bu) - 420 * Math.sin(Math.PI * bu)];
  const inBasket = t >= ballT.end;
  const cheer = spring(t - (ballT.end + 0.05), MATERIAL.swagger);
  const toFront = progress(t, ballT.end, ballT.end + 0.2);
  const kiteX = 780 + 90 * Math.sin((t - 159) * 0.7);
  const r = rng(7); void r;
  let girl: React.ReactNode;
  if (t < wMushkil2.start) {
    girl = <XFade k={turn} a={<Girl view="front" expr="focused" />} b={<Girl view="threeQuarter" expr="focused" />} />;
  } else if (t < ballT.end) {
    const tu = windup < 1 ? 0.15 * windup : throwU; // small wind-up, then the lob
    girl = <XFade k={toSide} a={<Girl view="threeQuarter" expr="focused" />} b={<Girl view="side" expr="focused" throwU={tu} />} />;
  } else {
    girl = <XFade k={toFront} a={<Girl view="side" expr="focused" throwU={1} />} b={<Girl view="front" expr="happy_closed" cheer={cheer} />} />;
  }
  return (
    <Frame>
      {m < 1 && (
        <Layer cam={camA}>
          <rect x={-2000} y={-2000} width={5000} height={6000} fill="#EBD3A6" />
          <g transform={svgM(place(A.x, A.y, 1))}><Prince look="arjuna" expr="focused" shadow={false} /></g>
        </Layer>
      )}
      <g opacity={m}>
        <Layer cam={camRoom}>
          <Room kiteX={kiteX} />
          <g transform={`translate(${BASKET[0]} ${BASKET[1]}) scale(0.9)`}><Basket /></g>
          <g transform={svgM(place(G.x, G.y, 1))}>{girl}</g>
          {turn > 0 && t < wMushkil2.start && <g opacity={turn}><PaperBall x={G.x + 70} y={G.y - 270} r={24} /></g>}
          {bu > 0 && !inBasket && <PaperBall x={ballP[0]} y={ballP[1]} r={24} spin={bu * 540} />}
          {inBasket && <PaperBall x={BASKET[0]} y={BASKET[1] - 4 - 18 * Math.exp(-(t - ballT.end) * 8) * Math.abs(Math.sin((t - ballT.end) * 18))} r={24} />}
          {inBasket && <g transform={`translate(${BASKET[0]} ${BASKET[1]}) scale(0.9)`}><path d="M-70,0 L70,0 L66,40 L-66,40Z" fill="#C9873F" stroke="#3A2418" strokeWidth={4} /></g>}
          {inBasket && <Sparkle x={325} y={515} s={0.8} o={Math.sin(Math.PI * progress(t, ballT.end + 0.1, ballT.end + 1.1))} />}
        </Layer>
      </g>
      {t < 159.5 + 0.5 && <circle cx={ringC[0]} cy={ringC[1]} r={11 * zEye * 1.6 + 40} fill="none" stroke="#FFE7A8" strokeWidth={60} opacity={0.45 * (1 - progress(t, 159.5, 160.0))} />}
      <FocusRing cx={ringC[0]} cy={ringC[1]} r={t < match.start ? 11 * zEye * 1.6 : ringR} drawn={1} lock={inBasket ? progress(t, ballT.end, ballT.end + 0.8) : 0} width={t < match.start ? lerp(16, 12, progress(t, 159.5, 160.0)) : 12} />
      {inBasket && <Ripple x={basketScr[0]} y={basketScr[1] - 40} u={progress(t, ballT.end, ballT.end + 1.0)} max={260} n={2} />}
    </Frame>
  );
};
void C1World; void Watchers; void HORIZON; void Squirrel;
