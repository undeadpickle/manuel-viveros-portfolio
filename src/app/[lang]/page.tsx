import { getDictionary } from '@/dictionaries'
import { type Locale } from '@/lib/i18n'
import HomePageClient from './HomePageClient'

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang: langParam } = await params
  const lang = langParam as Locale
  const dictionary = await getDictionary(lang)

  return <HomePageClient lang={lang} dictionary={dictionary} />
}
