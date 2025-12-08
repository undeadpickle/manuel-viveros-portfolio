# Manuel Viveros Portfolio

A minimalist, bilingual portfolio website for artist Manuel Viveros Segura, showcasing paintings, sculptures, sketches, photography, and travel journals.

## Features

- **Bilingual** - English (default) and Spanish
- **Hero Slideshow** - Full-screen autoplaying slideshow with CMS-controlled settings
- **Gallery System** - Thumbnail grid with lightbox slideshow
- **CMS Integration** - Sanity.io for easy content management
- **SEO Optimized** - Dynamic meta tags, structured data, sitemap
- **Mobile First** - Responsive design across all devices
- **Performance** - Image optimization via Sanity CDN

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS v4
- **CMS**: Sanity.io
- **Animations**: Framer Motion
- **Hosting**: Vercel
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Sanity account (free tier)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/undeadpickle/manuel-viveros-portfolio.git
cd manuel-viveros-portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your Sanity project credentials
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

### Sanity Studio

Access the content management studio at [http://localhost:3000/studio](http://localhost:3000/studio) (requires Sanity account).

## Project Structure

```
├── src/
│   ├── app/[lang]/      # Pages with i18n routing
│   ├── components/      # React components
│   ├── lib/             # Utilities (Sanity client, i18n)
│   └── dictionaries/    # UI translations (en.json, es.json)
├── sanity/
│   └── schemas/         # CMS content models
├── scripts/             # Content migration scripts (Wix → Sanity)
├── data/                # Migration metadata (generated)
├── docs/                # Documentation
└── CLAUDE.md           # AI assistant context
```

## Scripts

```bash
npm run dev        # Start development server
npm run build      # Production build
npm run start      # Start production server
npm run lint       # Run ESLint
npm run typecheck  # TypeScript type checking
npm run sanity     # Start Sanity Studio locally
```

## Documentation

- [Architecture](./docs/ARCHITECTURE.md) - System design and data flow
- [Sanity Schemas](./docs/SANITY_SCHEMAS.md) - CMS content model reference
- [i18n Guide](./docs/I18N.md) - Internationalization patterns
- [Deployment](./docs/DEPLOYMENT.md) - Vercel deployment guide

## License

Private - All rights reserved.

---

Built with Next.js and Sanity for Manuel Viveros Segura.
