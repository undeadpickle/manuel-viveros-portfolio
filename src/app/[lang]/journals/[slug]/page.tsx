import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText, type PortableTextComponents, type PortableTextBlock } from '@portabletext/react'
import { client, getImageUrl } from '@/lib/sanity'
import { journalBySlugQuery, allJournalSlugsQuery } from '@/lib/queries'
import { getDictionary } from '@/dictionaries'
import { type Locale, getLocalizedValue } from '@/lib/i18n'

interface Journal {
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

interface PageProps {
  params: Promise<{ lang: string; slug: string }>
}

export async function generateStaticParams() {
  const slugs: string[] = await client.fetch(allJournalSlugsQuery)
  const locales = ['en', 'es']

  return locales.flatMap((lang) =>
    slugs.map((slug) => ({ lang, slug }))
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang: langParam, slug } = await params
  const lang = langParam as Locale
  const journal: Journal | null = await client.fetch(journalBySlugQuery, { slug })

  if (!journal) {
    return { title: 'Not Found' }
  }

  const title = getLocalizedValue(journal.title, lang)
  const description = journal.excerpt
    ? getLocalizedValue(journal.excerpt, lang)
    : undefined

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Manuel Viveros`,
      description,
      type: 'article',
      publishedTime: journal.publishedAt,
    },
  }
}

async function getJournal(slug: string): Promise<Journal | null> {
  return client.fetch(journalBySlugQuery, { slug })
}

// Custom Portable Text components for rich text rendering
const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) return null
      return (
        <figure className="my-8">
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={getImageUrl(value, 1200)}
              alt={value.alt || ''}
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-cover"
            />
          </div>
          {value.caption && (
            <figcaption className="mt-2 text-center text-sm text-[var(--color-gray-500)]">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
  block: {
    h1: ({ children }) => (
      <h1 className="text-3xl font-light mt-12 mb-4 text-[var(--color-ink)]">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-light mt-10 mb-4 text-[var(--color-ink)]">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-medium mt-8 mb-3 text-[var(--color-ink)]">{children}</h3>
    ),
    normal: ({ children }) => (
      <p className="mb-4 text-[var(--color-gray-700)] leading-relaxed">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 pl-4 border-l-2 border-[var(--color-accent)] italic text-[var(--color-gray-600)]">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => {
      const target = value?.href?.startsWith('http') ? '_blank' : undefined
      return (
        <a
          href={value?.href}
          target={target}
          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
          className="text-[var(--color-accent)] hover:underline"
        >
          {children}
        </a>
      )
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-4 pl-6 list-disc text-[var(--color-gray-700)]">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mb-4 pl-6 list-decimal text-[var(--color-gray-700)]">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="mb-1">{children}</li>,
    number: ({ children }) => <li className="mb-1">{children}</li>,
  },
}

export default async function JournalDetailPage({ params }: PageProps) {
  const { lang: langParam, slug } = await params
  const lang = langParam as Locale
  const [journal, dictionary] = await Promise.all([
    getJournal(slug),
    getDictionary(lang),
  ])

  if (!journal) {
    notFound()
  }

  const title = getLocalizedValue(journal.title, lang)
  const content: PortableTextBlock[] = journal.content?.[lang] || journal.content?.en || []

  return (
    <article className="min-h-screen">
      {/* Header */}
      <header className="pt-8 pb-6 md:pt-12 md:pb-8 px-4 md:px-8 max-w-4xl mx-auto">
        <Link
          href={`/${lang}/journals`}
          className="inline-flex items-center gap-2 text-sm text-[var(--color-gray-500)] hover:text-[var(--color-accent)] transition-colors mb-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {dictionary.journal.backToJournals}
        </Link>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-[var(--color-ink)] tracking-tight">
          {title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-[var(--color-gray-500)]">
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
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {journal.location}
              </span>
            </>
          )}
        </div>

        {journal.tags && journal.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {journal.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs bg-[var(--color-gray-100)] text-[var(--color-gray-600)] rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Cover image */}
      {journal.coverImage && (
        <div className="relative aspect-[21/9] max-w-6xl mx-auto mb-12">
          <Image
            src={getImageUrl(journal.coverImage, 1600)}
            alt={title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Content */}
      <div className="px-4 md:px-8 max-w-3xl mx-auto prose-lg">
        {content.length > 0 ? (
          <PortableText value={content} components={portableTextComponents} />
        ) : journal.excerpt ? (
          <p className="text-[var(--color-gray-700)] leading-relaxed text-lg">
            {getLocalizedValue(journal.excerpt, lang)}
          </p>
        ) : (
          <p className="text-[var(--color-gray-500)] italic">
            {lang === 'en' ? 'Content coming soon...' : 'Contenido próximamente...'}
          </p>
        )}
      </div>

      {/* Gallery */}
      {journal.gallery && journal.gallery.length > 0 && (
        <section className="mt-16 px-4 md:px-8 max-w-6xl mx-auto">
          <h2 className="text-2xl font-light text-[var(--color-ink)] mb-6">
            {lang === 'en' ? 'Gallery' : 'Galería'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {journal.gallery.map((image, index) => (
              <div key={index} className="relative aspect-square overflow-hidden bg-[var(--color-gray-100)]">
                <Image
                  src={getImageUrl(image, 600)}
                  alt={`${title} - ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer navigation */}
      <footer className="mt-16 mb-8 px-4 md:px-8 max-w-4xl mx-auto border-t border-[var(--color-gray-200)] pt-8">
        <Link
          href={`/${lang}/journals`}
          className="inline-flex items-center gap-2 text-[var(--color-accent)] hover:underline"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {dictionary.journal.backToJournals}
        </Link>
      </footer>
    </article>
  )
}
