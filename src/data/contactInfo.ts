export interface ContactAction {
  label: string;
  href: string;
  kind: 'call' | 'whatsapp' | 'instagram';
}

export interface ContactChannel {
  id: string;
  type: 'phone' | 'instagram';
  label: string;
  value: string;
  actions: ContactAction[];
}

const CHANNELS: ContactChannel[] = [
  {
    id: 'phone-1',
    type: 'phone',
    label: 'CALL & WHATSAPP',
    value: '+91 89586 37291',
    actions: [
      { label: 'Call', href: 'tel:+918958637291', kind: 'call' },
      { label: 'WhatsApp', href: 'https://wa.me/918958637291', kind: 'whatsapp' },
    ],
  },
  {
    id: 'phone-2',
    type: 'phone',
    label: 'CALL & WHATSAPP',
    value: '+91 98189 83663',
    actions: [
      { label: 'Call', href: 'tel:+919818983663', kind: 'call' },
      { label: 'WhatsApp', href: 'https://wa.me/919818983663', kind: 'whatsapp' },
    ],
  },
  {
    id: 'instagram',
    type: 'instagram',
    label: 'INSTAGRAM',
    value: '@Unframeevents_',
    actions: [
      {
        label: 'Follow',
        href: 'https://www.instagram.com/Unframeevents_/',
        kind: 'instagram',
      },
    ],
  },
];

export const CONTACT_INFO = {
  heading: 'CONTACT US',
  subheading: 'UNFRAME EVENTS — ORIGIN (REP YOUR STYLE)',
  channels: CHANNELS,
};
