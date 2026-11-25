# unframe-origin-registration

Single-screen, production-ready athlete registration web application for **UNFRAME EVENTS presents ORIGIN (REP YOUR STYLE)** in **Delhi** on **17 January 2027**.

- **Repository:** https://github.com/MadhavVashisht/unframe-origin-registration
- **Stack:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Vercel Serverless API + Google Apps Script

## Event Details

| Field | Value |
| --- | --- |
| **Presenter** | UNFRAME EVENTS |
| **Event** | ORIGIN (REP YOUR STYLE) |
| **Battle Date** | 17 January 2027 |
| **City** | Delhi |
| **Winner Cash Prize** | ₹15,000/- |
| **Runner Up Cash Prize** | ₹10,000/- |

## Features & Form Fields

- **Single-Screen Desktop Layout:** Non-scrollable desktop viewport featuring a live ticker marquee, interactive 4-scene battle poster backdrop, prize pool card, and 2-column registration form.
- **Validated Athlete Inputs:**
  - **Name** (full legal name matching Government ID)
  - **Stage Name** (battle / dancer alias)
  - **Age** (`12–65`)
  - **City** (with Delhi quick-pick and NCR/metro suggestions)
  - **Contact Number** (normalizes `+91` / `0` prefixes and validates 10-digit Indian mobile numbers)
  - **PAN or Aadhaar Card (Last 6 Digits / Characters)** (auto-uppercases and detects Aadhaar 6-digit vs. PAN tail format)
  - **Rules & On-Site Check-In Consent Checkbox**
- **Instant Digital Athlete Pass:** Issues a printable `ORG27-XXXX` pass with clipboard summary copy after confirmed submission.

## Project Structure

```text
├── api/
│   └── register.ts                  # Vercel serverless proxy for Google Sheets
├── google-apps-script/
│   └── Code.gs                      # Google Sheets Web App handler (doGet + doPost)
├── src/
│   ├── assets/battle/               # Bundled street-dance battle photography
│   ├── components/
│   │   ├── BattleMarquee.tsx        # Top presenter & event ticker bar
│   │   ├── BeatBars.tsx             # Animated audio-meter bars
│   │   ├── ConfirmationPass.tsx     # Printable digital battle pass
│   │   ├── EventPoster.tsx          # Interactive 4-scene poster & prize card
│   │   └── RegistrationForm.tsx     # Validated registration form
│   ├── services/
│   │   └── registrationService.ts   # Endpoint resolution & submission client
│   ├── types/
│   │   └── registration.ts          # TypeScript interfaces
│   ├── utils/
│   │   └── validation.ts            # Input normalization & field validation
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── tests/
│   ├── registrationService.test.ts
│   └── validation.test.ts
├── .env.example
└── vercel.json
```

## Quick Start (Local)

**Prerequisites:** Node.js 22.18+ or 24+ (for native TypeScript test execution).

```bash
git clone https://github.com/MadhavVashisht/unframe-origin-registration.git
cd unframe-origin-registration
npm install
cp .env.example .env
npm run dev
```

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite development server |
| `npm run build` | Type-check and build production bundle into `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run typecheck` | Run `tsc --noEmit` |
| `npm test` | Run unit tests via `node --test` |

## Connect Google Sheets (Production Setup)

1. Open or create a Google Sheet → **Extensions → Apps Script**.
2. Paste the contents of [`google-apps-script/Code.gs`](google-apps-script/Code.gs) and save.
3. *(Optional)* In Apps Script **Project Settings → Script Properties**, add `WEBHOOK_TOKEN` with a secret string.
4. Click **Deploy → New deployment → Web app**:
   - **Execute as:** Me
   - **Who has access:** Anyone
5. Copy the generated Web App URL (`https://script.google.com/macros/s/.../exec`), then choose one hosting option:

### Option A — Vercel Production Proxy (Recommended)

1. Import `MadhavVashisht/unframe-origin-registration` in Vercel.
2. Add Environment Variables in Vercel:
   - `VITE_API_ENDPOINT=/api/register`
   - `GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec`
   - `WEBHOOK_TOKEN=your_secret_token` *(optional, if set in Apps Script)*
3. Deploy — [`api/register.ts`](api/register.ts) validates requests server-side, strips client-exposed tokens, and avoids Safari cross-origin redirect issues.

### Option B — Direct Static Hosting (Netlify / Cloudflare Pages / Local)

Set these variables in `.env` (or your static host's build environment):

```bash
VITE_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
VITE_WEBHOOK_TOKEN=your_secret_token
```

## Image Attributions (Wikimedia Commons)

- `src/assets/battle/arena-stage.jpg` — *Baltic session world finals* by Earlyymoss (CC BY-SA 3.0)
- `src/assets/battle/freeze-airchair.jpg` — *Airchair* by Kenny Mahadewsing (CC BY-SA 4.0)
- `src/assets/battle/street-headspin.jpg` — *B-boy* by boltron (CC BY-SA 2.0)
- `src/assets/battle/cypher-ring.jpg` — *Breakdance cypher* by NexusMoves (CC BY-SA 3.0)
