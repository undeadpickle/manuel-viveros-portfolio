import type { Metadata } from 'next'
import { sanityFetch } from '@/lib/sanity'
import { siteSettingsQuery } from '@/lib/queries'
import { getDictionary } from '@/dictionaries'
import { validateLocale } from '@/lib/i18n'
import { SocialLinks } from '@/components/ui'

interface SiteSettings {
  email?: string
  phone?: string
  socialLinks?: { platform: string; url: string }[]
}

interface PageProps {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang: langParam } = await params
  const lang = validateLocale(langParam)

  const titles = {
    en: 'Contact',
    es: 'Contacto',
  }

  const descriptions = {
    en: 'Get in touch with Manuel Viveros Segura. Contact for commissions, exhibitions, and inquiries.',
    es: 'Ponte en contacto con Manuel Viveros Segura. Contacto para comisiones, exposiciones y consultas.',
  }

  return {
    title: titles[lang],
    description: descriptions[lang],
    openGraph: {
      title: `${titles[lang]} | Manuel Viveros`,
      description: descriptions[lang],
    },
  }
}

async function getSiteSettings(): Promise<SiteSettings | null> {
  return sanityFetch<SiteSettings | null>(siteSettingsQuery)
}

export default async function ContactPage({ params }: PageProps) {
  const { lang: langParam } = await params
  const lang = validateLocale(langParam)
  const [settings, dictionary] = await Promise.all([
    getSiteSettings(),
    getDictionary(lang),
  ])

  const email = settings?.email || 'viveroscinco@yahoo.com'
  const phone = settings?.phone || '+1 (408) 205-6916'
  const socialLinks = settings?.socialLinks || []

  return (
    <div className="min-h-screen">
      {/* Page header */}
      <header className="pt-8 pb-6 md:pt-12 md:pb-8 px-4 md:px-8 max-w-4xl mx-auto text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-[var(--color-ink)] tracking-tight">
          {dictionary.contact.title}
        </h1>
        <p className="mt-4 text-[var(--color-gray-500)] text-lg">
          {dictionary.contact.subtitle}
        </p>
      </header>

      {/* Contact content */}
      <section className="px-4 md:px-8 pb-16 max-w-2xl mx-auto">
        <div className="space-y-12">
          {/* Email */}
          <div className="text-center">
            <h2 className="text-sm uppercase tracking-widest text-[var(--color-gray-400)] mb-3">
              {dictionary.contact.email}
            </h2>
            <a
              href={`mailto:${email}`}
              className="text-xl md:text-2xl text-[var(--color-ink)] hover:text-[var(--color-accent)] transition-colors"
            >
              {email}
            </a>
          </div>

          {/* Phone */}
          <div className="text-center">
            <h2 className="text-sm uppercase tracking-widest text-[var(--color-gray-400)] mb-3">
              {dictionary.contact.phone}
            </h2>
            <a
              href={`tel:${phone.replace(/\D/g, '')}`}
              className="text-xl md:text-2xl text-[var(--color-ink)] hover:text-[var(--color-accent)] transition-colors"
            >
              {phone}
            </a>
          </div>

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="text-center">
              <h2 className="text-sm uppercase tracking-widest text-[var(--color-gray-400)] mb-6">
                {dictionary.contact.followMe}
              </h2>
              <div className="flex justify-center">
                <SocialLinks links={socialLinks} className="gap-6" />
              </div>
            </div>
          )}

          {/* CTA Button */}
          <div className="text-center pt-8">
            <a
              href={`mailto:${email}`}
              className="btn-primary gap-2 px-8 py-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              {dictionary.contact.sendEmail}
            </a>
          </div>
        </div>

        {/* Additional info */}
        <div className="mt-16 pt-8 border-t border-[var(--color-gray-200)] text-center">
          <p className="text-[var(--color-gray-500)] text-sm leading-relaxed">
            {lang === 'en'
              ? 'Available for commissions, exhibitions, and collaborations. Response time is typically 2-3 business days.'
              : 'Disponible para comisiones, exposiciones y colaboraciones. El tiempo de respuesta es generalmente de 2-3 días hábiles.'}
          </p>
        </div>
      </section>
    </div>
  )
}
