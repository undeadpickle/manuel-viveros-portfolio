'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'
import { getImageUrl, getBlurUrl } from '@/lib/sanity'

export interface Artwork {
  _id: string
  title: { en: string; es: string }
  category: string
  image: {
    asset: {
      _ref: string
    }
    hotspot?: {
      x: number
      y: number
    }
  }
  videoUrl?: string
  year?: number
  dimensions?: string
  medium?: { en: string; es: string }
  description?: { en: string; es: string }
}

interface ThumbnailGridProps {
  artworks: Artwork[]
  lang: 'en' | 'es'
  onSelect: (index: number) => void
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut' as const,
    },
  },
}

export default function ThumbnailGrid({ artworks, lang, onSelect }: ThumbnailGridProps) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())

  const handleImageLoad = (id: string) => {
    setLoadedImages((prev) => new Set(prev).add(id))
  }

  if (!artworks || artworks.length === 0) {
    return (
      <div className="text-center py-16 text-[var(--color-gray-500)]">
        {lang === 'en' ? 'No artworks to display' : 'No hay obras para mostrar'}
      </div>
    )
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
    >
      {artworks.map((artwork, index) => (
        <motion.div
          key={artwork._id}
          variants={itemVariants}
          className="group cursor-pointer"
          onClick={() => onSelect(index)}
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
        >
          <div className="relative aspect-square overflow-hidden bg-[var(--color-gray-100)] rounded-sm shadow-sm group-hover:shadow-lg transition-shadow duration-300">
            {/* Blur placeholder */}
            {!loadedImages.has(artwork._id) && (
              <div
                className="absolute inset-0 bg-[var(--color-gray-200)] animate-pulse"
                aria-hidden="true"
              />
            )}

            <Image
              src={getImageUrl(artwork.image, 600)}
              alt={artwork.title[lang] || artwork.title.en || 'Artwork'}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className={`object-cover transition-all duration-500 group-hover:scale-105 ${
                loadedImages.has(artwork._id) ? 'opacity-100' : 'opacity-0'
              }`}
              placeholder="blur"
              blurDataURL={getBlurUrl(artwork.image)}
              onLoad={() => handleImageLoad(artwork._id)}
            />

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

            {/* Video indicator */}
            {artwork.videoUrl && (
              <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            )}
          </div>

          {/* Title below thumbnail */}
          <div className="mt-2 px-1">
            <h3 className="text-sm font-medium text-[var(--color-ink)] truncate">
              {artwork.title[lang] || artwork.title.en}
            </h3>
            {artwork.year && (
              <p className="text-xs text-[var(--color-gray-500)]">{artwork.year}</p>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
