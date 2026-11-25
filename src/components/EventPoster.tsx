import { useState } from 'react';
import { Award, Calendar, MapPin, ShieldCheck, Trophy } from 'lucide-react';
import arenaStageImg from '../assets/battle/arena-stage.jpg';
import freezeAirchairImg from '../assets/battle/freeze-airchair.jpg';
import streetHeadspinImg from '../assets/battle/street-headspin.jpg';
import cypherRingImg from '../assets/battle/cypher-ring.jpg';
import { EVENT_METADATA } from '../services/registrationService';
import { BeatBars } from './BeatBars';

interface BattleScene {
  id: string;
  label: string;
  tag: string;
  image: string;
  alt: string;
  objectPosition: string;
}

const BATTLE_SCENES: BattleScene[] = [
  {
    id: 'stage',
    label: '01 STAGE',
    tag: 'CYPHER FLOOR',
    image: arenaStageImg,
    alt: 'Dancer locked in on the battle stage in front of a live cheering crowd',
    objectPosition: 'object-[50%_20%]',
  },
  {
    id: 'freeze',
    label: '02 FREEZE',
    tag: 'AIR CONTROL',
    image: freezeAirchairImg,
    alt: 'Street dancer holding a one-hand airchair freeze against concrete shadows',
    objectPosition: 'object-[50%_35%]',
  },
  {
    id: 'power',
    label: '03 POWER',
    tag: 'CONCRETE MOVE',
    image: streetHeadspinImg,
    alt: 'Breaker performing an inverted freeze in the middle of a street cypher',
    objectPosition: 'object-[50%_45%]',
  },
  {
    id: 'cypher',
    label: '04 CYPHER',
    tag: 'THE RING',
    image: cypherRingImg,
    alt: 'Dancer hitting floorwork inside a packed street dance cypher circle',
    objectPosition: 'object-[50%_35%]',
  },
];

export function EventPoster() {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const activeScene = BATTLE_SCENES[activeSceneIndex];

  return (
    <aside
      aria-label="Event Poster and Prize Details"
      className="no-print flex h-full flex-col overflow-hidden border border-[#27272f] bg-[#111115] shadow-2xl"
    >
      {/* Top hazard accent strip */}
      <div className="hazard-stripe h-1.5 w-full shrink-0 border-b border-[#27272f]" aria-hidden="true" />

      {/* Atmospheric Battle Stage Backdrop + Poster Title Lockup */}
      <div className="relative min-h-[160px] flex-1 overflow-hidden border-b border-[#27272f] bg-[#08080a]">
        <img
          src={activeScene.image}
          alt={activeScene.alt}
          className={`h-full w-full object-cover ${activeScene.objectPosition} grayscale-[22%] contrast-125 brightness-[0.68] transition-all duration-300`}
        />
        {/* Measured dark scrims + warm street spotlight */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#111115] via-[#111115]/60 to-[#08080a]/65"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#ff5500]/22 via-transparent to-[#facc15]/20"
          aria-hidden="true"
        />

        {/* Top viewfinder status */}
        <div className="absolute top-3 left-4 right-4 flex items-center justify-between gap-2">
          <span className="font-mono-tabular border border-[#3f3f4a] bg-[#08080a]/85 px-2.5 py-1 text-[10px] font-semibold tracking-[0.18em] text-[#facc15] uppercase backdrop-blur-xs">
            [ {activeScene.tag} ]
          </span>
          <span className="font-mono-tabular inline-flex items-center gap-2 border border-[#3f3f4a] bg-[#08080a]/85 px-2.5 py-1 text-[10px] font-semibold tracking-[0.18em] text-[#fafafa] uppercase backdrop-blur-xs">
            <BeatBars />
            <span>ENTRY OPEN</span>
          </span>
        </div>

        {/* Overlaid Hero Title Lockup */}
        <div className="poster-grain absolute inset-x-0 bottom-0 p-4 sm:p-5">
          <p className="font-mono-tabular text-[11px] font-semibold tracking-[0.24em] text-[#fde047] uppercase">
            {EVENT_METADATA.presenter} <span className="text-[#d4d4d8]">PRESENTS</span>
          </p>

          <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-2">
            <h1 className="font-display text-5xl leading-[0.86] tracking-tight text-[#fafafa] uppercase sm:text-6xl">
              ORIGIN
            </h1>
            <span className="font-mono-tabular inline-flex items-center bg-[#facc15] px-2.5 py-1 text-[11px] font-bold tracking-[0.18em] text-[#08080a] uppercase">
              ( REP YOUR STYLE )
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Compact Specs, Prizes & 4-Scene Battle Vibes Switcher */}
      <div className="poster-grain flex shrink-0 flex-col gap-3 p-4 sm:p-5">
        {/* Interactive Battle Vibes Strip */}
        <div aria-label="Battle atmosphere gallery">
          <div className="mb-1.5 flex items-center justify-between text-[10px]">
            <span className="font-mono-tabular font-semibold tracking-[0.18em] text-[#a1a1aa] uppercase">
              BATTLE VIBES
            </span>
            <span className="font-mono-tabular text-[#a1a1aa] uppercase">
              SELECT SCENE
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {BATTLE_SCENES.map((scene, idx) => {
              const isActive = idx === activeSceneIndex;
              return (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => setActiveSceneIndex(idx)}
                  aria-pressed={isActive}
                  className={`group relative h-14 cursor-pointer overflow-hidden border text-left transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#facc15] ${
                    isActive
                      ? 'border-[#facc15] ring-1 ring-[#facc15]'
                      : 'border-[#2e2e38] hover:border-[#71717a]'
                  }`}
                >
                  <img
                    src={scene.image}
                    alt={scene.alt}
                    className={`h-full w-full object-cover ${scene.objectPosition} transition-transform duration-200 group-hover:scale-105 ${
                      isActive ? 'brightness-90' : 'grayscale-[45%] brightness-[0.65]'
                    }`}
                  />
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#08080a]/90 via-[#08080a]/25 to-transparent"
                    aria-hidden="true"
                  />
                  <span
                    className={`font-mono-tabular absolute bottom-1 left-1.5 text-[9px] font-bold tracking-wider uppercase ${
                      isActive ? 'text-[#facc15]' : 'text-[#e4e4e7]'
                    }`}
                  >
                    {scene.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Date & City */}
        <div className="grid grid-cols-2 gap-px border border-[#27272f] bg-[#27272f]">
          <div className="bg-[#141419] px-3.5 py-2.5">
            <div className="flex items-center gap-1.5 text-[#a1a1aa]">
              <Calendar className="h-3.5 w-3.5 text-[#facc15]" aria-hidden="true" />
              <span className="font-mono-tabular text-[10px] font-semibold tracking-[0.16em] uppercase">
                BATTLE DATE
              </span>
            </div>
            <p className="font-mono-tabular mt-1 text-sm font-bold tracking-wide text-[#fafafa]">
              {EVENT_METADATA.battleDate}
            </p>
          </div>

          <div className="bg-[#141419] px-3.5 py-2.5">
            <div className="flex items-center gap-1.5 text-[#a1a1aa]">
              <MapPin className="h-3.5 w-3.5 text-[#ff5500]" aria-hidden="true" />
              <span className="font-mono-tabular text-[10px] font-semibold tracking-[0.16em] uppercase">
                CITY
              </span>
            </div>
            <p className="font-mono-tabular mt-1 text-sm font-bold tracking-wide text-[#fafafa]">
              {EVENT_METADATA.eventCity}
            </p>
          </div>
        </div>

        {/* Cash Prizes */}
        <section
          aria-labelledby="prize-heading"
          className="border border-[#27272f] bg-[#0c0c10] p-3"
        >
          <div className="flex items-center justify-between border-b border-[#27272f] pb-2">
            <h2
              id="prize-heading"
              className="font-mono-tabular text-[10px] font-bold tracking-[0.2em] text-[#facc15] uppercase"
            >
              CASH PRIZE
            </h2>
            <span className="font-mono-tabular text-[10px] text-[#a1a1aa] uppercase">
              POOL ₹25,000/-
            </span>
          </div>

          <div className="mt-2.5 grid grid-cols-2 gap-2.5">
            <div className="border border-[#facc15]/50 bg-[#18150c] px-3 py-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono-tabular text-[10px] font-bold tracking-[0.16em] text-[#fde047] uppercase">
                  WINNER
                </span>
                <Trophy className="h-3.5 w-3.5 text-[#facc15]" aria-hidden="true" />
              </div>
              <p className="font-display mt-1 text-2xl tracking-wide text-[#facc15] sm:text-3xl">
                15,000/-
              </p>
            </div>

            <div className="border border-[#3f3f4a] bg-[#16161c] px-3 py-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono-tabular text-[10px] font-bold tracking-[0.16em] text-[#d4d4d8] uppercase">
                  RUNNER UP
                </span>
                <Award className="h-3.5 w-3.5 text-[#fb923c]" aria-hidden="true" />
              </div>
              <p className="font-display mt-1 text-2xl tracking-wide text-[#fafafa] sm:text-3xl">
                10,000/-
              </p>
            </div>
          </div>
        </section>

        {/* Compact Check-in Line */}
        <div className="flex items-center gap-2.5 border-t border-[#27272f] pt-2.5 text-[11px] text-[#a1a1aa]">
          <ShieldCheck className="h-4 w-4 shrink-0 text-[#facc15]" aria-hidden="true" />
          <p className="leading-snug">
            Carry matching physical PAN or Aadhaar card to the Delhi check-in desk.
          </p>
        </div>
      </div>
    </aside>
  );
}
