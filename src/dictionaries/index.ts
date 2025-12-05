import type { Locale } from '@/lib/i18n'

// Dictionary type based on en.json structure
export type Dictionary = typeof import('./en.json')

const dictionaries = {
  en: () => import('./en.json').then((module) => module.default),
  es: () => import('./es.json').then((module) => module.default),
}

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]()
}
