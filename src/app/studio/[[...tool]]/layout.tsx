export const metadata = {
  title: 'Sanity Studio | Manuel Viveros',
}

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="fixed inset-0">
      {children}
    </div>
  )
}
