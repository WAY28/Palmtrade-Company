// src/proxy.js  (Next.js 16)
import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import createIntlMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './i18n'

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
})

export default async function proxy(request) {
  const { pathname } = request.nextUrl

  // ── Halaman login: boleh diakses tanpa session ──
  if (pathname === '/admin/login') {
    // Kalau sudah login, redirect ke dashboard
    const response = NextResponse.next()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() { return request.cookies.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    return response
  }

  // ── Proteksi semua /admin/* selain login ──
  if (pathname.startsWith('/admin')) {
    const response = NextResponse.next()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() { return request.cookies.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    return response
  }

  // ── Halaman publik: pakai next-intl ──
  if (!pathname.startsWith('/api')) {
    return intlMiddleware(request)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!admin|api|_next|_vercel|.*\\..*).*)', '/admin/:path*'],
}
