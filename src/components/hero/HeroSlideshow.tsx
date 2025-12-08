'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { getImageUrl, getBlurUrl } from '@/lib/sanity'

interface HeroSlide {
  _id: string
  title?: { en?: string; es?: string }
  slug?: { current?: string }
  category?: string
  image: {
    asset: { _ref: string }
    hotspot?: { x: number; y: number }
  }
  year?: number
  medium?: { en?: string; es?: string }
}

interface HeroSlideshowSettings {
  enabled?: boolean
  duration?: number
  transitionDuration?: number
  showIndicators?: boolean
  pauseOnHover?: boolean
  randomizeOrder?: boolean
}

interface HeroSlideshowProps {
  slides: HeroSlide[]
  settings?: HeroSlideshowSettings
  tagline?: string | null
  artistName?: string | null
}

export default function HeroSlideshow({ slides, settings, tagline, artistName }: HeroSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const progressRef = useRef<NodeJS.Timeout | null>(null)

  // Default settings
  const duration = (settings?.duration || 5) * 1000 // Convert to ms
  const transitionDuration = settings?.transitionDuration || 1000
  const showIndicators = settings?.showIndicators !== false
  const pauseOnHover = settings?.pauseOnHover !== false
  const randomizeOrder = settings?.randomizeOrder === true

  // Fisher-Yates shuffle algorithm
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // Use original order for initial render (SSR), randomize after hydration
  const [displaySlides, setDisplaySlides] = useState(slides)

  // Randomize slides only on client after mount to avoid hydration mismatch
  useEffect(() => {
    if (randomizeOrder && slides.length > 1) {
      setDisplaySlides(shuffleArray(slides))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty deps = only run once on mount

  // Check for reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  // Go to next slide
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % displaySlides.length)
    setProgress(0)
  }, [displaySlides.length])

  // Go to previous slide
  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + displaySlides.length) % displaySlides.length)
    setProgress(0)
  }, [displaySlides.length])

  // Go to specific slide
  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index)
    setProgress(0)
  }, [])

  // Autoplay logic
  useEffect(() => {
    if (displaySlides.length <= 1 || isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (progressRef.current) clearInterval(progressRef.current)
      return
    }

    // Progress update interval (60fps smooth progress bar)
    const progressInterval = 16 // ~60fps
    progressRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (progressInterval / duration) * 100
        return next >= 100 ? 100 : next
      })
    }, progressInterval)

    // Slide change interval
    intervalRef.current = setInterval(goToNext, duration)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (progressRef.current) clearInterval(progressRef.current)
    }
  }, [displaySlides.length, isPaused, duration, goToNext])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrev()
      } else if (e.key === 'ArrowRight') {
        goToNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goToNext, goToPrev])

  // Handle mouse enter/leave for pause on hover
  const handleMouseEnter = () => {
    if (pauseOnHover) setIsPaused(true)
  }

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      setIsPaused(false)
      setProgress(0) // Reset progress when resuming
    }
  }

  // Animation variants
  const slideVariants = {
    enter: {
      opacity: 0,
      scale: prefersReducedMotion ? 1 : 1.05,
    },
    center: {
      opacity: 1,
      scale: 1,
      transition: {
        opacity: { duration: transitionDuration / 1000 },
        scale: { duration: duration / 1000, ease: 'linear' as const },
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: transitionDuration / 1000 },
    },
  }

  // Ken Burns effect - subtle zoom while slide is displayed
  const kenBurnsVariants = {
    initial: { scale: prefersReducedMotion ? 1 : 1 },
    animate: {
      scale: prefersReducedMotion ? 1 : 1.08,
      transition: { duration: duration / 1000, ease: 'linear' as const },
    },
  }

  if (!displaySlides || displaySlides.length === 0) {
    return null
  }

  const currentSlide = displaySlides[currentIndex]

  return (
    <section
      className="relative h-screen w-full overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="region"
      aria-label="Hero slideshow"
      aria-roledescription="carousel"
    >
      {/* Background slides */}
      <AnimatePresence mode="sync">
        <motion.div
          key={currentIndex}
          className="absolute inset-0"
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
        >
          <motion.div
            className="absolute inset-0"
            variants={kenBurnsVariants}
            initial="initial"
            animate="animate"
          >
            <Image
              src={getImageUrl(currentSlide.image, 1920, 1080, 85)}
              alt={currentSlide.title?.en || currentSlide.title?.es || 'Artwork'}
              fill
              priority={currentIndex === 0}
              className="object-cover"
              sizes="100vw"
              placeholder="blur"
              blurDataURL={getBlurUrl(currentSlide.image)}
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-black/30 pointer-events-none" />

      {/* Content overlay - artist name centered */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-widest uppercase text-white drop-shadow-lg"
          style={{ fontFamily: 'var(--font-raleway)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {artistName || 'Manuel Viveros Segura'}
        </motion.h1>
        <motion.p
          className="mt-4 text-lg md:text-xl text-white/90 tracking-widest uppercase drop-shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {tagline || 'Arte Latinoamericano'}
        </motion.p>
      </div>

      {/* Navigation arrows (hidden on mobile, visible on hover) */}
      {displaySlides.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white transition-colors opacity-0 hover:opacity-100 focus:opacity-100 hidden md:block"
            aria-label="Previous slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white transition-colors opacity-0 hover:opacity-100 focus:opacity-100 hidden md:block"
            aria-label="Next slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </>
      )}

      {/* Progress indicators */}
      {showIndicators && displaySlides.length > 1 && (
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3"
          role="tablist"
          aria-label="Slide indicators"
        >
          {displaySlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className="group relative h-1 w-12 md:w-16 bg-white/30 rounded-full overflow-hidden cursor-pointer transition-all hover:bg-white/40"
              role="tab"
              aria-selected={index === currentIndex}
              aria-label={`Go to slide ${index + 1}`}
            >
              {index === currentIndex && (
                <motion.div
                  className="absolute inset-y-0 left-0 bg-white rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.016, ease: 'linear' }}
                />
              )}
              {index < currentIndex && (
                <div className="absolute inset-0 bg-white/60 rounded-full" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{
          opacity: { delay: 1, duration: 0.5 },
          y: { repeat: Infinity, duration: 1.5, ease: 'easeInOut' },
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </motion.div>
    </section>
  )
}
