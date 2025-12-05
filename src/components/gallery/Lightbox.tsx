'use client'

import { motion, AnimatePresence, type PanInfo } from 'framer-motion'
import Image from 'next/image'
import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { getImageUrl } from '@/lib/sanity'
import type { Artwork } from './ThumbnailGrid'

interface LightboxProps {
  artworks: Artwork[]
  currentIndex: number
  lang: 'en' | 'es'
  onClose: () => void
  onNavigate: (index: number) => void
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

const imageVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut' as const,
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.3,
      ease: 'easeIn' as const,
    },
  }),
}

const SWIPE_THRESHOLD = 50

// Custom hook for client-side only rendering
function useIsMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
}

export default function Lightbox({
  artworks,
  currentIndex,
  lang,
  onClose,
  onNavigate,
}: LightboxProps) {
  const [direction, setDirection] = useState(0)
  // Track loaded images by their ID
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const mounted = useIsMounted()

  const currentArtwork = artworks[currentIndex]
  const hasNext = currentIndex < artworks.length - 1
  const hasPrev = currentIndex > 0
  const imageLoaded = loadedImages.has(currentArtwork._id)

  const handleImageLoad = useCallback(() => {
    setLoadedImages((prev) => new Set(prev).add(currentArtwork._id))
  }, [currentArtwork._id])

  const goNext = useCallback(() => {
    if (hasNext) {
      setDirection(1)
      onNavigate(currentIndex + 1)
    }
  }, [hasNext, currentIndex, onNavigate])

  const goPrev = useCallback(() => {
    if (hasPrev) {
      setDirection(-1)
      onNavigate(currentIndex - 1)
    }
  }, [hasPrev, currentIndex, onNavigate])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowRight':
          goNext()
          break
        case 'ArrowLeft':
          goPrev()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, goNext, goPrev])

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > SWIPE_THRESHOLD && hasPrev) {
      goPrev()
    } else if (info.offset.x < -SWIPE_THRESHOLD && hasNext) {
      goNext()
    }
  }

  if (!mounted) return null

  const lightboxContent = (
    <AnimatePresence mode="wait">
      <motion.div
        key="lightbox-overlay"
        className="fixed inset-0 z-50 bg-black/95 flex flex-col"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.2 }}
      >
        {/* Header with close button and counter */}
        <div className="flex items-center justify-between p-4 text-white">
          <span className="text-sm">
            {currentIndex + 1} / {artworks.length}
          </span>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            aria-label={lang === 'en' ? 'Close' : 'Cerrar'}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Main image area */}
        <div className="flex-1 relative flex items-center justify-center overflow-hidden">
          {/* Previous button */}
          <button
            onClick={goPrev}
            disabled={!hasPrev}
            className={`absolute left-2 md:left-4 z-10 p-3 rounded-full transition-all ${
              hasPrev
                ? 'bg-white/10 hover:bg-white/20 text-white'
                : 'text-white/30 cursor-not-allowed'
            }`}
            aria-label={lang === 'en' ? 'Previous' : 'Anterior'}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Image container */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentArtwork._id}
              custom={direction}
              variants={imageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              className="relative w-full h-full max-w-5xl max-h-[70vh] mx-4 md:mx-16"
            >
              {/* Loading spinner */}
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              )}

              <Image
                src={getImageUrl(currentArtwork.image, 1600)}
                alt={currentArtwork.title[lang] || currentArtwork.title.en || 'Artwork'}
                fill
                sizes="(max-width: 768px) 100vw, 80vw"
                className={`object-contain transition-opacity duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                priority
                onLoad={handleImageLoad}
              />
            </motion.div>
          </AnimatePresence>

          {/* Next button */}
          <button
            onClick={goNext}
            disabled={!hasNext}
            className={`absolute right-2 md:right-4 z-10 p-3 rounded-full transition-all ${
              hasNext
                ? 'bg-white/10 hover:bg-white/20 text-white'
                : 'text-white/30 cursor-not-allowed'
            }`}
            aria-label={lang === 'en' ? 'Next' : 'Siguiente'}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Footer with artwork details */}
        <div className="p-4 text-white text-center">
          <h2 className="text-lg font-medium">
            {currentArtwork.title[lang] || currentArtwork.title.en}
          </h2>
          <div className="flex items-center justify-center gap-3 mt-1 text-sm text-white/70">
            {currentArtwork.medium && (
              <span>{currentArtwork.medium[lang] || currentArtwork.medium.en}</span>
            )}
            {currentArtwork.dimensions && <span>{currentArtwork.dimensions}</span>}
            {currentArtwork.year && <span>{currentArtwork.year}</span>}
          </div>
          {currentArtwork.description && (
            <p className="mt-2 text-sm text-white/60 max-w-2xl mx-auto">
              {currentArtwork.description[lang] || currentArtwork.description.en}
            </p>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )

  return createPortal(lightboxContent, document.body)
}
