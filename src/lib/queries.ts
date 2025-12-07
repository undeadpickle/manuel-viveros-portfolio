import { groq } from 'next-sanity'

// ============================================
// ARTWORK QUERIES
// ============================================

// Get all artwork by category
export const artworkByCategoryQuery = groq`
  *[_type == "artwork" && category == $category] | order(order asc, year desc) {
    _id,
    title,
    slug,
    category,
    image,
    videoUrl,
    year,
    dimensions,
    medium,
    description,
    featured
  }
`

// Get featured artwork for homepage
export const featuredArtworkQuery = groq`
  *[_type == "artwork" && featured == true] | order(order asc) [0...8] {
    _id,
    title,
    slug,
    category,
    image,
    year,
    medium
  }
`

// Get hero slideshow images (max 6, no videos)
export const heroSlidesQuery = groq`
  *[_type == "artwork" && heroSlide == true && !defined(videoUrl)] | order(heroOrder asc) [0...6] {
    _id,
    title,
    slug,
    category,
    image,
    year,
    medium
  }
`

// Get single artwork by slug
export const artworkBySlugQuery = groq`
  *[_type == "artwork" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    category,
    image,
    videoUrl,
    year,
    dimensions,
    medium,
    description
  }
`

// Get all artwork slugs for static generation
export const allArtworkSlugsQuery = groq`
  *[_type == "artwork" && defined(slug.current)][].slug.current
`

// ============================================
// JOURNAL QUERIES
// ============================================

// Get all journal entries
export const allJournalsQuery = groq`
  *[_type == "journal"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    coverImage,
    excerpt,
    location,
    tags
  }
`

// Get single journal by slug
export const journalBySlugQuery = groq`
  *[_type == "journal" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    publishedAt,
    coverImage,
    excerpt,
    content,
    gallery,
    location,
    tags
  }
`

// Get all journal slugs for static generation
export const allJournalSlugsQuery = groq`
  *[_type == "journal" && defined(slug.current)][].slug.current
`

// Get recent journals for homepage
export const recentJournalsQuery = groq`
  *[_type == "journal"] | order(publishedAt desc) [0...3] {
    _id,
    title,
    slug,
    publishedAt,
    coverImage,
    excerpt,
    location
  }
`

// ============================================
// SITE SETTINGS QUERIES
// ============================================

// Get site settings (singleton)
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    artistName,
    tagline,
    artistStatement,
    signature,
    email,
    phone,
    socialLinks,
    seo,
    heroSlideshow
  }
`
