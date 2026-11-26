import { useRef, useState } from 'react';
import { AmbientBattleBackdrop } from './components/AmbientBattleBackdrop';
import { BattleMarquee } from './components/BattleMarquee';
import { ConfirmationPass } from './components/ConfirmationPass';
import { EventPoster } from './components/EventPoster';
import { RegistrationForm } from './components/RegistrationForm';
import { EVENT_METADATA } from './services/registrationService';
import type { SubmissionResult } from './types/registration';

export function App() {
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== 'mouse' || !rootRef.current) {
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    const nx = e.clientX / window.innerWidth - 0.5;
    const ny = e.clientY / window.innerHeight - 0.5;

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }
    rafRef.current = requestAnimationFrame(() => {
      rootRef.current?.style.setProperty('--mx', nx.toFixed(3));
      rootRef.current?.style.setProperty('--my', ny.toFixed(3));
    });
  }

  return (
    <div
      ref={rootRef}
      onPointerMove={handlePointerMove}
      className="relative flex min-h-dvh flex-col lg:h-dvh lg:overflow-hidden"
    >
      <AmbientBattleBackdrop />

      <div className="relative z-10 flex min-h-dvh flex-col lg:h-full">
        <BattleMarquee />

        {/* Single-screen non-scrollable desktop workspace */}
        <main className="mx-auto flex w-full max-w-[1320px] flex-1 items-center px-4 py-3 sm:px-6 lg:min-h-0 lg:px-8 lg:py-3">
          <div className="grid w-full grid-cols-1 gap-4 lg:h-full lg:max-h-[670px] lg:grid-cols-12 lg:gap-5">
            <div className="lg:col-span-5 lg:h-full lg:min-h-0">
              <EventPoster />
            </div>

            <div className="lg:col-span-7 lg:h-full lg:min-h-0">
              {submissionResult ? (
                <ConfirmationPass
                  result={submissionResult}
                  onRegisterAnother={() => setSubmissionResult(null)}
                />
              ) : (
                <RegistrationForm onSuccess={(result) => setSubmissionResult(result)} />
              )}
            </div>
          </div>
        </main>

        {/* Slim Footer */}
        <footer className="no-print shrink-0 border-t border-white/10 bg-[#08080a]/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-2 px-4 py-2 text-[11px] text-[#d4d4d8] sm:px-6 lg:px-8">
            <span className="font-mono-tabular text-[#a1a1aa] uppercase">
              {EVENT_METADATA.presenter} &bull; {EVENT_METADATA.event}
            </span>
            <p className="font-mono-tabular">
              Developed by <span className="font-semibold text-[#fafafa]">Madhav Vashisht</span>{' '}
              (
              <a
                href="https://www.amadhav.com"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer font-semibold text-[#facc15] underline decoration-[#facc15]/60 underline-offset-2 transition-colors hover:text-[#fde047] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#facc15]"
              >
                www.amadhav.com
              </a>
              )
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
