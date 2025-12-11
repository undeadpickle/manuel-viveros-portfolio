import type { Metadata } from 'next'
import { sanityFetch } from '@/lib/sanity'
import { artworkByCategoryQuery } from '@/lib/queries'
import { GalleryPage } from '@/components/gallery'
import { validateLocale } from '@/lib/i18n'
import type { Artwork } from '@/components/gallery'
import { CollectionJsonLd } from '@/components/seo'

interface PageProps {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang: langParam } = await params
  const lang = validateLocale(langParam)

  const titles = {
    en: 'Paintings',
    es: 'Pinturas',
  }

  const descriptions = {
    en: 'Explore the paintings of Manuel Viveros Segura. Oil paintings, acrylics, and mixed media artworks.',
    es: 'Explora las pinturas de Manuel Viveros Segura. Óleos, acrílicos y obras de técnica mixta.',
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
  return sanityFetch<Artwork[]>(artworkByCategoryQuery, { category: 'painting' })
}

export default async function PaintingsPage({ params }: PageProps) {
  const { lang: langParam } = await params
  const lang = validateLocale(langParam)
  const artworks = await getArtworks()

  const titles = {
    en: 'Paintings',
    es: 'Pinturas',
  }

  const descriptions = {
    en: 'Explore the paintings of Manuel Viveros Segura. Oil paintings, acrylics, and mixed media artworks.',
    es: 'Explora las pinturas de Manuel Viveros Segura. Óleos, acrílicos y obras de técnica mixta.',
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
