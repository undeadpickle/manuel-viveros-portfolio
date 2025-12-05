import Link from 'next/link'
import { type Locale } from '@/lib/i18n'
import type { Dictionary } from '@/dictionaries'
import SocialLinks from '@/components/ui/SocialLinks'

interface FooterProps {
  lang: Locale
  dictionary: Dictionary
}

// Default contact info - will be replaced with Sanity data
const defaultContact = {
  email: 'viveroscinco@yahoo.com',
  phone: '1 (408) 205-6916',
}

// Default social links - will be replaced with Sanity data
const defaultSocialLinks = [
  { platform: 'instagram', url: 'https://instagram.com' },
  { platform: 'facebook', url: 'https://facebook.com' },
  { platform: 'tiktok', url: 'https://tiktok.com' },
]

export default function Footer({ lang, dictionary }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-[var(--color-gray-200)] bg-[var(--background)]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Brand / Tagline */}
          <div>
            <Link href={`/${lang}`} className="text-xl font-light tracking-wide">
              Manuel Viveros
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
                href={`mailto:${defaultContact.email}?subject=About%20your%20artwork...`}
                className="block text-sm hover:text-[var(--color-accent)] transition-colors"
              >
                {defaultContact.email}
              </a>
              <a
                href={`tel:${defaultContact.phone.replace(/\D/g, '')}`}
                className="block text-sm hover:text-[var(--color-accent)] transition-colors"
              >
                {defaultContact.phone}
              </a>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-sm font-medium tracking-wider uppercase mb-4 text-[var(--color-gray-500)]">
              {dictionary.contact.followMe}
            </h3>
            <SocialLinks links={defaultSocialLinks} />
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-[var(--color-gray-200)]">
          <p className="text-xs text-[var(--color-gray-500)] text-center">
            &copy; {currentYear} Manuel Viveros Segura. {dictionary.footer.copyright}.
          </p>
        </div>
      </div>
    </footer>
  )
}
