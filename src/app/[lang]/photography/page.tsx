import type { Metadata } from 'next'
import { client } from '@/lib/sanity'
import { artworkByCategoryQuery } from '@/lib/queries'
import { GalleryPage } from '@/components/gallery'
import { getDictionary } from '@/dictionaries'
import type { Locale } from '@/lib/i18n'
import type { Artwork } from '@/components/gallery'
import { CollectionJsonLd } from '@/components/seo'

interface PageProps {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang: langParam } = await params
  const lang = langParam as Locale

  const titles = {
    en: 'Photography',
    es: 'Fotografía',
  }

  const descriptions = {
    en: 'Explore the photography of Manuel Viveros Segura. Documentary, portrait, and landscape photography.',
    es: 'Explora la fotografía de Manuel Viveros Segura. Fotografía documental, de retrato y paisaje.',
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

async function getArtworks(): Promise<Artwork[]> {
  return client.fetch(artworkByCategoryQuery, { category: 'photography' })
}

export default async function PhotographyPage({ params }: PageProps) {
  const { lang: langParam } = await params
  const lang = langParam as Locale
  const [artworks] = await Promise.all([
    getArtworks(),
    getDictionary(lang),
  ])

  const titles = {
    en: 'Photography',
    es: 'Fotografía',
  }

  const descriptions = {
    en: 'Explore the photography of Manuel Viveros Segura. Documentary, portrait, and landscape photography.',
    es: 'Explora la fotografía de Manuel Viveros Segura. Fotografía documental, de retrato y paisaje.',
  }

  return (
    <>
      <CollectionJsonLd
        name={titles[lang]}
        description={descriptions[lang]}
        numberOfItems={artworks.length}
        lang={lang}
      />
      <GalleryPage
        title={titles[lang]}
        artworks={artworks}
        lang={lang}
      />
    </>
  )
}
