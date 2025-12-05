import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import '../globals.css'
import { locales, type Locale } from '@/lib/i18n'
import { getDictionary } from '@/dictionaries'
import { Header, Footer } from '@/components/layout'

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
  params: Promise<{ lang: Locale }>
}): Promise<Metadata> {
  const { lang } = await params

  const titles = {
    en: 'Manuel Viveros Segura | Visual Artist',
    es: 'Manuel Viveros Segura | Artista Visual',
  }

  const descriptions = {
    en: 'Artwork of Manuel Viveros Segura. Painting, sculpture, and photography. Arte Latinoamericano.',
    es: 'Obra de Manuel Viveros Segura. Pintura, escultura y fotografía. Arte Latinoamericano.',
  }

  return {
    title: {
      default: titles[lang],
      template: `%s | Manuel Viveros`,
    },
    description: descriptions[lang],
    keywords: [
      'Manuel Viveros',
      'Arte Latinoamericano',
      'Latin American Art',
      'Painting',
      'Pintura',
      'Sculpture',
      'Escultura',
      'Photography',
      'Fotografía',
    ],
    authors: [{ name: 'Manuel Viveros Segura' }],
    openGraph: {
      type: 'website',
      locale: lang === 'es' ? 'es_ES' : 'en_US',
      alternateLocale: lang === 'es' ? 'en_US' : 'es_ES',
      siteName: 'Manuel Viveros Segura',
    },
  }
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ lang: Locale }>
}>) {
  const { lang } = await params
  const dictionary = await getDictionary(lang)

  return (
    <html lang={lang}>
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
