import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Manuel Viveros Segura | Visual Artist',
  description: 'Artwork of Manuel Viveros Segura. Painting, sculpture, and photography. Arte Latinoamericano.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
