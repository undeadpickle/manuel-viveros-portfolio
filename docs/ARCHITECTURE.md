# Architecture Overview

## System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Vercel (Hosting)                         │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    Next.js Application                     │  │
│  │  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐   │  │
│  │  │   /en/*     │    │   /es/*     │    │  /studio    │   │  │
│  │  │  English    │    │  Spanish    │    │  Sanity UI  │   │  │
│  │  └─────────────┘    └─────────────┘    └─────────────┘   │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ GROQ Queries
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Sanity.io (CMS + CDN)                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │    Artwork      │  │    Journal      │  │  Site Settings  │  │
│  │  - Paintings    │  │  - Blog posts   │  │  - Contact      │  │
│  │  - Sculptures   │  │  - Travel       │  │  - Social       │  │
│  │  - Sketches     │  │  - Gallery      │  │  - SEO          │  │
│  │  - Photography  │  │                 │  │                 │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
│                              │                                   │
│                    Sanity Image CDN                              │
│              (auto-optimization, WebP, resizing)                 │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ Video Embeds
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                       YouTube / Vimeo                            │
│                    (video hosting, free)                         │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Content Publishing Flow
```
Manuel (CMS)          Sanity Studio         Sanity Content Lake
    │                     │                        │
    │ 1. Upload image     │                        │
    ├────────────────────>│                        │
    │                     │ 2. Store to CDN        │
    │                     ├───────────────────────>│
    │ 3. Fill metadata    │                        │
    ├────────────────────>│                        │
    │                     │ 4. Save document       │
    │ 5. Click Publish    ├───────────────────────>│
    ├────────────────────>│                        │
    │                     │                        │
    │              Content immediately available    │
```

### Page Request Flow
```
User                  Next.js (Vercel)           Sanity API
 │                         │                         │
 │ 1. GET /en/paintings    │                         │
 ├────────────────────────>│                         │
 │                         │ 2. GROQ query           │
 │                         ├────────────────────────>│
 │                         │ 3. Return documents     │
 │                         │<────────────────────────┤
 │                         │                         │
 │                         │ 4. Render React         │
 │ 5. HTML + images        │                         │
 │<────────────────────────┤                         │
 │                         │                         │
 │ 6. User clicks image    │                         │
 ├────────────────────────>│                         │
 │ 7. Lightbox opens       │                         │
 │   (client-side)         │                         │
```

## Component Hierarchy

```
RootLayout (src/app/layout.tsx)
└── [lang]/Layout (src/app/[lang]/layout.tsx)
    ├── Header
    │   ├── Logo (signature)
    │   ├── Navigation
    │   │   └── NavLink (for each page)
    │   └── LanguageToggle
    │
    ├── Main Content (page-specific)
    │   │
    │   ├── HomePage
    │   │   ├── Hero
    │   │   ├── FeaturedGrid
    │   │   │   └── ArtworkCard[]
    │   │   └── ArtistStatement
    │   │
    │   ├── GalleryPage (paintings, sculptures, etc.)
    │   │   └── ThumbnailGrid
    │   │       └── ImageCard[]
    │   │           └── onClick → Lightbox
    │   │
    │   ├── JournalsPage
    │   │   └── JournalCard[]
    │   │
    │   ├── JournalDetailPage
    │   │   ├── JournalContent (Portable Text)
    │   │   └── Gallery (if present)
    │   │
    │   └── ContactPage
    │       ├── ContactInfo
    │       └── SocialLinks
    │
    └── Footer
        ├── ContactInfo
        ├── SocialLinks
        └── Copyright
```

## Lightbox Architecture

```
Page Component
    │
    │ manages selectedIndex state
    │
    ├── ThumbnailGrid
    │   └── onClick(index) → setSelectedIndex(index)
    │
    └── {selectedIndex !== null && (
          <Lightbox
            images={allImages}
            currentIndex={selectedIndex}
            onClose={() => setSelectedIndex(null)}
            onPrev={() => setSelectedIndex(prev)}
            onNext={() => setSelectedIndex(next)}
          />
        )}

Lightbox (Portal to document.body)
├── Overlay (semi-transparent black)
├── Image (full-size, centered)
├── Controls
│   ├── CloseButton (top-right, ESC key)
│   ├── PrevButton (left arrow key)
│   └── NextButton (right arrow key)
├── Counter ("3 of 25")
└── Caption (title, medium, year)
```

## Caching Strategy

| Content Type | Caching | Revalidation |
|-------------|---------|--------------|
| Server pages | ISR | 60 seconds (via `sanityFetch`) |
| Client pages | None | Fresh on each load |
| Images | CDN | Immutable (content-addressed) |
| Sanity queries | useCdn: true (prod) | Real-time (dev) |

## Mobile Responsiveness

```
Breakpoints (Tailwind defaults):
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px

Gallery Grid:
- Mobile (< 640px):    1 column
- Tablet (640-1023px): 2 columns
- Desktop (≥ 1024px):  3-4 columns

Navigation:
- Mobile: Hamburger menu → slide-in drawer
- Desktop: Horizontal nav links
```
