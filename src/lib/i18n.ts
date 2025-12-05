export const locales = ['en', 'es'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

// Route mappings for URLs
// Note: Currently using English paths for both languages.
// Spanish localized URLs (pinturas, esculturas, etc.) are planned for future.
export const routeMap = {
  en: {
    home: '',
    paintings: 'paintings',
    sculptures: 'sculptures',
    sketches: 'sketches',
    photography: 'photography',
    journals: 'journals',
    contact: 'contact',
  },
  es: {
    home: '',
    paintings: 'paintings',
    sculptures: 'sculptures',
    sketches: 'sketches',
    photography: 'photography',
    journals: 'journals',
    contact: 'contact',
  },
} as const

// Reverse route map for determining page type from URL
export function getRouteKey(locale: Locale, path: string): keyof typeof routeMap.en | null {
  const routes = routeMap[locale]
  for (const [key, value] of Object.entries(routes)) {
    if (value === path) {
      return key as keyof typeof routeMap.en
    }
  }
  return null
}

// Get localized path for a route
export function getLocalizedPath(locale: Locale, routeKey: keyof typeof routeMap.en): string {
  return `/${locale}/${routeMap[locale][routeKey]}`
}

// Get the alternate language path for current page
export function getAlternatePath(
  currentLocale: Locale,
  currentPath: string
): { locale: Locale; path: string } {
  const targetLocale = currentLocale === 'en' ? 'es' : 'en'

  // Find the route key from current path
  const pathSegment = currentPath.split('/').filter(Boolean)[1] || '' // After /en/ or /es/
  const routeKey = getRouteKey(currentLocale, pathSegment)

  if (routeKey) {
    return {
      locale: targetLocale,
      path: getLocalizedPath(targetLocale, routeKey),
    }
  }

  // Fallback: just swap locale prefix
  return {
    locale: targetLocale,
    path: currentPath.replace(`/${currentLocale}`, `/${targetLocale}`),
  }
}

// Helper to get localized content from bilingual fields
export function getLocalizedValue<T extends { en?: string; es?: string }>(
  obj: T | undefined | null,
  locale: Locale
): string {
  if (!obj) return ''
  return obj[locale] || obj.en || obj.es || ''
}
