# Manuel Viveros Portfolio

A minimalist, bilingual portfolio website for artist Manuel Viveros showcasing paintings, sculptures, sketches, photography, and travel journals.

## Quick Reference

```bash
# Development
npm run dev          # Start dev server (port 3000) with Turbopack
npm run sanity       # Start Sanity Studio locally
npm run build        # Production build
npm run typecheck    # TypeScript type checking
npm run lint         # ESLint
```

## Architecture

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS v4
- **CMS**: Sanity.io (headless)
- **Animations**: Framer Motion
- **Deployment**: Vercel

## Project Structure

```
src/
├── app/
│   ├── [lang]/              # i18n route segment (en/es)
│   │   ├── page.tsx         # Home
│   │   ├── paintings/       # Paintings gallery → /es/pinturas
│   │   ├── sculptures/      # Sculptures → /es/esculturas
│   │   ├── sketches/        # Sketches → /es/bocetos
│   │   ├── photography/     # Photography → /es/fotografia
│   │   ├── journals/        # Journals → /es/diario
│   │   │   └── [slug]/      # Individual journal entry
│   │   └── contact/         # Contact → /es/contacto
│   ├── layout.tsx           # Root layout (passthrough)
│   └── globals.css          # Global styles + Tailwind
├── components/
│   ├── layout/              # Header, Footer, Navigation
│   ├── gallery/             # ThumbnailGrid, Lightbox, VideoPlayer
│   ├── journal/             # JournalCard, JournalContent
│   └── ui/                  # Reusable UI components
├── lib/
│   ├── sanity.ts            # Sanity client + image helpers
│   ├── queries.ts           # GROQ queries
│   └── i18n.ts              # Internationalization utilities
├── dictionaries/
│   ├── en.json              # English UI strings
│   └── es.json              # Spanish UI strings
└── middleware.ts            # Locale detection + redirects

sanity/
├── schemas/
│   ├── artwork.ts           # Paintings, sculptures, sketches, photography
│   ├── journal.ts           # Travel/blog entries
│   └── siteSettings.ts      # Global config (contact, social, SEO)
└── sanity.config.ts
```

## Key Patterns

### Bilingual Content
All content is stored with both languages in Sanity:
```typescript
// In Sanity schema
{ name: 'title', type: 'object', fields: [
  { name: 'en', type: 'string' },
  { name: 'es', type: 'string' }
]}

// In components - use helper
import { getLocalizedValue } from '@/lib/i18n'
const title = getLocalizedValue(artwork.title, lang)
```

### URL Routing
- English: `/en/paintings`, `/en/sculptures`, etc.
- Spanish: `/es/pinturas`, `/es/esculturas`, etc.
- Middleware auto-redirects `/` → `/en`
- Route mappings in `src/lib/i18n.ts`

### Gallery Pages
All gallery pages follow the same pattern:
1. Fetch artwork by category from Sanity
2. Display in responsive grid (ThumbnailGrid component)
3. Click opens Lightbox with prev/next navigation

### Images
Images are served via Sanity CDN with automatic optimization:
```typescript
import { urlFor, getImageUrl, getBlurUrl } from '@/lib/sanity'

// In component
<Image
  src={getImageUrl(artwork.image, 800, 600)}
  placeholder="blur"
  blurDataURL={getBlurUrl(artwork.image)}
/>
```

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
```

See `.env.example` for full list.

## Sanity Studio

- **Local**: `npm run sanity` or visit `http://localhost:3000/studio`
- **Production**: Will be at `/studio` route

### Content Types
- **Artwork**: Paintings, sculptures, sketches, photography (categorized)
- **Journal**: Combined travel stories and blog posts
- **Site Settings**: Contact info, social links, artist statement, SEO

## Color Palette

Defined in `globals.css`:
- `--color-ink`: #1a1a1a (near-black)
- `--color-paper`: #fafafa (off-white)
- `--color-accent`: #8b7355 (warm brown/sepia)

## Documentation

For detailed docs, see the `docs/` folder:
- `ARCHITECTURE.md` - System design and data flow
- `SANITY_SCHEMAS.md` - CMS schema reference
- `I18N.md` - Internationalization guide
- `DEPLOYMENT.md` - Vercel deployment guide
