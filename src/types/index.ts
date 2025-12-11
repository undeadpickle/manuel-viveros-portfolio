import type { PortableTextBlock } from '@portabletext/types'

/**
 * Journal/blog entry from Sanity CMS
 */
export interface Journal {
  _id: string
  title: { en: string; es: string }
  slug: { current: string }
  publishedAt: string
  coverImage?: { asset: { _ref: string } }
  excerpt?: { en: string; es: string }
  content?: { en: PortableTextBlock[]; es: PortableTextBlock[] }
  gallery?: { asset: { _ref: string } }[]
  location?: string
  tags?: string[]
}

/**
 * Hero slideshow configuration from Sanity siteSettings
 */
export interface HeroSlideshowSettings {
  enabled?: boolean
  duration?: number
  transitionDuration?: number
  showIndicators?: boolean
  pauseOnHover?: boolean
  randomizeOrder?: boolean
}

/**
 * Individual slide in the hero slideshow
 */
export interface HeroSlide {
  _id: string
  title?: { en?: string; es?: string }
  slug?: { current?: string }
  category?: string
  image: {
    asset: { _ref: string }
    hotspot?: { x: number; y: number }
  }
  year?: number
  medium?: { en?: string; es?: string }
}
