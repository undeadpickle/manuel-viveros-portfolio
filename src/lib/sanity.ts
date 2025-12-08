import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SanityImageSource = any

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production',
})

// Image URL builder
const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

// Helper to get optimized image URL with specific dimensions
export function getImageUrl(
  source: SanityImageSource,
  width?: number,
  height?: number,
  quality = 80
) {
  let imageBuilder = builder.image(source).auto('format').quality(quality)

  if (width) {
    imageBuilder = imageBuilder.width(width)
  }
  if (height) {
    imageBuilder = imageBuilder.height(height)
  }

  return imageBuilder.url()
}

// Helper to get blur placeholder URL (tiny image for loading state)
export function getBlurUrl(source: SanityImageSource) {
  return builder.image(source).width(20).quality(30).blur(10).url()
}

// Server-side fetch with revalidation (for React Server Components)
// Revalidates cache every 60 seconds by default
export async function sanityFetch<T>(
  query: string,
  params?: Record<string, unknown>,
  revalidate = 60
): Promise<T> {
  return client.fetch(query, params, { next: { revalidate } })
}
