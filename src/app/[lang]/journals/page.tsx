import type { Metadata } from 'next'
import { sanityFetch, getImageUrl } from '@/lib/sanity'
import { allJournalsQuery } from '@/lib/queries'
import { validateLocale, getLocalizedValue } from '@/lib/i18n'
import type { Journal } from '@/types'
import Link from 'next/link'
import Image from 'next/image'

interface PageProps {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang: langParam } = await params
  const lang = validateLocale(langParam)

  const titles = {
    en: 'Journals',
    es: 'Diario',
  }

  const descriptions = {
    en: 'Travel journals and writings by Manuel Viveros Segura. Stories and reflections from artistic journeys.',
    es: 'Diarios de viaje y escritos de Manuel Viveros Segura. Historias y reflexiones de viajes artísticos.',
  }

  return {
    title: titles[lang],
    description: descriptions[lang],
    openGraph: {
      title: `${titles[lang]} | Manuel Viveros`,
      description: descriptions[lang],
    },
  }
}

async function getJournals(): Promise<Journal[]> {
  return sanityFetch<Journal[]>(allJournalsQuery)
}

export default async function JournalsPage({ params }: PageProps) {
  const { lang: langParam } = await params
  const lang = validateLocale(langParam)
  const journals = await getJournals()

  const titles = {
    en: 'Journals',
    es: 'Diario',
  }

  const subtitles = {
    en: 'Travel stories and artistic reflections',
    es: 'Historias de viaje y reflexiones artísticas',
  }

  return (
    <div className="min-h-screen">
      {/* Page header */}
      <header className="pt-8 pb-6 md:pt-12 md:pb-8 px-4 md:px-8 max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-[var(--color-ink)] tracking-tight">
          {titles[lang]}
        </h1>
        <p className="mt-2 text-[var(--color-gray-500)] text-lg">
          {subtitles[lang]}
        </p>
      </header>

      {/* Journals list */}
      <section className="px-4 md:px-8 pb-16 max-w-7xl mx-auto">
        {journals && journals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {journals.map((journal) => (
              <article key={journal._id} className="group">
                <Link href={`/${lang}/journals/${journal.slug.current}`}>
                  {journal.coverImage ? (
                    <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-gray-100)] mb-4">
                      <Image
                        src={getImageUrl(journal.coverImage, 800)}
                        alt={getLocalizedValue(journal.title, lang)}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[16/10] bg-[var(--color-gray-100)] mb-4 flex items-center justify-center">
                      <span className="text-[var(--color-gray-400)]">
                        {lang === 'en' ? 'No image' : 'Sin imagen'}
                      </span>
                    </div>
                  )}

                  <h2 className="text-xl font-medium text-[var(--color-ink)] group-hover:text-[var(--color-accent)] transition-colors">
                    {getLocalizedValue(journal.title, lang)}
                  </h2>

                  {journal.excerpt && (
                    <p className="mt-2 text-[var(--color-gray-500)] line-clamp-3">
                      {getLocalizedValue(journal.excerpt, lang)}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-[var(--color-gray-400)]">
                    {journal.publishedAt && (
                      <time dateTime={journal.publishedAt}>
                        {new Date(journal.publishedAt).toLocaleDateString(
                          lang === 'es' ? 'es-ES' : 'en-US',
                          { year: 'numeric', month: 'long', day: 'numeric' }
                        )}
                      </time>
                    )}
                    {journal.location && (
                      <>
                        <span>•</span>
                        <span>{journal.location}</span>
                      </>
                    )}
                  </div>

                  {journal.tags && journal.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {journal.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-[var(--color-gray-100)] text-[var(--color-gray-600)] rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-[var(--color-gray-500)]">
            {lang === 'en'
              ? 'No journal entries yet. Check back soon!'
              : 'Aún no hay entradas. ¡Vuelve pronto!'}
          </div>
        )}
      </section>
    </div>
  )
}
