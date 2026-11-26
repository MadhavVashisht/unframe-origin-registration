import { useRef } from 'react';
import { Award, Calendar, MapPin, ShieldCheck, Trophy } from 'lucide-react';
import { EVENT_METADATA } from '../services/registrationService';
import { BeatBars } from './BeatBars';

export function EventPoster() {
  const cardRef = useRef<HTMLDivElement>(null);

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== 'mouse' || !cardRef.current) {
      return;
    }
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      return;
    }
    const rect = cardRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    cardRef.current.style.setProperty('--rx', `${(-ny * 6).toFixed(2)}deg`);
    cardRef.current.style.setProperty('--ry', `${(nx * 7).toFixed(2)}deg`);
  }

  function handlePointerLeave() {
    if (!cardRef.current) {
      return;
    }
    cardRef.current.style.setProperty('--rx', '0deg');
    cardRef.current.style.setProperty('--ry', '0deg');
  }

  return (
    <aside
      aria-label="Event Poster and Prize Details"
      className="no-print h-full [perspective:1400px]"
    >
      <div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{
          transform: 'rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))',
          transformStyle: 'preserve-3d',
        }}
        className="relative flex h-full flex-col justify-between overflow-hidden border border-white/15 bg-[#0e0e13]/68 shadow-[0_28px_70px_rgba(0,0,0,0.85)] backdrop-blur-md transition-transform duration-200 ease-out"
      >
        {/* Top hazard accent strip */}
        <div
          className="hazard-stripe h-1.5 w-full shrink-0 border-b border-white/10"
          aria-hidden="true"
        />

        {/* Hero 3D Centerpiece */}
        <div className="poster-grain relative flex flex-1 flex-col justify-between overflow-hidden border-b border-white/10 p-5 sm:p-6">
          {/* Interactive 3D Gyroscope Emblem behind title */}
          <div
            className="orbit-3d-stage pointer-events-none absolute top-1/2 right-[-28px] h-52 w-52 -translate-y-1/2 opacity-70 sm:right-[-10px] sm:h-60 sm:w-60"
            aria-hidden="true"
          >
            <div className="orbit-ring-a absolute inset-0 rounded-full border-2 border-[#facc15]/40 shadow-[0_0_24px_rgba(250,204,21,0.15)]" />
            <div className="orbit-ring-b absolute inset-4 rounded-full border border-dashed border-[#ff5500]/55" />
            <div className="orbit-ring-c absolute inset-10 rounded-full border border-white/25" />
            <div className="absolute inset-[42%] rounded-full bg-gradient-to-br from-[#facc15] to-[#ff5500] opacity-75 blur-[1px]" />
          </div>

          {/* Top Bar */}
          <div className="relative z-10 flex items-center justify-between gap-2">
            <span className="font-mono-tabular border border-white/15 bg-[#08080a]/80 px-2.5 py-1 text-[10px] font-semibold tracking-[0.2em] text-[#facc15] uppercase">
              {EVENT_METADATA.presenter}
            </span>
            <span className="font-mono-tabular inline-flex items-center gap-2 border border-white/15 bg-[#08080a]/80 px-2.5 py-1 text-[10px] font-semibold tracking-[0.18em] text-[#fafafa] uppercase">
              <BeatBars />
              <span>CYPHER OPEN</span>
            </span>
          </div>

          {/* 3D Title Lockup */}
          <div
            className="relative z-10 my-auto py-4"
            style={{ transform: 'translateZ(26px)' }}
          >
            <p className="font-mono-tabular text-[11px] font-semibold tracking-[0.28em] text-[#d4d4d8] uppercase">
              PRESENTS
            </p>
            <h1 className="font-display text-3d-origin mt-1 text-6xl leading-[0.86] tracking-tight text-[#fafafa] uppercase sm:text-7xl">
              ORIGIN
            </h1>
            <div className="mt-3 inline-flex items-center bg-[#facc15] px-3 py-1 text-[#08080a] shadow-[0_4px_0_#a16207,0_10px_24px_rgba(250,204,21,0.22)]">
              <span className="font-mono-tabular text-xs font-bold tracking-[0.2em] uppercase">
                ( REP YOUR STYLE )
              </span>
            </div>
            <p className="mt-3.5 max-w-sm text-xs leading-relaxed text-[#d4d4d8] sm:text-sm">
              One floor. Pure movement. Step into the ring and claim the crown in Delhi.
            </p>
          </div>

          <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-3 font-mono-tabular text-[10px] tracking-[0.18em] text-[#a1a1aa] uppercase">
            <span>ALL STYLES BATTLE</span>
            <span className="text-[#fde047]">DELHI &bull; 2027</span>
          </div>
        </div>

        {/* Bottom Specs & 3D Prize Cards */}
        <div className="poster-grain relative flex shrink-0 flex-col gap-3 bg-[#0a0a0e]/70 p-4 sm:p-5">
          {/* Date & City */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="border border-white/12 bg-[#131319]/85 px-3.5 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
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

            <div className="border border-white/12 bg-[#131319]/85 px-3.5 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
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
            className="border border-white/12 bg-[#09090d]/85 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
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
              <div className="border border-[#facc15]/60 bg-gradient-to-br from-[#1d180a]/95 to-[#12100a]/95 px-3 py-2.5 shadow-[0_10px_24px_rgba(250,204,21,0.10),inset_0_1px_0_rgba(250,204,21,0.25)] transition-transform duration-200 hover:-translate-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono-tabular text-[10px] font-bold tracking-[0.16em] text-[#fde047] uppercase">
                    WINNER
                  </span>
                  <Trophy className="h-3.5 w-3.5 text-[#facc15]" aria-hidden="true" />
                </div>
                <p className="font-display mt-1 text-3xl tracking-wide text-[#facc15]">
                  15,000/-
                </p>
              </div>

              <div className="border border-white/15 bg-gradient-to-br from-[#181820]/95 to-[#111116]/95 px-3 py-2.5 shadow-[0_10px_24px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.12)] transition-transform duration-200 hover:-translate-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono-tabular text-[10px] font-bold tracking-[0.16em] text-[#d4d4d8] uppercase">
                    RUNNER UP
                  </span>
                  <Award className="h-3.5 w-3.5 text-[#fb923c]" aria-hidden="true" />
                </div>
                <p className="font-display mt-1 text-3xl tracking-wide text-[#fafafa]">
                  10,000/-
                </p>
              </div>
            </div>
          </section>

          {/* Compact Check-in Line */}
          <div className="flex items-center gap-2.5 border-t border-white/10 pt-2.5 text-[11px] text-[#d4d4d8]">
            <ShieldCheck className="h-4 w-4 shrink-0 text-[#facc15]" aria-hidden="true" />
            <p className="leading-snug">
              Carry matching physical PAN or Aadhaar card to the Delhi check-in desk.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
