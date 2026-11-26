import { useEffect, useRef } from 'react';
import { AtSign, Mail, MapPin, MessageCircle, Phone, X } from 'lucide-react';
import { CONTACT_INFO, type ContactChannel } from '../data/contactInfo';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ChannelIcon({ id }: { id: ContactChannel['id'] }) {
  switch (id) {
    case 'phone':
      return <Phone className="h-4 w-4 text-[#facc15]" aria-hidden="true" />;
    case 'whatsapp':
      return <MessageCircle className="h-4 w-4 text-[#facc15]" aria-hidden="true" />;
    case 'email':
      return <Mail className="h-4 w-4 text-[#facc15]" aria-hidden="true" />;
    case 'instagram':
      return <AtSign className="h-4 w-4 text-[#ff5500]" aria-hidden="true" />;
    case 'venue':
      return <MapPin className="h-4 w-4 text-[#ff5500]" aria-hidden="true" />;
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

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="no-print fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs"
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
        className="animate-enter-up w-full max-w-lg border border-white/15 bg-[#0e0e13]/95 shadow-[0_28px_75px_rgba(0,0,0,0.92),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md"
      >
        <div className="hazard-stripe h-1.5 w-full border-b border-white/10" aria-hidden="true" />

        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <p className="font-mono-tabular text-[10px] font-semibold tracking-[0.2em] text-[#facc15] uppercase">
                {CONTACT_INFO.subheading}
              </p>
              <h2
                id="contact-modal-title"
                className="font-display mt-1 text-2xl tracking-wide text-[#fafafa] uppercase sm:text-3xl"
              >
                {CONTACT_INFO.heading}
              </h2>
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

          <div className="mt-4 space-y-2.5">
            {CONTACT_INFO.channels.map((channel) => (
              <div
                key={channel.id}
                className="flex items-center justify-between gap-3 border border-white/10 bg-[#14141b]/85 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <ChannelIcon id={channel.id} />
                  <div>
                    <p className="font-mono-tabular text-[10px] font-semibold tracking-[0.16em] text-[#a1a1aa] uppercase">
                      {channel.label}
                    </p>
                    {channel.href ? (
                      <a
                        href={channel.href}
                        target={channel.href.startsWith('http') ? '_blank' : undefined}
                        rel={channel.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="mt-0.5 inline-block text-sm font-semibold text-[#facc15] underline decoration-[#facc15]/50 underline-offset-2 hover:text-[#fde047] focus-visible:outline-2 focus-visible:outline-[#facc15]"
                      >
                        {channel.value}
                      </a>
                    ) : (
                      <p className="mt-0.5 text-sm font-medium text-[#d4d4d8]">
                        {channel.value}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {CONTACT_INFO.note && (
            <p className="mt-4 border-t border-white/10 pt-3 text-xs text-[#a1a1aa]">
              {CONTACT_INFO.note}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
