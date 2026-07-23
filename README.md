# Injection Calculator

Clinical web app for anti-VEGF injection interval calculation and 2D barcode (QR) generation.

Built from the Stage 1 / Stage 2 calculator specification.

## Features

### Stage 1 — Interval calculator
- Enter **Date of last injection** and **Date of OCT-m**
- **No. of weeks** = OCT-m − last injection (rounded whole weeks)
- **Keep** / **Extend +2** / **Shorten −2** → sets **Next injection** weeks
- Number pad + **Today** for touch-friendly entry

### Stage 2 — Clinical options & barcode
- Carries forward next-injection weeks from Stage 1
- **Recent past / upcoming injection** date
- Required exclusive choices: **RE | LE**, **wAMD | PCV**, drug (**Eylea 8mg | Eylea 2mg | Vabysmo | Lucentis**)
- Optional: **RE only eye | LE only eye**, **FU + OCT-m 1 week before**
- **Enter** generates QR (2D barcode) with the clinical text payload

### Q-week calculation
```
Q weeks = Next injection weeks + weeks(recent injection − today)
```
- Recent = today → same as next injection weeks  
- Recent earlier than today → subtract week difference  
- Recent later than today → add week difference  

### Barcode text template
```
<<< List: {eye} {drug}; {eye} {diagnosis}; Q{n}wk  MP {eye}
Amsler grid, AREDS2 info
[Protect RE | Protect LE if only-eye selected]
FU Same Day VR Clinic VA IOP MPBE
<<< OCT-m BE n/v MPBE
```
If **FU + OCT-m 1 week before** is selected, FU line becomes:
`FU VR Clinic 1/52 before injection VA IOP MPBE`

## Tech
- Next.js (App Router) + TypeScript + Tailwind CSS
- `qrcode` for 2D barcode generation
- Deploy-ready for Vercel

## Local development

```bash
cd injection-calculator
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy on Vercel

1. Push this repo to GitHub
2. Import the project in [Vercel](https://vercel.com/new)
3. Framework: **Next.js** (auto-detected)
4. Deploy

Or with Vercel CLI:

```bash
npx vercel
```

## Date entry
- Tap a date field, then type **DDMM** (year defaults to **2026**) or full **DDMMYYYY**
- Or press **Today**
