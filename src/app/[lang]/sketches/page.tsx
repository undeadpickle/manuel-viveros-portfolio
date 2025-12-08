import type { Metadata } from 'next'
import { sanityFetch } from '@/lib/sanity'
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
    en: 'Sketches',
    es: 'Bocetos',
  }

  const descriptions = {
    en: 'Explore the sketches and drawings of Manuel Viveros Segura. Pencil, charcoal, and ink works on paper.',
    es: 'Explora los bocetos y dibujos de Manuel Viveros Segura. Obras en lápiz, carboncillo y tinta sobre papel.',
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
  return sanityFetch<Artwork[]>(artworkByCategoryQuery, { category: 'sketch' })
}

export default async function SketchesPage({ params }: PageProps) {
  const { lang: langParam } = await params
  const lang = langParam as Locale
  const [artworks] = await Promise.all([
    getArtworks(),
    getDictionary(lang),
  ])

  const titles = {
    en: 'Sketches',
    es: 'Bocetos',
  }

  const descriptions = {
    en: 'Explore the sketches and drawings of Manuel Viveros Segura. Pencil, charcoal, and ink works on paper.',
    es: 'Explora los bocetos y dibujos de Manuel Viveros Segura. Obras en lápiz, carboncillo y tinta sobre papel.',
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
