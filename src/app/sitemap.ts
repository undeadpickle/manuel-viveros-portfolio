import type { MetadataRoute } from 'next'
import { client } from '@/lib/sanity'
import { allJournalSlugsQuery } from '@/lib/queries'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://manuelviveros.art'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages = [
    '',
    '/paintings',
    '/sculptures',
    '/sketches',
    '/photography',
    '/journals',
    '/contact',
  ]

  // Generate entries for both languages
  const staticEntries: MetadataRoute.Sitemap = staticPages.flatMap((page) => [
    {
      url: `${baseUrl}/en${page}`,
      lastModified: new Date(),
      changeFrequency: page === '' ? 'weekly' : 'monthly',
      priority: page === '' ? 1.0 : 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/en${page}`,
          es: `${baseUrl}/es${page}`,
        },
      },
    },
    {
      url: `${baseUrl}/es${page}`,
      lastModified: new Date(),
      changeFrequency: page === '' ? 'weekly' : 'monthly',
      priority: page === '' ? 1.0 : 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/en${page}`,
          es: `${baseUrl}/es${page}`,
        },
      },
    },
  ])

  // Get dynamic journal slugs
  let journalEntries: MetadataRoute.Sitemap = []
  try {
    const journalSlugs: string[] = await client.fetch(allJournalSlugsQuery)
    journalEntries = journalSlugs.flatMap((slug) => [
      {
        url: `${baseUrl}/en/journals/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
        alternates: {
          languages: {
            en: `${baseUrl}/en/journals/${slug}`,
            es: `${baseUrl}/es/journals/${slug}`,
          },
        },
      },
      {
        url: `${baseUrl}/es/journals/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
        alternates: {
          languages: {
            en: `${baseUrl}/en/journals/${slug}`,
            es: `${baseUrl}/es/journals/${slug}`,
          },
        },
      },
    ])
  } catch (error) {
    console.error('Error fetching journal slugs for sitemap:', error)
  }

  return [...staticEntries, ...journalEntries]
}
