import type { Metadata } from 'next'
import { Geist, Geist_Mono, Raleway } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const raleway = Raleway({
  variable: '--font-raleway',
  subsets: ['latin'],
  weight: '800',
})

export const metadata: Metadata = {
  title: 'Manuel Viveros Segura | Visual Artist',
  description: 'Artwork of Manuel Viveros Segura. Painting, sculpture, and photography. Arte Latinoamericano.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${raleway.variable} antialiased min-h-screen flex flex-col`}
      >
        {children}
      </body>
    </html>
  )
}
