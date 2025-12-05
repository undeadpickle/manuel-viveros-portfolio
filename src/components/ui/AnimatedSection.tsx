'use client'

import { motion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
}

const getVariants = (direction: AnimatedSectionProps['direction']): Variants => {
  const directions = {
    up: { y: 30 },
    down: { y: -30 },
    left: { x: 30 },
    right: { x: -30 },
    none: {},
  }

  const offset = directions[direction || 'up']

  return {
    hidden: {
      opacity: 0,
      ...offset,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
    },
  }
}

export default function AnimatedSection({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}: AnimatedSectionProps) {
  return (
    <motion.div
      className={className}
      variants={getVariants(direction)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.1, 0.25, 1], // Custom easing
      }}
    >
      {children}
    </motion.div>
  )
}
