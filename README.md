# Aveyo Illinois Landing Page

A modern, responsive landing page for Aveyo with a multi-step form for solar energy quotes.

## Features

- **Multi-step Form**: 6-step form collecting:
  - ZIP code
  - Home ownership status
  - Average monthly electric bill
  - Email address
  - Name (first and last)
  - Phone number

- **Modern Tech Stack**:
  - Next.js 14 (App Router)
  - TypeScript
  - Tailwind CSS
  - Responsive design

- **Aveyo Branding**:
  - Brand-aligned messaging: "Powering what matters most"
  - Custom gradient backgrounds
  - Professional UI with smooth transitions

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/lahvjal/aveyo-LP.git
cd aveyo-LP
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` from `.env.example` and configure:

```bash
cp .env.example .env.local
```

- `GHL_WEBHOOK_URL`: the GoHighLevel inbound webhook URL
- `META_PIXEL_ID`: the Meta Pixel ID

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
├── app/
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/
│   └── MultiStepForm.tsx # Multi-step form component
├── public/               # Static assets
└── tailwind.config.ts    # Tailwind configuration
```

## Deployment

The project is optimized for deployment on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/lahvjal/aveyo-LP)

## Form Integration

All forms submit to the same-origin `POST /api/leads` route. The server validates the payload and forwards it to GoHighLevel. After GoHighLevel accepts the submission, the browser sends a Meta Pixel `Lead` event with a unique event ID. The Conversions API Gateway connected to the Pixel forwards the corresponding server event and uses that event ID for deduplication.

The GoHighLevel webhook URL is server-only and is not included in the browser bundle. Meta authentication is managed by the connected Conversions API Gateway; this application does not store or send a Meta access token.

### Required Meta Events Manager setting

Turn off **Track events automatically without code** for this Pixel in Meta Events Manager. The application already sends an explicit `Lead` only after GoHighLevel accepts the submission. Leaving automatic event detection enabled can create an additional browser `Lead` with a different event ID and double-count one form submission.

Do not disable Pixel `autoConfig` in the website code. The Conversions API Gateway uses Meta-delivered Pixel configuration to forward server events.

## Customization

- **Colors**: Edit `tailwind.config.ts` to change the color scheme
- **Copy**: Update text in `app/page.tsx` and `components/MultiStepForm.tsx`
- **Images**: Replace images in the `public/` directory

## License

© 2026 Aveyo. All rights reserved.
