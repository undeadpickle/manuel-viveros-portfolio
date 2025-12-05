'use client'

import { motion, type Transition } from 'framer-motion'
import { usePathname } from 'next/navigation'

interface PageTransitionProps {
  children: React.ReactNode
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -8,
  },
}

const pageTransition: Transition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.3,
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()

  return (
    <motion.div
      key={pathname}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  )
}
