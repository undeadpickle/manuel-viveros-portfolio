import { getDictionary } from '@/dictionaries'
import { validateLocale } from '@/lib/i18n'
import { sanityFetch } from '@/lib/sanity'
import { featuredArtworkQuery, recentJournalsQuery, siteSettingsQuery, heroSlidesQuery } from '@/lib/queries'
import type { Artwork } from '@/components/gallery'
import type { Journal, HeroSlide } from '@/types'
import HomePageClient from './HomePageClient'

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
  const lang = validateLocale(langParam)

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
