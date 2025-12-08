import Link from 'next/link'
import { type Locale } from '@/lib/i18n'
import type { Dictionary } from '@/dictionaries'
import SocialLinks from '@/components/ui/SocialLinks'

interface FooterProps {
  lang: Locale
  dictionary: Dictionary
  siteSettings?: {
    artistName?: string
    email?: string
    phone?: string
    socialLinks?: Array<{ platform: string; url: string }>
  } | null
}

// Fallback defaults if CMS values are empty
const DEFAULT_ARTIST_NAME = 'Manuel Viveros Segura'
const DEFAULT_EMAIL = 'viveroscinco@yahoo.com'
const DEFAULT_PHONE = '1 (408) 205-6916'

export default function Footer({ lang, dictionary, siteSettings }: FooterProps) {
  const currentYear = new Date().getFullYear()

  // Use CMS values with fallbacks
  const artistName = siteSettings?.artistName || DEFAULT_ARTIST_NAME
  const email = siteSettings?.email || DEFAULT_EMAIL
  const phone = siteSettings?.phone || DEFAULT_PHONE
  const socialLinks = siteSettings?.socialLinks || []

  return (
    <footer className="border-t border-[var(--color-gray-200)] bg-[var(--background)]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Brand / Tagline */}
          <div>
            <Link href={`/${lang}`} className="text-xl font-light tracking-wide">
              {artistName.split(' ').slice(0, 2).join(' ')}
            </Link>
            <p className="mt-2 text-sm text-[var(--color-gray-500)]">
              {dictionary.footer.arteLatino}
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-medium tracking-wider uppercase mb-4 text-[var(--color-gray-500)]">
              {dictionary.contact.title}
            </h3>
            <div className="space-y-2">
              <a
                href={`mailto:${email}?subject=About%20your%20artwork...`}
                className="block text-sm hover:text-[var(--color-accent)] transition-colors"
              >
                {email}
              </a>
              <a
                href={`tel:${phone.replace(/\D/g, '')}`}
                className="block text-sm hover:text-[var(--color-accent)] transition-colors"
              >
                {phone}
              </a>
            </div>
          </div>

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div>
              <h3 className="text-sm font-medium tracking-wider uppercase mb-4 text-[var(--color-gray-500)]">
                {dictionary.contact.followMe}
              </h3>
              <SocialLinks links={socialLinks} />
            </div>
          )}
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-[var(--color-gray-200)]">
          <p className="text-xs text-[var(--color-gray-500)] text-center">
            &copy; {currentYear} {artistName}. {dictionary.footer.copyright}.
          </p>
        </div>
      </div>
    </footer>
  )
}
