import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/onboard(.*)',
  '/invite(.*)',
  '/no-access(.*)',
  '/api/webhooks/(.*)',
  '/api/invites/validate',
  '/api/bootstrap',
])

export default clerkMiddleware(async (auth, request) => {
  const { userId, sessionClaims } = await auth()
  const pathname = request.nextUrl.pathname

  if (userId && pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (!isPublicRoute(request)) {
    if (!userId) {
      const signInUrl = new URL('/sign-in', request.url)
      signInUrl.searchParams.set('redirect_url', request.url)
      return NextResponse.redirect(signInUrl)
    }

    const role = (sessionClaims?.metadata as { role?: string })?.role

    if (!role && pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/onboard', request.url))
    }

    if (role && pathname === '/dashboard') {
      if (role === 'admin') return NextResponse.redirect(new URL('/dashboard/admin', request.url))
      if (role === 'manager') return NextResponse.redirect(new URL('/dashboard/manager', request.url))
    }

    if (pathname.startsWith('/dashboard/admin') || pathname.startsWith('/dashboard/billing')) {
      if (role !== 'admin') {
        return NextResponse.redirect(new URL('/no-access', request.url))
      }
    }

    if (pathname.startsWith('/dashboard/manager')) {
      if (role !== 'manager') {
        return NextResponse.redirect(new URL('/no-access', request.url))
      }
    }
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
