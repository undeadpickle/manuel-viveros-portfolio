import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales, defaultLocale } from '@/lib/i18n'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/studio') ||
    pathname.includes('.') // files with extensions
  ) {
    return NextResponse.next()
  }

  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    return NextResponse.next()
  }

  // Redirect to default locale
  const url = request.nextUrl.clone()
  url.pathname = `/${defaultLocale}${pathname}`

  return NextResponse.redirect(url)
}

export const config = {
  matcher: [
    // Match all paths except static files and API
    '/((?!_next|api|studio|.*\\..*).*)',
  ],
}
