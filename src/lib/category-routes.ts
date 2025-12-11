/**
 * Maps Sanity artwork category values to URL route segments.
 * Sanity stores: 'painting', 'sculpture', 'sketch', 'photography'
 * Routes use:    'paintings', 'sculptures', 'sketches', 'photography'
 */
const CATEGORY_ROUTES: Record<string, string> = {
  painting: 'paintings',
  sculpture: 'sculptures',
  sketch: 'sketches',
  photography: 'photography',
}

/**
 * Converts a Sanity category to its corresponding URL route segment.
 * @param category - The category from Sanity (e.g., 'painting')
 * @returns The URL route segment (e.g., 'paintings')
 */
export function getCategoryRoute(category: string): string {
  return CATEGORY_ROUTES[category] || 'photography'
}
