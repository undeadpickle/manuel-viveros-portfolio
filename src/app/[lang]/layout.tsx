import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import '../globals.css'
import { locales, type Locale } from '@/lib/i18n'
import { getDictionary } from '@/dictionaries'
import { Header, Footer } from '@/components/layout'
import { PersonJsonLd, WebsiteJsonLd } from '@/components/seo'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang: langParam } = await params
  const lang = langParam as Locale

  const titles = {
    en: 'Manuel Viveros Segura | Visual Artist',
    es: 'Manuel Viveros Segura | Artista Visual',
  }

  const descriptions = {
    en: 'Artwork of Manuel Viveros Segura. Painting, sculpture, and photography. Arte Latinoamericano.',
    es: 'Obra de Manuel Viveros Segura. Pintura, escultura y fotografía. Arte Latinoamericano.',
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://manuelviveros.art'

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: titles[lang],
      template: `%s | Manuel Viveros`,
    },
    description: descriptions[lang],
    keywords: [
      'Manuel Viveros',
      'Manuel Viveros Segura',
      'Arte Latinoamericano',
      'Latin American Art',
      'Mexican Artist',
      'Artista Mexicano',
      'Painting',
      'Pintura',
      'Sculpture',
      'Escultura',
      'Photography',
      'Fotografía',
      'Visual Art',
      'Arte Visual',
    ],
    authors: [{ name: 'Manuel Viveros Segura' }],
    creator: 'Manuel Viveros Segura',
    openGraph: {
      type: 'website',
      locale: lang === 'es' ? 'es_ES' : 'en_US',
      alternateLocale: lang === 'es' ? 'en_US' : 'es_ES',
      siteName: 'Manuel Viveros Segura',
      title: titles[lang],
      description: descriptions[lang],
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[lang],
      description: descriptions[lang],
    },
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages: {
        'en': `${baseUrl}/en`,
        'es': `${baseUrl}/es`,
        'x-default': `${baseUrl}/en`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ lang: string }>
}>) {
  const { lang: langParam } = await params
  const lang = langParam as Locale
  const dictionary = await getDictionary(lang)

  return (
    <html lang={lang}>
      <head>
        <PersonJsonLd lang={lang} />
        <WebsiteJsonLd lang={lang} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header lang={lang} dictionary={dictionary} />
        <main className="flex-1">{children}</main>
        <Footer lang={lang} dictionary={dictionary} />
      </body>
    </html>
  )
}
