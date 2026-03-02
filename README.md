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

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

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

To connect the form to your backend API, update the `handleSubmit` function in `components/MultiStepForm.tsx`:

```typescript
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault()
  if (validateStep()) {
    await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    setSubmitted(true)
  }
}
```

## Customization

- **Colors**: Edit `tailwind.config.ts` to change the color scheme
- **Copy**: Update text in `app/page.tsx` and `components/MultiStepForm.tsx`
- **Images**: Replace images in the `public/` directory

## License

© 2026 Aveyo. All rights reserved.
