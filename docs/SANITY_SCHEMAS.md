# Sanity Schema Reference

## Overview

The CMS has three document types:
1. **Artwork** - Paintings, sculptures, sketches, photography
2. **Journal** - Travel stories and blog posts
3. **Site Settings** - Global configuration (singleton)

## Artwork Schema

Location: `sanity/schemas/artwork.ts`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | `{ en: string, es: string }` | Yes | Bilingual title |
| `slug` | `slug` | Yes | URL-safe identifier |
| `category` | `string` | Yes | One of: `painting`, `sculpture`, `sketch`, `photography` |
| `image` | `image` | Yes | Main artwork image (with hotspot) |
| `videoUrl` | `url` | No | YouTube/Vimeo URL for video works |
| `year` | `number` | No | Year created (1900-current) |
| `dimensions` | `string` | No | e.g., "24\" x 36\"" |
| `medium` | `{ en: string, es: string }` | No | e.g., "Oil on canvas" |
| `description` | `{ en: text, es: text }` | No | Longer description |
| `featured` | `boolean` | No | Show on homepage (default: false) |
| `order` | `number` | No | Display order (lower = first) |

### Example GROQ Query
```groq
*[_type == "artwork" && category == "painting"] | order(order asc) {
  _id,
  title,
  slug,
  image,
  year,
  medium
}
```

## Journal Schema

Location: `sanity/schemas/journal.ts`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | `{ en: string, es: string }` | Yes | Bilingual title |
| `slug` | `slug` | Yes | URL-safe identifier |
| `publishedAt` | `datetime` | Yes | Publication date |
| `coverImage` | `image` | Yes | Cover/preview image |
| `excerpt` | `{ en: text, es: text }` | No | Short preview text |
| `content` | `{ en: portableText[], es: portableText[] }` | No | Rich text with embedded images |
| `gallery` | `image[]` | No | Optional photo gallery |
| `location` | `string` | No | Where it was written/took place |
| `tags` | `string[]` | No | Categorization tags |

### Portable Text (content field)
Supports:
- Standard text formatting (bold, italic, links)
- Block quotes
- Embedded images with caption and alt text

### Example GROQ Query
```groq
*[_type == "journal"] | order(publishedAt desc) [0...10] {
  _id,
  title,
  slug,
  publishedAt,
  coverImage,
  excerpt,
  location
}
```

## Site Settings Schema

Location: `sanity/schemas/siteSettings.ts`

This is a **singleton** - only one document exists.

| Field | Type | Description |
|-------|------|-------------|
| `artistName` | `string` | "Manuel Viveros Segura" |
| `tagline` | `{ en: string, es: string }` | Site tagline |
| `artistStatement` | `{ en: text, es: text }` | Homepage statement |
| `signature` | `image` | Artist signature for header |
| `email` | `string` | Contact email |
| `phone` | `string` | Contact phone |
| `socialLinks` | `array` | Social media links |
| `seo` | `object` | Meta title, description, OG image |

### Social Links Structure
```typescript
{
  platform: 'instagram' | 'facebook' | 'tiktok' | 'youtube' | 'twitter' | 'linkedin' | 'behance',
  url: string
}
```

### Example GROQ Query
```groq
*[_type == "siteSettings"][0] {
  artistName,
  tagline,
  artistStatement,
  signature,
  email,
  phone,
  socialLinks[] {
    platform,
    url
  }
}
```

## TypeScript Types

For type safety, define these in `src/types/sanity.ts`:

```typescript
export interface LocalizedString {
  en?: string
  es?: string
}

export interface LocalizedText {
  en?: any[] // Portable Text blocks
  es?: any[]
}

export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
}

export interface Artwork {
  _id: string
  title: LocalizedString
  slug: { current: string }
  category: 'painting' | 'sculpture' | 'sketch' | 'photography'
  image: SanityImage
  videoUrl?: string
  year?: number
  dimensions?: string
  medium?: LocalizedString
  description?: LocalizedString
  featured?: boolean
  order?: number
}

export interface Journal {
  _id: string
  title: LocalizedString
  slug: { current: string }
  publishedAt: string
  coverImage: SanityImage
  excerpt?: LocalizedString
  content?: LocalizedText
  gallery?: SanityImage[]
  location?: string
  tags?: string[]
}

export interface SiteSettings {
  artistName: string
  tagline: LocalizedString
  artistStatement: LocalizedString
  signature: SanityImage
  email: string
  phone: string
  socialLinks: Array<{
    platform: string
    url: string
  }>
  seo: {
    metaTitle: LocalizedString
    metaDescription: LocalizedString
    ogImage: SanityImage
  }
}
```

## Studio Structure

The Sanity Studio is organized for easy content management:

```
Content
├── Site Settings (singleton)
├── ─────────────
├── Paintings / Pinturas
├── Sculptures / Esculturas
├── Sketches / Bocetos
├── Photography / Fotografía
├── All Artwork / Todo el Arte
├── ─────────────
└── Journals / Diario
```

Each artwork category shows filtered documents for easier navigation.
