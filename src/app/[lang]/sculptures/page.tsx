import type { Metadata } from 'next'
import { client } from '@/lib/sanity'
import { artworkByCategoryQuery } from '@/lib/queries'
import { GalleryPage } from '@/components/gallery'
import { getDictionary } from '@/dictionaries'
import type { Locale } from '@/lib/i18n'
import type { Artwork } from '@/components/gallery'

interface PageProps {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang: langParam } = await params
  const lang = langParam as Locale

  const titles = {
    en: 'Sculptures',
    es: 'Esculturas',
  }

  const descriptions = {
    en: 'Explore the sculptures of Manuel Viveros Segura. Bronze, ceramic, and mixed media sculptural works.',
    es: 'Explora las esculturas de Manuel Viveros Segura. Bronce, cerámica y obras escultóricas de técnica mixta.',
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
  return client.fetch(artworkByCategoryQuery, { category: 'sculpture' })
}

export default async function SculpturesPage({ params }: PageProps) {
  const { lang: langParam } = await params
  const lang = langParam as Locale
  const [artworks] = await Promise.all([
    getArtworks(),
    getDictionary(lang),
  ])

  const titles = {
    en: 'Sculptures',
    es: 'Esculturas',
  }

  return (
    <GalleryPage
      title={titles[lang]}
      artworks={artworks}
      lang={lang}
    />
  )
}
