import { useEffect, useRef } from 'react';
import { ArrowUpRight, AtSign, MessageCircle, Phone, X } from 'lucide-react';
import unframeLogo from '../assets/logos/unframe-logo.png';
import { CONTACT_INFO, type ContactAction, type ContactChannel } from '../data/contactInfo';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ChannelIcon({ type }: { type: ContactChannel['type'] }) {
  if (type === 'instagram') {
    return <AtSign className="h-4 w-4 shrink-0 text-[#ff5500]" aria-hidden="true" />;
  }
  return <Phone className="h-4 w-4 shrink-0 text-[#facc15]" aria-hidden="true" />;
}

function ActionIcon({ kind }: { kind: ContactAction['kind'] }) {
  switch (kind) {
    case 'call':
      return <Phone className="h-3.5 w-3.5" aria-hidden="true" />;
    case 'whatsapp':
      return <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />;
    case 'instagram':
      return <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />;
  }
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    closeBtnRef.current?.focus();

    // Lock background scroll across desktop and iOS Safari smartphones
    const scrollY = window.scrollY;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevHtmlScrollBehavior = document.documentElement.style.scrollBehavior;
    const prevBodyStyle = {
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      right: document.body.style.right,
      width: document.body.style.width,
      overflow: document.body.style.overflow,
    };

    document.documentElement.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.position = prevBodyStyle.position;
      document.body.style.top = prevBodyStyle.top;
      document.body.style.left = prevBodyStyle.left;
      document.body.style.right = prevBodyStyle.right;
      document.body.style.width = prevBodyStyle.width;
      document.body.style.overflow = prevBodyStyle.overflow;
      document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo(0, scrollY);
      document.documentElement.style.scrollBehavior = prevHtmlScrollBehavior;
      previousFocusRef.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="no-print fixed inset-0 z-50 flex items-center justify-center overflow-hidden overscroll-contain bg-black/75 p-4 backdrop-blur-xs"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
        className="animate-enter-up max-h-[90dvh] w-full max-w-lg touch-pan-y overflow-y-auto overscroll-contain border border-white/15 bg-[#0e0e13]/95 shadow-[0_28px_75px_rgba(0,0,0,0.92),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md"
      >
        <div className="hazard-stripe h-1.5 w-full border-b border-white/10" aria-hidden="true" />

        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <img
                src={unframeLogo}
                alt="UNFRAME EVENTS"
                className="h-10 w-auto shrink-0 object-contain"
              />
              <div>
                <p className="font-mono-tabular text-[10px] font-semibold tracking-[0.2em] text-[#facc15] uppercase">
                  {CONTACT_INFO.subheading}
                </p>
                <h2
                  id="contact-modal-title"
                  className="font-display mt-0.5 text-2xl tracking-wide text-[#fafafa] uppercase sm:text-3xl"
                >
                  {CONTACT_INFO.heading}
                </h2>
              </div>
            </div>

            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              aria-label="Close contact us modal"
              className="flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center border border-white/15 bg-[#16161d] text-[#d4d4d8] transition-colors hover:border-[#facc15] hover:text-[#fafafa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#facc15]"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {CONTACT_INFO.channels.map((channel) => (
              <div
                key={channel.id}
                className="flex flex-col gap-3 border border-white/10 bg-[#14141b]/85 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <ChannelIcon type={channel.type} />
                  <div className="min-w-0">
                    <p className="font-mono-tabular text-[10px] font-semibold tracking-[0.16em] text-[#a1a1aa] uppercase">
                      {channel.label}
                    </p>
                    <p className="font-mono-tabular mt-0.5 break-all text-sm font-semibold text-[#fafafa]">
                      {channel.value}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {channel.actions.map((action) => {
                    const isExternal = action.href.startsWith('http');
                    return (
                      <a
                        key={action.label}
                        href={action.href}
                        target={isExternal ? '_blank' : undefined}
                        rel={isExternal ? 'noopener noreferrer' : undefined}
                        className={`font-mono-tabular inline-flex min-h-[44px] flex-1 cursor-pointer items-center justify-center gap-1.5 border px-3 py-1.5 text-[11px] font-bold tracking-wider uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#facc15] sm:min-h-[36px] sm:flex-none ${
                          action.kind === 'whatsapp'
                            ? 'border-[#4ade80]/50 bg-[#0c2415] text-[#86efac] hover:border-[#4ade80] hover:text-[#bbf7d0]'
                            : action.kind === 'instagram'
                              ? 'border-[#ff5500]/50 bg-[#261108] text-[#fdba74] hover:border-[#ff5500] hover:text-[#fed7aa]'
                              : 'border-[#facc15]/50 bg-[#1d180a] text-[#fde047] hover:border-[#facc15] hover:text-[#fef08a]'
                        }`}
                      >
                        <ActionIcon kind={action.kind} />
                        <span>{action.label}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
