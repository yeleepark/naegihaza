import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale } from './src/i18n/settings';

function getLocale(request: NextRequest): string {
  // Check if locale is in the pathname
  const pathname = request.nextUrl.pathname;
  const pathnameLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameLocale) return pathnameLocale;

  // Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const preferredLocale = acceptLanguage
      .split(',')
      .map((lang) => lang.split(';')[0].trim().toLowerCase())
      .find((lang) => {
        const shortLang = lang.split('-')[0];
        return locales.includes(shortLang as any);
      });

    if (preferredLocale) {
      const shortLang = preferredLocale.split('-')[0];
      if (locales.includes(shortLang as any)) {
        return shortLang;
      }
    }
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for static files, API routes, and special Next.js paths
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    const locale = locales.find(
      (l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`
    )!;
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-locale', locale);
    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });
    response.headers.set('Content-Language', locale);
    return response;
  }

  // Rewrite to locale-prefixed URL (no redirect, keeps original URL for SEO)
  const locale = getLocale(request);
  const newUrl = new URL(`/${locale}${pathname}`, request.url);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-locale', locale);
  const response = NextResponse.rewrite(newUrl, {
    request: { headers: requestHeaders },
  });
  response.headers.set('Content-Language', locale);
  return response;
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, api, static files)
    '/((?!_next|api|.*\\.).*)',
  ],
};
