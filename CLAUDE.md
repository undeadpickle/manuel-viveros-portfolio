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
│   │   ├── page.tsx         # Home (server wrapper)
│   │   ├── HomePageClient.tsx  # Home page client component
│   │   ├── paintings/       # Paintings gallery
│   │   ├── sculptures/      # Sculptures gallery
│   │   ├── sketches/        # Sketches gallery
│   │   ├── photography/     # Photography gallery
│   │   ├── journals/        # Journals listing
│   │   │   └── [slug]/      # Individual journal entry
│   │   ├── contact/         # Contact page
│   │   └── layout.tsx       # Lang layout with Header/Footer
│   ├── layout.tsx           # Root layout (passthrough)
│   └── globals.css          # Global styles + Tailwind
├── components/
│   ├── layout/              # Header, Footer, PageTransition
│   ├── gallery/             # ThumbnailGrid, Lightbox, GalleryPage
│   └── ui/                  # SocialLinks, reusable components
├── lib/
│   ├── sanity.ts            # Sanity client + image helpers
│   ├── queries.ts           # GROQ queries
│   └── i18n.ts              # Internationalization utilities
├── dictionaries/
│   ├── index.ts             # Dictionary loader
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
- Spanish: `/es/paintings`, `/es/sculptures`, etc. (same paths, different lang prefix)
- Middleware auto-redirects `/` → `/en`
- Route translations defined in `src/lib/i18n.ts` (for future localized URLs)

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
