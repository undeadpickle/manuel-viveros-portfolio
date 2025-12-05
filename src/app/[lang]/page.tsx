import { type Locale } from '@/lib/i18n'
import { getDictionary } from '@/dictionaries'

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params
  const dictionary = await getDictionary(lang)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl md:text-6xl font-light tracking-wide mb-4">
          Manuel Viveros Segura
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400">
          Arte Latinoamericano | Visual Art
        </p>
      </section>

      {/* Featured Work Section - placeholder */}
      <section className="py-16">
        <h2 className="text-2xl font-light mb-8 text-center">
          {dictionary.home.featuredWork}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Artwork grid will be populated from Sanity */}
          <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-sm flex items-center justify-center">
            <span className="text-gray-400">Artwork placeholder</span>
          </div>
          <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-sm flex items-center justify-center">
            <span className="text-gray-400">Artwork placeholder</span>
          </div>
          <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-sm flex items-center justify-center">
            <span className="text-gray-400">Artwork placeholder</span>
          </div>
        </div>
      </section>

      {/* Artist Statement Section - placeholder */}
      <section className="py-16 max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-light mb-8">{dictionary.home.artistStatement}</h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          {lang === 'es'
            ? 'Declaración del artista aparecerá aquí desde Sanity...'
            : 'Artist statement will appear here from Sanity...'}
        </p>
      </section>
    </div>
  )
}
