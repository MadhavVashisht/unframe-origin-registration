import { useEffect, useState } from 'react';
import arenaStageImg from '../assets/battle/arena-stage.jpg';
import freezeAirchairImg from '../assets/battle/freeze-airchair.jpg';
import streetHeadspinImg from '../assets/battle/street-headspin.jpg';
import cypherRingImg from '../assets/battle/cypher-ring.jpg';

const BACKDROP_IMAGES = [
  {
    src: arenaStageImg,
    position: 'object-[50%_22%]',
  },
  {
    src: freezeAirchairImg,
    position: 'object-[50%_35%]',
  },
  {
    src: streetHeadspinImg,
    position: 'object-[50%_40%]',
  },
  {
    src: cypherRingImg,
    position: 'object-[50%_35%]',
  },
];

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
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % BACKDROP_IMAGES.length);
    }, 5500);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div
      className="no-print pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#060608]"
      aria-hidden="true"
    >
      {/* Crossfading Full-Screen Street Battle Photography with Subtle Mouse Parallax */}
      <div
        className="absolute inset-[-3%] transition-transform duration-300 ease-out"
        style={{
          transform:
            'translate3d(calc(var(--mx, 0) * -14px), calc(var(--my, 0) * -10px), 0) scale(1.06)',
        }}
      >
        {BACKDROP_IMAGES.map((img, idx) => (
          <img
            key={img.src}
            src={img.src}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover ${img.position} grayscale-[25%] contrast-125 transition-opacity duration-[1600ms] ease-in-out ${
              idx === activeIndex ? 'opacity-[0.30]' : 'opacity-0'
            }`}
          />
        ))}
      </div>

      {/* Stage Spotlights & Deep Obsidian Vignette Scrim */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 18% 15%, rgba(250, 204, 21, 0.16) 0%, transparent 45%), radial-gradient(circle at 85% 20%, rgba(255, 85, 0, 0.16) 0%, transparent 42%), radial-gradient(circle at 50% 50%, rgba(8, 8, 10, 0.45) 0%, rgba(6, 6, 8, 0.92) 85%)',
        }}
      />

      {/* 3D Perspective Dance Floor Grid */}
      <div className="absolute inset-x-[-15%] bottom-[-12%] h-[58vh] opacity-70">
        <div className="stage-floor-3d h-full w-full" />
      </div>

      {/* Floating 3D Geometric Stage Elements */}
      <div
        className="absolute top-[12%] left-[4%] hidden opacity-60 transition-transform duration-300 ease-out lg:block"
        style={{
          transform:
            'translate3d(calc(var(--mx, 0) * 18px), calc(var(--my, 0) * 14px), 0)',
        }}
      >
        <div className="animate-float-3d">
          <WireframeCube
            size={68}
            borderClass="border-[#facc15]/45 bg-[#facc15]/[0.03] shadow-[0_0_16px_rgba(250,204,21,0.12)]"
          />
        </div>
      </div>

      <div
        className="absolute right-[5%] bottom-[10%] hidden opacity-55 transition-transform duration-300 ease-out lg:block"
        style={{
          transform:
            'translate3d(calc(var(--mx, 0) * -20px), calc(var(--my, 0) * -14px), 0)',
        }}
      >
        <div className="animate-float-3d" style={{ animationDelay: '-2.5s' }}>
          <WireframeCube
            size={86}
            reverse
            borderClass="border-[#ff5500]/45 bg-[#ff5500]/[0.03] shadow-[0_0_20px_rgba(255,85,0,0.12)]"
          />
        </div>
      </div>

      {/* Background 3D Gyroscope Rings */}
      <div
        className="orbit-3d-stage absolute top-[55%] left-[48%] hidden -translate-x-1/2 -translate-y-1/2 opacity-25 lg:block"
        style={{ width: 420, height: 420 }}
      >
        <div className="orbit-ring-a absolute inset-0 rounded-full border border-[#facc15]/35" />
        <div className="orbit-ring-b absolute inset-8 rounded-full border border-dashed border-[#ff5500]/40" />
      </div>
    </div>
  );
}
