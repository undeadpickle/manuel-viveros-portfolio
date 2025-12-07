import { JournalSkeleton } from '@/components/ui'

export default function JournalsLoading() {
  return (
    <div className="min-h-screen">
      {/* Page header skeleton */}
      <header className="pt-8 pb-6 md:pt-12 md:pb-8 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="h-10 md:h-12 lg:h-14 w-48 bg-[var(--color-gray-200)] rounded animate-pulse" />
        <div className="mt-2 h-5 w-64 bg-[var(--color-gray-200)] rounded animate-pulse" />
      </header>

      {/* Journal grid skeleton */}
      <section className="px-4 md:px-8 pb-16 max-w-7xl mx-auto">
        <JournalSkeleton count={6} />
      </section>
    </div>
  )
}
