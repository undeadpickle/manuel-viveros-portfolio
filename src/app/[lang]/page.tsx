import { getDictionary } from '@/dictionaries'
import { type Locale } from '@/lib/i18n'
import { sanityFetch } from '@/lib/sanity'
import { featuredArtworkQuery, recentJournalsQuery, siteSettingsQuery, heroSlidesQuery } from '@/lib/queries'
import type { Artwork } from '@/components/gallery'
import HomePageClient from './HomePageClient'

interface Journal {
  _id: string
  title: { en: string; es: string }
  slug: { current: string }
  publishedAt: string
  coverImage?: { asset: { _ref: string } }
  excerpt?: { en: string; es: string }
  location?: string
}

interface HeroSlide {
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

interface SiteSettings {
  artistName?: string
  tagline?: { en: string; es: string }
  artistStatement?: { en: string; es: string }
  signature?: { asset: { _ref: string } }
  heroSlideshow?: {
    enabled?: boolean
    duration?: number
    transitionDuration?: number
    showIndicators?: boolean
    pauseOnHover?: boolean
    randomizeOrder?: boolean
  }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang: langParam } = await params
  const lang = langParam as Locale

  // Fetch all data server-side with revalidation (60s default)
  const [dictionary, featuredArtwork, recentJournals, siteSettings, heroSlides] = await Promise.all([
    getDictionary(lang),
    sanityFetch<Artwork[]>(featuredArtworkQuery),
    sanityFetch<Journal[]>(recentJournalsQuery),
    sanityFetch<SiteSettings | null>(siteSettingsQuery),
    sanityFetch<HeroSlide[]>(heroSlidesQuery),
  ])

  return (
    <HomePageClient
      lang={lang}
      dictionary={dictionary}
      featuredArtwork={featuredArtwork || []}
      recentJournals={recentJournals || []}
      siteSettings={siteSettings}
      heroSlides={heroSlides || []}
    />
  )
}
