import { useRef, useState } from 'react';
import { ArrowUpRight, MessageSquare } from 'lucide-react';
import { AmbientBattleBackdrop } from './components/AmbientBattleBackdrop';
import { BattleMarquee } from './components/BattleMarquee';
import { ConfirmationPass } from './components/ConfirmationPass';
import { ContactModal } from './components/ContactModal';
import { EventPoster } from './components/EventPoster';
import { RegistrationForm } from './components/RegistrationForm';
import { EVENT_METADATA } from './services/registrationService';
import type { SubmissionResult } from './types/registration';

export function App() {
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
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
      className="desktop-viewport-lock relative flex min-h-dvh flex-col"
    >
      <AmbientBattleBackdrop />

      <div className="relative z-10 flex min-h-dvh flex-1 flex-col lg:min-h-0">
        <BattleMarquee />

        {/* Single-screen non-scrollable desktop workspace (fluid scroll on mobile/tablet/short viewports) */}
        <main className="mx-auto flex w-full max-w-[1320px] flex-1 items-center px-3.5 py-4 sm:px-6 lg:min-h-0 lg:px-8 lg:py-3">
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

        {/* Slim Responsive Footer */}
        <footer className="no-print shrink-0 border-t border-white/10 bg-[#08080a]/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-[1320px] flex-col items-start gap-2.5 px-4 py-3 text-[11px] text-[#d4d4d8] sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-2 lg:px-8">
            <span className="font-mono-tabular text-[#a1a1aa] uppercase">
              {EVENT_METADATA.presenter} &bull; {EVENT_METADATA.event}
            </span>

            <div className="flex w-full flex-wrap items-center justify-between gap-3 sm:w-auto sm:justify-end sm:gap-4">
              <button
                type="button"
                onClick={() => setIsContactOpen(true)}
                className="font-mono-tabular inline-flex min-h-[44px] cursor-pointer items-center gap-1.5 border border-white/15 bg-[#14141b] px-3 py-1.5 text-[11px] font-semibold text-[#fafafa] uppercase transition-colors hover:border-[#facc15] hover:text-[#facc15] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#facc15] sm:min-h-[30px] sm:px-2.5 sm:py-1"
              >
                <MessageSquare className="h-3 w-3 text-[#facc15]" aria-hidden="true" />
                <span>Contact Us</span>
              </button>

              <p className="font-mono-tabular">
                Developed by{' '}
                <a
                  href="https://www.amadhav.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] cursor-pointer items-center gap-0.5 font-semibold text-[#facc15] underline decoration-[#facc15]/60 underline-offset-2 transition-colors hover:text-[#fde047] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#facc15] sm:min-h-[30px]"
                >
                  <span>Madhav Vashisht</span>
                  <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                </a>
              </p>
            </div>
          </div>
        </footer>
      </div>

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
}

export default App;
