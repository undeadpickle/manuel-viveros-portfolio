import type { Locale } from '@/lib/i18n'

interface PersonSchema {
  '@context': 'https://schema.org'
  '@type': 'Person'
  name: string
  jobTitle: string
  description: string
  url: string
  sameAs?: string[]
  knowsAbout?: string[]
}

interface WebsiteSchema {
  '@context': 'https://schema.org'
  '@type': 'WebSite'
  name: string
  url: string
  description: string
  inLanguage: string[]
  author: {
    '@type': 'Person'
    name: string
  }
}

interface ArtworkSchema {
  '@context': 'https://schema.org'
  '@type': 'VisualArtwork'
  name: string
  description?: string
  creator: {
    '@type': 'Person'
    name: string
  }
  artform?: string
  artMedium?: string
  dateCreated?: string
  image?: string
}

interface Props {
  lang: Locale
  socialLinks?: { platform: string; url: string }[]
}

export function PersonJsonLd({ lang, socialLinks }: Props) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://manuelviveros.art'

  const schema: PersonSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Manuel Viveros Segura',
    jobTitle: lang === 'es' ? 'Artista Visual' : 'Visual Artist',
    description:
      lang === 'es'
        ? 'Artista visual latinoamericano especializado en pintura, escultura y fotografía.'
        : 'Latin American visual artist specializing in painting, sculpture, and photography.',
    url: baseUrl,
    sameAs: socialLinks?.map((link) => link.url) || [],
    knowsAbout: [
      'Painting',
      'Sculpture',
      'Photography',
      'Visual Art',
      'Latin American Art',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function WebsiteJsonLd({ lang }: { lang: Locale }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://manuelviveros.art'

  const schema: WebsiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Manuel Viveros Segura',
    url: baseUrl,
    description:
      lang === 'es'
        ? 'Portafolio de arte de Manuel Viveros Segura. Pintura, escultura y fotografía.'
        : 'Art portfolio of Manuel Viveros Segura. Painting, sculpture, and photography.',
    inLanguage: ['en', 'es'],
    author: {
      '@type': 'Person',
      name: 'Manuel Viveros Segura',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface ArtworkJsonLdProps {
  name: string
  description?: string
  artform: string
  medium?: string
  year?: number
  imageUrl?: string
}

export function ArtworkJsonLd({
  name,
  description,
  artform,
  medium,
  year,
  imageUrl,
}: ArtworkJsonLdProps) {
  const schema: ArtworkSchema = {
    '@context': 'https://schema.org',
    '@type': 'VisualArtwork',
    name,
    description,
    creator: {
      '@type': 'Person',
      name: 'Manuel Viveros Segura',
    },
    artform,
    artMedium: medium,
    dateCreated: year?.toString(),
    image: imageUrl,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface CollectionJsonLdProps {
  name: string
  description: string
  numberOfItems: number
  lang: Locale
}

export function CollectionJsonLd({
  name,
  description,
  numberOfItems,
  lang,
}: CollectionJsonLdProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://manuelviveros.art'

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    numberOfItems,
    inLanguage: lang,
    author: {
      '@type': 'Person',
      name: 'Manuel Viveros Segura',
    },
    isPartOf: {
      '@type': 'WebSite',
      name: 'Manuel Viveros Segura',
      url: baseUrl,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
