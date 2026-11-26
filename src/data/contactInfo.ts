export interface ContactChannel {
  id: 'phone' | 'whatsapp' | 'email' | 'instagram' | 'venue';
  label: string;
  value: string;
  href?: string;
}

const CHANNELS: ContactChannel[] = [
  {
    id: 'phone',
    label: 'CALL / WHATSAPP',
    value: 'Details coming soon',
  },
  {
    id: 'email',
    label: 'EMAIL',
    value: 'Details coming soon',
  },
  {
    id: 'instagram',
    label: 'INSTAGRAM',
    value: 'Details coming soon',
  },
  {
    id: 'venue',
    label: 'BATTLE VENUE',
    value: 'Delhi (Venue TBA)',
  },
];

export const CONTACT_INFO = {
  heading: 'CONTACT UNFRAME EVENTS',
  subheading: 'ORIGIN (REP YOUR STYLE) — DELHI • 17 JANUARY 2027',
  note: 'Organizer contact details are being finalized and will be updated here shortly.',
  channels: CHANNELS,
};
