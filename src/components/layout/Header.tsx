'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { type Locale, routeMap, getAlternatePath } from '@/lib/i18n'
import type { Dictionary } from '@/dictionaries'

interface HeaderProps {
  lang: Locale
  dictionary: Dictionary
}

export default function Header({ lang, dictionary }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { key: 'paintings', href: `/${lang}/${routeMap[lang].paintings}` },
    { key: 'sculptures', href: `/${lang}/${routeMap[lang].sculptures}` },
    { key: 'sketches', href: `/${lang}/${routeMap[lang].sketches}` },
    { key: 'photography', href: `/${lang}/${routeMap[lang].photography}` },
    { key: 'journals', href: `/${lang}/${routeMap[lang].journals}` },
    { key: 'contact', href: `/${lang}/${routeMap[lang].contact}` },
  ] as const

  const { locale: altLocale, path: altPath } = getAlternatePath(lang, pathname)

  const isActive = (href: string) => {
    if (href === `/${lang}`) {
      return pathname === `/${lang}` || pathname === `/${lang}/`
    }
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 bg-[var(--background)]/95 backdrop-blur-sm border-b border-[var(--color-gray-200)]">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo / Name */}
          <Link
            href={`/${lang}`}
            className="text-xl md:text-2xl font-bold tracking-widest uppercase hover:opacity-70 transition-opacity"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            Manuel Viveros Segura
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`text-sm tracking-wide transition-colors hover:text-[var(--color-accent)] ${
                  isActive(item.href)
                    ? 'text-[var(--color-accent)]'
                    : 'text-[var(--foreground)]'
                }`}
              >
                {dictionary.nav[item.key as keyof typeof dictionary.nav]}
              </Link>
            ))}

            {/* Language Toggle */}
            <Link
              href={altPath}
              className="ml-4 px-3 py-1 text-xs font-medium tracking-wider border border-[var(--color-gray-300)] rounded hover:bg-[var(--color-gray-100)] transition-colors"
            >
              {altLocale.toUpperCase()}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 -mr-2"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <div className="w-6 h-5 relative flex flex-col justify-between">
              <motion.span
                animate={isMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                className="w-full h-0.5 bg-[var(--foreground)] origin-left"
              />
              <motion.span
                animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-full h-0.5 bg-[var(--foreground)]"
              />
              <motion.span
                animate={isMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                className="w-full h-0.5 bg-[var(--foreground)] origin-left"
              />
            </div>
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="lg:hidden overflow-hidden"
            >
              <div className="pt-6 pb-4 flex flex-col gap-4">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block text-lg tracking-wide transition-colors hover:text-[var(--color-accent)] ${
                        isActive(item.href)
                          ? 'text-[var(--color-accent)]'
                          : 'text-[var(--foreground)]'
                      }`}
                    >
                      {dictionary.nav[item.key as keyof typeof dictionary.nav]}
                    </Link>
                  </motion.div>
                ))}

                {/* Mobile Language Toggle */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.05 }}
                  className="pt-4 border-t border-[var(--color-gray-200)]"
                >
                  <Link
                    href={altPath}
                    onClick={() => setIsMenuOpen(false)}
                    className="inline-block px-4 py-2 text-sm font-medium tracking-wider border border-[var(--color-gray-300)] rounded hover:bg-[var(--color-gray-100)] transition-colors"
                  >
                    {altLocale === 'es' ? 'Español' : 'English'}
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
