# UNFRAME EVENTS — ORIGIN (REP YOUR STYLE) Registration

Single-screen, production-ready React + TypeScript + Tailwind CSS registration app for **ORIGIN (Rep Your Style)** presented by **UNFRAME EVENTS** in **Delhi** on **17 January 2027**.

## Event Summary

- **Presenter:** UNFRAME EVENTS
- **Event:** ORIGIN (REP YOUR STYLE)
- **Battle Date:** 17 January 2027
- **City:** Delhi
- **Cash Prize:** Winner ₹15,000/- | Runner Up ₹10,000/-

## Collected Form Fields

- Full Legal Name
- Stage Name
- Age (`12–65`)
- City
- Contact Number (10-digit Indian mobile)
- PAN or Aadhaar Card (Last 6 digits / characters)
- Rules & on-site ID verification confirmation checkbox

## Connect Google Sheets (Production Setup)

1. Open or create a Google Sheet → **Extensions → Apps Script**.
2. Paste [`google-apps-script/Code.gs`](google-apps-script/Code.gs) and save.
3. *(Optional)* In Apps Script **Project Settings → Script Properties**, add `WEBHOOK_TOKEN` with a secret string.
4. Click **Deploy → New deployment → Web app**:
   - **Execute as:** Me
   - **Who has access:** Anyone
5. Copy the generated Web App URL (`https://script.google.com/macros/s/.../exec`), then choose one deployment mode:

### Option A — Direct Static Hosting (Netlify / Cloudflare Pages / Local / Vite)

Create `.env` from `.env.example` and set:

```bash
VITE_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
# Optional if WEBHOOK_TOKEN is set in Apps Script:
VITE_WEBHOOK_TOKEN=your_secret_token
```

### Option B — Vercel Production Proxy (Recommended for Safari + Hidden Token)

1. Set `VITE_API_ENDPOINT=/api/register` during build (or in Vercel Project Environment Variables).
2. Set `GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec` (and optional `WEBHOOK_TOKEN`) in Vercel Environment Variables.
3. [`api/register.ts`](api/register.ts) validates submissions server-side and forwards them to Google Sheets with zero browser CORS issues.

## Local Development & Verification

```bash
npm install
npm run dev
npm test
npm run typecheck
npm run build
```

## Image Attributions (Wikimedia Commons)

- `src/assets/battle/arena-stage.jpg` — *Baltic session world finals* by Earlyymoss (CC BY-SA 3.0)
- `src/assets/battle/freeze-airchair.jpg` — *Airchair* by Kenny Mahadewsing (CC BY-SA 4.0)
- `src/assets/battle/street-headspin.jpg` — *B-boy* by boltron (CC BY-SA 2.0)
- `src/assets/battle/cypher-ring.jpg` — *Breakdance cypher* by NexusMoves (CC BY-SA 3.0)
