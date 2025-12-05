'use client'

import { useState } from 'react'
import ThumbnailGrid from './ThumbnailGrid'
import Lightbox from './Lightbox'
import type { Artwork } from './ThumbnailGrid'

interface GalleryPageProps {
  title: string
  subtitle?: string
  artworks: Artwork[]
  lang: 'en' | 'es'
}

export default function GalleryPage({ title, subtitle, artworks, lang }: GalleryPageProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index)
  }

  const handleCloseLightbox = () => {
    setLightboxIndex(null)
  }

  const handleNavigate = (index: number) => {
    setLightboxIndex(index)
  }

  return (
    <div className="min-h-screen">
      {/* Page header */}
      <header className="pt-8 pb-6 md:pt-12 md:pb-8 px-4 md:px-8 max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-[var(--color-ink)] tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-[var(--color-gray-500)] text-lg">
            {subtitle}
          </p>
        )}
        <div className="mt-4 text-sm text-[var(--color-gray-400)]">
          {artworks.length} {lang === 'en' ? 'works' : 'obras'}
        </div>
      </header>

      {/* Gallery grid */}
      <section className="px-4 md:px-8 pb-16 max-w-7xl mx-auto">
        <ThumbnailGrid
          artworks={artworks}
          lang={lang}
          onSelect={handleOpenLightbox}
        />
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          artworks={artworks}
          currentIndex={lightboxIndex}
          lang={lang}
          onClose={handleCloseLightbox}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  )
}
