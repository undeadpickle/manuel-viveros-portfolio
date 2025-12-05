'use client'

import { motion } from 'framer-motion'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'rectangular' | 'circular'
}

export default function Skeleton({ className = '', variant = 'rectangular' }: SkeletonProps) {
  const baseClasses = 'bg-[var(--color-gray-200)] animate-pulse'

  const variantClasses = {
    text: 'h-4 rounded',
    rectangular: 'rounded-sm',
    circular: 'rounded-full',
  }

  return (
    <motion.div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

interface GallerySkeletonProps {
  count?: number
}

export function GallerySkeleton({ count = 8 }: GallerySkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="aspect-square w-full" />
          <Skeleton variant="text" className="w-3/4" />
          <Skeleton variant="text" className="w-1/4" />
        </div>
      ))}
    </div>
  )
}

interface JournalSkeletonProps {
  count?: number
}

export function JournalSkeleton({ count = 3 }: JournalSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="aspect-[16/10] w-full" />
          <Skeleton variant="text" className="w-3/4 h-6" />
          <Skeleton variant="text" className="w-full" />
          <Skeleton variant="text" className="w-2/3" />
          <div className="flex gap-2">
            <Skeleton variant="text" className="w-24" />
            <Skeleton variant="text" className="w-16" />
          </div>
        </div>
      ))}
    </div>
  )
}
