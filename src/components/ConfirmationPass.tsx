import { useEffect, useRef, useState } from 'react';
import {
  Check,
  CheckCircle2,
  Copy,
  Printer,
  RotateCcw,
} from 'lucide-react';
import type { SubmissionResult } from '../types/registration';
import { EVENT_METADATA } from '../services/registrationService';

interface ConfirmationPassProps {
  result: SubmissionResult;
  onRegisterAnother: () => void;
}

export function ConfirmationPass({
  result,
  onRegisterAnother,
}: ConfirmationPassProps) {
  const { registration } = result;
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  async function handleCopySummary() {
    const summaryText = [
      `${EVENT_METADATA.presenter} — ${EVENT_METADATA.event}`,
      `Registration ID: ${registration.registrationId}`,
      `Battle Date: ${EVENT_METADATA.battleDate} | City: ${EVENT_METADATA.eventCity}`,
      `Stage Name: ${registration.stageName}`,
      `Full Name: ${registration.name}`,
      `Age: ${registration.age} | Representing: ${registration.city}`,
      `Contact: +91 ${registration.contactNumber}`,
      `PAN/Aadhaar Last 6: ${registration.idLast6} (${registration.idFormatHint})`,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // Ignore clipboard permission failures
    }
  }

  return (
    <section
      aria-labelledby="pass-confirmed-heading"
      className="animate-enter-up flex h-full flex-col justify-between border border-white/15 bg-[#0e0e13]/85 shadow-[0_28px_75px_rgba(0,0,0,0.88),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md"
    >
      {/* Top confirmation banner */}
      <div className="no-print flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-[#27272f] bg-[#0c2415] px-5 py-3.5 sm:px-6">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-[#4ade80]" aria-hidden="true" />
          <div>
            <h2
              ref={headingRef}
              id="pass-confirmed-heading"
              tabIndex={-1}
              className="text-sm font-bold tracking-wide text-[#fafafa] uppercase focus-visible:outline-2 focus-visible:outline-[#4ade80]"
            >
              REGISTRATION CONFIRMED
            </h2>
            <p className="text-xs text-[#bbf7d0]">{result.message}</p>
          </div>
        </div>

        <span className="font-mono-tabular border border-[#4ade80]/50 bg-[#14532d]/60 px-2.5 py-1 text-[11px] font-semibold text-[#86efac] uppercase">
          RECORDED
        </span>
      </div>

      {/* Printable Digital Battle Pass */}
      <div className="flex flex-1 flex-col justify-between gap-4 p-5 sm:p-6">
        <div className="print-card relative border-2 border-[#facc15]/70 bg-[#0b0b0f] p-5">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-dashed border-[#3f3f4a] pb-4">
            <div>
              <p className="font-mono-tabular text-[11px] font-semibold tracking-[0.22em] text-[#facc15] uppercase">
                {EVENT_METADATA.presenter} &bull; ATHLETE PASS
              </p>
              <h3 className="font-display mt-1 text-3xl tracking-wide text-[#fafafa] uppercase sm:text-4xl">
                {registration.stageName}
              </h3>
              <p className="mt-0.5 text-xs text-[#d4d4d8]">
                ORIGIN (REP YOUR STYLE) &mdash; {EVENT_METADATA.eventCity}
              </p>
            </div>

            <div className="border border-[#3f3f4a] bg-[#16161c] px-3.5 py-2 text-left sm:text-right">
              <span className="font-mono-tabular block text-[10px] tracking-[0.2em] text-[#a1a1aa] uppercase">
                ENTRY CODE
              </span>
              <span className="font-mono-tabular mt-0.5 block text-base font-bold tracking-wider text-[#facc15]">
                {registration.registrationId}
              </span>
            </div>
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-3.5">
            <div>
              <dt className="font-mono-tabular text-[10px] tracking-[0.16em] text-[#a1a1aa] uppercase">
                LEGAL NAME
              </dt>
              <dd className="mt-0.5 text-sm font-semibold text-[#fafafa]">
                {registration.name}
              </dd>
            </div>

            <div>
              <dt className="font-mono-tabular text-[10px] tracking-[0.16em] text-[#a1a1aa] uppercase">
                AGE / CITY
              </dt>
              <dd className="mt-0.5 text-sm font-semibold text-[#fafafa]">
                {registration.age} yrs &bull; {registration.city}
              </dd>
            </div>

            <div>
              <dt className="font-mono-tabular text-[10px] tracking-[0.16em] text-[#a1a1aa] uppercase">
                CONTACT NUMBER
              </dt>
              <dd className="font-mono-tabular mt-0.5 text-sm font-semibold text-[#fafafa]">
                +91 {registration.contactNumber}
              </dd>
            </div>

            <div>
              <dt className="font-mono-tabular text-[10px] tracking-[0.16em] text-[#a1a1aa] uppercase">
                PAN / AADHAAR (LAST 6)
              </dt>
              <dd className="font-mono-tabular mt-0.5 text-sm font-semibold text-[#fafafa]">
                &bull;&bull;&bull;&bull;&bull;&bull;{registration.idLast6}{' '}
                <span className="text-xs font-normal text-[#a1a1aa]">
                  ({registration.idFormatHint})
                </span>
              </dd>
            </div>

            <div>
              <dt className="font-mono-tabular text-[10px] tracking-[0.16em] text-[#a1a1aa] uppercase">
                BATTLE DATE
              </dt>
              <dd className="font-mono-tabular mt-0.5 text-sm font-semibold text-[#facc15]">
                {EVENT_METADATA.battleDate}
              </dd>
            </div>

            <div>
              <dt className="font-mono-tabular text-[10px] tracking-[0.16em] text-[#a1a1aa] uppercase">
                CASH PRIZE POOL
              </dt>
              <dd className="font-mono-tabular mt-0.5 text-sm font-semibold text-[#fafafa]">
                Winner {EVENT_METADATA.winnerPrize} &bull; Runner Up{' '}
                {EVENT_METADATA.runnerUpPrize}
              </dd>
            </div>
          </dl>

          <p className="mt-4 border-t border-dashed border-[#3f3f4a] pt-3 text-xs text-[#a1a1aa]">
            Present this pass code and matching physical Government ID at the Delhi check-in
            desk on {EVENT_METADATA.battleDate}.
          </p>
        </div>

        <div className="no-print flex flex-col gap-2.5 sm:flex-row">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex min-h-[46px] flex-1 cursor-pointer items-center justify-center gap-2 bg-[#facc15] px-4 py-2.5 text-xs font-bold tracking-[0.14em] text-[#08080a] uppercase transition-colors duration-150 hover:bg-[#fde047] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fafafa]"
          >
            <Printer className="h-4 w-4" aria-hidden="true" />
            <span>PRINT / SAVE PASS</span>
          </button>

          <button
            type="button"
            onClick={handleCopySummary}
            className="inline-flex min-h-[46px] flex-1 cursor-pointer items-center justify-center gap-2 border border-[#3f3f4a] bg-[#18181d] px-4 py-2.5 text-xs font-bold tracking-[0.14em] text-[#fafafa] uppercase transition-colors duration-150 hover:border-[#facc15] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#facc15]"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-[#4ade80]" aria-hidden="true" />
                <span>COPIED</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" aria-hidden="true" />
                <span>COPY DETAILS</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onRegisterAnother}
            className="inline-flex min-h-[46px] cursor-pointer items-center justify-center gap-2 border border-[#2e2e38] bg-transparent px-4 py-2.5 text-xs font-semibold tracking-[0.12em] text-[#a1a1aa] uppercase transition-colors duration-150 hover:border-[#52525b] hover:text-[#fafafa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#facc15]"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            <span>NEW ENTRY</span>
          </button>
        </div>
      </div>
    </section>
  );
}
