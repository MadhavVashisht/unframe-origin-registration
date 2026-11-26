import arenaStageImg from '../assets/battle/arena-stage.jpg';
import battleFeraImg from '../assets/battle/battle-fera.jpg';
import battleIguinImg from '../assets/battle/battle-iguin.jpg';
import battleLinImg from '../assets/battle/battle-lin.jpg';
import battleLuanImg from '../assets/battle/battle-luan.jpg';
import crewAomImg from '../assets/battle/crew-aom.jpg';
import cypherCentralImg from '../assets/battle/cypher-central.jpg';
import cypherRingImg from '../assets/battle/cypher-ring.jpg';
import freezeAirchairImg from '../assets/battle/freeze-airchair.jpg';
import streetHeadspinImg from '../assets/battle/street-headspin.jpg';

const ROW_ONE = [
  { src: battleLinImg, pos: 'object-[50%_28%]' },
  { src: arenaStageImg, pos: 'object-[50%_22%]' },
  { src: cypherCentralImg, pos: 'object-[50%_30%]' },
  { src: battleLuanImg, pos: 'object-[50%_25%]' },
  { src: freezeAirchairImg, pos: 'object-[50%_35%]' },
];

const ROW_TWO = [
  { src: battleFeraImg, pos: 'object-[50%_30%]' },
  { src: streetHeadspinImg, pos: 'object-[50%_40%]' },
  { src: battleIguinImg, pos: 'object-[50%_25%]' },
  { src: cypherRingImg, pos: 'object-[50%_35%]' },
  { src: crewAomImg, pos: 'object-[50%_22%]' },
];

const ROW_THREE = [
  { src: battleLuanImg, pos: 'object-[50%_25%]' },
  { src: cypherRingImg, pos: 'object-[50%_35%]' },
  { src: battleFeraImg, pos: 'object-[50%_30%]' },
  { src: freezeAirchairImg, pos: 'object-[50%_35%]' },
  { src: battleLinImg, pos: 'object-[50%_28%]' },
];

function PhotoWallRow({
  items,
  direction,
}: {
  items: { src: string; pos: string }[];
  direction: 'left' | 'right';
}) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div
        className={`flex h-full w-max gap-3 sm:gap-4 ${
          direction === 'left' ? 'animate-wall-left' : 'animate-wall-right'
        }`}
      >
        {[0, 1].map((dup) => (
          <div key={dup} className="flex h-full shrink-0 gap-3 sm:gap-4">
            {items.map((item, idx) => (
              <div
                key={`${dup}-${idx}`}
                className="relative h-full w-60 shrink-0 overflow-hidden border border-white/15 bg-[#0a0a0e] shadow-[0_12px_30px_rgba(0,0,0,0.65)] sm:w-80 lg:w-96"
              >
                <img
                  src={item.src}
                  alt=""
                  className={`h-full w-full object-cover ${item.pos} contrast-115 saturate-95 opacity-[0.68]`}
                />
                <div
                  className="absolute inset-0 bg-gradient-to-tr from-[#08080a]/50 via-transparent to-[#facc15]/10"
                  aria-hidden="true"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function WireframeCube({
  size,
  reverse = false,
  borderClass,
}: {
  size: number;
  reverse?: boolean;
  borderClass: string;
}) {
  const half = size / 2;
  const faces = [
    `translateZ(${half}px)`,
    `rotateY(180deg) translateZ(${half}px)`,
    `rotateY(90deg) translateZ(${half}px)`,
    `rotateY(-90deg) translateZ(${half}px)`,
    `rotateX(90deg) translateZ(${half}px)`,
    `rotateX(-90deg) translateZ(${half}px)`,
  ];

  return (
    <div className="cube-3d-scene" style={{ width: size, height: size }}>
      <div
        className={reverse ? 'cube-3d-reverse' : 'cube-3d'}
        style={{ width: size, height: size }}
      >
        {faces.map((transform, i) => (
          <div
            key={i}
            className={`cube-face border ${borderClass}`}
            style={{ transform }}
          />
        ))}
      </div>
    </div>
  );
}

export function AmbientBattleBackdrop() {
  return (
    <div
      className="no-print pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#060608]"
      aria-hidden="true"
    >
      {/* 3D Tilted Scrolling Multi-Photo Dance Battle Wall */}
      <div
        className="absolute inset-[-10%] grid grid-rows-3 gap-3 transition-transform duration-300 ease-out sm:gap-4"
        style={{
          transform:
            'perspective(1100px) rotateX(8deg) rotateY(calc(var(--mx, 0) * -6deg)) translate3d(calc(var(--mx, 0) * -14px), calc(var(--my, 0) * -10px), -40px) scale(1.1)',
        }}
      >
        <PhotoWallRow items={ROW_ONE} direction="left" />
        <PhotoWallRow items={ROW_TWO} direction="right" />
        <PhotoWallRow items={ROW_THREE} direction="left" />
      </div>

      {/* Balanced Spotlight & Vignette Scrim — keeps background dancers visible */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 20% 18%, rgba(250, 204, 21, 0.16) 0%, transparent 45%), radial-gradient(circle at 82% 24%, rgba(255, 85, 0, 0.16) 0%, transparent 42%), radial-gradient(circle at 50% 50%, rgba(6, 6, 8, 0.36) 0%, rgba(6, 6, 8, 0.72) 92%)',
        }}
      />

      {/* 3D Perspective Dance Floor Grid */}
      <div className="absolute inset-x-[-15%] bottom-[-12%] h-[56vh] opacity-65">
        <div className="stage-floor-3d h-full w-full" />
      </div>

      {/* Floating 3D Geometric Stage Elements */}
      <div
        className="absolute top-[11%] left-[3%] hidden opacity-70 transition-transform duration-300 ease-out lg:block"
        style={{
          transform:
            'translate3d(calc(var(--mx, 0) * 18px), calc(var(--my, 0) * 14px), 0)',
        }}
      >
        <div className="animate-float-3d">
          <WireframeCube
            size={68}
            borderClass="border-[#facc15]/55 bg-[#facc15]/[0.04] shadow-[0_0_18px_rgba(250,204,21,0.16)]"
          />
        </div>
      </div>

      <div
        className="absolute right-[4%] bottom-[9%] hidden opacity-65 transition-transform duration-300 ease-out lg:block"
        style={{
          transform:
            'translate3d(calc(var(--mx, 0) * -20px), calc(var(--my, 0) * -14px), 0)',
        }}
      >
        <div className="animate-float-3d" style={{ animationDelay: '-2.5s' }}>
          <WireframeCube
            size={84}
            reverse
            borderClass="border-[#ff5500]/55 bg-[#ff5500]/[0.04] shadow-[0_0_22px_rgba(255,85,0,0.16)]"
          />
        </div>
      </div>

      {/* Background 3D Gyroscope Rings */}
      <div
        className="orbit-3d-stage absolute top-[54%] left-[48%] hidden -translate-x-1/2 -translate-y-1/2 opacity-30 lg:block"
        style={{ width: 420, height: 420 }}
      >
        <div className="orbit-ring-a absolute inset-0 rounded-full border border-[#facc15]/40" />
        <div className="orbit-ring-b absolute inset-8 rounded-full border border-dashed border-[#ff5500]/45" />
      </div>
    </div>
  );
}
