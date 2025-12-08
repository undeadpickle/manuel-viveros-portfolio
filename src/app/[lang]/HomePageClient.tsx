'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { getImageUrl } from '@/lib/sanity'
import { type Locale, getLocalizedValue } from '@/lib/i18n'
import type { Artwork } from '@/components/gallery'
import HeroSlideshow from '@/components/hero/HeroSlideshow'

interface Journal {
  _id: string
  title: { en: string; es: string }
  slug: { current: string }
  publishedAt: string
  coverImage?: { asset: { _ref: string } }
  excerpt?: { en: string; es: string }
  location?: string
}

interface HeroSlideshowSettings {
  enabled?: boolean
  duration?: number
  transitionDuration?: number
  showIndicators?: boolean
  pauseOnHover?: boolean
  randomizeOrder?: boolean
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
  heroSlideshow?: HeroSlideshowSettings
}

interface HomePageClientProps {
  lang: Locale
  dictionary: {
    home: {
      featuredWork: string
      viewAll: string
      recentJournals: string
      artistStatement: string
    }
    journal: {
      readMore: string
    }
  }
  featuredArtwork: Artwork[]
  recentJournals: Journal[]
  siteSettings: SiteSettings | null
  heroSlides: HeroSlide[]
}

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
}

export default function HomePageClient({
  lang,
  dictionary,
  featuredArtwork,
  recentJournals,
  siteSettings,
  heroSlides,
}: HomePageClientProps) {
  const artistStatement = siteSettings?.artistStatement
    ? getLocalizedValue(siteSettings.artistStatement, lang)
    : null

  const tagline = siteSettings?.tagline
    ? getLocalizedValue(siteSettings.tagline, lang)
    : null

  // Determine if we should show the slideshow
  const showSlideshow = heroSlides.length > 0 && siteSettings?.heroSlideshow?.enabled !== false

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {showSlideshow ? (
        <HeroSlideshow
          slides={heroSlides}
          settings={siteSettings?.heroSlideshow}
          tagline={tagline}
          artistName={siteSettings?.artistName}
        />
      ) : (
        <motion.section
          className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4"
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-wide text-[var(--color-ink)]">
            {siteSettings?.artistName || 'Manuel Viveros Segura'}
          </h1>
          <p className="mt-4 text-lg md:text-xl text-[var(--color-gray-500)] tracking-widest uppercase">
            {tagline || 'Arte Latinoamericano'}
          </p>
          {siteSettings?.signature && (
            <motion.div
              className="mt-8 opacity-60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <Image
                src={getImageUrl(siteSettings.signature, 200)}
                alt="Signature"
                width={150}
                height={60}
                className="object-contain"
              />
            </motion.div>
          )}
        </motion.section>
      )}

      {/* Featured Work Section */}
      <motion.section
        className="py-16 px-4 md:px-8 max-w-7xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={sectionVariants}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-light text-[var(--color-ink)]">
            {dictionary.home.featuredWork}
          </h2>
          <Link
            href={`/${lang}/paintings`}
            className="text-sm text-[var(--color-gray-500)] hover:text-[var(--color-accent)] transition-colors"
          >
            {dictionary.home.viewAll} →
          </Link>
        </div>

        {featuredArtwork.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {featuredArtwork.slice(0, 8).map((artwork) => (
              <motion.div key={artwork._id} variants={itemVariants} className="group">
                <Link href={`/${lang}/${artwork.category === 'painting' ? 'paintings' : artwork.category === 'sculpture' ? 'sculptures' : artwork.category === 'sketch' ? 'sketches' : 'photography'}`}>
                  <div className="relative aspect-square overflow-hidden bg-[var(--color-gray-100)]">
                    <Image
                      src={getImageUrl(artwork.image, 400)}
                      alt={getLocalizedValue(artwork.title, lang)}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>
                  <div className="mt-2">
                    <h3 className="text-sm font-medium text-[var(--color-ink)] truncate">
                      {getLocalizedValue(artwork.title, lang)}
                    </h3>
                    {artwork.year && (
                      <p className="text-xs text-[var(--color-gray-500)]">{artwork.year}</p>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p className="text-center text-[var(--color-gray-500)] py-8">
            {lang === 'en' ? 'Featured works coming soon' : 'Obras destacadas próximamente'}
          </p>
        )}
      </motion.section>

      {/* Recent Journals Section */}
      {recentJournals.length > 0 && (
        <motion.section
          className="py-16 px-4 md:px-8 max-w-7xl mx-auto bg-[var(--color-gray-50)]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={sectionVariants}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-light text-[var(--color-ink)]">
              {dictionary.home.recentJournals}
            </h2>
            <Link
              href={`/${lang}/journals`}
              className="text-sm text-[var(--color-gray-500)] hover:text-[var(--color-accent)] transition-colors"
            >
              {dictionary.home.viewAll} →
            </Link>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {recentJournals.map((journal) => (
              <motion.article key={journal._id} variants={itemVariants} className="group">
                <Link href={`/${lang}/journals/${journal.slug.current}`}>
                  {journal.coverImage && (
                    <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-gray-100)] mb-4">
                      <Image
                        src={getImageUrl(journal.coverImage, 600)}
                        alt={getLocalizedValue(journal.title, lang)}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <h3 className="text-lg font-medium text-[var(--color-ink)] group-hover:text-[var(--color-accent)] transition-colors">
                    {getLocalizedValue(journal.title, lang)}
                  </h3>
                  {journal.excerpt && (
                    <p className="mt-2 text-sm text-[var(--color-gray-500)] line-clamp-2">
                      {getLocalizedValue(journal.excerpt, lang)}
                    </p>
                  )}
                  <div className="mt-3 flex items-center gap-3 text-xs text-[var(--color-gray-400)]">
                    {journal.publishedAt && (
                      <time dateTime={journal.publishedAt}>
                        {new Date(journal.publishedAt).toLocaleDateString(
                          lang === 'es' ? 'es-ES' : 'en-US',
                          { year: 'numeric', month: 'long', day: 'numeric' }
                        )}
                      </time>
                    )}
                    {journal.location && <span>• {journal.location}</span>}
                  </div>
                </Link>
              </motion.article>
            ))}
          </motion.div>
        </motion.section>
      )}

      {/* Artist Statement Section */}
      {artistStatement && (
        <motion.section
          className="py-20 px-4 max-w-3xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={sectionVariants}
        >
          <h2 className="text-2xl md:text-3xl font-light text-[var(--color-ink)] mb-8">
            {dictionary.home.artistStatement}
          </h2>
          <p className="text-[var(--color-gray-600)] leading-relaxed text-lg">
            {artistStatement}
          </p>
        </motion.section>
      )}
    </div>
  )
}
