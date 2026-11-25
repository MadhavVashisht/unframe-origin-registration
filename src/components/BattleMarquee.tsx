import { EVENT_METADATA } from '../services/registrationService';
import { BeatBars } from './BeatBars';

const TICKER_ITEMS = [
  EVENT_METADATA.event,
  EVENT_METADATA.battleDate,
  EVENT_METADATA.eventCity,
  `WINNER ${EVENT_METADATA.winnerPrize}`,
  `RUNNER UP ${EVENT_METADATA.runnerUpPrize}`,
  'OPEN FLOOR CYPHER',
  'NO CREW POLITICS',
];

export function BattleMarquee() {
  return (
    <div className="no-print flex h-9 shrink-0 items-stretch border-b border-[#27272f] bg-[#0c0c10]">
      <div className="flex shrink-0 items-center gap-2.5 border-r border-[#27272f] bg-[#0c0c10] px-3.5 sm:px-5">
        <BeatBars />
        <span className="font-mono-tabular text-[11px] font-bold tracking-[0.2em] text-[#fafafa] uppercase sm:text-xs">
          {EVENT_METADATA.presenter}
        </span>
      </div>

      <div className="relative flex flex-1 items-center overflow-hidden bg-[#facc15] text-[#08080a]">
        <p className="sr-only">
          {EVENT_METADATA.presenter} presents {EVENT_METADATA.event} on{' '}
          {EVENT_METADATA.battleDate} in {EVENT_METADATA.eventCity}. Winner{' '}
          {EVENT_METADATA.winnerPrize}, Runner Up {EVENT_METADATA.runnerUpPrize}.
        </p>

        <div className="animate-marquee flex w-max items-center" aria-hidden="true">
          {[0, 1].map((dupIndex) => (
            <div key={dupIndex} className="flex shrink-0 items-center">
              {TICKER_ITEMS.map((item, idx) => (
                <span
                  key={`${dupIndex}-${idx}`}
                  className="font-mono-tabular inline-flex items-center text-[11px] font-bold tracking-[0.18em] uppercase"
                >
                  <span className="px-4">{item}</span>
                  <span className="text-[#08080a]/45">//</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
